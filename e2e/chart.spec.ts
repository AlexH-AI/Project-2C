import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { expect, test, type Page } from '@playwright/test';

const CHART = 'Lịch hẹn theo team';

function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test('the overview shows the sample chart with series coloured from the tokens', async ({
  page,
}) => {
  await page.goto('/#/overview');
  const chart = page.getByRole('img', { name: CHART });
  await expect(chart.locator('svg')).toHaveCount(1);
  await expect(chart).toContainText('Sao Mai');

  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return ['--accent', '--n3', '--n2'].map((name) => style.getPropertyValue(name).trim());
  });
  const fills = await chart
    .locator('svg path[fill]')
    .evaluateAll((paths) => paths.map((path) => path.getAttribute('fill')));
  for (const colour of tokens) expect(fills).toContain(colour);
});

test('switching screens 10 times keeps one chart and logs no errors', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto('/#/overview');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });

  for (let round = 0; round < 10; round++) {
    await nav.getByRole('link', { name: 'Lịch hẹn' }).click();
    await expect(page.getByRole('img', { name: CHART })).toHaveCount(0);
    await nav.getByRole('link', { name: 'Tổng quan' }).click();
    await expect(page.getByRole('img', { name: CHART }).locator('svg')).toHaveCount(1);
  }

  await expect(page.locator('[_echarts_instance_]')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('the chart bundle stays within 250 KB gzip', () => {
  const assets = join(import.meta.dirname, '../apps/desktop/dist/assets');
  const chunks = readdirSync(assets).filter((file) => /^chart-.*\.js$/.test(file));

  expect(chunks).toHaveLength(1);
  const size = gzipSync(readFileSync(join(assets, chunks[0]!))).length;
  expect(size).toBeLessThanOrEqual(250 * 1024);
});
