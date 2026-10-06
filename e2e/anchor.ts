// The e2e build opens on this day instead of the machine's today (VITE_DEMO_ANCHOR, spec §7), so
// expectations never read the machine clock.
export const DEMO_ANCHOR = '15/09/2026';
export const ANCHOR_YEAR = 2026;

/** Mid-morning of the pinned day, local time: for `page.clock` when a test freezes the clock. */
export const ANCHOR_MORNING = new Date(ANCHOR_YEAR, 8, 15, 9, 30);
