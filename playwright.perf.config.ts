import { defineConfig } from '@playwright/test';

// The perf probe of spec Phase 6 §5.2 (T-218), run by hand against an exe release already running
// with the load data and its WebView2 debug port, never in CI:
//   pnpm exec playwright test -c playwright.perf.config.ts
// e2e/perf/README.md has the steps. The probe is *.perf.ts, which the e2e config's default
// testMatch never picks up; no web server, no browser launched: it connects to the exe.
export default defineConfig({
  testDir: 'e2e/perf',
  testMatch: '*.perf.ts',
  workers: 1,
  forbidOnly: true,
  reporter: 'list',
  // Each operation runs PERF_RUNS times, the writes with the debugger off in between.
  timeout: 30 * 60_000,
  expect: { timeout: 15_000 },
  // A click that finds nothing fails rather than waits for the whole run.
  use: { actionTimeout: 15_000 },
});
