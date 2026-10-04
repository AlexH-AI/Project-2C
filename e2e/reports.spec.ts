import { expect, test, type Page } from '@playwright/test';
import { trackConsoleErrors } from './support';

// The e2e build pins today to Tuesday 15/09/2026 (playwright.config.ts): September is in progress.
async function openReports(page: Page) {
  await page.goto('/#/reports');
  return {
    kinds: page.getByRole('radiogroup', { name: 'Loại kỳ' }),
    scope: page.getByRole('radiogroup', { name: 'Góc nhìn' }),
    filter: page.getByRole('button', { name: 'Lọc', exact: true }),
    pending: page.getByText('Đã đổi kỳ / góc nhìn — bấm Lọc để cập nhật'),
    viewing: page.locator('p', { hasText: 'Đang xem:' }),
    summary: page.getByRole('table', { name: 'Tổng hợp' }),
    tables: page.getByRole('radiogroup', { name: 'Bảng báo cáo' }),
  };
}

test('Toàn bộ: Tổng hợp over Theo team, and Theo RE can be chosen', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  const { viewing, summary, tables } = await openReports(page);

  await expect(viewing).toHaveText('Đang xem: Tháng 09/2026MTD 01/09 – 15/09/2026 · Toàn bộ');
  await expect(page.getByRole('region', { name: 'Tổng hợp' })).toContainText('Toàn bộ · 30 RE');
  await expect(summary.getByRole('rowheader')).toHaveText(['Toàn bộ']);
  await expect(summary.getByRole('columnheader', { name: 'Kết quả · tới hôm nay' })).toBeVisible();
  await expect(summary.getByRole('columnheader', { name: 'Mất cơ hội' })).toBeVisible();

  await expect(tables.getByRole('radio')).toHaveText(['Theo team', 'Theo RE', 'Theo mốc']);
  await expect(tables.getByRole('radio', { checked: true })).toHaveText('Theo team');
  const byTeam = page.getByRole('table', { name: 'Theo team' });
  await expect(byTeam.getByRole('rowheader')).toHaveCount(4);
  await expect(byTeam.getByRole('rowheader').last()).toHaveText('Tổng');

  await tables.getByRole('radio', { name: 'Theo RE' }).click();
  const byRe = page.getByRole('table', { name: 'Theo RE' });
  await expect(byRe.getByRole('rowheader')).toHaveCount(31);
  await expect(page.getByRole('region', { name: 'Theo RE' })).toContainText(
    '30 RE · thứ tự theo team rồi tên',
  );
  expect(errors).toEqual([]);
});

test('scrolled sideways, Theo RE keeps the RE name and every figure of Tổng readable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  const { tables } = await openReports(page);
  await tables.getByRole('radio', { name: 'Theo RE' }).click();
  const table = page.getByRole('table', { name: 'Theo RE' });
  await expect(table.getByRole('rowheader')).toHaveCount(31);

  // Scrolled to the far right: the RE name stays at the left edge, and every cell of the first RE
  // row and of Tổng whose middle is right of the RE column is the element seen there, not covered.
  const seen = await table.evaluate((element) => {
    const box = element.parentElement!;
    const rows = [
      element.querySelector('tbody tr')!,
      element.querySelector('tbody tr:last-child')!,
    ];
    const covered: string[] = [];
    for (const row of rows) {
      row.scrollIntoView({ block: 'center' });
      box.scrollLeft = box.scrollWidth;
      const view = box.getBoundingClientRect();
      const reColumn = rows[0]!.querySelector('th')!.getBoundingClientRect();
      if (reColumn.left !== view.left) covered.push('RE name moved');
      for (const cell of row.querySelectorAll('td')) {
        const rect = cell.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (x <= reColumn.right || x >= view.right) continue;
        if (document.elementFromPoint(x, y) !== cell) covered.push(cell.textContent ?? '');
      }
    }
    return { scrolled: box.scrollLeft > 0, covered };
  });
  expect(seen).toEqual({ scrolled: true, covered: [] });
});

