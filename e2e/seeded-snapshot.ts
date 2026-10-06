import type { Page } from '@playwright/test';

/**
 * Makes the page seed the simulated data itself: e2e/serve.mjs serves the pinned day's data
 * already seeded (DR-79), and the app seeds only when that file is missing.
 */
export const seedOnLoad = (page: Page) =>
  page.route('**/demo-*.sqlite', (route) => route.fulfill({ status: 404 }));

/** The duration of the seed in this page load; `undefined` when it opened the seeded file. */
export const seedDuration = (page: Page) =>
  page.evaluate(() => performance.getEntriesByName('p2c:demo-seed', 'measure')[0]?.duration);
