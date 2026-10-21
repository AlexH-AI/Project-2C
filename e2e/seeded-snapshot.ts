import type { Page } from '@playwright/test';

/**
 * Makes the page seed the simulated data itself: e2e/serve.mjs serves the pinned day's data
 * already seeded (DR-79), and the app seeds only when that file is missing.
 */
export const seedOnLoad = (page: Page) =>
  page.route('**/demo-*.sqlite', (route) => route.fulfill({ status: 404 }));

/**
 * The duration of the seed in this page load; `undefined` when it opened the seeded file. A page on
 * the page clock keeps no `performance` entry at all, so it fails there rather than read "no seed"
 * (`machineClock` of fixtures.ts).
 */
export const seedDuration = (page: Page) =>
  page.evaluate(() => {
    if (!performance.getEntriesByType('navigation').length)
      throw new Error('This page keeps no performance entries: run it on the machine clock.');
    return performance.getEntriesByName('p2c:demo-seed', 'measure')[0]?.duration;
  });