test('Team Bình Minh has no Theo team, and Theo RE lists its 10 RE', async ({ page }) => {
  const { scope, filter, viewing, summary, tables } = await openReports(page);

  await scope.getByRole('radio', { name: 'Team' }).click();
  await page
    .getByRole('combobox', { name: 'Team của góc nhìn' })
    .selectOption({ label: 'Bình Minh' });
  await filter.click();

  await expect(viewing).toContainText('· Team Bình Minh');
  await expect(summary.getByRole('rowheader')).toHaveText(['Team Bình Minh']);
  await expect(tables.getByRole('radio')).toHaveText(['Theo RE', 'Theo mốc']);
  const byRe = page.getByRole('table', { name: 'Theo RE' });
  await expect(byRe.getByRole('rowheader')).toHaveCount(11);
  await expect(byRe.getByRole('row').filter({ hasText: 'Bình Minh' })).toHaveCount(10);
});

test('RE · Năm: Tổng hợp and Theo mốc of 12 months, the months after today "—"', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  const { kinds, scope, filter, viewing, summary, tables } = await openReports(page);

  await scope.getByRole('radio', { name: 'RE' }).click();
  await kinds.getByRole('radio', { name: 'Năm' }).click();
  await filter.click();

  await expect(viewing).toContainText('Năm 2026');
  await expect(viewing).toContainText('· RE ');
  await expect(summary).toBeVisible();
  await expect(tables.getByRole('radio')).toHaveText(['Theo mốc']);
  await expect(page.getByRole('table')).toHaveCount(2);
  const byMark = page.getByRole('table', { name: 'Theo mốc' });
  await expect(page.getByRole('region', { name: 'Theo mốc' })).toContainText('12 mốc');
  await expect(byMark.getByRole('rowheader')).toHaveText([
    ...Array.from({ length: 8 }, (_, index) => `Tháng ${index + 1}`),
    'Tháng 9 (tới 15/09)',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ]);
  // A month after today: its appointments counted (Dự kiến), the results and KH "—".
  const december = byMark.getByRole('row', { name: /^Tháng 12/ }).getByRole('cell');
  await expect(december.nth(4)).not.toHaveText('—');
  for (let index = 5; index < 17; index += 1) await expect(december.nth(index)).toHaveText('—');
  const august = byMark.getByRole('row', { name: /^Tháng 8/ }).getByRole('cell');
  await expect(august.nth(5)).not.toHaveText('—');
  expect(errors).toEqual([]);
});

test('a new period waits for Lọc: the tables keep their numbers until then', async ({ page }) => {
  const { kinds, filter, pending, summary } = await openReports(page);
  const before = await summary.textContent();

  await kinds.getByRole('radio', { name: 'Năm' }).click();
  await expect(pending).toBeVisible();
  await expect(summary).toHaveText(before ?? '');

  await filter.click();
  await expect(pending).toHaveCount(0);
  await expect(summary).not.toHaveText(before ?? '');
});

test('Xuất Excel downloads the report of the period and scope viewed, a sheet per table', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  await openReports(page);

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất Excel' }).click();
  const file = await download;

  expect(file.suggestedFilename()).toBe('bao-cao_2026-09_toan-bo_2026-09-15.xlsx');
  await expect(page.getByRole('status').filter({ hasText: 'Đã xuất báo cáo' })).toHaveText(
    'Đã xuất báo cáo · 4 sheet: bao-cao_2026-09_toan-bo_2026-09-15.xlsx',
  );
  expect(errors).toEqual([]);
});

test('the export line stays while a new period waits for Lọc, and goes once it is applied', async ({
  page,
}) => {
  const { kinds, filter, pending } = await openReports(page);
  const exported = page.getByRole('status').filter({ hasText: 'Đã xuất báo cáo' });

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất Excel' }).click();
  await download;
  await expect(exported).toBeVisible();

  await kinds.getByRole('radio', { name: 'Năm' }).click();
  await expect(pending).toBeVisible();
  await expect(exported).toBeVisible();

  await filter.click();
  await expect(pending).toHaveCount(0);
  await expect(exported).toHaveCount(0);
});

test('the export line stays when Lọc applies the same period and scope again', async ({ page }) => {
  const { kinds, filter, pending, viewing } = await openReports(page);
  const exported = page.getByRole('status').filter({ hasText: 'Đã xuất báo cáo' });

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất Excel' }).click();
  await download;
  await expect(exported).toBeVisible();

  // Year, then back to the month: the same period as the one exported, though made anew.
  await kinds.getByRole('radio', { name: 'Năm' }).click();
  await kinds.getByRole('radio', { name: 'Tháng' }).click();
  await expect(pending).toHaveCount(0);
  await filter.click();
  await expect(viewing).toContainText('Tháng 09/2026');
  await expect(exported).toBeVisible();
});
