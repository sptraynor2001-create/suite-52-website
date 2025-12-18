#!/bin/bash
# Performance Optimizer - Check Bundle Size
# Simple build analysis - runs vite build with size reporting
# Use sparingly as it does require a build

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../shared/tools/logger.sh"

OUTPUT_FORMAT="${1:-text}"  # text | json
SKIP_BUILD="${SKIP_BUILD:-false}"

log_header "Bundle Size Analysis"

# Check if dist exists
if [ ! -d "dist" ] && [ "$SKIP_BUILD" = "false" ]; then
  log_info "Building for analysis (npm run build)..."
  npm run build --silent 2>/dev/null || {
    log_error "Build failed - cannot analyze bundle"
    exit 1
  }
fi

if [ ! -d "dist" ]; then
  log_error "No dist/ directory found. Run 'npm run build' first."
  exit 1
fi

# Analyze bundle sizes
log_info "Analyzing dist/ directory..."

total_size=0
js_size=0
css_size=0
asset_size=0

# Calculate sizes
while IFS= read -r file; do
  size=$(wc -c < "$file" | tr -d ' ')
  total_size=$((total_size + size))
  
  case "$file" in
    *.js) js_size=$((js_size + size)) ;;
    *.css) css_size=$((css_size + size)) ;;
    *) asset_size=$((asset_size + size)) ;;
  esac
done < <(find dist -type f 2>/dev/null)

# Convert to KB
total_kb=$((total_size / 1024))
js_kb=$((js_size / 1024))
css_kb=$((css_size / 1024))
asset_kb=$((asset_size / 1024))

if [ "$OUTPUT_FORMAT" = "json" ]; then
  cat <<EOF
{
  "total_kb": $total_kb,
  "js_kb": $js_kb,
  "css_kb": $css_kb,
  "assets_kb": $asset_kb,
  "budget_kb": 1000,
  "over_budget": $([ "$total_kb" -gt 1000 ] && echo "true" || echo "false")
}
EOF
else
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Bundle Size:"
  echo "  JavaScript:  ${js_kb} KB"
  echo "  CSS:         ${css_kb} KB"
  echo "  Assets:      ${asset_kb} KB"
  echo "  ─────────────────────────"
  echo "  Total:       ${total_kb} KB"
  echo "  Budget:      1000 KB"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if [ "$total_kb" -gt 1000 ]; then
    log_warn "Bundle exceeds 1MB budget"
    log_info "Consider: code splitting, lazy loading, tree shaking"
  else
    log_success "Bundle within budget"
  fi
fi
