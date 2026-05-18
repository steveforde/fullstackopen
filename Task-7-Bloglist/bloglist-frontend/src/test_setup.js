// Import the 'afterEach' function from Vitest
// afterEach is a hook that runs after every individual test in your test suite
// It's used for cleanup operations to ensure tests don't interfere with each other
import { afterEach } from 'vitest'

// Import the 'cleanup' function from React Testing Library
// cleanup unmounts any React components that were rendered during a test
// This prevents memory leaks and ensures each test starts with a clean DOM
import { cleanup } from '@testing-library/react'

// Import custom matchers from Jest DOM extended for Vitest
// This adds DOM-specific assertions like:
// - toBeInTheDocument()
// - toHaveTextContent()
// - toBeVisible()
// - toHaveClass()
// - toHaveAttribute()
// And many more helpful assertions for testing DOM elements
import '@testing-library/jest-dom/vitest'

// ========== GLOBAL TEST CLEANUP ==========
// afterEach runs after EACH test completes (whether the test passed or failed)
afterEach(() => {
  // Clean up any mounted React components from the DOM
  // This ensures the next test starts with a completely fresh DOM
  // Without this, rendered components from previous tests could still be in the DOM
  // and cause false positives or unexpected behavior
  cleanup()
})
