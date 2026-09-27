import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const EDGE = { ...devices['Desktop Edge'], channel: 'msedge' };

// E2E runs against the production web build (ADR-0006 web mode). Microsoft Edge ships with
// Windows and shares its engine with the WebView2 runtime Tauri uses, so no browser download.
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  // Every page load seeds the simulated data (~3 s alone, more with parallel workers).
  expect: { timeout: 15_000 },
  use: {
    baseURL: `http://localhost:${port}`,
    locale: 'vi-VN',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    // The seed timing (#64: under 5 s) runs first and alone: parallel workers seeding at the same
    // time would measure CPU contention, not the seed.
    { name: 'seed-timing', testMatch: 'seed-timing.spec.ts', use: EDGE },
    { name: 'edge', testIgnore: 'seed-timing.spec.ts', dependencies: ['seed-timing'], use: EDGE },
  ],
  webServer: {
    command: `pnpm build:web && pnpm --filter @p2c/desktop preview --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // New databases get simulated data anchored on this day instead of today (spec §7).
    env: { VITE_DEMO_ANCHOR: '15/09/2026' },
  },
});
