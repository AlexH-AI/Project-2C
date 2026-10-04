import { expect, test } from '@playwright/test';

test('app shell shows the brand and the overview with its KPI', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('complementary')).toContainText('Project-2C');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan');

  await expect(page.getByRole('region', { name: 'Chỉ số của kỳ' }).getByRole('region')).toHaveCount(
    6,
  );
});

test('page loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  expect(errors).toEqual([]);
});

test('web mode opens the in-memory database: sql.js wasm loads, no storage alert', async ({
  page,
}) => {
  const wasm = page.waitForResponse((response) => response.url().endsWith('.wasm'));
  await page.goto('/');

  expect((await wasm).ok()).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan');
  await expect(page.getByRole('alert')).toHaveCount(0);
});
