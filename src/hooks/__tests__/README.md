# Hook Tests

This directory contains tests for React custom hooks used in the Roma Mart application.

## Testing Framework

- **Vitest**: Fast, Vite-native test runner
- **React Testing Library**: Testing utilities for React components and hooks
- **jsdom**: DOM environment for testing in Node.js

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI (interactive)
npm run test:ui
```

## Test Structure

Tests for custom hooks follow the patterns described below.

## Writing New Tests

When adding new hook tests:

1. Create a new test file: `yourHook.test.jsx`
2. Import necessary testing utilities:
   ```javascript
   import { describe, it, expect, beforeEach, vi } from 'vitest';
   import { renderHook, waitFor } from '@testing-library/react';
   ```
3. Use `renderHook` to test hooks in isolation
4. Mock external dependencies (fetch, localStorage, etc.)
5. Test both success and error cases
6. Clean up after tests to prevent memory leaks

## CI Integration

Tests are automatically run in GitHub Actions:
- Tests run before the build step
- If tests fail, the build is skipped
- Test results are included in the CI summary report

## Fixtures

Test fixtures (sample data files) are stored in `src/test/fixtures/`:
- `test-menu.xlsx`: Sample Excel menu file for testing

## Mocking Best Practices

1. **Fetch API**: Mock using `vi.fn()` in `beforeEach`
2. **Reset mocks**: Clean up between tests
3. **Realistic data**: Use data that matches production structure
4. **Edge cases**: Test empty data, malformed data, errors

## Common Patterns

### Testing Async Hooks
```javascript
const { result } = renderHook(() => useYourHook());
await waitFor(() => {
  expect(result.current.loading).toBe(false);
});
```

### Testing Hook Updates
```javascript
const { result, rerender } = renderHook(
  ({ value }) => useYourHook(value),
  { initialProps: { value: 'initial' } }
);
rerender({ value: 'updated' });
```

### Testing Cleanup
```javascript
const { unmount } = renderHook(() => useYourHook());
unmount();
// Verify cleanup happened
```

## Troubleshooting

### Tests Timing Out
- Increase `timeout` in `waitFor` options
- Check for infinite loops or unresolved promises

### Mock Not Working
- Ensure mock is set up in `beforeEach`
- Verify you're mocking the correct module/function
- Check that mock returns the expected shape

### Memory Leaks
- Always cleanup in `afterEach`
- Unmount hooks that set up subscriptions
- Cancel pending promises in cleanup

## References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Hooks](https://react-hooks-testing-library.com/)
