import { expect, test } from './fixtures';

test('app shell shows the brand and the overview with its KPI', async ({ page }) => {
  await page.goto('/');

  // The logo of Heritas L-CRM and its slogan, in place of the "2C" mark (T-308).
  const sidebar = page.getByRole('complementary');
  await expect(sidebar.getByRole('img', { name: 'Heritas L-CRM' })).toBeVisible();
  await expect(sidebar.getByText('Where legacy meets trust')).toBeVisible();
  await expect(sidebar).not.toContainText('2C');
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
