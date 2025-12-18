#!/bin/bash
# suggest-tests.sh - Suggest specific test cases for a file
# Usage: ./aurora/agents/test-reviewer/tools/suggest-tests.sh src/components/Button.tsx

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

log_info "💡 Suggesting tests for: $TARGET_FILE"

# Detect file type
IS_COMPONENT=false
IS_HOOK=false
IS_UTILITY=false

if [[ "$TARGET_FILE" == *"/components/"* ]] || [[ "$TARGET_FILE" == *"/features/"* ]]; then
  IS_COMPONENT=true
elif [[ "$TARGET_FILE" == *"/hooks/"* ]]; then
  IS_HOOK=true
elif [[ "$TARGET_FILE" == *"/utils/"* ]] || [[ "$TARGET_FILE" == *"/helpers/"* ]]; then
  IS_UTILITY=true
fi

echo ""
echo "═══════════════════════════════════════"
echo "  TEST SUGGESTIONS FOR: $(basename "$TARGET_FILE")"
echo "═══════════════════════════════════════"
echo ""

# Analyze file content
HAS_PROPS=$(grep -c "interface.*Props" "$FULL_PATH" || echo 0)
HAS_STATE=$(grep -c "useState" "$FULL_PATH" || echo 0)
HAS_EFFECTS=$(grep -c "useEffect" "$FULL_PATH" || echo 0)
HAS_CALLBACKS=$(grep -c "useCallback\|onClick\|onChange\|onSubmit" "$FULL_PATH" || echo 0)
HAS_ASYNC=$(grep -c "async\|await\|fetch\|Promise" "$FULL_PATH" || echo 0)
EXPORTS_COUNT=$(grep -c "^export " "$FULL_PATH" || echo 0)

# Component-specific suggestions
if [ "$IS_COMPONENT" = true ]; then
  echo "📦 COMPONENT TESTS"
  echo ""
  
  echo "✓ Basic rendering:"
  echo "  it('should render with default props', () => {
    render(<ComponentName />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })"
  echo ""
  
  if [ "$HAS_PROPS" -gt 0 ]; then
    echo "✓ Props handling:"
    echo "  it('should render with custom props', () => {
    render(<ComponentName prop=\"value\" />)
    expect(screen.getByText('value')).toBeInTheDocument()
  })"
    echo ""
  fi
  
  if [ "$HAS_STATE" -gt 0 ]; then
    echo "✓ State changes:"
    echo "  it('should update when state changes', () => {
    render(<ComponentName />)
    // Trigger state change
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('updated')).toBeInTheDocument()
  })"
    echo ""
  fi
  
  if [ "$HAS_CALLBACKS" -gt 0 ]; then
    echo "✓ User interactions:"
    echo "  it('should handle user interaction', () => {
    const handleClick = vi.fn()
    render(<ComponentName onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })"
    echo ""
  fi
  
  if [ "$HAS_ASYNC" -gt 0 ]; then
    echo "✓ Async operations:"
    echo "  it('should handle loading state', async () => {
    render(<ComponentName />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })"
    echo ""
    
    echo "  it('should handle error state', async () => {
    // Mock API error
    render(<ComponentName />)
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })"
    echo ""
  fi
  
  echo "✓ Accessibility:"
  echo "  it('should be accessible', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toHaveAccessibleName()
  })"
  echo ""
  
  echo "✓ Edge cases:"
  echo "  it('should handle empty props', () => {
    render(<ComponentName data={[]} />)
    expect(screen.getByText('No items')).toBeInTheDocument()
  })"
  echo ""
fi

# Hook-specific suggestions
if [ "$IS_HOOK" = true ]; then
  echo "🪝 HOOK TESTS"
  echo ""
  
  echo "✓ Basic functionality:"
  echo "  it('should return initial value', () => {
    const { result } = renderHook(() => useHookName())
    expect(result.current.value).toBe(initialValue)
  })"
  echo ""
  
  echo "✓ State updates:"
  echo "  it('should update value', () => {
    const { result } = renderHook(() => useHookName())
    act(() => {
      result.current.setValue(newValue)
    })
    expect(result.current.value).toBe(newValue)
  })"
  echo ""
  
  if [ "$HAS_EFFECTS" -gt 0 ]; then
    echo "✓ Side effects:"
    echo "  it('should run effect on mount', () => {
    const cleanup = vi.fn()
    renderHook(() => useHookName())
    expect(cleanup).toHaveBeenCalled()
  })"
    echo ""
  fi
fi

# Utility-specific suggestions
if [ "$IS_UTILITY" = true ]; then
  echo "🔧 UTILITY TESTS"
  echo ""
  
  echo "✓ Test each exported function:"
  echo "  it('should format date correctly', () => {
    const result = formatDate(new Date('2024-01-01'))
    expect(result).toBe('01/01/2024')
  })"
  echo ""
  
  echo "✓ Edge cases:"
  echo "  it('should handle null input', () => {
    const result = formatDate(null)
    expect(result).toBe('')
  })"
  echo ""
  
  echo "✓ Error handling:"
  echo "  it('should throw on invalid input', () => {
    expect(() => formatDate('invalid')).toThrow()
  })"
  echo ""
fi

echo "═══════════════════════════════════════"
echo ""
echo "Summary: Suggested $([ "$IS_COMPONENT" = true ] && echo "6-8" || echo "3-5") test cases"
echo ""
echo "Next steps:"
echo "  1. Create test file: ${TARGET_FILE%.tsx}.test.tsx"
echo "  2. Copy relevant suggestions above"
echo "  3. Run: @test-generator to auto-generate tests"
echo "  4. Run: npm run test:coverage to verify"
echo ""

exit 0
