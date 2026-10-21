import { readdirSync, readFileSync } from 'node:fs';
import { ANCHOR_MORNING } from './anchor';
import { expect, test } from './fixtures';

test('a page starts on the anchor morning, and its clock runs on', async ({ page }) => {
  await page.goto('/');
  const at = await page.evaluate(() => Date.now());
  expect(at - ANCHOR_MORNING.getTime()).toBeGreaterThanOrEqual(0);
  expect(at - ANCHOR_MORNING.getTime()).toBeLessThan(60_000);
  await expect.poll(() => page.evaluate(() => Date.now())).toBeGreaterThan(at);
});

// A spec on Playwright's own `test` would read the machine's day again (DR6-129).
test('every spec takes its test from fixtures.ts', () => {
  const dir = new URL('./', import.meta.url);
  const loose = readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.spec.ts'))
    .filter((file) =>
      /^import \{[^}]*\btest\b[^}]*\} from '@playwright\/test'/m.test(
        readFileSync(new URL(file.replaceAll('\\', '/'), dir), 'utf8'),
      ),
    );
  expect(loose).toEqual([]);
});
