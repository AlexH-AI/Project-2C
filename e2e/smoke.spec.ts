import { expect, test } from '@playwright/test';

test('app shell shows the title and the pipeline stages in order', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'Project-2C' })).toBeVisible();

  const stages = page.getByRole('region', { name: 'Nhóm cơ hội' }).getByRole('listitem');
  await expect(stages).toHaveText(['N4', 'N3', 'N2', 'N1']);
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
