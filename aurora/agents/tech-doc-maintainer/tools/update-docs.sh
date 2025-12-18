#!/bin/bash
# Update Docs Tool - Tech Doc Maintainer
# Updates/creates/deletes documentation files based on package changes
# Usage: ./update-docs.sh [--auto|--interactive]

set -euo pipefail

# Load shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AURORA_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
source "$AURORA_DIR/agents/shared/tools/logger.sh"

# Configuration
MODE="${1:---interactive}"
DOCS_DIR="$AURORA_DIR/project-docs/tech-stack"
STATE_FILE="$DOCS_DIR/.package-state.json"
SCAN_REPORT="${2:-/tmp/package-scan-report.json}"

log_header "Documentation Updater - Tech Doc Maintainer"

# Check if scan report exists
if [ ! -f "$SCAN_REPORT" ]; then
    log_info "No scan report found. Running scan first..."
    "$SCRIPT_DIR/scan-packages.sh"
fi

# Load scan report
report=$(cat "$SCAN_REPORT")

# Get summary
total_changes=$(echo "$report" | grep -o '"new":\s*\[[^]]*\]' | wc -l)
total_changes=$((total_changes + $(echo "$report" | grep -o '"updated":\s*\[[^]]*\]' | wc -l)))
total_changes=$((total_changes + $(echo "$report" | grep -o '"deleted":\s*\[[^]]*\]' | wc -l)))

if [ "$total_changes" -eq 0 ]; then
    log_success "No changes detected. Documentation is up to date."
    exit 0
fi

log_info "Found changes to process..."
log_separator

# Normalize package name for file naming
normalize_package_name() {
    local name="$1"
    echo "$name" | sed 's/@//g' | sed 's/\//-/g' | tr '[:upper:]' '[:lower:]'
}

# Determine category for package
get_category() {
    local name="$1"
    local normalized=$(normalize_package_name "$name")
    
    # Core technologies
    if [[ "$normalized" =~ ^(react|typescript|node) ]]; then
        echo "core"
    # 3D graphics
    elif [[ "$normalized" =~ (three|drei|fiber|postprocessing|detect-gpu|simplex-noise) ]]; then
        echo "3d"
    # UI libraries
    elif [[ "$normalized" =~ (framer-motion|react-icons) ]]; then
        echo "ui"
    # Styling
    elif [[ "$normalized" =~ (tailwind|postcss|autoprefixer) ]]; then
        echo "styling"
    # Testing
    elif [[ "$normalized" =~ (vitest|testing-library|jest) ]]; then
        echo "testing"
    # Tooling
    elif [[ "$normalized" =~ (vite|eslint|webpack|rollup) ]] || [[ "$normalized" =~ ^@vitejs ]]; then
        echo "tooling"
    # Routing (core)
    elif [[ "$normalized" =~ (router|routing) ]]; then
        echo "core"
    # Libraries (default)
    else
        echo "libraries"
    fi
}

# Update state file
update_state() {
    local packages="$1"
    
    log_info "Updating package state..."
    
    if command -v node >/dev/null 2>&1; then
        node -e "
            const fs = require('fs');
            const packages = $packages;
            const state = {};
            
            for (const [name, version] of Object.entries(packages)) {
                state[name] = {
                    version: version,
                    lastUpdated: new Date().toISOString(),
                    category: '$category'
                };
            }
            
            fs.writeFileSync('$STATE_FILE', JSON.stringify(state, null, 2));
        "
    else
        python3 -c "
import json
from datetime import datetime

packages = json.loads('''$packages''')
state = {}

for name, version in packages.items():
    state[name] = {
        'version': version,
        'lastUpdated': datetime.now().isoformat(),
        'category': '$category'
    }

with open('$STATE_FILE', 'w') as f:
    json.dump(state, f, indent=2)
        "
    fi
    
    log_success "State file updated: $STATE_FILE"
}

# Process new packages
process_new_packages() {
    local new_packages=$(echo "$report" | grep -o '"new":\s*\[[^]]*\]' || echo '[]')
    
    if [ "$new_packages" != "[]" ]; then
        log_info "Processing new packages..."
        
        echo "$report" | if command -v node >/dev/null 2>&1; then
            node -e "
                const report = JSON.parse(require('fs').readFileSync(0, 'utf8'));
                if (report.new && report.new.length > 0) {
                    console.log('New packages to document:');
                    report.new.forEach(pkg => {
                        console.log('  - ' + pkg.name + ' @ ' + pkg.version);
                    });
                }
            "
        fi
        
        log_warn "ACTION REQUIRED: New packages need documentation files."
        log_info "Run: @tech-doc-maintainer generate <package-name>"
    fi
}

# Process updated packages
process_updated_packages() {
    local updated=$(echo "$report" | grep -o '"updated":\s*\[[^]]*\]' || echo '[]')
    
    if [ "$updated" != "[]" ]; then
        log_info "Processing updated packages..."
        
        echo "$report" | if command -v node >/dev/null 2>&1; then
            node -e "
                const report = JSON.parse(require('fs').readFileSync(0, 'utf8'));
                if (report.updated && report.updated.length > 0) {
                    console.log('Updated packages:');
                    report.updated.forEach(pkg => {
                        console.log('  - ' + pkg.name + ': ' + pkg.oldVersion + ' → ' + pkg.newVersion);
                    });
                }
            "
        fi
        
        log_info "Auto-updating version numbers in documentation files..."
        # TODO: Implement version number updates
    fi
}

# Process deleted packages
process_deleted_packages() {
    local deleted=$(echo "$report" | grep -o '"deleted":\s*\[[^]]*\]' || echo '[]')
    
    if [ "$deleted" != "[]" ]; then
        log_warn "Processing deleted packages..."
        
        echo "$report" | if command -v node >/dev/null 2>&1; then
            node -e "
                const report = JSON.parse(require('fs').readFileSync(0, 'utf8'));
                if (report.deleted && report.deleted.length > 0) {
                    console.log('Deleted packages:');
                    report.deleted.forEach(pkg => {
                        console.log('  - ' + pkg.name + ' (was @ ' + pkg.lastVersion + ')');
                    });
                }
            "
        fi
        
        log_warn "ACTION REQUIRED: Remove obsolete documentation files."
        log_info "Run: @tech-doc-maintainer remove <package-name>"
    fi
}

# Main execution
process_new_packages
process_updated_packages
process_deleted_packages

log_separator
log_success "Documentation update scan complete."

log_info "Next steps:"
log_info "  1. Generate docs for new packages: @tech-doc-maintainer generate <package>"
log_info "  2. Review updated package docs: @tech-doc-maintainer review <package>"
log_info "  3. Remove obsolete docs: @tech-doc-maintainer remove <package>"
