# 🧪 Test Suite Documentation

## Overview

This test suite provides comprehensive coverage for the Suite 52 website using modern testing practices. The suite is organized, maintainable, and designed for efficiency.

## Architecture

```
src/test/
├── unit/                 # Unit tests (isolated functions/components)
├── integration/          # Integration tests (component interactions)
├── e2e/                  # End-to-end tests (full user workflows)
├── utils/                # Test utilities and helpers
├── fixtures/             # Test data and mocks
├── __mocks__/           # Manual mocks
├── setup.ts             # Global test configuration
└── README.md            # This file
```

## Testing Strategy

### 1. Unit Tests (`src/test/unit/`)
- **Purpose**: Test individual functions and components in isolation
- **Tools**: Vitest, React Testing Library
- **Coverage**: Hooks, utilities, pure components
- **Example**: `useTypingEffect.test.ts`

### 2. Integration Tests (`src/test/integration/`)
- **Purpose**: Test component interactions and data flow
- **Tools**: React Testing Library, User Event
- **Coverage**: Component composition, routing, animations
- **Example**: `routing.test.tsx`

### 3. E2E Tests (`src/test/e2e/`)
- **Purpose**: Test complete user workflows
- **Tools**: Playwright (future implementation)
- **Coverage**: Critical user journeys, performance

## Test Categories & Naming

### File Naming Convention
```
ComponentName.test.tsx    # Component tests
useHookName.test.ts       # Hook tests
utilityName.test.ts       # Utility tests
featureName.test.tsx      # Integration tests
```

### Test Naming Convention
```javascript
describe('ComponentName', () => {
  describe('Feature Group', () => {
    it('should handle specific scenario', () => {
      // Test implementation
    })
  })
})
```

### Test Structure
```javascript
describe('Component', () => {
  describe('Rendering', () => {
    it('should render correctly', () => { ... })
  })

  describe('Interactions', () => {
    it('should handle user input', () => { ... })
  })

  describe('Edge Cases', () => {
    it('should handle error states', () => { ... })
  })

  describe('Accessibility', () => {
    it('should meet WCAG guidelines', () => { ... })
  })
})
```

## Best Practices

### ✅ Do's
- **Single Responsibility**: Each test should verify one behavior
- **Descriptive Names**: Test names should explain what they verify
- **Arrange-Act-Assert**: Structure tests clearly
- **Independent Tests**: Tests should not depend on each other
- **Fast Execution**: Keep tests running quickly
- **Realistic Data**: Use fixtures that match real data structure

### ❌ Don'ts
- **Test Implementation**: Test behavior, not internal implementation
- **Over-Mock**: Only mock external dependencies
- **Flaky Tests**: Avoid tests that fail randomly
- **Slow Tests**: Integration tests should be fast
- **Test Everything**: Focus on critical paths and edge cases

## Running Tests

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI (requires @vitest/ui)
npm run test:ui
```

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

## Test Utilities

### Custom Render (`test-utils.tsx`)
```javascript
import { render } from '@/test/utils/test-utils'

// Automatically includes Router and other providers
const { getByText } = render(<MyComponent />)
```

### Mock Helpers
```javascript
import { createMockIntersectionObserver } from '@/test/utils/test-utils'

// Setup mocks for complex browser APIs
const mockObserver = createMockIntersectionObserver()
```

## Common Patterns

### Testing Async Behavior
```javascript
it('should handle async operations', async () => {
  render(<AsyncComponent />)

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

### Testing User Interactions
```javascript
it('should handle button clicks', async () => {
  const user = userEvent.setup()
  render(<ButtonComponent />)

  await user.click(screen.getByRole('button'))

  expect(mockHandler).toHaveBeenCalled()
})
```

### Testing Custom Hooks
```javascript
it('should return correct values', () => {
  const { result } = renderHook(() => useCustomHook())

  expect(result.current.value).toBe(expectedValue)
})
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: npm run test:run

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
```

## Performance Considerations

- **Parallel Execution**: Tests run in parallel by default
- **Fast Feedback**: Unit tests provide immediate feedback
- **Selective Testing**: Use `--run` for specific test files
- **Mock Heavy Dependencies**: Avoid testing third-party libraries

## Maintenance

### Regular Tasks
- **Update Dependencies**: Keep testing libraries current
- **Review Coverage**: Ensure new code is tested
- **Refactor Tests**: Improve test readability and performance
- **Remove Flaky Tests**: Fix or remove unreliable tests

### Test Debt
- **Document Known Issues**: Comment on skipped tests
- **Prioritize Critical Paths**: Focus on user-facing features
- **Gradual Improvement**: Improve test quality over time

## Troubleshooting

### Common Issues
- **Flaky Tests**: Use `waitFor` instead of arbitrary timeouts
- **Missing Providers**: Use custom render utility
- **Async Timing**: Use `act()` for state updates
- **Mock Issues**: Ensure mocks are properly reset

### Debug Tips
- **Verbose Output**: Use `screen.debug()` to inspect DOM
- **Step Through**: Add `debugger` statements in tests
- **Isolate Issues**: Run individual test files
- **Check Coverage**: Identify untested code paths
