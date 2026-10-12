import { defineConfig, devices } from '@playwright/test';
import { DEMO_ANCHOR } from './e2e/anchor';

const port = 4174;

// Screenshots of the user guide (spec Phase 6 §4.3), run by hand, never in CI:
//   pnpm exec playwright test -c playwright.guide.config.ts
// Same web build and pinned day as e2e (playwright.config.ts), so a second run gives the same
// bytes. The files are *.guide.ts, which the e2e config's default testMatch never picks up.
export default defineConfig({
  testDir: 'e2e/guide',
  testMatch: '*.guide.ts',
  // One worker: the shots then the checks, in order, on one quiet CPU.
  workers: 1,
  forbidOnly: true,
  reporter: 'list',
  expect: { timeout: 15_000 },
  use: {
    ...devices['Desktop Edge'],
    channel: 'msedge',
    baseURL: `http://localhost:${port}`,
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  },
  projects: [
    { name: 'shots', testMatch: 'shots.guide.ts' },
    { name: 'check', testMatch: 'check.guide.ts', dependencies: ['shots'] },
  ],
  webServer: {
    command: 'node e2e/serve.mjs',
    url: `http://localhost:${port}`,
    reuseExistingServer: process.env.PW_REUSE === '1',
    timeout: 120_000,
    env: { E2E_PORT: String(port), VITE_DEMO_ANCHOR: DEMO_ANCHOR },
  },
});
