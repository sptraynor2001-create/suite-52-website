#!/bin/bash
# Scan Packages Tool - Tech Doc Maintainer
# Scans package.json and compares with documented packages
# Output: JSON report of new/updated/deleted packages

set -euo pipefail

# Load shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AURORA_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
source "$AURORA_DIR/agents/shared/tools/logger.sh"

# Configuration
PACKAGE_JSON="${1:-package.json}"
DOCS_DIR="$AURORA_DIR/project-docs/tech-stack"
STATE_FILE="$DOCS_DIR/.package-state.json"
REPORT_FILE="${2:-/tmp/package-scan-report.json}"

log_header "Package Scanner - Tech Doc Maintainer"

# Check if package.json exists
if [ ! -f "$PACKAGE_JSON" ]; then
    log_error "package.json not found at: $PACKAGE_JSON"
    exit 1
fi

log_info "Scanning packages from: $PACKAGE_JSON"

# Extract packages from package.json
extract_packages() {
    local json_file="$1"
    local dep_type="$2"
    
    # Use node or python to parse JSON
    if command -v node >/dev/null 2>&1; then
        node -e "
            const fs = require('fs');
            const pkg = JSON.parse(fs.readFileSync('$json_file', 'utf8'));
            const deps = pkg.$dep_type || {};
            const result = {};
            for (const [name, version] of Object.entries(deps)) {
                result[name] = version.replace(/^[\^~]/, '');
            }
            console.log(JSON.stringify(result, null, 2));
        "
    elif command -v python3 >/dev/null 2>&1; then
        python3 -c "
import json
import sys
with open('$json_file', 'r') as f:
    pkg = json.load(f)
deps = pkg.get('$dep_type', {})
result = {}
for name, version in deps.items():
    result[name] = version.lstrip('^~')
print(json.dumps(result, indent=2))
        "
    else
        log_error "Neither node nor python3 found. Cannot parse JSON."
        exit 1
    fi
}

# Normalize package name for file naming
normalize_package_name() {
    local name="$1"
    # Convert @scope/package to scope-package
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
    # Libraries (default)
    else
        echo "libraries"
    fi
}

# Find existing documentation file
find_doc_file() {
    local name="$1"
    local normalized=$(normalize_package_name "$name")
    local category=$(get_category "$name")
    
    # Try different naming patterns
    local patterns=(
        "$DOCS_DIR/$category/$normalized-*.md"
        "$DOCS_DIR/$category/${normalized}.md"
        "$DOCS_DIR/$category/*${normalized}*.md"
    )
    
    for pattern in "${patterns[@]}"; do
        if ls $pattern 2>/dev/null; then
            ls $pattern 2>/dev/null | head -1
            return 0
        fi
    done
    
    return 1
}

# Load current state
current_state="{}"
if [ -f "$STATE_FILE" ]; then
    log_info "Loading state from: $STATE_FILE"
    current_state=$(cat "$STATE_FILE")
else
    log_warn "No state file found. Creating new state."
fi

# Extract current packages
log_info "Extracting dependencies..."
dependencies=$(extract_packages "$PACKAGE_JSON" "dependencies")
dev_dependencies=$(extract_packages "$PACKAGE_JSON" "devDependencies")

# Merge dependencies
all_packages=$(if command -v node >/dev/null 2>&1; then
    node -e "
        const deps = $dependencies;
        const devDeps = $dev_dependencies;
        console.log(JSON.stringify({...deps, ...devDeps}, null, 2));
    "
else
    python3 -c "
import json
deps = json.loads('''$dependencies''')
devDeps = json.loads('''$dev_dependencies''')
result = {**deps, **devDeps}
print(json.dumps(result, indent=2))
    "
fi)

# Compare with state
log_info "Comparing with documented packages..."

