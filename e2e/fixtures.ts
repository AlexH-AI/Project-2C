import { test as base } from '@playwright/test';
import { ANCHOR_MORNING } from './anchor';

export { expect, type Locator, type Page } from '@playwright/test';

/**
 * The `test` of every spec: the pages of a test run on a clock that starts on the anchor morning,
 * so the e2e day, which follows the clock from the day the app opens on (T-126), never moves on
 * when the machine's midnight comes during a run (DR6-129). A test that needs another day moves
 * that clock itself (`page.clock.fastForward`, `toNewYearsEve`).
 */
export const test = base.extend<{ machineClock: boolean }>({
  /**
   * Leaves the pages on the machine's clock, for a test that reads their `performance` entries:
   * the page clock fakes `performance` too, and keeps none.
   */
  machineClock: [false, { option: true }],
  context: async ({ context, machineClock }, use) => {
    if (!machineClock) await context.clock.install({ time: ANCHOR_MORNING });
    await use(context);
  },
});
