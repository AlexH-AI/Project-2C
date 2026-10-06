import { expect, test, type Locator, type Page } from '@playwright/test';

import { ANCHOR_MORNING } from './anchor';

// The clock stays on the pinned day so the app's today cannot move during a test.
const TODAY = ANCHOR_MORNING;

async function openPicker(page: Page) {
  await page.clock.setFixedTime(TODAY);
  await page.goto('/#/overview');
  const picker = page.getByRole('group', { name: 'Kỳ thống kê' });
  return {
    kinds: picker.getByRole('radiogroup', { name: 'Loại kỳ' }),
    label: picker.getByRole('status'),
    previous: picker.getByRole('button', { name: 'Kỳ trước' }),
    next: picker.getByRole('button', { name: 'Kỳ sau' }),
    picker,
  };
}

test('opens on the current month', async ({ page }) => {
  const { kinds, label } = await openPicker(page);

  await expect(kinds.getByRole('radio', { checked: true })).toHaveText('Tháng');
  await expect(label).toHaveText('Tháng 09/2026');
  await expect(label).toHaveCSS('font-variant-numeric', 'tabular-nums');
});

// Tổng quan takes today from the app (T-109): the e2e build pins it to Tuesday 15/09/2026.
test('switching kind and stepping ‹ › updates the label', async ({ page }) => {
  const { kinds, label, previous, next } = await openPicker(page);

  await kinds.getByRole('radio', { name: 'Tuần' }).click();
  await expect(label).toHaveText('14/09 – 20/09/2026');
  await next.click();
  await expect(label).toHaveText('21/09 – 27/09/2026');

  await kinds.getByRole('radio', { name: 'Ngày' }).click();
  await expect(label).toHaveText('21/09/2026');
  await previous.click();
  await expect(label).toHaveText('20/09/2026');

  await kinds.getByRole('radio', { name: 'Tháng' }).click();
  await expect(label).toHaveText('Tháng 09/2026');
  await next.click();
  await next.click();
  await expect(label).toHaveText('Tháng 11/2026');

  await kinds.getByRole('radio', { name: 'Năm' }).click();
  await expect(label).toHaveText('Năm 2026');
  await next.click();
  await expect(label).toHaveText('Năm 2027');
});

test('custom range edits start and end and refuses a start after the end', async ({ page }) => {
  const { kinds, label, picker, next } = await openPicker(page);

  await kinds.getByRole('radio', { name: 'Tùy chọn' }).click();
  const start = picker.getByRole('textbox', { name: 'Từ ngày' });
  const end = picker.getByRole('textbox', { name: 'Đến ngày' });
  await expect(start).toHaveValue('01/09/2026');
  await expect(end).toHaveValue('30/09/2026');

  await end.fill('10/09/2026');
  await end.press('Enter');
  await expect(label).toHaveText('01/09 – 10/09/2026');
  await next.click();
  await expect(label).toHaveText('11/09 – 20/09/2026');
  await expect(start).toHaveValue('11/09/2026');

  await start.fill('25/09/2026');
  await start.blur();
  await expect(start).toHaveAttribute('aria-invalid', 'true');
  await expect(label).toHaveText('11/09 – 20/09/2026');

  await start.fill('31/02/2026');
  await start.press('Enter');
  await expect(start).toHaveAttribute('aria-invalid', 'true');
  await expect(label).toHaveText('11/09 – 20/09/2026');
});

// Spec Phase 4 §3.1: a custom range runs at most 3 calendar months.
async function expectCapRefused(picker: Locator, label: Locator, shown: string) {
  const start = picker.getByRole('textbox', { name: 'Từ ngày' });
  const end = picker.getByRole('textbox', { name: 'Đến ngày' });
  const tooLong = picker.getByText('Kỳ Tùy chọn tối đa 3 tháng');

  await start.fill('01/01/2026');
  await end.fill('01/04/2026');
  await end.press('Enter');
  await expect(end).toHaveAttribute('aria-invalid', 'true');
  await expect(end).toHaveAccessibleDescription('Kỳ Tùy chọn tối đa 3 tháng');
  await expect(tooLong).toBeVisible();
  await expect(label).toHaveText(shown);

  await end.fill('31/03/2026');
  await end.press('Enter');
  await expect(label).toHaveText('01/01 – 31/03/2026');
  await expect(end).toHaveAttribute('aria-invalid', 'false');
  await expect(tooLong).toHaveCount(0);
}

