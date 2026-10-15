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

/** Books an appointment on `date` for the customer named `name`, or the first N3 one. */
async function book(page: Page, date: string, name?: string) {
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: /^Khách hàng/ }).fill(name ?? 'K-');
  await dialog
    .getByRole('list', { name: 'KH khớp' })
    .getByRole('button')
    .filter({ hasText: name ?? /N3$/ })
    .first()
    .click();
  const booked = (await dialog.locator('b').first().textContent()) ?? '';
  await dialog.getByRole('textbox', { name: /^Ngày/ }).fill(date);
  await dialog.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(detail(page).getByRole('heading', { level: 2 })).toContainText(booked);
  return booked;
}

/** Records the open appointment as met, with `stage` as its stage after. */
async function recordMet(page: Page, stage: string) {
  await detail(page).getByRole('button', { name: 'Ghi kết quả' }).click();
  const dialog = page.getByRole('dialog', { name: 'Kết quả cuộc gặp' });
  await dialog
    .getByRole('radiogroup', { name: 'Nhóm sau cuộc gặp' })
    .getByRole('radio', { name: stage, exact: true })
    .check();
  await dialog.getByRole('textbox', { name: /^Việc tiếp theo/ }).fill('Gửi bảng minh họa');
  await dialog.getByRole('button', { name: 'Lưu kết quả' }).click();
  await expect(dialog).toHaveCount(0);
}

/**
 * Books an appointment on 15/09 for the first N3 customer, then deletes it; returns the customer's
 * name and the link to its profile.
 */
