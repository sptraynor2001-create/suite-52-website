#!/bin/bash
# Debugger - Check for Common Error Patterns
# Scans codebase for error-prone patterns without executing code
# Zero compute overhead - just grep patterns

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../shared/tools/logger.sh"

SEARCH_PATH="${1:-src}"
OUTPUT_FORMAT="${2:-text}"  # text | json

log_header "Error Pattern Scan"
log_info "Scanning: $SEARCH_PATH"

# Count various error-prone patterns
console_logs=0
todo_fixme=0
any_types=0
empty_catches=0

# Console.log statements (often left in accidentally)
console_logs=$(grep -r "console\.\(log\|warn\|error\)" "$SEARCH_PATH" --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')

# TODO/FIXME comments (technical debt markers)
todo_fixme=$(grep -rE "(TODO|FIXME|XXX|HACK)" "$SEARCH_PATH" --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')

# TypeScript 'any' usage
any_types=$(grep -rE ": any\b|as any\b" "$SEARCH_PATH" --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')

# Empty catch blocks
empty_catches=$(grep -rE "catch\s*\([^)]*\)\s*\{\s*\}" "$SEARCH_PATH" --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')

total=$((console_logs + todo_fixme + any_types + empty_catches))

if [ "$OUTPUT_FORMAT" = "json" ]; then
  cat <<EOF
{
  "total_issues": $total,
  "console_statements": $console_logs,
  "todo_fixme_comments": $todo_fixme,
  "any_type_usage": $any_types,
  "empty_catch_blocks": $empty_catches
}
EOF
else
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Error-Prone Patterns Found:"
  echo "  console.* statements:  $console_logs"
  echo "  TODO/FIXME comments:   $todo_fixme"
  echo "  'any' type usage:      $any_types"
  echo "  Empty catch blocks:    $empty_catches"
  echo "  ─────────────────────────"
  echo "  Total:                 $total"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if [ "$total" -gt 0 ]; then
    log_warn "Found $total potential issues"
    [ "$console_logs" -gt 0 ] && log_info "Remove console.* before production"
    [ "$any_types" -gt 0 ] && log_info "Replace 'any' with proper types"
    [ "$empty_catches" -gt 0 ] && log_info "Handle errors in catch blocks"
  else
    log_success "No error-prone patterns found"
  fi
fi
