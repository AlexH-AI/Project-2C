import { expect, test, type Page } from '@playwright/test';
import { trackConsoleErrors } from './support';

// The e2e build pins today to Tuesday 15/09/2026 (playwright.config.ts): September is in progress.
async function openOverview(page: Page) {
  await page.goto('/#/overview');
  return {
    kinds: page.getByRole('radiogroup', { name: 'Loại kỳ' }),
    filter: page.getByRole('button', { name: 'Lọc', exact: true }),
    pending: page.getByText('Đã đổi kỳ / góc nhìn — bấm Lọc để cập nhật'),
    viewing: page.locator('p', { hasText: 'Đang xem:' }),
    kpis: page.getByRole('region', { name: 'Chỉ số của kỳ' }),
    scope: page.getByRole('radiogroup', { name: 'Góc nhìn' }),
  };
}

test('opens on the current month to date with the appointments tile and six KPI', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  const { kinds, viewing, kpis, pending } = await openOverview(page);

  await expect(kinds.getByRole('radio', { checked: true })).toHaveText('Tháng');
  await expect(viewing).toHaveText('Đang xem: Tháng 09/2026MTD 01/09 – 15/09/2026 · Toàn bộ');
  await expect(pending).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Lịch hẹn · cả tháng' })).toContainText(
    'đã gặp / tổng lịch',
  );
  await expect(kpis.getByRole('region')).toHaveCount(6);
  await expect(kpis.getByRole('region', { name: 'Chuyển RF' })).toContainText(
    'so với 01/08 – 15/08',
  );
  await expect(kpis.getByRole('region', { name: 'Tỉ lệ chốt' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('a new period waits for Lọc, then "Đang xem" changes', async ({ page }) => {
  const { kinds, filter, pending, viewing } = await openOverview(page);

  await kinds.getByRole('radio', { name: 'Năm' }).click();
  await expect(pending).toBeVisible();
  await expect(viewing).toContainText('Tháng 09/2026');
  await expect(page.getByRole('region', { name: 'Lịch hẹn · cả tháng' })).toBeVisible();

  await filter.click();
  await expect(pending).toHaveCount(0);
  await expect(viewing).toHaveText('Đang xem: Năm 2026 01/01 – 15/09/2026 · Toàn bộ');
  await expect(page.getByRole('region', { name: 'Lịch hẹn · cả năm' })).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Chỉ số của kỳ' }).getByRole('region', { name: 'Chuyển RF' }),
  ).toContainText('so với 01/01 – 15/09/2025');
});

test('choosing the shown period again leaves nothing to apply', async ({ page }) => {
  const { kinds, pending } = await openOverview(page);

  await kinds.getByRole('radio', { name: 'Tuần' }).click();
  await expect(pending).toBeVisible();
  await kinds.getByRole('radio', { name: 'Tháng' }).click();
  await expect(pending).toHaveCount(0);
});

test('the Team scope has no team to pick and counts every team', async ({ page }) => {
  const { scope, filter, pending, viewing } = await openOverview(page);

  await scope.getByRole('radio', { name: 'Team' }).click();
  await expect(page.getByRole('combobox', { name: 'Team của góc nhìn' })).toHaveCount(0);
  await expect(pending).toBeVisible();

  await filter.click();
  await expect(viewing).toContainText('· Team (3 team)');

  await scope.getByRole('radio', { name: 'RE' }).click();
  await expect(page.getByRole('combobox', { name: 'RE của góc nhìn' })).toBeVisible();
  await filter.click();
  await expect(viewing).toContainText('· RE ');
});

test('a period without appointments shows "0 / 0" and "chưa có lịch" in the bar', async ({
  page,
}) => {
  const { kinds, filter } = await openOverview(page);

  await kinds.getByRole('radio', { name: 'Tùy chọn' }).click();
  const picker = page.getByRole('group', { name: 'Kỳ thống kê' });
  await picker.getByRole('textbox', { name: 'Từ ngày' }).fill('01/01/2000');
  const end = picker.getByRole('textbox', { name: 'Đến ngày' });
  await end.fill('10/01/2000');
  await end.press('Enter');
  await filter.click();

  const tile = page.getByRole('region', { name: 'Lịch hẹn · cả khoảng' });
  await expect(tile).toContainText('0 / 0');
  await expect(tile).toContainText('chưa có lịch');
});
