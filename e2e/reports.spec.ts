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

  await expect(tables.getByRole('radio')).toHaveText(['Theo team', 'Theo RE']);
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

test('Team Bình Minh has no Theo team, and Theo RE lists its 10 RE', async ({ page }) => {
  const { scope, filter, viewing, summary, tables } = await openReports(page);

  await scope.getByRole('radio', { name: 'Team' }).click();
  await page
    .getByRole('combobox', { name: 'Team của góc nhìn' })
    .selectOption({ label: 'Bình Minh' });
  await filter.click();

  await expect(viewing).toContainText('· Team Bình Minh');
  await expect(summary.getByRole('rowheader')).toHaveText(['Team Bình Minh']);
  await expect(tables.getByRole('radio')).toHaveText(['Theo RE']);
  const byRe = page.getByRole('table', { name: 'Theo RE' });
  await expect(byRe.getByRole('rowheader')).toHaveCount(11);
  await expect(byRe.getByRole('row').filter({ hasText: 'Bình Minh' })).toHaveCount(10);
});

test('the RE scope shows Tổng hợp only', async ({ page }) => {
  const { scope, filter, viewing, summary, tables } = await openReports(page);

  await scope.getByRole('radio', { name: 'RE' }).click();
  await filter.click();

  await expect(viewing).toContainText('· RE ');
  await expect(summary).toBeVisible();
  await expect(tables).toHaveCount(0);
  await expect(page.getByRole('table')).toHaveCount(1);
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
