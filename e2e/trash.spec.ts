import { expect, test, type Page } from '@playwright/test';
import { trackConsoleErrors } from './support';

// Cài đặt → Thùng rác (spec Phase 6 §4.2; mockup trash.html 11a, 11e). The seed deletes nothing,
// and the e2e build pins today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).

const sidebar = (page: Page) => page.getByRole('navigation', { name: 'Điều hướng chính' });
const settingsNav = (page: Page) => page.getByRole('navigation', { name: 'Mục cài đặt' });
const trash = (page: Page) => page.getByRole('region', { name: 'Thùng rác' });
const kinds = (page: Page) => page.getByRole('radiogroup', { name: 'Loại bản ghi' });
const table = (page: Page) => page.getByRole('table', { name: 'Bản ghi đã xóa' });
const detail = (page: Page) => page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });

async function openTrash(page: Page) {
  await sidebar(page).getByRole('link', { name: 'Cài đặt' }).click();
  await settingsNav(page).getByRole('button', { name: 'Thùng rác' }).click();
  await expect(trash(page)).toBeVisible();
}

/** Books an appointment on 15/09 for the first N3 customer, then deletes it; returns the name. */
async function bookAndDelete(page: Page) {
  await page.goto('/#/appointments');
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: /^Khách hàng/ }).fill('K-');
  await dialog
    .getByRole('list', { name: 'KH khớp' })
    .getByRole('button')
    .filter({ hasText: /N3$/ })
    .first()
    .click();
  const name = (await dialog.locator('b').first().textContent()) ?? '';
  await dialog.getByRole('textbox', { name: /^Ngày/ }).fill('15/9');
  await dialog.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(dialog).toHaveCount(0);

  await detail(page).getByRole('button', { name: 'Xóa', exact: true }).click();
  const confirm = page.getByRole('dialog', { name: 'Xóa lịch hẹn 15/09/2026?' });
  await confirm.getByRole('button', { name: 'Xóa lịch hẹn' }).click();
  await expect(confirm).toHaveCount(0);
  return name;
}

test('Thùng rác comes after Dữ liệu and AI, at #/settings/trash, empty at first (11e)', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  await page.goto('/#/settings/trash');

  await expect(settingsNav(page).getByRole('button')).toHaveText(['Dữ liệu', 'AI', 'Thùng rác']);
  await expect(settingsNav(page).getByRole('button', { name: 'Thùng rác' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(trash(page).getByRole('heading', { name: 'Thùng rác' })).toBeVisible();
  await expect(trash(page)).toContainText('0 bản ghi');
  await expect(trash(page)).toContainText('không tự dọn, không xóa vĩnh viễn');
  await expect(trash(page)).toContainText('Thùng rác trống');
  await expect(trash(page)).toContainText(
    'KH, lịch hẹn, HĐ, nhân sự và team đã xóa nằm ở đây và khôi phục được.',
  );
  await expect(table(page)).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('a deleted appointment shows in Thùng rác, whatever the scope (TR-7)', async ({ page }) => {
  const name = await bookAndDelete(page);
  await openTrash(page);

  await expect(trash(page)).toContainText('1 bản ghi');
  await expect(kinds(page).getByRole('radio')).toHaveText([
    'Tất cả 1',
    'KH 0',
    'Lịch hẹn 1',
    'HĐ 0',
    'Nhân sự 0',
    'Team 0',
  ]);
  const rows = table(page).getByRole('row');
  await expect(rows).toHaveCount(2);
  const row = rows.nth(1);
  await expect(row.getByRole('cell').nth(0)).toHaveText('Lịch hẹn');
  await expect(row.getByRole('cell').nth(1)).toContainText('15/09/2026');
  await expect(row.getByRole('cell').nth(1)).toContainText('Dự kiến');
  await expect(row.getByRole('cell').nth(2)).toContainText(`KH ${name}`);
  await expect(row.getByRole('cell').nth(3)).toHaveText(/^\d\d\/\d\d\/\d{4} \d\d:\d\d$/);
  const re = /RE (.+)$/.exec((await row.getByRole('cell').nth(2).textContent()) ?? '')?.[1] ?? '';
  expect(re).not.toBe('');

  // The appointment's customer by name finds it; another kind or name does not.
  const search = trash(page).getByRole('searchbox', { name: 'Tìm theo tên' });
  await search.fill(name.slice(0, 6));
  await expect(rows).toHaveCount(2);
  await kinds(page).getByRole('radio', { name: 'KH 0' }).click();
  await expect(trash(page)).toContainText('Không có bản ghi đã xóa nào khớp.');
  await kinds(page).getByRole('radio', { name: 'Tất cả 1' }).click();
  await search.fill('không có ai tên này');
  await expect(table(page)).toHaveCount(0);
  await search.fill('');
  await expect(rows).toHaveCount(2);

  // Another RE in the scope of the top bar: the trash still lists the appointment.
  await sidebar(page).getByRole('link', { name: 'Lịch hẹn' }).click();
  await page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'RE' })
    .click();
  const picker = page.getByRole('combobox', { name: 'RE của góc nhìn' });
  const others = (await picker.locator('option').allTextContents()).filter(
    (label) => label.split(' · ')[0] !== re,
  );
  await picker.selectOption({ label: others[0]! });
  await openTrash(page);
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(1)).toContainText(`KH ${name}`);
});
