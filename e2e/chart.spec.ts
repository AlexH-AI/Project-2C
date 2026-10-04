import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';
import { trackConsoleErrors } from './support';

const CHART = 'Diễn biến khách hàng theo nhóm';

test('the stage chart colours N4–N1 from the stage tokens', async ({ page }) => {
  await page.goto('/#/overview');
  const chart = page.getByRole('img', { name: CHART, exact: true });
  await expect(chart.locator('svg')).toHaveCount(1);

  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return ['--n4', '--n3', '--n2', '--n1'].map((name) => style.getPropertyValue(name).trim());
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
  const chart = page.getByRole('img', { name: CHART, exact: true });

  for (let round = 0; round < 10; round++) {
    await nav.getByRole('link', { name: 'Lịch hẹn' }).click();
    await expect(chart).toHaveCount(0);
    await nav.getByRole('link', { name: 'Tổng quan' }).click();
    await expect(chart.locator('svg')).toHaveCount(1);
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
