// Runs once per test file, before the tests in it.
// Add global matchers, mocks, and cleanup here.

import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Unmount React trees and reset the DOM between tests
afterEach(() => {
  cleanup()
})
