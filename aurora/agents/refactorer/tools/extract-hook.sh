#!/bin/bash
# extract-hook.sh - Suggest custom hooks to extract from components
# Usage: ./aurora/agents/refactorer/tools/extract-hook.sh src/features/home/Home.tsx

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source shared logger
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

if [ -z "$1" ]; then
  log_error "Usage: $0 <file-path>"
  exit 1
fi

TARGET_FILE="$1"
FULL_PATH="$PROJECT_ROOT/$TARGET_FILE"

if [ ! -f "$FULL_PATH" ]; then
  log_error "File not found: $TARGET_FILE"
  exit 1
fi

FILENAME=$(basename "$TARGET_FILE" .tsx)
DIRNAME=$(dirname "$TARGET_FILE")

log_info "🪝 Analyzing hook extraction opportunities: $FILENAME"

echo ""
echo "═══════════════════════════════════════"
echo "  HOOK EXTRACTION ANALYSIS"
echo "═══════════════════════════════════════"
echo ""

# Count hooks
USESTATE_COUNT=$(grep -c "useState" "$FULL_PATH" || echo 0)
USEEFFECT_COUNT=$(grep -c "useEffect" "$FULL_PATH" || echo 0)
USECALLBACK_COUNT=$(grep -c "useCallback" "$FULL_PATH" || echo 0)
USEMEMO_COUNT=$(grep -c "useMemo" "$FULL_PATH" || echo 0)

TOTAL_HOOKS=$((USESTATE_COUNT + USEEFFECT_COUNT + USECALLBACK_COUNT + USEMEMO_COUNT))

echo "📊 CURRENT HOOK USAGE"
echo "  useState: $USESTATE_COUNT"
echo "  useEffect: $USEEFFECT_COUNT"
echo "  useCallback: $USECALLBACK_COUNT"
echo "  useMemo: $USEMEMO_COUNT"
echo "  TOTAL: $TOTAL_HOOKS"
echo ""

if [ "$TOTAL_HOOKS" -lt 3 ]; then
  log_success "✅ Hook count is reasonable. No extraction needed."
  exit 0
fi

echo "💡 SUGGESTED CUSTOM HOOKS"
echo ""

SUGGESTIONS=0

# Suggest data fetching hook if fetch/async found
if grep -q "fetch\|axios\|async.*=>" "$FULL_PATH"; then
  ((SUGGESTIONS++))
  echo "$SUGGESTIONS. useData Hook"
  echo "   Purpose: Extract data fetching logic"
  echo "   Location: ${DIRNAME}/hooks/useData.ts"
  echo ""
  echo "   Implementation:"
  echo "   \`\`\`typescript"
  echo "   function useData(endpoint: string) {"
  echo "     const [data, setData] = useState(null)"
  echo "     const [loading, setLoading] = useState(true)"
  echo "     const [error, setError] = useState(null)"
  echo ""
  echo "     useEffect(() => {"
  echo "       fetch(endpoint)"
  echo "         .then(res => res.json())"
  echo "         .then(setData)"
  echo "         .catch(setError)"
  echo "         .finally(() => setLoading(false))"
  echo "     }, [endpoint])"
  echo ""
  echo "     return { data, loading, error }"
  echo "   }"
  echo "   \`\`\`"
  echo ""
fi

# Suggest form hook if form elements found
if grep -q "onChange\|onSubmit\|value=" "$FULL_PATH"; then
  ((SUGGESTIONS++))
  echo "$SUGGESTIONS. useForm Hook"
  echo "   Purpose: Extract form state management"
  echo "   Location: ${DIRNAME}/hooks/useForm.ts"
  echo ""
  echo "   Implementation:"
  echo "   \`\`\`typescript"
  echo "   function useForm(initialValues) {"
  echo "     const [values, setValues] = useState(initialValues)"
  echo "     const [errors, setErrors] = useState({})"
  echo ""
  echo "     const handleChange = (e) => {"
  echo "       setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))"
  echo "     }"
  echo ""
  echo "     const handleSubmit = (onSubmit) => (e) => {"
  echo "       e.preventDefault()"
  echo "       onSubmit(values)"
  echo "     }"
  echo ""
  echo "     return { values, errors, handleChange, handleSubmit }"
  echo "   }"
  echo "   \`\`\`"
  echo ""
fi

# Suggest animation hook if animation found
if grep -q "animate\|motion\|transition" "$FULL_PATH"; then
  ((SUGGESTIONS++))
  echo "$SUGGESTIONS. useAnimation Hook"
  echo "   Purpose: Extract animation logic"
  echo "   Location: src/shared/hooks/useAnimation.ts"
  echo ""
  echo "   Implementation:"
  echo "   \`\`\`typescript"
  echo "   function useAnimation() {"
  echo "     const [isAnimating, setIsAnimating] = useState(false)"
  echo ""
  echo "     const animate = useCallback(() => {"
  echo "       setIsAnimating(true)"
  echo "       setTimeout(() => setIsAnimating(false), 300)"
  echo "     }, [])"
  echo ""
  echo "     return { isAnimating, animate }"
  echo "   }"
  echo "   \`\`\`"
  echo ""
fi

# Suggest window hook if window events found
if grep -q "window\\.addEventListener\|window\\.innerWidth\|window\\.scroll" "$FULL_PATH"; then
  ((SUGGESTIONS++))
  echo "$SUGGESTIONS. useWindowSize / useScroll Hook"
  echo "   Purpose: Extract window event handling"
  echo "   Location: src/shared/hooks/useWindowSize.ts"
  echo ""
  echo "   Implementation:"
  echo "   \`\`\`typescript"
  echo "   function useWindowSize() {"
  echo "     const [size, setSize] = useState({"
  echo "       width: window.innerWidth,"
  echo "       height: window.innerHeight"
  echo "     })"
  echo ""
  echo "     useEffect(() => {"
  echo "       const handleResize = () => {"
  echo "         setSize({ width: window.innerWidth, height: window.innerHeight })"
  echo "       }"
  echo "       window.addEventListener('resize', handleResize)"
  echo "       return () => window.removeEventListener('resize', handleResize)"
  echo "     }, [])"
  echo ""
  echo "     return size"
  echo "   }"
  echo "   \`\`\`"
  echo ""
fi

# Generic hook extraction suggestion
if [ "$SUGGESTIONS" -eq 0 ] && [ "$TOTAL_HOOKS" -gt 5 ]; then
  echo "1. Generic Hook Extraction"
  echo "   The component has $TOTAL_HOOKS hooks."
  echo "   Consider extracting related state and effects into a custom hook."
  echo ""
  echo "   Example:"
  echo "   → use${FILENAME}.ts"
  echo ""
  ((SUGGESTIONS++))
fi

# Summary
echo "═══════════════════════════════════════"
echo ""

if [ "$SUGGESTIONS" -eq 0 ]; then
  log_success "✅ No obvious hook extractions needed"
else
  log_info "Found $SUGGESTIONS hook extraction opportunities"
  echo ""
  echo "Next steps:"
  echo "  1. Create suggested hook files"
  echo "  2. Move logic from component to hooks"
  echo "  3. Update component to use new hooks"
  echo "  4. Run: npm run test to verify behavior unchanged"
fi

echo ""
exit 0
