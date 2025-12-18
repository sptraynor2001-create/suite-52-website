#!/bin/bash
# suggest-patterns.sh - Suggest design patterns for code scenarios
# Usage: ./aurora/agents/architect/tools/suggest-patterns.sh [path]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source shared logger
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

TARGET_PATH="${1:-src/}"
FULL_PATH="$PROJECT_ROOT/$TARGET_PATH"

log_info "💡 Suggesting patterns for: $TARGET_PATH"

echo ""
echo "═══════════════════════════════════════"
echo "  DESIGN PATTERN SUGGESTIONS"
echo "═══════════════════════════════════════"
echo ""

# Analyze code patterns
SUGGESTIONS=0

# 1. Check for props drilling
echo "🔍 Checking for Props Drilling..."
echo ""

find "$FULL_PATH" -name "*.tsx" | while read -r file; do
  # Count props being passed down
  PROP_PASSING=$(grep -c "={.*}" "$file" || echo 0)
  
  if [ "$PROP_PASSING" -gt 10 ]; then
    RELATIVE_FILE="${file#$PROJECT_ROOT/}"
    echo "📌 $RELATIVE_FILE"
    echo "   Passing many props ($PROP_PASSING)"
    echo ""
    echo "   PATTERN: Use Context API or Composition"
    echo "   Example:"
    echo "   // Create context"
    echo "   const ThemeContext = createContext(defaultTheme)"
    echo ""
    echo "   // Provider"
    echo "   <ThemeContext.Provider value={theme}>"
    echo "     <Component />"
    echo "   </ThemeContext.Provider>"
    echo ""
    echo "   // Consumer"
    echo "   const theme = useContext(ThemeContext)"
    echo ""
    ((SUGGESTIONS++)) || true
  fi
done

# 2. Check for duplicated logic
echo "🔍 Checking for Duplicated Logic..."
echo ""

# Find similar function patterns
COMMON_PATTERNS=$(find "$FULL_PATH" -name "*.tsx" -o -name "*.ts" | xargs grep -h "const.*= (" 2>/dev/null | sort | uniq -c | sort -rn | head -5 || true)

if [ -n "$COMMON_PATTERNS" ]; then
  echo "📌 Common patterns found (potential for extraction):"
  echo ""
  echo "   PATTERN: Extract Custom Hook"
  echo "   Example:"
  echo "   // Extract shared logic"
  echo "   function useFormState(initialValue) {"
  echo "     const [value, setValue] = useState(initialValue)"
  echo "     const [error, setError] = useState(null)"
  echo ""
  echo "     const validate = () => { /* validation */ }"
  echo ""
  echo "     return { value, setValue, error, validate }"
  echo "   }"
  echo ""
  ((SUGGESTIONS++)) || true
fi

# 3. Check for conditional rendering
echo "🔍 Checking for Complex Conditional Rendering..."
echo ""

find "$FULL_PATH" -name "*.tsx" | while read -r file; do
  TERNARY_COUNT=$(grep -c "?" "$file" || echo 0)
  
  if [ "$TERNARY_COUNT" -gt 5 ]; then
    RELATIVE_FILE="${file#$PROJECT_ROOT/}"
    echo "📌 $RELATIVE_FILE"
    echo "   Many ternary operators ($TERNARY_COUNT)"
    echo ""
    echo "   PATTERN: Extract Component or Use Guard Clauses"
    echo "   Example:"
    echo "   // Instead of nested ternaries"
    echo "   // Use early returns"
    echo "   if (!data) return <Loading />"
    echo "   if (error) return <Error error={error} />"
    echo "   return <Content data={data} />"
    echo ""
    ((SUGGESTIONS++)) || true
  fi
done

# 4. Check for state management
echo "🔍 Checking State Management Patterns..."
echo ""

find "$FULL_PATH" -name "*.tsx" | while read -r file; do
  USESTATE_COUNT=$(grep -c "useState" "$file" || echo 0)
  
  if [ "$USESTATE_COUNT" -gt 5 ]; then
    RELATIVE_FILE="${file#$PROJECT_ROOT/}"
    echo "📌 $RELATIVE_FILE"
    echo "   Many useState calls ($USESTATE_COUNT)"
    echo ""
    echo "   PATTERN: Use useReducer for Complex State"
    echo "   Example:"
    echo "   const [state, dispatch] = useReducer(reducer, initialState)"
    echo ""
    echo "   function reducer(state, action) {"
    echo "     switch (action.type) {"
    echo "       case 'INCREMENT': return { count: state.count + 1 }"
    echo "       case 'DECREMENT': return { count: state.count - 1 }"
    echo "       default: return state"
    echo "     }"
    echo "   }"
    echo ""
    ((SUGGESTIONS++)) || true
  fi
done

# 5. Check for side effects
echo "🔍 Checking Side Effect Management..."
echo ""

find "$FULL_PATH" -name "*.tsx" | while read -r file; do
  USEEFFECT_COUNT=$(grep -c "useEffect" "$file" || echo 0)
  
  if [ "$USEEFFECT_COUNT" -gt 3 ]; then
    RELATIVE_FILE="${file#$PROJECT_ROOT/}"
    echo "📌 $RELATIVE_FILE"
    echo "   Many useEffect calls ($USEEFFECT_COUNT)"
    echo ""
    echo "   PATTERN: Extract Side Effects to Custom Hook"
    echo "   Example:"
    echo "   function useDataFetching(url) {"
    echo "     const [data, setData] = useState(null)"
    echo "     const [loading, setLoading] = useState(true)"
    echo ""
    echo "     useEffect(() => {"
    echo "       fetch(url).then(res => res.json()).then(setData)"
    echo "       return () => { /* cleanup */ }"
    echo "     }, [url])"
    echo ""
    echo "     return { data, loading }"
    echo "   }"
    echo ""
    ((SUGGESTIONS++)) || true
  fi
done

# Summary
echo "═══════════════════════════════════════"
echo ""

if [ "$SUGGESTIONS" -eq 0 ]; then
  log_success "✅ No major pattern improvements needed"
else
  log_info "Found $SUGGESTIONS pattern improvement opportunities"
  echo ""
  echo "Next steps:"
  echo "  1. Review suggestions above"
  echo "  2. Run: @refactorer extract-hook [file] to extract logic"
  echo "  3. Run: @architect analyze-architecture for full analysis"
fi

echo ""
exit 0
