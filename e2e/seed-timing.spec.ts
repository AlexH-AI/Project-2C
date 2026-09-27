import { expect, test } from '@playwright/test';

// Its own Playwright project, run before the others and alone (playwright.config.ts).
test('web mode seeds the simulated data in under 5 s (#64)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan hôm nay');

  const duration = await page.evaluate(
    () => performance.getEntriesByName('p2c:demo-seed', 'measure')[0]?.duration,
  );
  test.info().annotations.push({ type: 'seed ms', description: String(duration) });
  expect(duration).toBeGreaterThan(0);
  expect(duration).toBeLessThan(5_000);
});
