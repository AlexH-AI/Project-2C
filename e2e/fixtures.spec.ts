import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { ANCHOR_MORNING, toNewYearsEve } from './anchor';
import { expect, test, type Page } from './fixtures';

/** The page's date and time by its own wall clock: year, month, day, hours, minutes. */
const wallClock = (page: Page) =>
  page.evaluate(() => {
    const now = new Date();
    return [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes()];
  });

test('a page starts on the anchor morning, and its clock runs on', async ({ page }) => {
  await page.goto('/');
  const at = await page.evaluate(() => Date.now());
  expect(at - ANCHOR_MORNING.getTime()).toBeGreaterThanOrEqual(0);
  expect(at - ANCHOR_MORNING.getTime()).toBeLessThan(60_000);
  await expect.poll(() => page.evaluate(() => Date.now())).toBeGreaterThan(at);
});

test('toNewYearsEve stops at 23:58 on 31/12 by the page clock, however long the test ran', async ({
  page,
}) => {
  await page.goto('/');
  // A slow test: the page clock some minutes past the anchor morning already.
  await page.clock.fastForward(5 * 60_000);
  await toNewYearsEve(page);
  expect(await wallClock(page)).toEqual([2026, 12, 31, 23, 58]);
});

test.describe('a browser in a time zone of its own (use.timezoneId)', () => {
  // Far from the machine's zone: the anchor morning by the machine's clock is 14/09 there.
  test.use({ timezoneId: 'Pacific/Honolulu' });

  test('a page starts on the anchor morning of its own wall clock', async ({ page }) => {
    await page.goto('/');
    expect(await wallClock(page)).toEqual([2026, 9, 15, 9, 30]);
  });
});

// A file on Playwright's own `test` would read the machine's day again (DR6-129). The lint of
// eslint.config.js refuses it in every form, in a spec or in a helper that would hand it on.
test("lint refuses Playwright's own test to every e2e file but fixtures.ts", async () => {
  test.setTimeout(60_000);
  const eslint = new ESLint({ cwd: fileURLToPath(new URL('..', import.meta.url)) });
  const refusals = async (code: string, filePath = 'e2e/probe.spec.ts') =>
    (await eslint.lintText(code, { filePath }))[0]!.messages.filter(
      (message) => message.ruleId === 'no-restricted-imports',
    ).length;

  for (const code of [
    "import { expect, test } from '@playwright/test';",
    "import { test as base } from '@playwright/test';",
    "import * as playwright from '@playwright/test';",
    // Its default export is `test` too.
    "import playwright from '@playwright/test';",
    "export { test } from '@playwright/test';",
  ]) {
    expect(await refusals(code), code).toBe(1);
  }
  expect(await refusals("export { test } from '@playwright/test';", 'e2e/helper.ts')).toBe(1);
  expect(await refusals("import { expect, type Page } from '@playwright/test';")).toBe(0);
  expect(await refusals("import { expect, test } from './fixtures';")).toBe(0);
  const fixtures = readFileSync(new URL('./fixtures.ts', import.meta.url), 'utf8');
  expect(await refusals(fixtures, 'e2e/fixtures.ts')).toBe(0);
});
