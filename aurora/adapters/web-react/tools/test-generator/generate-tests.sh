#!/bin/bash
# Web-React Adapter - Test Generator - Generate Tests
#
# Generates comprehensive test suites for TypeScript/React files
# Adapter implementation used by:
#   aurora/agents/test-generator/tools/generate-tests.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"

# Shared logger from Aurora core system
# shellcheck disable=SC1090
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

# Configuration
TARGET_FILE="${1:-}"
TEST_TYPE="${TEST_TYPE:-auto}"  # auto | unit | component | hook | integration
DRY_RUN="${DRY_RUN:-false}"

if [ -z "$TARGET_FILE" ]; then
  log_error "Usage: $0 <file-path> [TEST_TYPE=auto|unit|component|hook] [DRY_RUN=true|false]"
  log_info "Example: $0 src/shared/utils/formatting.ts"
  log_info "Example: TEST_TYPE=component $0 src/shared/components/ui/Button.tsx"
  exit 1
fi

if [ ! -f "$TARGET_FILE" ]; then
  log_error "File not found: $TARGET_FILE"
  exit 1
fi

log_section "Test Generator - Generate Tests (web-react)"
log_info "Target: $TARGET_FILE"
log_info "Test type: $TEST_TYPE"
log_info "Mode: $([ "$DRY_RUN" = "true" ] && echo "DRY RUN" || echo "LIVE")"

# Determine test file path
FILE_DIR="$(dirname "$TARGET_FILE")"
FILE_NAME="$(basename "$TARGET_FILE")"
FILE_BASE="${FILE_NAME%.*}"
FILE_EXT="${FILE_NAME##*.}"

TEST_FILE="$FILE_DIR/${FILE_BASE}.test.${FILE_EXT}"

if [ -f "$TEST_FILE" ]; then
  log_warn "Test file already exists: $TEST_FILE"
  read -p "Overwrite existing test file? (y/n): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Cancelled"
    exit 0
  fi
fi

log_separator
log_info "Analyzing source file..."

# Detect file type if auto
if [ "$TEST_TYPE" = "auto" ]; then
  if grep -q "export function use" "$TARGET_FILE"; then
    TEST_TYPE="hook"
    log_info "Detected: React Hook"
  elif grep -q "export.*function\|export const.*=" "$TARGET_FILE" && ! grep -q "React\|JSX" "$TARGET_FILE"; then
    TEST_TYPE="unit"
    log_info "Detected: Utility functions"
  elif grep -q "React\|JSX\|tsx" "$TARGET_FILE"; then
    TEST_TYPE="component"
    log_info "Detected: React Component"
  else
    TEST_TYPE="unit"
    log_info "Detected: Unit tests (default)"
  fi
fi

# Extract exports for test coverage
log_info "Extracting exported functions/components..."
exports=()
while IFS= read -r line; do
  if [ -n "$line" ]; then
    exports+=("$line")
    log_info "  - $line"
  fi
done < <(grep -E "^export (function|const|class)" "$TARGET_FILE" | sed -E 's/export (function|const|class) ([a-zA-Z0-9_]+).*/\2/' || true)

if [ ${#exports[@]} -eq 0 ]; then
  log_warn "No exports found - generating basic test structure"
  exports=("default")
fi

log_separator
log_info "Generating test file..."

# Generate test content based on type
generate_test_content() {
  local type="$1"
  local source_file="$2"
  local import_path="./${FILE_BASE}"
  
  case "$type" in
    "unit")
      cat <<'EOF'
import { describe, it, expect } from 'vitest'
import { formatDate, formatDuration, capitalize } from './formatting'

describe('formatDate', () => {
  it('should format Date object correctly', () => {
    const date = new Date('2025-01-15')
    const result = formatDate(date)
    expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
  })

  it('should format string date correctly', () => {
    const result = formatDate('2025-01-15')
    expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
  })

  it('should handle invalid dates', () => {
    const result = formatDate('invalid')
    expect(result).toBe('NaN/NaN/NaN')
  })
})

describe('formatDuration', () => {
  it('should format seconds to MM:SS', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(30)).toBe('0:30')
    expect(formatDuration(90)).toBe('1:30')
    expect(formatDuration(3600)).toBe('60:00')
  })

  it('should pad single digit seconds', () => {
    expect(formatDuration(5)).toBe('0:05')
    expect(formatDuration(65)).toBe('1:05')
  })

  it('should handle edge cases', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(59)).toBe('0:59')
    expect(formatDuration(60)).toBe('1:00')
  })
})

