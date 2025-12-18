#!/bin/bash
# analyze-tests.sh - Analyze test quality and patterns
# Usage: ./aurora/agents/test-reviewer/tools/analyze-tests.sh [path]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source shared logger
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

# Default to src/ if no path provided
TARGET_PATH="${1:-src/}"

log_info "🔍 Analyzing tests in: $TARGET_PATH"

# Find all test files
TEST_FILES=$(find "$PROJECT_ROOT/$TARGET_PATH" -type f \( -name "*.test.ts" -o -name "*.test.tsx" \) 2>/dev/null || true)

if [ -z "$TEST_FILES" ]; then
  log_warning "No test files found in $TARGET_PATH"
  exit 0
fi

TEST_COUNT=$(echo "$TEST_FILES" | wc -l | tr -d ' ')
log_info "Found $TEST_COUNT test files"

# Analysis results
ISSUES_FOUND=0

echo ""
echo "═══════════════════════════════════════"
echo "  TEST QUALITY ANALYSIS"
echo "═══════════════════════════════════════"
echo ""

# Check each test file
while IFS= read -r test_file; do
  RELATIVE_PATH="${test_file#$PROJECT_ROOT/}"
  
  # Check 1: Test file has describe blocks
  if ! grep -q "describe(" "$test_file"; then
    echo "⚠️  $RELATIVE_PATH"
    echo "   Missing describe() block"
    echo "   Add: describe('ComponentName', () => { ... })"
    echo ""
    ((ISSUES_FOUND++))
  fi
  
  # Check 2: Test file has it/test blocks
  if ! grep -q -E "(it\(|test\()" "$test_file"; then
    echo "⚠️  $RELATIVE_PATH"
    echo "   No test cases found"
    echo "   Add: it('should do something', () => { ... })"
    echo ""
    ((ISSUES_FOUND++))
  fi
  
  # Check 3: Using Testing Library best practices
  if grep -q "getByTestId" "$test_file"; then
    echo "💡 $RELATIVE_PATH"
    echo "   Using getByTestId (prefer getByRole)"
    echo "   Replace: getByTestId('button') → getByRole('button')"
    echo ""
    ((ISSUES_FOUND++))
  fi
  
  # Check 4: Testing implementation details
  if grep -q "\.state\|\.instance()" "$test_file"; then
    echo "⚠️  $RELATIVE_PATH"
    echo "   Testing implementation details"
    echo "   Test user behavior, not component internals"
    echo ""
    ((ISSUES_FOUND++))
  fi
  
  # Check 5: Async without waitFor
  if grep -q "async" "$test_file" && ! grep -q "waitFor" "$test_file"; then
    echo "💡 $RELATIVE_PATH"
    echo "   Async test without waitFor"
    echo "   Consider: await waitFor(() => { ... })"
    echo ""
    ((ISSUES_FOUND++))
  fi
  
  # Check 6: Test file size
  LINE_COUNT=$(wc -l < "$test_file" | tr -d ' ')
  if [ "$LINE_COUNT" -gt 300 ]; then
    echo "⚠️  $RELATIVE_PATH"
    echo "   Test file too large: $LINE_COUNT lines (max 300)"
    echo "   Split into multiple describe blocks or files"
    echo ""
    ((ISSUES_FOUND++))
  fi
  
done <<< "$TEST_FILES"

# Summary
echo "═══════════════════════════════════════"
echo ""

if [ "$ISSUES_FOUND" -eq 0 ]; then
  log_success "✅ All tests follow best practices!"
else
  log_warning "Found $ISSUES_FOUND test quality issues"
  echo ""
  echo "Next steps:"
  echo "  1. Review recommendations above"
  echo "  2. Run: @test-reviewer suggest-tests [file] for specific improvements"
  echo "  3. Run: npm run test:coverage to check coverage"
fi

echo ""
exit 0