# Generate report
report=$(if command -v node >/dev/null 2>&1; then
    node -e "
        const current = $all_packages;
        const state = $current_state;
        
        const new_packages = [];
        const updated_packages = [];
        const deleted_packages = [];
        const unchanged_packages = [];
        
        // Check for new and updated
        for (const [name, version] of Object.entries(current)) {
            if (!state[name]) {
                new_packages.push({name, version});
            } else if (state[name].version !== version) {
                updated_packages.push({
                    name,
                    oldVersion: state[name].version,
                    newVersion: version
                });
            } else {
                unchanged_packages.push({name, version});
            }
        }
        
        // Check for deleted
        for (const [name, info] of Object.entries(state)) {
            if (!current[name]) {
                deleted_packages.push({name, lastVersion: info.version});
            }
        }
        
        const report = {
            timestamp: new Date().toISOString(),
            new: new_packages,
            updated: updated_packages,
            deleted: deleted_packages,
            unchanged: unchanged_packages,
            summary: {
                total: Object.keys(current).length,
                new: new_packages.length,
                updated: updated_packages.length,
                deleted: deleted_packages.length,
                unchanged: unchanged_packages.length
            }
        };
        
        console.log(JSON.stringify(report, null, 2));
    "
else
    python3 -c "
import json
from datetime import datetime

current = json.loads('''$all_packages''')
state = json.loads('''$current_state''')

new_packages = []
updated_packages = []
deleted_packages = []
unchanged_packages = []

# Check for new and updated
for name, version in current.items():
    if name not in state:
        new_packages.append({'name': name, 'version': version})
    elif state[name].get('version') != version:
        updated_packages.append({
            'name': name,
            'oldVersion': state[name].get('version'),
            'newVersion': version
        })
    else:
        unchanged_packages.append({'name': name, 'version': version})

# Check for deleted
for name, info in state.items():
    if name not in current:
        deleted_packages.append({'name': name, 'lastVersion': info.get('version')})

report = {
    'timestamp': datetime.now().isoformat(),
    'new': new_packages,
    'updated': updated_packages,
    'deleted': deleted_packages,
    'unchanged': unchanged_packages,
    'summary': {
        'total': len(current),
        'new': len(new_packages),
        'updated': len(updated_packages),
        'deleted': len(deleted_packages),
        'unchanged': len(unchanged_packages)
    }
}

print(json.dumps(report, indent=2))
    "
fi)

# Save report
echo "$report" > "$REPORT_FILE"

# Display summary
log_separator
log_info "Scan Summary:"
echo "$report" | if command -v node >/dev/null 2>&1; then
    node -e "
        const report = JSON.parse(require('fs').readFileSync(0, 'utf8'));
        console.log('  Total packages:', report.summary.total);
        console.log('  New:', report.summary.new);
        console.log('  Updated:', report.summary.updated);
        console.log('  Deleted:', report.summary.deleted);
        console.log('  Unchanged:', report.summary.unchanged);
    "
else
    python3 -c "
import json
import sys
report = json.load(sys.stdin)
print(f\"  Total packages: {report['summary']['total']}\")
print(f\"  New: {report['summary']['new']}\")
print(f\"  Updated: {report['summary']['updated']}\")
print(f\"  Deleted: {report['summary']['deleted']}\")
print(f\"  Unchanged: {report['summary']['unchanged']}\")
    "
fi

log_separator

# Show details
if echo "$report" | grep -q '"new":\s*\[\s*{' || echo "$report" | grep -q '"new": \[{' 2>/dev/null; then
    log_warn "New packages found:"
    echo "$report" | if command -v node >/dev/null 2>&1; then
        node -e "
            const report = JSON.parse(require('fs').readFileSync(0, 'utf8'));
            report.new.forEach(pkg => {
                console.log('  -', pkg.name, '@' + pkg.version);
            });
        "
    else
        python3 -c "
import json
import sys
report = json.load(sys.stdin)
for pkg in report['new']:
    print(f\"  - {pkg['name']} @{pkg['version']}\")
        "
    fi
fi

if echo "$report" | grep -q '"updated":\s*\[\s*{' || echo "$report" | grep -q '"updated": \[{' 2>/dev/null; then
    log_warn "Updated packages found:"
    echo "$report" | if command -v node >/dev/null 2>&1; then
        node -e "
            const report = JSON.parse(require('fs').readFileSync(0, 'utf8'));
            report.updated.forEach(pkg => {
                console.log('  -', pkg.name, pkg.oldVersion, '→', pkg.newVersion);
            });
        "
    else
        python3 -c "
import json
import sys
report = json.load(sys.stdin)
for pkg in report['updated']:
    print(f\"  - {pkg['name']} {pkg['oldVersion']} → {pkg['newVersion']}\")
        "
    fi
fi

log_success "Scan complete. Report saved to: $REPORT_FILE"
echo "$REPORT_FILE"
