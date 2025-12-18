#!/bin/bash
# Web-React Adapter - Theme Enforcer - Scan Hardcoded Values
#
# Adapter implementation used by:
#   aurora/agents/theme-enforcer/tools/scan-hardcoded.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"

# Shared logger from Aurora core system
# shellcheck disable=SC1090
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

# Configuration
SEARCH_PATH="${1:-src}"
OUTPUT_FORMAT="${2:-text}"  # text | xml | json

# Patterns to detect (web-react)
COLOR_PATTERN="'#[0-9a-fA-F]{3,8}'|\"#[0-9a-fA-F]{3,8}\""
ZINDEX_PATTERN="zIndex:\\s*[0-9]+"
SPACING_PATTERN="(padding|margin|gap|top|left|right|bottom):\\s*'?[0-9]+px'?"

# Counters
color_violations=0
zindex_violations=0
spacing_violations=0

log_section "Theme Enforcer - Hardcoded Value Scanner (web-react)"
log_info "Scanning: $SEARCH_PATH"

scan_pattern() {
  local pattern="$1"
  local label="$2"
  local count=0

  if command -v rg &> /dev/null; then
    while IFS= read -r line; do
      if [ -n "$line" ]; then
        ((count++)) || true
        if [ "$OUTPUT_FORMAT" = "text" ]; then
          log_warn "$label: $line" >&2
        fi
      fi
    done < <(rg -n --no-heading -e "$pattern" "$SEARCH_PATH" --type ts --type tsx 2>/dev/null || true)
  else
    while IFS= read -r line; do
      if [ -n "$line" ]; then
        ((count++)) || true
        if [ "$OUTPUT_FORMAT" = "text" ]; then
          log_warn "$label: $line" >&2
        fi
      fi
    done < <(grep -rn -E "$pattern" "$SEARCH_PATH" --include="*.ts" --include="*.tsx" 2>/dev/null || true)
  fi

  echo "$count"
}

log_info "Scanning for hardcoded colors..."
color_violations=$(scan_pattern "$COLOR_PATTERN" "Hardcoded color")

log_info "Scanning for hardcoded z-index..."
zindex_violations=$(scan_pattern "$ZINDEX_PATTERN" "Hardcoded z-index")

log_info "Scanning for hardcoded spacing..."
spacing_violations=$(scan_pattern "$SPACING_PATTERN" "Hardcoded spacing")

total_violations=$((color_violations + zindex_violations + spacing_violations))

log_section "Scan Results"

if [ "$OUTPUT_FORMAT" = "xml" ]; then
  cat <<EOF
<scan_results>
  <summary>
    <total_violations>$total_violations</total_violations>
    <color_violations>$color_violations</color_violations>
    <zindex_violations>$zindex_violations</zindex_violations>
    <spacing_violations>$spacing_violations</spacing_violations>
  </summary>
  <recommendation>
    Use theme tokens from src/themes/colors.ts and src/design/tokens.ts
  </recommendation>
</scan_results>
EOF
elif [ "$OUTPUT_FORMAT" = "json" ]; then
  cat <<EOF
{
  "total_violations": $total_violations,
  "color_violations": $color_violations,
  "zindex_violations": $zindex_violations,
  "spacing_violations": $spacing_violations,
  "recommendation": "Use theme tokens from src/themes/colors.ts and src/design/tokens.ts"
}
EOF
else
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Summary:"
  echo "  Hardcoded colors:  $color_violations"
  echo "  Hardcoded z-index: $zindex_violations"
  echo "  Hardcoded spacing: $spacing_violations"
  echo "  ─────────────────────────────"
  echo "  Total violations:  $total_violations"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [ "$total_violations" -gt 0 ]; then
    log_warn "Found $total_violations hardcoded values"
    log_info "Replace with theme tokens from:"
    log_info "  - src/themes/colors.ts (colors)"
    log_info "  - src/design/tokens.ts (spacing, z-index)"
    exit 1
  else
    log_success "No hardcoded values found!"
    exit 0
  fi
fi