test('a custom range longer than 3 months is refused with a note', async ({ page }) => {
  const { kinds, label, picker, next } = await openPicker(page);

  await kinds.getByRole('radio', { name: 'Tùy chọn' }).click();
  await expectCapRefused(picker, label, '01/09 – 30/09/2026');

  // A year turned into a custom range keeps its first 3 months.
  await kinds.getByRole('radio', { name: 'Năm' }).click();
  await next.click();
  await expect(label).toHaveText('Năm 2027');
  await kinds.getByRole('radio', { name: 'Tùy chọn' }).click();
  await expect(label).toHaveText('01/01 – 31/03/2027');
});

test('the appointments screen refuses a custom range longer than 3 months too', async ({
  page,
}) => {
  await page.clock.setFixedTime(TODAY);
  await page.goto('/#/appointments');
  const picker = page.getByRole('group', { name: 'Kỳ thống kê' });

  await picker
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Tùy chọn' })
    .click();
  await expectCapRefused(picker, picker.getByRole('status'), '01/09 – 30/09/2026');
});

test('disables ‹ at year 1900 and › at year 2100 without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', (error) => errors.push(error.message));
  const { kinds, label, picker, previous, next } = await openPicker(page);

  await kinds.getByRole('radio', { name: 'Tùy chọn' }).click();
  const start = picker.getByRole('textbox', { name: 'Từ ngày' });
  const end = picker.getByRole('textbox', { name: 'Đến ngày' });
  await start.fill('01/01/1900');
  await end.fill('10/01/1900');
  await end.press('Enter');
  await expect(label).toHaveText('01/01 – 10/01/1900');
  await expect(previous).toBeDisabled();

  await kinds.getByRole('radio', { name: 'Năm' }).click();
  await expect(label).toHaveText('Năm 1900');
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  await next.click();
  await expect(label).toHaveText('Năm 1901');
  await expect(previous).toBeEnabled();

  await kinds.getByRole('radio', { name: 'Tùy chọn' }).click();
  await start.fill('27/12/2100');
  await end.fill('31/12/2100');
  await end.press('Enter');
  await kinds.getByRole('radio', { name: 'Tuần' }).click();
  await expect(label).toHaveText('27/12 – 31/12/2100');
  await expect(next).toBeDisabled();
  await expect(previous).toBeEnabled();

  expect(errors).toEqual([]);
});

test('the appointments calendar shows December 2100 with blank cells after it', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', (error) => errors.push(error.message));
  await page.clock.setFixedTime(TODAY);
  await page.goto('/#/appointments');
  const picker = page.getByRole('group', { name: 'Kỳ thống kê' });
  const kinds = picker.getByRole('radiogroup', { name: 'Loại kỳ' });

  await kinds.getByRole('radio', { name: 'Tùy chọn' }).click();
  await picker.getByRole('textbox', { name: 'Từ ngày' }).fill('01/12/2100');
  const end = picker.getByRole('textbox', { name: 'Đến ngày' });
  await end.fill('31/12/2100');
  await end.press('Enter');
  await kinds.getByRole('radio', { name: 'Tháng' }).click();

  await expect(picker.getByRole('status')).toHaveText('Tháng 12/2100');
  await expect(page.getByRole('heading', { name: 'Lịch tháng 12/2100' })).toBeVisible();
  await expect(picker.getByRole('button', { name: 'Kỳ sau' })).toBeDisabled();
  expect(errors).toEqual([]);
});

