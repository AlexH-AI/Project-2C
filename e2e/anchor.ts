import type { Page } from '@playwright/test';

// The e2e build opens on this day instead of the machine's today (VITE_DEMO_ANCHOR, spec §7), and
// the page's clock moves the day on from there (T-126). That clock starts on the anchor morning in
// every test (fixtures.ts), so expectations never read the machine clock: a test reaches another
// day only by moving the page's clock.
export const DEMO_ANCHOR = '15/09/2026';
export const ANCHOR_YEAR = 2026;

/**
 * Mid-morning of the pinned day by the machine's clock: where the page's clock of every test starts
 * while the browser keeps the machine's time zone (`anchorMorning`).
 */
export const ANCHOR_MORNING = new Date(ANCHOR_YEAR, 8, 15, 9, 30);

/**
 * The anchor morning by the wall clock of `timeZone`, the zone a config may give the browser
 * (`use.timezoneId`); ANCHOR_MORNING, by the machine's, without one. By the machine's clock, a
 * browser in a zone far from it would start close to midnight or on another day (DR6-129).
 */
export function anchorMorning(timeZone?: string): Date {
  if (timeZone === undefined) return ANCHOR_MORNING;
  const wall = Date.UTC(ANCHOR_YEAR, 8, 15, 9, 30);
  // How far the zone's clock is ahead of UTC at `at`.
  const offset = (at: number) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).formatToParts(at);
    const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    return (
      Date.UTC(part('year'), part('month') - 1, part('day'), part('hour'), part('minute')) - at
    );
  };
  // The offset at the instant found, not at the wall reading taken as UTC: summer time may differ.
  return new Date(wall - offset(wall - offset(wall)));
}

const DAY = 24 * 60 * 60_000;

/**
 * 23:58 on 31/12/2026 by the page's own clock, from wherever that clock is now: the e2e day starts
 * on the anchor and the clock moves it on (T-126). One fast-forward wraps past 2³² ms, so it goes
 * 20 days a time.
 */
export async function toNewYearsEve(page: Page) {
  const ms = await page.evaluate(
    (year) => new Date(year, 11, 31, 23, 58).getTime() - Date.now(),
    ANCHOR_YEAR,
  );
  for (let left = ms; left > 0; left -= 20 * DAY) {
    await page.clock.fastForward(Math.min(left, 20 * DAY));
  }
}