async function bookAndDelete(page: Page) {
  await page.goto('/#/appointments');
  const name = await book(page, '15/9');
  const profile =
    (await detail(page).getByRole('link', { name: 'Hồ sơ KH →' }).getAttribute('href')) ?? '';
  await detail(page).getByRole('button', { name: 'Xóa', exact: true }).click();
  const confirm = page.getByRole('dialog', { name: 'Xóa lịch hẹn 15/09/2026?' });
  // TR-10: the delete dialog points at where the appointment comes back from (11f).
  await expect(confirm).toContainText('Xóa mềm, khôi phục được ở Cài đặt → Thùng rác.');
  await confirm.getByRole('button', { name: 'Xóa lịch hẹn' }).click();
  await expect(confirm).toHaveCount(0);
  return { name, profile };
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
  const { name } = await bookAndDelete(page);
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

test('restores a deleted customer, then its appointment deleted on its own (TR-1, TR-4, TR-8; 11b, 11e)', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  const { name, profile } = await bookAndDelete(page);

  // The profile without the deleted appointment, then the customer deleted from it (5f).
  await page.goto(`/${profile}`);
  await expect(page.getByRole('region', { name })).toBeVisible();
  // "7 lịch · 3 đã gặp" above the appointments of the profile → 7.
  const total = async () =>
    Number((await page.getByText(/^\d+ lịch · \d+ đã gặp/).textContent())?.match(/^\d+/)?.[0]);
  const before = await total();
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  await page
    .getByRole('dialog', { name: `Sửa hồ sơ · ${name}` })
    .getByRole('button', { name: 'Xóa KH…' })
    .click();
  await page
    .getByRole('dialog', { name: `Xóa ${name}?` })
    .getByRole('button', { name: 'Xóa KH' })
    .click();
  await expect(page).toHaveURL(/#\/customers$/);

  await openTrash(page);
  const rows = table(page).getByRole('row');
  const ofKind = (kind: string) =>
    rows.filter({ has: page.getByRole('cell', { name: kind, exact: true }) });
  const restoreButton = (kind: string) => ofKind(kind).getByRole('button', { name: 'Khôi phục…' });
  await expect(rows).toHaveCount(3);
  // TR-1: the appointment waits for its customer, named on the row.
  await expect(ofKind('Lịch hẹn')).toContainText(`Khôi phục KH ${name} trước.`);
  await expect(restoreButton('Lịch hẹn')).toBeDisabled();

  // 11b: the dialog says what comes back; Hủy changes nothing.
  await restoreButton('KH').click();
  let dialog = page.getByRole('dialog', { name: `Khôi phục ${name}?` });
  await expect(dialog).toContainText(/KH · xóa lúc \d\d\/\d\d\/\d{4} \d\d:\d\d/);
  await expect(dialog).toContainText(`Hiện lại cùng KH${before} lịch hẹn (`);
  await expect(dialog).toContainText(
    'Lịch hẹn / HĐ đã xóa riêng trước đó vẫn ở Thùng rác (1 lịch hẹn), khôi phục riêng sau.',
  );
  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toBeHidden();
  await expect(rows).toHaveCount(3);
  await expect(trash(page).getByRole('status')).toHaveCount(0);

  await restoreButton('KH').click();
  await dialog.getByRole('button', { name: 'Khôi phục', exact: true }).click();
  await expect(dialog).toBeHidden();
  const notice = trash(page).getByRole('status');
  await expect(notice).toContainText(`Đã khôi phục KH ${name}`);
  await expect(notice.getByRole('link', { name: 'Mở hồ sơ' })).toHaveAttribute('href', profile);
  await expect(rows).toHaveCount(2);

  // E11: the planned appointment can come back now, the stage untouched.
  await expect(restoreButton('Lịch hẹn')).toBeEnabled();
  await restoreButton('Lịch hẹn').click();
  dialog = page.getByRole('dialog', { name: 'Khôi phục lịch hẹn 15/09/2026?' });
  await expect(dialog).toContainText(`KH ${name}`);
  await expect(dialog).toContainText('Trạng tháiDự kiến');
  await expect(dialog).toContainText('Không đổi nhóm KH');
  await dialog.getByRole('button', { name: 'Khôi phục', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(notice).toContainText('Đã khôi phục lịch hẹn 15/09/2026');
  await expect(notice).toContainText(`KH ${name}`);
  await expect(trash(page)).toContainText('Thùng rác trống');

  // 11e: "Mở hồ sơ" leads to the profile, with every appointment back.
  await notice.getByRole('link', { name: 'Mở hồ sơ' }).click();
  await expect(page).toHaveURL(new RegExp(`${profile.replace(/[/#]/g, '\\$&')}$`));
  await expect(page.getByRole('region', { name })).toBeVisible();
  await expect.poll(total).toBe(before + 1);
  expect(errors).toEqual([]);
});

test('restores a meeting that kept the stage though the stage changed after it (E18, DR6-01)', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  await page.goto('/#/appointments');
  // Met on 14/09 keeping N3, then moved to N2 by the meeting of 15/09.
  const name = await book(page, '14/9');
  await recordMet(page, 'N3 giữ nguyên');
  await book(page, '15/9', name);
  await recordMet(page, 'N2');

  // Yesterday's day alone lists the meeting of 14/09 (T-150).
  const yesterday = async () => {
    await page
      .getByRole('radiogroup', { name: 'Loại kỳ' })
      .getByRole('radio', { name: 'Ngày' })
      .click();
    await page.getByRole('button', { name: 'Kỳ trước' }).click();
  };
  const kept = page
    .getByRole('table', { name: 'Danh sách lịch hẹn' })
    .locator('tbody tr')
    .filter({ hasText: name });
  await yesterday();
  await kept.getByRole('button', { name }).click();
  await expect(detail(page).getByRole('heading', { level: 2 })).toHaveText(`14/09/2026 · ${name}`);
  const profile =
    (await detail(page).getByRole('link', { name: 'Hồ sơ KH →' }).getAttribute('href')) ?? '';
  // A met appointment is deleted from its edit dialog (6f → 6g); keeping the stage, it moves none.
  await detail(page).getByRole('button', { name: 'Sửa kết quả' }).click();
  await page
    .getByRole('dialog', { name: 'Sửa kết quả cuộc gặp' })
    .getByRole('button', { name: 'Xóa lịch hẹn' })
    .click();
  const confirm = page.getByRole('dialog', { name: 'Xóa lịch hẹn 14/09/2026?' });
  await expect(confirm).toContainText('Cuộc hẹn này không đổi nhóm KH');
  await confirm.getByRole('button', { name: 'Xóa lịch hẹn' }).click();
  await expect(confirm).toHaveCount(0);
  await expect(kept).toHaveCount(0);

  await openTrash(page);
  const row = table(page).getByRole('row').nth(1);
  await expect(row).toContainText('14/09/2026');
  await expect(row).toContainText('Đã gặp');
  await row.getByRole('button', { name: 'Khôi phục…' }).click();
  const dialog = page.getByRole('dialog', { name: 'Khôi phục lịch hẹn 14/09/2026?' });
  await expect(dialog).toContainText('Kết quảĐã gặp · nhóm sau');
  await expect(dialog).toContainText('Không đổi nhóm KH');
  await dialog.getByRole('button', { name: 'Khôi phục', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(trash(page).getByRole('status')).toContainText('Đã khôi phục lịch hẹn 14/09/2026');
  await expect(trash(page)).toContainText('Thùng rác trống');

  // Back as it was: met on 14/09, the customer still in N2.
  await sidebar(page).getByRole('link', { name: 'Lịch hẹn' }).click();
  await yesterday();
  await expect(kept).toHaveCount(1);
  await expect(kept).toContainText('Đã gặp');
  await page.goto(`/${profile}`);
  await expect(
    page.getByRole('region', { name }).getByText('N2', { exact: true }).first(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