test('"Hôm nay" goes back to the period containing today and stays enabled at year 1900', async ({
  page,
}) => {
  const { kinds, label, picker, previous, next } = await openPicker(page);
  const todayButton = picker.getByRole('button', { name: 'Hôm nay' });

  await next.click();
  await next.click();
  await expect(label).toHaveText('Tháng 11/2026');
  await todayButton.click();
  await expect(label).toHaveText('Tháng 09/2026');

  await kinds.getByRole('radio', { name: 'Tuần' }).click();
  await next.click();
  await todayButton.click();
  await expect(label).toHaveText('14/09 – 20/09/2026');

  await kinds.getByRole('radio', { name: 'Tùy chọn' }).click();
  await picker.getByRole('textbox', { name: 'Từ ngày' }).fill('01/01/1900');
  const end = picker.getByRole('textbox', { name: 'Đến ngày' });
  await end.fill('10/01/1900');
  await end.press('Enter');
  await kinds.getByRole('radio', { name: 'Năm' }).click();
  await expect(label).toHaveText('Năm 1900');
  await expect(previous).toBeDisabled();
  await expect(todayButton).toBeEnabled();
  await todayButton.click();
  await expect(label).toHaveText('Năm 2026');
});

test('the appointments screen has the "Hôm nay" button too', async ({ page }) => {
  await page.clock.setFixedTime(TODAY);
  await page.goto('/#/appointments');
  const picker = page.getByRole('group', { name: 'Kỳ thống kê' });

  await picker.getByRole('button', { name: 'Kỳ sau' }).click();
  await expect(picker.getByRole('status')).toHaveText('Tháng 10/2026');
  await picker.getByRole('button', { name: 'Hôm nay' }).click();
  await expect(picker.getByRole('status')).toHaveText('Tháng 09/2026');
});

// T-126: the app's day follows the clock past midnight. The e2e build pins the day the app opens
// on (15/09/2026, playwright.config.ts); the clock moves it on from there.
const LAST_MINUTE = new Date(2026, 8, 15, 23, 59);
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

test('after midnight "Hôm nay" goes to the new month; the numbers wait for Lọc', async ({
  page,
}) => {
  await page.clock.install({ time: LAST_MINUTE });
  await page.goto('/#/overview');
  const picker = page.getByRole('group', { name: 'Kỳ thống kê' });
  const label = picker.getByRole('status');
  const viewing = page.locator('p', { hasText: 'Đang xem:' });
  await expect(label).toHaveText('Tháng 09/2026');

  // 15 days and 2 minutes on, the app left open: its day is 01/10/2026.
  await page.clock.fastForward(15 * DAY + 2 * MINUTE);
  await expect(label).toHaveText('Tháng 09/2026');
  await picker.getByRole('button', { name: 'Hôm nay' }).click();
  await expect(label).toHaveText('Tháng 10/2026');
  await expect(page.getByText('Đã đổi kỳ / góc nhìn — bấm Lọc để cập nhật')).toBeVisible();
  await expect(viewing).toContainText('Tháng 09/2026');

  await page.getByRole('button', { name: 'Lọc', exact: true }).click();
  await expect(viewing).toHaveText('Đang xem: Tháng 10/2026MTD 01/10/2026 · Toàn bộ');
});

test('after midnight the appointments expected the day before read unrecorded, on the same screen', async ({
  page,
}) => {
  await page.clock.install({ time: LAST_MINUTE });
  await page.goto('/#/appointments');
  const picker = page.getByRole('group', { name: 'Kỳ thống kê' });
  await picker
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Ngày' })
    .click();
  await expect(picker.getByRole('status')).toHaveText('15/09/2026');
  const status = page
    .getByRole('table', { name: 'Danh sách lịch hẹn' })
    .locator('tbody tr td:nth-child(7)');
  const expected = status.filter({ hasText: 'Dự kiến' });
  const unrecorded = status.filter({ hasText: 'Chưa ghi kết quả' });
  await expect(expected.first()).toBeVisible();
  const count = await expected.count();
  await expect(unrecorded).toHaveCount(0);

  await page.clock.fastForward(2 * MINUTE);
  await expect(expected).toHaveCount(0);
  await expect(unrecorded).toHaveCount(count);
});