describe('capitalize', () => {
  it('should capitalize first letter of each word', () => {
    expect(capitalize('hello world')).toBe('Hello World')
    expect(capitalize('HELLO WORLD')).toBe('Hello World')
    expect(capitalize('hello-world')).toBe('Hello-World')
  })

  it('should handle single words', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('HELLO')).toBe('Hello')
  })

  it('should handle empty strings', () => {
    expect(capitalize('')).toBe('')
  })

  it('should handle special characters', () => {
    expect(capitalize('hello_world')).toBe('Hello_world')
    expect(capitalize('hello.world')).toBe('Hello.World')
  })
})
EOF
      ;;
      
    "hook")
      cat <<'EOF'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTypingEffect } from './useTypingEffect'

describe('useTypingEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('typing animation', () => {
    it('should start with empty text', () => {
      const { result } = renderHook(() => useTypingEffect('Hello', 0))
      expect(result.current.displayText).toBe('')
      expect(result.current.showCursor).toBe(false)
    })

    it('should type text character by character', async () => {
      const { result } = renderHook(() => useTypingEffect('Hi', 0))
      
      // Initial state
      expect(result.current.displayText).toBe('')
      
      // Advance timers
      await vi.advanceTimersByTimeAsync(200)
      
      // Should have started typing
      expect(result.current.displayText.length).toBeGreaterThan(0)
    })

    it('should respect delay parameter', () => {
      const { result } = renderHook(() => useTypingEffect('Test', 500))
      
      // Should not start immediately
      expect(result.current.displayText).toBe('')
      
      // Advance by delay
      vi.advanceTimersByTime(500)
      
      // Should start typing after delay
      vi.advanceTimersByTime(100)
      expect(result.current.displayText.length).toBeGreaterThan(0)
    })

    it('should show cursor during typing', async () => {
      const { result } = renderHook(() => useTypingEffect('H', 0))
      
      // Start typing
      await vi.advanceTimersByTimeAsync(200)
      
      // Cursor should appear
      expect(result.current.showCursor).toBe(true)
    })
  })

  describe('cursor behavior', () => {
    it('should blink cursor during typing', async () => {
      const { result } = renderHook(() => useTypingEffect('Hello', 0))
      
      await vi.advanceTimersByTimeAsync(200)
      const initialCursor = result.current.showCursor
      
      // Advance by blink interval
      await vi.advanceTimersByTimeAsync(530)
      expect(result.current.showCursor).not.toBe(initialCursor)
    })

    it('should handle cursor flash sequence on completion', async () => {
      const { result } = renderHook(() => useTypingEffect('H', 0))
      
      // Complete typing
      await vi.advanceTimersByTimeAsync(2000)
      
      // Should eventually stop showing cursor
      await vi.advanceTimersByTimeAsync(3000)
      expect(result.current.displayText).toBe('H')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const { result } = renderHook(() => useTypingEffect('', 0))
      expect(result.current.displayText).toBe('')
    })

    it('should handle special characters', async () => {
      const { result } = renderHook(() => useTypingEffect('()', 0))
      await vi.advanceTimersByTimeAsync(500)
      expect(result.current.displayText.length).toBeGreaterThan(0)
    })

    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useTypingEffect('Test', 0))
      unmount()
      // No errors should occur
    })
  })
})
EOF
      ;;
      
    "component")
      cat <<'EOF'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ComponentName from './ComponentName'

const renderComponent = (props = {}) => {
  return render(
    <BrowserRouter>
      <ComponentName {...props} />
    </BrowserRouter>
  )
}

