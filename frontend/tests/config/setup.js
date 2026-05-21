// Runs once per test file, before the tests in it.
// Add global matchers, mocks, and cleanup here.

import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

vi.stubEnv("VITE_SUPABASE_URL", "http://localhost:54321");
vi.stubEnv("VITE_SUPABASE_ANON_KEY", "test-anon-key");

// Unmount React trees and reset the DOM between tests
afterEach(() => {
  cleanup();
});
