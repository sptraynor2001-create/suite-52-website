#!/bin/bash
# reduce-complexity.sh - Analyze cyclomatic complexity and suggest reductions
# Usage: ./aurora/agents/refactorer/tools/reduce-complexity.sh [path]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source shared logger
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

TARGET_PATH="${1:-src/}"
FULL_PATH="$PROJECT_ROOT/$TARGET_PATH"

log_info "📐 Analyzing complexity in: $TARGET_PATH"

echo ""
echo "═══════════════════════════════════════"
echo "  COMPLEXITY ANALYSIS"
echo "═══════════════════════════════════════"
echo ""

COMPLEX_FUNCTIONS=0

# Find files and analyze
find "$FULL_PATH" -name "*.ts" -o -name "*.tsx" | while read -r file; do
  RELATIVE_FILE="${file#$PROJECT_ROOT/}"
  
  # Count complexity indicators (rough heuristic)
  # if, else, case, while, for, &&, ||, ?
  
  # Extract function blocks (simplified)
  FUNCTIONS=$(grep -n "function\|const.*= (" "$file" || true)
  
  if [ -n "$FUNCTIONS" ]; then
    while IFS= read -r func_line; do
      LINE_NUM=$(echo "$func_line" | cut -d: -f1)
      FUNC_NAME=$(echo "$func_line" | sed 's/.*function \([a-zA-Z_]*\).*/\1/' | sed 's/.*const \([a-zA-Z_]*\).*/\1/')
      
      # Count complexity indicators in next 50 lines
      END_LINE=$((LINE_NUM + 50))
      COMPLEXITY=$(sed -n "${LINE_NUM},${END_LINE}p" "$file" | grep -c -E "if |else |case |while |for |\&\&|\|\||\?" || echo 0)
      
      if [ "$COMPLEXITY" -gt 10 ]; then
        echo "⚠️  $RELATIVE_FILE:$LINE_NUM - $FUNC_NAME()"
        echo "   Cyclomatic complexity: ~$COMPLEXITY (max: 10)"
        echo ""
        ((COMPLEX_FUNCTIONS++)) || true
      fi
    done <<< "$FUNCTIONS"
  fi
done

if [ "$COMPLEX_FUNCTIONS" -eq 0 ]; then
  log_success "✅ All functions have acceptable complexity"
  exit 0
fi

echo "═══════════════════════════════════════"
echo "  COMPLEXITY REDUCTION STRATEGIES"
echo "═══════════════════════════════════════"
echo ""

echo "Found $COMPLEX_FUNCTIONS complex functions"
echo ""

echo "💡 HOW TO REDUCE COMPLEXITY:"
echo ""

echo "1. Extract Conditions"
echo "   \`\`\`typescript"
echo "   // Before"
echo "   if (user && user.age > 18 && user.verified && !user.banned) {"
echo ""
echo "   // After"
echo "   const isEligible = user && user.age > 18 && user.verified && !user.banned"
echo "   if (isEligible) {"
echo "   \`\`\`"
echo ""

echo "2. Guard Clauses (Early Returns)"
echo "   \`\`\`typescript"
echo "   // Before"
echo "   function process(data) {"
echo "     if (data) {"
echo "       if (data.valid) {"
echo "         // process"
echo "       }"
echo "     }"
echo "   }"
echo ""
echo "   // After"
echo "   function process(data) {"
echo "     if (!data) return"
echo "     if (!data.valid) return"
echo "     // process"
echo "   }"
echo "   \`\`\`"
echo ""

echo "3. Extract Helper Functions"
echo "   \`\`\`typescript"
echo "   // Before"
echo "   function bigFunction() {"
echo "     // 50 lines of logic"
echo "   }"
echo ""
echo "   // After"
echo "   function bigFunction() {"
echo "     const step1 = processStep1()"
echo "     const step2 = processStep2(step1)"
echo "     return combineResults(step1, step2)"
echo "   }"
echo "   \`\`\`"
echo ""

echo "4. Use Lookup Tables"
echo "   \`\`\`typescript"
echo "   // Before"
echo "   if (type === 'a') return 1"
echo "   else if (type === 'b') return 2"
echo "   else if (type === 'c') return 3"
echo ""
echo "   // After"
echo "   const typeMap = { a: 1, b: 2, c: 3 }"
echo "   return typeMap[type]"
echo "   \`\`\`"
echo ""

echo "5. Polymorphism (Strategy Pattern)"
echo "   \`\`\`typescript"
echo "   // Before"
echo "   if (user.role === 'admin') { /* admin logic */ }"
echo "   else if (user.role === 'user') { /* user logic */ }"
echo ""
echo "   // After"
echo "   const strategies = {"
echo "     admin: () => { /* admin logic */ },"
echo "     user: () => { /* user logic */ }"
echo "   }"
echo "   strategies[user.role]()"
echo "   \`\`\`"
echo ""

echo "Next steps:"
echo "  1. Review complex functions above"
echo "  2. Apply reduction strategies"
echo "  3. Run: npm run lint to verify"
echo "  4. Run: npm run test to ensure behavior unchanged"
echo ""

exit $COMPLEX_FUNCTIONS
