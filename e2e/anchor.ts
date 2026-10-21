import type { Page } from '@playwright/test';

// The e2e build opens on this day instead of the machine's today (VITE_DEMO_ANCHOR, spec §7), and
// the page's clock moves the day on from there (T-126). That clock starts on the anchor morning in
// every test (fixtures.ts), so expectations never read the machine clock: a test reaches another
// day only by moving the page's clock.
export const DEMO_ANCHOR = '15/09/2026';
export const ANCHOR_YEAR = 2026;

/** Mid-morning of the pinned day, local time: where the page's clock of every test starts. */
export const ANCHOR_MORNING = new Date(ANCHOR_YEAR, 8, 15, 9, 30);

const DAY = 24 * 60 * 60_000;

/**
 * 23:58 on 31/12/2026 by the app's clock, from the anchor morning: the e2e day starts on the anchor
 * and the clock moves it on (T-126). One fast-forward wraps past 2³² ms, so it goes 20 days a time.
 */
export async function toNewYearsEve(page: Page) {
  const ms = new Date(ANCHOR_YEAR, 11, 31, 23, 58).getTime() - ANCHOR_MORNING.getTime();
  for (let left = ms; left > 0; left -= 20 * DAY) {
    await page.clock.fastForward(Math.min(left, 20 * DAY));
  }
}
