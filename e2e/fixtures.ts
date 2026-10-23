import { test as base, type Locator } from '@playwright/test';
import { anchorMorning } from './anchor';

export { expect, type Locator, type Page } from '@playwright/test';

/**
 * The `test` of every spec: the pages of a test run on a clock that starts on the anchor morning
 * of the browser's time zone, so the e2e day, which follows the clock from the day the app opens
 * on (T-126), never moves on when the machine's midnight comes during a run (DR6-129). A test that
 * needs another day moves that clock itself (`page.clock.fastForward`, `toNewYearsEve`).
 */
export const test = base.extend<{ machineClock: boolean }>({
  /**
   * Leaves the pages on the machine's clock, for a test that reads their `performance` entries:
   * the page clock fakes `performance` too, and keeps none.
   */
  machineClock: [false, { option: true }],
  context: async ({ context, machineClock, timezoneId }, use) => {
    if (!machineClock) await context.clock.install({ time: anchorMorning(timezoneId) });
    await use(context);
  },
});

/**
 * Sets the text of an input or a textarea as a paste would, past the keyboard, so it reaches the
 * app as given: a lone surrogate half, U+200B between the halves of an emoji (DR6-109).
 */
export async function pasteAsIs(field: Locator, text: string) {
  await field.evaluate((element: HTMLInputElement | HTMLTextAreaElement, text) => {
    // React reads a value set through the setter of the element's own prototype.
    const prototype =
      element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(element, text);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, text);
}
