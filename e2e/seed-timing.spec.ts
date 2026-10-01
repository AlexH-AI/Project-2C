import { expect, test } from '@playwright/test';

// #64: under 5 s on the Owner's machines. GitHub's Windows runner is ~2.5× slower (6.6–7.4 s),
// so CI records the time and only fails on a large regression (Owner decision, 27/09/2026).
const LIMIT_MS = process.env.CI ? 15_000 : 5_000;

// Its own Playwright project, run before the others and alone (playwright.config.ts).
test('web mode seeds the simulated data in time (#64)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan');

  const duration = await page.evaluate(
    () => performance.getEntriesByName('p2c:demo-seed', 'measure')[0]?.duration,
  );
  test.info().annotations.push({ type: 'seed ms', description: String(duration) });
  expect(duration).toBeGreaterThan(0);
  expect(duration).toBeLessThan(LIMIT_MS);
});
