import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { expect, test } from './fixtures';
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

// Today is pinned to 15/09/2026 (playwright.config.ts): 15 days drawn, 15 after today.
test('the stage chart marks today and draws the days after it as dashed lines', async ({
  page,
}) => {
  await page.goto('/#/overview');
  const chart = page.getByRole('img', { name: CHART, exact: true });
  await expect(chart.locator('svg')).toHaveCount(1);

  const [borderStrong, dateToday] = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return ['--border-strong', '--date-today'].map((name) => style.getPropertyValue(name).trim());
  });
  const dashes = chart.locator('svg path[stroke-dasharray]');
  await expect(dashes).toHaveCount(15);
  expect(await dashes.first().getAttribute('stroke')).toBe(borderStrong);

  const today = chart.locator('svg text', { hasText: /^15$/ });
  await expect(today).toHaveAttribute('fill', dateToday!);
  await expect(today).toHaveCSS('font-weight', '700');
});

// Review of Phase 4 (P8): the chart is one image to a screen reader, so its numbers come from a
// table off screen, built from the same columns, that the image names as its description.
test('the stage chart is described by a hidden table of its numbers', async ({ page }) => {
  await page.goto('/#/overview');
  const chart = page.getByRole('img', { name: CHART, exact: true });
  await expect(chart.locator('svg')).toHaveCount(1);
  const table = page.getByRole('table', { name: `Số liệu: ${CHART}`, exact: true });
  // The rows, not the table: a description would read the table's name, its caption, alone.
  const described = (await chart.getAttribute('aria-describedby'))!.split(' ');
  expect(described).toHaveLength(2);
  for (const id of described) await expect(table.locator(`[id="${id}"]`)).toHaveCount(1);
  await expect(chart).toHaveAccessibleDescription(
    /^Ngày\s*N4\s*N3\s*N2\s*N1\s*Tổng\b.*15\/09\/2026 · cuối ngày/,
  );
  // Off screen: the box holding it takes a pixel.
  const box = await table.locator('..').boundingBox();
  expect(Math.max(box!.width, box!.height)).toBeLessThanOrEqual(1);

  await expect(table.getByRole('columnheader')).toHaveText([
    'Ngày',
    'N4',
    'N3',
    'N2',
    'N1',
    'Tổng',
  ]);
  // A row per day of September; today (15/09) is the four tiles, the days after it "—".
  const rows = table.getByRole('row').filter({ has: page.getByRole('rowheader') });
  await expect(rows).toHaveCount(30);
  const count = (text: string | null) => Number((text ?? '').replaceAll('.', ''));
  const block = page.getByRole('region', { name: 'Khách hàng theo nhóm' });
  const tiles = await Promise.all(
    ['N4', 'N3', 'N2', 'N1'].map(async (stage) =>
      count(
        await block
          .getByRole('button', { name: new RegExp(`^${stage}`) })
          .locator('b')
          .textContent(),
      ),
    ),
  );
  const today = (
    await rows.filter({ hasText: '15/09/2026' }).getByRole('cell').allTextContents()
  ).map(count);
  expect(today).toEqual([...tiles, tiles.reduce((sum, tile) => sum + tile, 0)]);
  await expect(rows.filter({ hasText: '16/09/2026' }).getByRole('cell')).toHaveText(
    Array(5).fill('—'),
  );
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
