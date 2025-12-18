#!/bin/bash
# Analyze Complexity - Code Analyzer Tool
# Runs ESLint complexity analysis and reports high-complexity functions

set -euo pipefail

# Get script directory and source shared tools
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../shared/tools/logger.sh"

# Configuration
SEARCH_PATH="${1:-src}"
COMPLEXITY_THRESHOLD="${COMPLEXITY_THRESHOLD:-10}"
OUTPUT_FORMAT="${2:-text}"  # text | xml | json

log_section "Code Analyzer - Complexity Analysis"
log_info "Analyzing: $SEARCH_PATH"
log_info "Threshold: Cyclomatic complexity > $COMPLEXITY_THRESHOLD"

# Run ESLint with JSON output
complexity_violations=0
large_files=0
large_functions=0

# Create temporary file for ESLint output
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

# Run ESLint and capture output
log_info "Running ESLint complexity check..."
if npx --no-install eslint "$SEARCH_PATH" --format json > "$TEMP_FILE" 2>/dev/null; then
  log_success "ESLint check passed"
else
  log_warn "ESLint found issues, analyzing..."
fi

# Parse ESLint output for complexity issues
if command -v jq &> /dev/null && [ -s "$TEMP_FILE" ]; then
  # Count complexity violations
  complexity_violations=$(jq '[.[] | .messages[] | select(.ruleId == "complexity")] | length' "$TEMP_FILE" 2>/dev/null || echo "0")
  
  # Count max-lines violations (file size)
  large_files=$(jq '[.[] | .messages[] | select(.ruleId == "max-lines")] | length' "$TEMP_FILE" 2>/dev/null || echo "0")
  
  # Count max-lines-per-function violations
  large_functions=$(jq '[.[] | .messages[] | select(.ruleId == "max-lines-per-function")] | length' "$TEMP_FILE" 2>/dev/null || echo "0")
  
  # Get detailed violations for text output
  if [ "$OUTPUT_FORMAT" = "text" ] && [ "$complexity_violations" -gt 0 ]; then
    log_warn "High complexity functions:"
    jq -r '.[] | select(.messages | length > 0) | .filePath as $file | .messages[] | select(.ruleId == "complexity") | "  \($file):\(.line) - \(.message)"' "$TEMP_FILE" 2>/dev/null || true
  fi
fi

# Manual file size check as backup
log_info "Checking file sizes..."
while IFS= read -r file; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file" | tr -d ' ')
    if [ "$lines" -gt 300 ]; then
      ((large_files++)) || true
      if [ "$OUTPUT_FORMAT" = "text" ]; then
        log_warn "Large file: $file ($lines lines, limit: 300)"
      fi
    fi
  fi
done < <(find "$SEARCH_PATH" -name "*.tsx" -o -name "*.ts" 2>/dev/null | grep -v node_modules | grep -v ".test." || true)

# Calculate totals
total_issues=$((complexity_violations + large_files + large_functions))

# Output results
log_section "Complexity Analysis Results"

if [ "$OUTPUT_FORMAT" = "xml" ]; then
  cat <<EOF
<complexity_analysis>
  <summary>
    <total_issues>$total_issues</total_issues>
    <complexity_violations>$complexity_violations</complexity_violations>
    <large_files>$large_files</large_files>
    <large_functions>$large_functions</large_functions>
  </summary>
  <thresholds>
    <cyclomatic_complexity>$COMPLEXITY_THRESHOLD</cyclomatic_complexity>
    <max_file_lines>300</max_file_lines>
    <max_function_lines>50</max_function_lines>
  </thresholds>
  <recommendations>
    <item>Split functions with complexity > $COMPLEXITY_THRESHOLD</item>
    <item>Extract subcomponents from large files</item>
    <item>Use @refactorer for guided splitting</item>
  </recommendations>
</complexity_analysis>
EOF
elif [ "$OUTPUT_FORMAT" = "json" ]; then
  cat <<EOF
{
  "total_issues": $total_issues,
  "complexity_violations": $complexity_violations,
  "large_files": $large_files,
  "large_functions": $large_functions,
  "thresholds": {
    "cyclomatic_complexity": $COMPLEXITY_THRESHOLD,
    "max_file_lines": 300,
    "max_function_lines": 50
  }
}
EOF
else
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Summary:"
  echo "  High complexity functions: $complexity_violations"
  echo "  Large files (>300 lines):  $large_files"
  echo "  Large functions (>50 lines): $large_functions"
  echo "  ─────────────────────────────"
  echo "  Total issues:              $total_issues"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if [ "$total_issues" -gt 0 ]; then
    log_warn "Found $total_issues complexity issues"
    log_info "Recommendations:"
    log_info "  1. Split functions with complexity > $COMPLEXITY_THRESHOLD"
    log_info "  2. Extract subcomponents from large files"
    log_info "  3. Use @refactorer for guided splitting"
    exit 1
  else
    log_success "No complexity issues found!"
    exit 0
  fi
fi