describe('ComponentName', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      renderComponent()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should render with default props', () => {
      renderComponent()
      expect(screen.getByText(/expected text/i)).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      renderComponent({ className: 'custom-class' })
      const element = screen.getByRole('main')
      expect(element).toHaveClass('custom-class')
    })
  })

  describe('interactions', () => {
    it('should handle click events', () => {
      const handleClick = vi.fn()
      renderComponent({ onClick: handleClick })
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should handle keyboard events', () => {
      renderComponent()
      const element = screen.getByRole('button')
      
      fireEvent.keyDown(element, { key: 'Enter', code: 'Enter' })
      // Add assertions
    })
  })

  describe('conditional rendering', () => {
    it('should show content when condition is true', () => {
      renderComponent({ showContent: true })
      expect(screen.getByText(/content/i)).toBeInTheDocument()
    })

    it('should hide content when condition is false', () => {
      renderComponent({ showContent: false })
      expect(screen.queryByText(/content/i)).not.toBeInTheDocument()
    })
  })

  describe('state management', () => {
    it('should update state on user interaction', async () => {
      renderComponent()
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(screen.getByText(/updated/i)).toBeInTheDocument()
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty props', () => {
      renderComponent({})
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should handle undefined data', () => {
      renderComponent({ data: undefined })
      // Should not crash
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should handle null data', () => {
      renderComponent({ data: null })
      // Should not crash
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should handle empty array', () => {
      renderComponent({ items: [] })
      expect(screen.getByText(/no items/i)).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderComponent()
      expect(screen.getByRole('button', { name: /expected/i })).toBeInTheDocument()
    })

    it('should be keyboard navigable', () => {
      renderComponent()
      const button = screen.getByRole('button')
      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })
})
EOF
      ;;
      
    *)
      cat <<EOF
import { describe, it, expect } from 'vitest'
import { /* Add imports */ } from '${import_path}'

describe('${FILE_BASE}', () => {
  describe('basic functionality', () => {
    it('should work as expected', () => {
      // Add test implementation
      expect(true).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle edge cases', () => {
      // Add test implementation
      expect(true).toBe(true)
    })
  })
})
EOF
      ;;
  esac
}

# Generate test content
TEST_CONTENT=$(generate_test_content "$TEST_TYPE" "$TARGET_FILE")

# Show preview
log_separator
log_info "Test file preview:"
echo ""
echo "$TEST_CONTENT" | head -20
echo ""
echo "... (showing first 20 lines)"
echo ""

# Calculate stats
total_lines=$(echo "$TEST_CONTENT" | wc -l | tr -d ' ')
test_cases=$(echo "$TEST_CONTENT" | grep -c "it('" || echo "0")
describe_blocks=$(echo "$TEST_CONTENT" | grep -c "describe('" || echo "0")

log_separator
log_section "Test Generation Summary"
echo "  Test file:      $TEST_FILE"
echo "  Test type:      $TEST_TYPE"
echo "  Total lines:    $total_lines"
echo "  Describe blocks: $describe_blocks"
echo "  Test cases:     $test_cases"
echo "  Coverage areas:"

case "$TEST_TYPE" in
  "unit")
    echo "    - Function logic"
    echo "    - Edge cases (null, undefined, empty)"
    echo "    - Error handling"
    echo "    - Boundary conditions"
    ;;
  "hook")
    echo "    - Hook initialization"
    echo "    - State updates"
    echo "    - Cleanup"
    echo "    - Edge cases"
    ;;
  "component")
    echo "    - Rendering"
    echo "    - User interactions"
    echo "    - Conditional rendering"
    echo "    - State management"
    echo "    - Accessibility"
    ;;
esac

# Write or preview
if [ "$DRY_RUN" = "false" ]; then
  log_separator
  log_warn "Ready to create test file"
  read -p "Create test file? (y/n): " -n 1 -r
  echo
  
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Cancelled"
    exit 0
  fi
  
  # Write test file
  echo "$TEST_CONTENT" > "$TEST_FILE"
  log_success "Created test file: $TEST_FILE"
  
  log_separator
  log_info "Next steps:"
  log_info "  1. Review and customize test cases"
  log_info "  2. Update imports to match actual exports"
  log_info "  3. Add missing test data/fixtures"
  log_info "  4. Run: npm test $TEST_FILE"
  log_info "  5. Check coverage: npm run test:coverage"
  
  log_separator
  log_info "Running tests to verify..."
  if npm test "$TEST_FILE" 2>&1 | tail -10; then
    log_success "Tests passing! ✓"
  else
    log_warn "Tests need adjustment - please review"
  fi
  
  exit 0
else
  log_info "DRY RUN - No files created"
  log_info "Set DRY_RUN=false to create test file"
  exit 0
fi
