import { defineConfig, devices } from '@playwright/test';

const port = 4173;

// E2E runs against the production web build (ADR-0006 web mode). Microsoft Edge ships with
// Windows and shares its engine with the WebView2 runtime Tauri uses, so no browser download.
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    locale: 'vi-VN',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } }],
  webServer: {
    command: `pnpm build:web && pnpm --filter @p2c/desktop preview --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
