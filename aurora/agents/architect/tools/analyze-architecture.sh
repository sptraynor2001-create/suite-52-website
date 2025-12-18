#!/bin/bash
# Aurora - Universal Agent Tool Wrapper (Adapter-Aware)
#
# Delegates to the active adapter implementation:
#   adapter: aurora/adapters/<project-type>/tools/architect/analyze-architecture.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE_DIR="$(cd "$SCRIPT_DIR/../../../core" && pwd)"

# shellcheck disable=SC1090
source "$CORE_DIR/agent-runtime.sh"

aurora_runtime_run "architect" "analyze-architecture" "$@"

# 1. Directory Structure Analysis
echo "📁 DIRECTORY STRUCTURE"
echo ""

FEATURES_COUNT=$(find "$FULL_PATH/features" -maxdepth 1 -type d 2>/dev/null | tail -n +2 | wc -l | tr -d ' ')
SHARED_COMPONENTS=$(find "$FULL_PATH/shared/components" -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
SHARED_HOOKS=$(find "$FULL_PATH/shared/hooks" -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
SHARED_UTILS=$(find "$FULL_PATH/shared/utils" -name "*.ts" 2>/dev/null | wc -l | tr -d ' ')

echo "  Features: $FEATURES_COUNT"
echo "  Shared Components: $SHARED_COMPONENTS"
echo "  Shared Hooks: $SHARED_HOOKS"
echo "  Shared Utils: $SHARED_UTILS"
echo ""

# 2. File Size Analysis
echo "📊 FILE SIZE DISTRIBUTION"
echo ""

LARGE_FILES=$(find "$FULL_PATH" -name "*.tsx" -o -name "*.ts" | while read -r file; do
  lines=$(wc -l < "$file" | tr -d ' ')
  if [ "$lines" -gt 300 ]; then
    echo "${file#$PROJECT_ROOT/}: $lines lines"
  fi
done)

if [ -z "$LARGE_FILES" ]; then
  echo "  ✅ All files under 300 lines"
else
  echo "  ⚠️  Large files (>300 lines):"
  echo "$LARGE_FILES" | while read -r line; do
    echo "     $line"
  done
fi
echo ""

# 3. Import Pattern Analysis
echo "🔗 IMPORT PATTERNS"
echo ""

# Check for potential circular dependencies
CIRCULAR_RISK=0

find "$FULL_PATH" -name "*.tsx" -o -name "*.ts" | while read -r file; do
  # Count imports from same feature
  FILE_DIR=$(dirname "$file")
  FEATURE_NAME=$(echo "$FILE_DIR" | grep -o "features/[^/]*" || echo "")
  
  if [ -n "$FEATURE_NAME" ]; then
    # Check if importing from other features
    OTHER_FEATURE_IMPORTS=$(grep -c "from.*features/" "$file" | grep -v "$FEATURE_NAME" || echo 0)
    
    if [ "$OTHER_FEATURE_IMPORTS" -gt 0 ]; then
      RELATIVE_FILE="${file#$PROJECT_ROOT/}"
      echo "  ⚠️  $RELATIVE_FILE imports from other features ($OTHER_FEATURE_IMPORTS)"
      ((CIRCULAR_RISK++)) || true
    fi
  fi
done

if [ "$CIRCULAR_RISK" -eq 0 ]; then
  echo "  ✅ No cross-feature dependencies detected"
fi
echo ""

# 4. Component Complexity
echo "⚙️  COMPONENT COMPLEXITY"
echo ""

COMPLEX_COMPONENTS=$(find "$FULL_PATH" -name "*.tsx" | while read -r file; do
  # Count hooks usage
  HOOKS_COUNT=$(grep -c "useState\|useEffect\|useCallback\|useMemo" "$file" || echo 0)
  
  if [ "$HOOKS_COUNT" -gt 5 ]; then
    RELATIVE_FILE="${file#$PROJECT_ROOT/}"
    echo "$RELATIVE_FILE: $HOOKS_COUNT hooks"
  fi
done)

if [ -z "$COMPLEX_COMPONENTS" ]; then
  echo "  ✅ All components have reasonable complexity"
else
  echo "  💡 Complex components (>5 hooks):"
  echo "$COMPLEX_COMPONENTS" | while read -r line; do
    echo "     $line"
  done
  echo "     Consider: Extract custom hooks or split components"
fi
echo ""

# 5. Shared vs. Feature Code
echo "📦 CODE DISTRIBUTION"
echo ""

TOTAL_LINES_FEATURES=$(find "$FULL_PATH/features" -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
TOTAL_LINES_SHARED=$(find "$FULL_PATH/shared" -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')

TOTAL_LINES=$((TOTAL_LINES_FEATURES + TOTAL_LINES_SHARED))

if [ "$TOTAL_LINES" -gt 0 ]; then
  SHARED_PERCENTAGE=$((TOTAL_LINES_SHARED * 100 / TOTAL_LINES))
  
  echo "  Features: $TOTAL_LINES_FEATURES lines"
  echo "  Shared: $TOTAL_LINES_SHARED lines ($SHARED_PERCENTAGE%)"
  echo ""
  
  if [ "$SHARED_PERCENTAGE" -gt 40 ]; then
    echo "  ⚠️  Shared code >40% - consider if everything should be shared"
  elif [ "$SHARED_PERCENTAGE" -lt 10 ]; then
    echo "  💡 Shared code <10% - opportunity to extract common patterns"
  else
    echo "  ✅ Healthy feature/shared balance"
  fi
fi
echo ""

# Summary
echo "═══════════════════════════════════════"
echo "  RECOMMENDATIONS"
echo "═══════════════════════════════════════"
echo ""

ISSUES=0

if [ -n "$LARGE_FILES" ]; then
  echo "1. Split large files (>300 lines)"
  echo "   Run: @refactorer split [file]"
  ((ISSUES++))
fi

if [ "$CIRCULAR_RISK" -gt 0 ]; then
  echo "2. Review cross-feature dependencies"
  echo "   Run: @architect dependency-graph"
  ((ISSUES++))
fi

if [ -n "$COMPLEX_COMPONENTS" ]; then
  echo "3. Extract logic from complex components"
  echo "   Run: @refactorer extract-hook [file]"
  ((ISSUES++))
fi

if [ "$ISSUES" -eq 0 ]; then
  log_success "✅ Architecture looks good!"
else
  log_info "Found $ISSUES architectural concerns"
fi

echo ""
exit 0
