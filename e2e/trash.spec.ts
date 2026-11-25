import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from './fixtures';
import {
  asExe,
  createKycCustomer,
  holdClock,
  pressButton,
  scopeMenu,
  scopePill,
  teamRow,
  trackConsoleErrors,
} from './support';

// Cài đặt → Thùng rác (spec Phase 6 §4.2; mockup trash.html 11a, 11e). The seed deletes nothing,
// and the e2e build pins today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).

const sidebar = (page: Page) => page.getByRole('navigation', { name: 'Điều hướng chính' });
const settingsNav = (page: Page) => page.getByRole('navigation', { name: 'Mục cài đặt' });
const trash = (page: Page) => page.getByRole('region', { name: 'Thùng rác' });
const kinds = (page: Page) => page.getByRole('radiogroup', { name: 'Loại bản ghi' });
const table = (page: Page) => page.getByRole('table', { name: 'Bản ghi đã xóa' });
const detail = (page: Page) => page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });
const purgeButton = (page: Page) =>
  trash(page).getByRole('button', { name: 'Dọn sạch Thùng rác…' });
const purgeDialog = (page: Page) => page.getByRole('dialog', { name: 'Dọn sạch Thùng rác?' });
const purgeWord = (page: Page) =>
  purgeDialog(page).getByRole('textbox', { name: 'Gõ DỌN SẠCH để xác nhận' });

/**
 * Types the word of 11i and purges: "Dọn sạch" in web mode, no backup (D13). Only the word itself
 * turns the button on (D1): not a part of it, another case, spaces around it or inside; what an IME
 * types, the letters decomposed, does (review R4).
 */
async function confirmPurge(page: Page) {
  const dialog = purgeDialog(page);
  const confirm = dialog.getByRole('button', { name: 'Dọn sạch', exact: true });
  const word = purgeWord(page);
  await expect(confirm).toBeDisabled();
  for (const typed of ['DỌN', 'dọn sạch', 'DỌN SẠCH ', ' DỌN SẠCH', 'DỌN  SẠCH']) {
    await word.fill(typed);
    await expect(confirm).toBeDisabled();
  }
  const decomposed = 'DỌN SẠCH'.normalize('NFD');
  expect(decomposed).not.toBe('DỌN SẠCH');
  await word.fill(decomposed);
  await expect(confirm).toBeEnabled();
  await word.fill('DỌN SẠCH');
  await confirm.click();
  await expect(dialog).toBeHidden();
}

async function openTrash(page: Page) {
  await sidebar(page).getByRole('link', { name: 'Cài đặt' }).click();
  await settingsNav(page).getByRole('button', { name: 'Thùng rác' }).click();
  await expect(trash(page)).toBeVisible();
}

/** Books an appointment on `date` (at `time`) for the customer named `name`, or the first N3 one. */
async function book(page: Page, date: string, name?: string, time?: string) {
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
  if (time) await dialog.getByRole('textbox', { name: /^Giờ/ }).fill(time);
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
 * name and the link to its profile. `afterLoad` runs once the page is up, before the booking.
 */
async function bookAndDelete(page: Page, afterLoad?: () => Promise<unknown>) {
  await page.goto('/#/appointments');
  await afterLoad?.();
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
  // Web mode has no file to back up before a purge (review of PR 707).
  await expect(trash(page)).toContainText(
    'Thùng rác không tự dọn; "Dọn sạch Thùng rác…" xóa hẳn mọi bản ghi ở đây. Xuất backup mang theo cả thùng rác.',
  );
  await expect(purgeButton(page)).toHaveCount(0);
  await expect(trash(page)).toContainText('Thùng rác trống');
  await expect(trash(page)).toContainText(
    'KH, lịch hẹn, HĐ, nhân sự và team đã xóa nằm ở đây và khôi phục được.',
  );
  // VA3c (components.html 09): empty, the table keeps its headers, over one row holding the note;
  // with nothing to filter, no filter shows.
  await expect(table(page).getByRole('columnheader')).toHaveCount(5);
  await expect(table(page).getByRole('columnheader', { name: 'Bản ghi' })).toBeVisible();
  await expect(table(page).getByRole('row')).toHaveCount(2);
  await expect(table(page).getByRole('row').nth(1)).toContainText('Thùng rác trống');
  await expect(kinds(page)).toHaveCount(0);
  await expect(trash(page).getByRole('button', { name: 'Bỏ lọc' })).toHaveCount(0);
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
  // DR6-43: "Bản ghi" holds names and dd/mm/yyyy days alike, so it does not sort; the column of
  // the buttons has a header for screen readers only.
  const record = table(page).getByRole('columnheader', { name: 'Bản ghi' });
  await expect(record).not.toHaveAttribute('aria-sort');
  await expect(record.getByRole('button')).toHaveCount(0);
  await expect(table(page).getByRole('columnheader', { name: 'Xóa lúc' })).toHaveAttribute(
    'aria-sort',
    'descending',
  );
  const actions = table(page).getByRole('columnheader', { name: 'Thao tác' });
  await expect(actions).toHaveCount(1);
  // An empty header on screen as in mockup 11a: the name is a pixel wide (R43e, DR6-91).
  expect((await actions.getByText('Thao tác').boundingBox())?.width).toBeLessThanOrEqual(1);
  const rm = /RM (.+)$/.exec((await row.getByRole('cell').nth(2).textContent()) ?? '')?.[1] ?? '';
  expect(rm).not.toBe('');
  // The restore button is named by the words of the cell, read as the screen shows them.
  const title = await row.getByRole('cell').nth(1).locator('b').innerText();
  await expect(row.getByRole('button', { name: /^Khôi phục/ })).toHaveAccessibleName(
    `Khôi phục lịch hẹn ${title} của KH ${name}`,
  );

  // The appointment's customer by name finds it; another kind or name does not.
  const search = trash(page).getByRole('searchbox', { name: 'Tìm theo tên' });
  await search.fill(name.slice(0, 6));
  await expect(rows).toHaveCount(2);
  await kinds(page).getByRole('radio', { name: 'KH 0' }).click();
  // VA3c: nothing under the filter is not an empty trash. The headers stay, the note names the
  // filter, and "Bỏ lọc" takes the kind and the name back to what the screen opens with.
  const note = rows.nth(1);
  await expect(rows).toHaveCount(2);
  await expect(table(page).getByRole('columnheader', { name: 'Bản ghi' })).toBeVisible();
  await expect(note).toContainText('Không có bản ghi đã xóa nào khớp.');
  await expect(note).toContainText(
    `Đang lọc: Loại KH · Tên có "${name.slice(0, 6)}". Bỏ bớt điều kiện để thấy các bản ghi khác.`,
  );
  await expect(trash(page)).not.toContainText('Thùng rác trống');
  await pressButton(note.getByRole('button', { name: 'Bỏ lọc' }));
  await expect(rows.nth(1).getByRole('cell').nth(0)).toHaveText('Lịch hẹn');
  await expect(kinds(page).getByRole('radio', { name: 'Tất cả 1' })).toBeChecked();
  await expect(search).toHaveValue('');
  // Its button gone, the focus is on the table it filled.
  await expect(table(page)).toBeFocused();
  await search.fill('không có ai tên này');
  await expect(note).toContainText('Đang lọc: Tên có "không có ai tên này".');
  await search.fill('');
  await expect(rows.nth(1).getByRole('cell').nth(0)).toHaveText('Lịch hẹn');

  // Another RM in the scope of the top bar: the trash still lists the appointment.
  await sidebar(page).getByRole('link', { name: 'Lịch hẹn' }).click();
  await scopePill(page).click();
  await teamRow(page, 'Bình Minh').click();
  // After "Toàn bộ" and "Cả team": the first RM of the team that is not the one of the appointment.
  await scopeMenu(page).getByRole('menuitemradio').filter({ hasNotText: rm }).nth(2).click();
  await expect(scopeMenu(page)).toBeHidden();
  await expect(scopePill(page)).not.toHaveText(rm);
  await openTrash(page);
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(1)).toContainText(`KH ${name}`);
});

// T-350 on screen (DR6-174 (b)): a planned appointment of a day past has no outcome recorded yet,
// as every screen says by today; the row, its button and the restore dialog read so too.
test('a deleted appointment of a day past still planned reads "Chưa ghi kết quả" (NT-TR-07; 11a)', async ({
  page,
}) => {
  await page.goto('/#/appointments');
  const name = await book(page, '10/9');
  await expect(detail(page)).toContainText('Chưa ghi kết quả');
  await detail(page).getByRole('button', { name: 'Xóa', exact: true }).click();
  const confirm = page.getByRole('dialog', { name: 'Xóa lịch hẹn 10/09/2026?' });
  await confirm.getByRole('button', { name: 'Xóa lịch hẹn' }).click();
  await expect(confirm).toHaveCount(0);
  await openTrash(page);

  const row = table(page).getByRole('row').nth(1);
  await expect(row.getByRole('cell').nth(1)).toContainText('10/09/2026 · Chưa ghi kết quả');
  const restore = row.getByRole('button', { name: /^Khôi phục/ });
  await expect(restore).toHaveAccessibleName(
    `Khôi phục lịch hẹn 10/09/2026 · Chưa ghi kết quả của KH ${name}`,
  );
  await restore.click();
  const dialog = page.getByRole('dialog', { name: 'Khôi phục lịch hẹn 10/09/2026?' });
  await expect(dialog).toContainText('Trạng tháiChưa ghi kết quả');
  await expect(dialog).not.toContainText('Dự kiến');
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
  // DR6-43, DR6-119: each button is named by the record it restores, its status too; a customer
  // with its stage, as its badge (Owner 25/10/2026).
  const restoreButton = (kind: string) =>
    ofKind(kind).getByRole('button', {
      name:
        kind === 'KH'
          ? new RegExp(`^Khôi phục KH ${name} · (N[1-4]|Tạm hoãn|Mất cơ hội)$`)
          : `Khôi phục lịch hẹn 15/09/2026 · Dự kiến của KH ${name}`,
      exact: true,
    });
  await expect(rows).toHaveCount(3);
  // T-305: the "Bản ghi" cell draws the customer's stage as its badge, which the button reads
  // (DR6-153).
  const badge = ofKind('KH')
    .getByRole('cell')
    .nth(1)
    .getByText(/^(N[1-4]|Tạm hoãn|Mất cơ hội)$/);
  await expect(badge).toBeVisible();
  await expect(restoreButton('KH')).toHaveAccessibleName(
    `Khôi phục KH ${name} · ${await badge.innerText()}`,
  );
  // TR-1: the appointment waits for its customer, named on the row and read with its button.
  await expect(ofKind('Lịch hẹn')).toContainText(`Khôi phục KH ${name} trước.`);
  await expect(restoreButton('Lịch hẹn')).toBeDisabled();
  await expect(restoreButton('Lịch hẹn')).toHaveAccessibleDescription(
    `Khôi phục KH ${name} trước.`,
  );

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

// DR6-83: the row and its button go with the restore, the last one with the whole table; the focus
// lands on the line saying what came back (11e), not on the page. Escape keeps the row and the focus.
test('by the keyboard, Khôi phục leaves the focus on the line of what came back (DR6-83)', async ({
  page,
}) => {
  const { name } = await bookAndDelete(page);
  await openTrash(page);
  const restore = table(page).getByRole('button', {
    name: `Khôi phục lịch hẹn 15/09/2026 · Dự kiến của KH ${name}`,
    exact: true,
  });
  const dialog = page.getByRole('dialog', { name: 'Khôi phục lịch hẹn 15/09/2026?' });
  await restore.press('Enter');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(restore).toBeFocused();

  await restore.press('Enter');
  await dialog.getByRole('button', { name: 'Khôi phục', exact: true }).press('Enter');
  await expect(dialog).toBeHidden();
  await expect(trash(page)).toContainText('Thùng rác trống');
  const notice = trash(page).getByRole('status');
  await expect(notice).toContainText('Đã khôi phục lịch hẹn 15/09/2026');
  await expect(notice).toBeFocused();
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
  // TR-3, DR6-93: the stage it recorded, and that restoring it changes none.
  await expect(row).toContainText('nhóm sau N3 · không đổi nhóm KH');
  await row
    .getByRole('button', { name: `Khôi phục lịch hẹn 14/09/2026 · Đã gặp của KH ${name}` })
    .click();
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

interface BackupRow {
  readonly id: string;
  readonly name: string;
  readonly rm_id: string;
  readonly deleted_at: string | null;
}

interface BackupAppointment {
  readonly id: string;
  readonly date: string;
  readonly time: string | null;
  readonly rescheduled_from_id: string | null;
  deleted_at: string | null;
}

type Tables = Record<string, unknown[]>;

/**
 * Exports a backup, lets `change` edit its tables, then imports it (Settings → Dữ liệu): only a file
 * brings in some records (spec Phase 3 §6).
 */
async function importChanged(page: Page, change: (tables: Tables) => void) {
  await page.goto('/#/settings');
  const backup = page.getByRole('region', { name: 'Xuất / nhập backup' });
  const download = page.waitForEvent('download');
  await backup.getByRole('button', { name: 'Xuất backup' }).click();
  const file = JSON.parse(await readFile(await (await download).path(), 'utf8')) as {
    tables: Tables;
  };
  change(file.tables);
  await backup.getByLabel('Nhập backup').setInputFiles({
    name: 'changed.p2cbackup',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(file)),
  });
  await page
    .getByRole('dialog', { name: 'Thay toàn bộ dữ liệu?' })
    .getByRole('button', { name: 'Thay dữ liệu', exact: true })
    .click();
  await expect(backup.getByRole('status')).toContainText('Đã nhập backup');
}

/** A deleted policy of `customer`, submitted on `submitted` (yyyy-mm-dd). */
const deletedPolicy = (id: string, customer: BackupRow, submitted: string, deletedAt: string) => ({
  id,
  customer_id: customer.id,
  rm_id: customer.rm_id,
  submitted_date: submitted,
  submitted_fyp: 24_000_000,
  issued_date: null,
  issued_fyp: null,
  cancelled_date: null,
  created_at: deletedAt,
  updated_at: deletedAt,
  deleted_at: deletedAt,
});

const liveCustomer = (tables: Tables) =>
  (tables.customers as BackupRow[]).find((c) => c.deleted_at === null)!;

// TR-5, DR6-43: a record dated after today waits for its day, and the trash sees the day come
// without another write. Only a file brings such a record in (spec Phase 3 §6 rule 10).
test('a deleted policy submitted tomorrow can be restored once its day comes (TR-5)', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  await page.clock.install({ time: new Date(2026, 8, 15, 23, 50) });
  let customer!: BackupRow;
  await importChanged(page, (tables) => {
    customer = liveCustomer(tables);
    const deletedAt = new Date(2026, 8, 15, 9, 0).toISOString();
    tables.policies!.push(deletedPolicy('tr5-policy', customer, '2026-09-16', deletedAt));
  });

  await settingsNav(page).getByRole('button', { name: 'Thùng rác' }).click();
  const restore = table(page).getByRole('button', {
    name: `Khôi phục HĐ Nộp 16/09/2026 · 24,000,000 VNĐ · Đã nộp của KH ${customer.name}`,
  });
  await expect(restore).toBeDisabled();
  await expect(restore).toHaveAccessibleDescription('Ngày nộp 16/09/2026 sau hôm nay.');

  // Past midnight, 16/09 is today: the policy can come back.
  await page.clock.fastForward(15 * 60_000);
  await expect(restore).toBeEnabled();
  await expect(trash(page)).not.toContainText('sau hôm nay');
  expect(errors).toEqual([]);
});

// Review of PR 748: a restore button is named by the very words of its "Bản ghi" cell, a policy's
// status badge too, so two rows that differ on screen differ by their buttons as well (DR6-119).
test('names each restore button by the words of its "Bản ghi" cell, a policy with its status', async ({
  page,
}) => {
  let customer!: BackupRow;
  await importChanged(page, (tables) => {
    customer = liveCustomer(tables);
    const deletedAt = new Date(2026, 8, 15, 9, 0).toISOString();
    tables.policies!.push(deletedPolicy('names-submitted', customer, '2026-09-10', deletedAt), {
      ...deletedPolicy('names-issued', customer, '2026-09-10', deletedAt),
      issued_date: '2026-09-12',
      issued_fyp: 24_000_000,
    });
  });

  await settingsNav(page).getByRole('button', { name: 'Thùng rác' }).click();
  const rows = table(page)
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: 'HĐ', exact: true }) });
  await expect(rows).toHaveCount(2);
  const names = new Set<string>();
  for (const row of await rows.all()) {
    const cell = row.getByRole('cell').nth(1);
    const title = await cell.locator('b').innerText();
    const status = await cell.getByText(/^Đã (nộp|phát hành)$/).innerText();
    const name = `Khôi phục HĐ ${title} · ${status} của KH ${customer.name}`;
    await expect(row.getByRole('button', { name: /^Khôi phục/ })).toHaveAccessibleName(name);
    names.add(name);
  }
  // One day, one FYP: the status tells the two apart, on screen and by name.
  expect(names.size).toBe(2);
});

test('purges the trash for good once DỌN SẠCH is typed, in web mode without a backup (TR-11; 11i, 11j, D13)', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  const { name, profile } = await bookAndDelete(page);
  // Then its customer (5f): the appointment, deleted on its own before, counts as one.
  await page.goto(`/${profile}`);
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
  await expect(purgeButton(page)).toBeEnabled();

  // Hủy changes nothing.
  await purgeButton(page).click();
  const dialog = purgeDialog(page);
  await expect(dialog).toContainText('2 bản ghi · mọi loại, không theo bộ lọc');
  await expect(dialog).toContainText('Các bản ghi sau bị xóa hẳn khỏi dữ liệu:');
  await expect(dialog).toContainText(
    /KH1 — kèm \d+ lịch hẹn · \d+ HĐ · \d+ ghi chú KYC · \d+ phân tích AI/,
  );
  await expect(dialog).toContainText('Lịch hẹn1HĐ0Nhân sự0Team0');
  await expect(dialog).toContainText('Không hoàn tác được');
  await expect(dialog).toContainText('Bản web không lưu file: dữ liệu chỉ nằm trong trình duyệt.');
  await expect(dialog).not.toContainText('Giữ lại');
  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toBeHidden();
  await expect(table(page).getByRole('row')).toHaveCount(3);

  await purgeButton(page).click();
  await confirmPurge(page);

  const notice = trash(page).getByRole('status');
  await expect(notice).toContainText('Đã dọn sạch Thùng rác');
  await expect(notice).toContainText(/Xóa hẳn 1 KH( \(kèm [^)]+\))? · 1 lịch hẹn\.$/);
  await expect(notice).not.toContainText('Backup');
  await expect(notice).toBeFocused();
  await expect(trash(page).getByText('0 bản ghi', { exact: true })).toBeVisible();
  await expect(trash(page)).toContainText('Thùng rác trống');
  await expect(purgeButton(page)).toHaveCount(0);
  expect(errors).toEqual([]);
});

// TR-12, TR-13 (D5, D12): a file brings a Dời lịch deleted while its new appointment is live, which
// the app never deletes (#171), and 999 deleted policies: 1 000 records.
test('reminds from 1 000 records, and keeps a record still pointed to, saying why (TR-12, TR-13; 11h, 11j)', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  let next!: BackupAppointment;
  await importChanged(page, (tables) => {
    const appointments = tables.appointments as BackupAppointment[];
    next = appointments.find((a) => a.rescheduled_from_id !== null && a.deleted_at === null)!;
    appointments.find((a) => a.id === next.rescheduled_from_id)!.deleted_at = new Date(
      2026,
      8,
      15,
      9,
      30,
    ).toISOString();
    const customer = liveCustomer(tables);
    const deletedAt = new Date(2026, 8, 14, 9, 0).toISOString();
    for (let i = 0; i < 999; i++) {
      tables.policies!.push(deletedPolicy(`d12-${i}`, customer, '2026-09-01', deletedAt));
    }
  });
  const [year, month, day] = next.date.split('-');
  const when = `${day}/${month}/${year}${next.time === null ? '' : ` ${next.time}`}`;
  const kept = `Giữ lại khi dọn: lịch ${when} dời từ lịch này.`;

  await settingsNav(page).getByRole('button', { name: 'Thùng rác' }).click();
  await expect(trash(page)).toContainText('1,000 bản ghi');
  const reminder =
    'Thùng rác có 1,000 bản ghi nên mở chậm dần. Nên dọn sạch khi không cần khôi phục các bản ghi này nữa.';
  await expect(trash(page)).toContainText(reminder);
  // Deleted last, the Dời lịch heads the table, its reason shown before the purge.
  const rows = table(page).getByRole('row');
  await expect(rows.nth(1)).toContainText('Dời lịch');
  await expect(rows.nth(1)).toContainText(kept);

  // TR-11, TR-13: the reminder and the purge go by every record, not by the kind or the name asked
  // for: with no row shown, the reminder stays and the button is on (DR6-128).
  await kinds(page)
    .getByRole('radio', { name: /^Lịch hẹn/ })
    .click();
  const search = trash(page).getByRole('searchbox', { name: 'Tìm theo tên' });
  await search.fill('không có ai tên này');
  await expect(trash(page)).toContainText('Không có bản ghi đã xóa nào khớp.');
  await expect(trash(page)).toContainText(reminder);
  await expect(purgeButton(page)).toBeEnabled();

  await purgeButton(page).click();
  const dialog = purgeDialog(page);
  await expect(dialog).toContainText('1,000 bản ghi · mọi loại, không theo bộ lọc');
  await expect(dialog).toContainText('KH0Lịch hẹn0HĐ999Nhân sự0Team0');
  await expect(dialog).toContainText(
    'Giữ lại 1 bản ghi còn được dùngLý do ghi ở dòng của nó trong Thùng rác.',
  );
  await confirmPurge(page);

  const notice = trash(page).getByRole('status');
  await expect(notice).toContainText('Xóa hẳn 999 HĐ. Giữ lại 1 bản ghi còn được dùng.');
  // The button stays, off, as every record left is kept: the notice has the focus all the same.
  await expect(notice).toBeFocused();
  await expect(purgeButton(page)).toBeDisabled();
  await expect(trash(page).getByText('1 bản ghi', { exact: true })).toBeVisible();
  await expect(trash(page)).not.toContainText('mở chậm dần');
  // The 999 policies went though the kind and the name shown matched none of them.
  await search.fill('');
  await kinds(page)
    .getByRole('radio', { name: /^Tất cả/ })
    .click();
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(1)).toContainText(kept);
  expect(errors).toEqual([]);
});

// DR6-151 (Q3 (a), Owner 31/10/2026): two customers of one name and stage in the trash name their
// code on their buttons, as mockup 9b names two of one name.
test('two customers of one name and one stage have restore buttons named with their codes', async ({
  page,
}) => {
  const name = 'Lâm Thị Trùng';
  for (let round = 0; round < 2; round += 1) {
    await createKycCustomer(page, name);
    await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
    await page.getByRole('button', { name: 'Xóa KH…' }).click();
    await page.getByRole('button', { name: 'Xóa KH', exact: true }).click();
    await expect(page).toHaveURL(/#\/customers$/);
  }

  await openTrash(page);
  const buttons = table(page).getByRole('button', {
    name: new RegExp(`^Khôi phục KH ${name} \\(K-[0-9A-Z]{4}\\) · N4$`),
  });
  await expect(buttons).toHaveCount(2);
  const labels = await Promise.all(
    (await buttons.all()).map((button) => button.getAttribute('aria-label')),
  );
  expect(new Set(labels).size).toBe(2);
});

// T-380, DR6-206: two deleted teams of one name are told apart by when each was deleted on the
// screen too, not only in the restore buttons: in the line of the RM a team keeps blocked and in
// "Thuộc", of every row whatever the filter, the teams' own rows filtered out.
test('two deleted teams of one name: the line and "Thuộc" of the RM each keeps blocked say when it went (T-380)', async ({
  page,
}) => {
  await page.goto('/#/team');
  const members = page.getByRole('region', { name: 'Thành viên team Sao Khuê' });
  const confirm = (title: string) =>
    page.getByRole('dialog', { name: title }).getByRole('button', { name: 'Xóa', exact: true });
  for (const [rm, minute] of [
    ['Vũ Văn Hai', 0],
    ['Vũ Văn Ba', 5],
  ] as const) {
    await page.clock.pauseAt(new Date(2026, 8, 15, 10, minute));
    await page.getByRole('button', { name: '+ Team' }).click();
    const team = page.getByRole('dialog', { name: 'Team mới' });
    await team.getByRole('textbox', { name: 'Tên team' }).fill('Sao Khuê');
    await team.getByRole('button', { name: 'Tạo team' }).click();
    await page.getByRole('button', { name: '+ Nhân sự' }).click();
    const person = page.getByRole('dialog', { name: 'Nhân sự mới' });
    await person.getByRole('textbox', { name: 'Họ tên' }).fill(rm);
    await person.getByRole('radio', { name: 'RM', exact: true }).check();
    await person.getByRole('combobox', { name: 'Team' }).selectOption({ label: 'Sao Khuê' });
    await person.getByRole('button', { name: 'Thêm' }).click();
    await members.getByRole('button', { name: `Sửa ${rm}` }).click();
    await page
      .getByRole('dialog', { name: 'Sửa nhân sự' })
      .getByRole('button', { name: 'Xóa nhân sự' })
      .click();
    await confirm(`Xóa ${rm}?`).click();
    await members.getByRole('button', { name: 'Xóa team' }).click();
    await confirm('Xóa team Sao Khuê?').click();
    await expect(members).toHaveCount(0);
  }

  await openTrash(page);
  await kinds(page)
    .getByRole('radio', { name: /^Nhân sự/ })
    .click();
  for (const [rm, at] of [
    ['Vũ Văn Hai', '15/09/2026 10:00'],
    ['Vũ Văn Ba', '15/09/2026 10:05'],
  ] as const) {
    const row = table(page).getByRole('row').filter({ hasText: rm });
    await expect(row).toContainText(`Khôi phục team Sao Khuê (xóa lúc ${at}) trước.`);
    await expect(row).toContainText(`Team Sao Khuê (đã xóa lúc ${at})`);
  }
});

// TR-11, 11i: while the purge runs the dialog stays, so nothing writes to the data it is replacing.
// The exe's backup is held, as a slow disk would (DR6-128).
test('the dialog of a purge that runs stays: Escape does not close it, Hủy is off (TR-11; 11i)', async ({
  page,
}) => {
  await asExe(page);
  await bookAndDelete(page);
  await openTrash(page);

  await purgeButton(page).click();
  const dialog = purgeDialog(page);
  await purgeWord(page).fill('DỌN SẠCH');
  await page.evaluate(() => window.exe.holdBackup());
  await dialog.getByRole('button', { name: 'Backup rồi dọn sạch' }).click();
  // DR6-154: the focus stays in the dialog, on the button saying what runs.
  const running = dialog.getByRole('button', { name: 'Đang dọn…' });
  await expect(running).toBeDisabled();
  await expect(running).toBeFocused();
  await expect(dialog.getByRole('button', { name: 'Hủy' })).toBeDisabled();
  await expect(purgeWord(page)).toBeDisabled();

  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  // Still modal: the page behind cannot be used while it purges. A second Escape closes the dialog
  // for a moment and it opens again (DR-58), so the check waits for that.
  await expect.poll(() => dialog.evaluate((node) => node.matches(':modal'))).toBe(true);
  await expect(running).toBeFocused();
  // Clicked while it runs, it does not run again: one backup.
  await running.click({ force: true });

  await page.evaluate(() => window.exe.releaseBackup());
  await expect(dialog).toHaveCount(0);
  const events = await page.evaluate(() => window.exe.events);
  expect(events.filter((event) => event === 'backup')).toHaveLength(1);
  const notice = trash(page).getByRole('status');
  await expect(notice).toContainText('Đã dọn sạch Thùng rác');
  await expect(notice).toContainText('Backup: ');
  await expect(notice).toBeFocused();
});

// D7, 11j: the last save failed, so a backup would miss what changed since: the purge is refused, in
// the place its notice would be, and nothing changes; "Thử lại" on the save warning saves, and the
// purge then runs (T-294). The notice that D8 and D9 show is this branch of the screen with another
// title; the exe's stand-in cannot make the backup fail.
test('a purge refused because the last save failed says so and changes nothing, then runs after "Thử lại" (D7; 11j)', async ({
  page,
}) => {
  await asExe(page);
  await bookAndDelete(page, () => page.evaluate(() => (window.exe.failSaves = true)));
  await openTrash(page);
  await expect(table(page).getByRole('row')).toHaveCount(2);

  await pressButton(purgeButton(page));
  const dialog = purgeDialog(page);
  await purgeWord(page).fill('DỌN SẠCH');
  await dialog.getByRole('button', { name: 'Backup rồi dọn sạch' }).click();
  await expect(dialog).toHaveCount(0);

  // The shell's own alert says the save failed; this one is the card's.
  const refused = trash(page).getByRole('alert');
  await expect(refused).toContainText(
    'Chưa dọn: lần lưu gần nhất bị lỗi, backup sẽ thiếu các thay đổi đó. Bấm "Thử lại" ở dải cảnh báo đầu màn, lưu được rồi thì dọn lại.',
  );
  await expect(refused).toContainText('Dữ liệu không bị đổi.');
  await expect(trash(page).getByRole('status')).toHaveCount(0);
  await expect(table(page).getByRole('row')).toHaveCount(2);
  await expect(trash(page)).toContainText('1 bản ghi');
  await expect(purgeButton(page)).toBeEnabled();
  await expect(purgeButton(page)).toBeFocused();

  await page.evaluate(() => (window.exe.failSaves = false));
  const warning = page.getByRole('alert').filter({ hasText: 'Chưa lưu được dữ liệu vào file' });
  await warning.getByRole('button', { name: 'Thử lại' }).click();
  await expect(warning).toHaveCount(0);
  await purgeButton(page).click();
  await purgeWord(page).fill('DỌN SẠCH');
  await purgeDialog(page).getByRole('button', { name: 'Backup rồi dọn sạch' }).click();
  await expect(trash(page).getByRole('status')).toContainText('Đã dọn sạch Thùng rác');
  await expect(trash(page)).toContainText('Thùng rác trống');
});

// ---- Thông báo nổi và Hoàn tác (VA3b; mockup components.html 08; TR-8 and its exception) ----

/** The polite live region while it holds a toast of these words: what a screen reader reads out. */
const toast = (page: Page, text: string) =>
  page.locator('[aria-live="polite"]').filter({ hasText: text });
const undo = (page: Page) => page.getByRole('button', { name: 'Hoàn tác', exact: true });
const MOVED = 'Đã chuyển lịch hẹn vào Thùng rác';

/**
 * "Hoàn tác" of the toast `moved`, read out or not (a dialog opened and closed over it): no
 * question is asked, and a toast says what came back.
 */
async function undoFrom(page: Page, moved: string, restored: string) {
  await expect(page.getByText(moved)).toBeVisible();
  await undo(page).click();
  await expect(toast(page, restored)).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(undo(page)).toHaveCount(0);
}

test('a deleted appointment says so in a toast; Hoàn tác brings it back at once, unasked', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  // The clock held: a slow machine does not see the toast go before Hoàn tác is pressed (L210).
  const { name } = await bookAndDelete(page, () => holdClock(page));
  await expect(toast(page, MOVED)).toBeVisible();
  // It takes no focus, which goes where it went before: to the detail the appointment left.
  await expect(undo(page)).not.toBeFocused();
  await expect(detail(page)).not.toContainText(name);

  // By the keyboard: the button goes with its toast, the focus to the heading of the screen.
  await undo(page).press('Enter');
  await expect(toast(page, 'Đã khôi phục lịch hẹn 15/09/2026')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1, name: 'Lịch hẹn' })).toBeFocused();
  await expect(detail(page).getByRole('heading', { level: 2 })).toContainText(name);
  await openTrash(page);
  await expect(trash(page)).toContainText('Thùng rác trống');
  expect(errors).toEqual([]);
});

test('a toast leaves after 4,2 s, its Hoàn tác with it; from Thùng rác the restore still asks (TR-8)', async ({
  page,
}) => {
  const { name } = await bookAndDelete(page, () => holdClock(page));
  await expect(toast(page, MOVED)).toBeVisible();
  await page.clock.runFor(4_199);
  await expect(toast(page, MOVED)).toBeVisible();
  await page.clock.runFor(1);
  await expect(toast(page, MOVED)).toHaveCount(0);
  await expect(undo(page)).toHaveCount(0);

  await openTrash(page);
  await table(page)
    .getByRole('button', { name: `Khôi phục lịch hẹn 15/09/2026 · Dự kiến của KH ${name}` })
    .click();
  await expect(page.getByRole('dialog', { name: 'Khôi phục lịch hẹn 15/09/2026?' })).toBeVisible();
});

// L209: the 4,2 s of a toast wait while the keyboard is on its Hoàn tác or the pointer over it.
test('a toast stays while the focus is on its Hoàn tác or the pointer over it, then has 4,2 s again', async ({
  page,
}) => {
  await bookAndDelete(page, () => holdClock(page));
  const moved = toast(page, MOVED);
  await expect(moved).toBeVisible();
  await undo(page).focus();
  await page.clock.runFor(10_000);
  await expect(moved).toBeVisible();
  await page.getByRole('heading', { level: 1, name: 'Lịch hẹn' }).focus();
  await page.clock.runFor(4_000);
  await expect(moved).toBeVisible();
  await moved.hover();
  await page.clock.runFor(10_000);
  await expect(moved).toBeVisible();
  await page.mouse.move(0, 0);
  await page.clock.runFor(4_199);
  await expect(moved).toBeVisible();
  await page.clock.runFor(1);
  await expect(moved).toHaveCount(0);
});

test('Hoàn tác brings back a team, a person, a policy and a customer', async ({ page }) => {
  await page.goto('/#/team');
  await holdClock(page);
  await page.getByRole('button', { name: '+ Team' }).click();
  let dialog = page.getByRole('dialog', { name: 'Team mới' });
  await dialog.getByRole('textbox', { name: 'Tên team' }).fill('Thiên Hà');
  await dialog.getByRole('button', { name: 'Tạo team' }).click();
  const members = (team: string) => page.getByRole('region', { name: `Thành viên team ${team}` });
  await members('Thiên Hà').getByRole('button', { name: 'Xóa team' }).click();
  const confirm = (title: string, button = 'Xóa') =>
    page.getByRole('dialog', { name: title }).getByRole('button', { name: button, exact: true });
  await confirm('Xóa team Thiên Hà?').click();
  await expect(members('Thiên Hà')).toHaveCount(0);
  await undoFrom(page, 'Đã chuyển team vào Thùng rác', 'Đã khôi phục team Thiên Hà');
  const teams = page.getByRole('region', { name: 'Team', exact: true });
  await expect(teams.getByRole('button', { name: /^Thiên Hà / })).toBeVisible();

  await page.getByRole('button', { name: '+ Nhân sự' }).click();
  dialog = page.getByRole('dialog', { name: 'Nhân sự mới' });
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill('Trần Hải Yến');
  await dialog.getByRole('radio', { name: 'RM', exact: true }).check();
  await dialog.getByRole('combobox', { name: 'Team' }).selectOption({ label: 'Hừng Đông' });
  await dialog.getByRole('button', { name: 'Thêm' }).click();
  const person = members('Hừng Đông').getByRole('row', { name: /Trần Hải Yến/ });
  await person.getByRole('button', { name: 'Sửa Trần Hải Yến' }).click();
  await confirm('Sửa nhân sự', 'Xóa nhân sự').click();
  await confirm('Xóa Trần Hải Yến?').click();
  await expect(person).toHaveCount(0);
  await undoFrom(page, 'Đã chuyển nhân sự vào Thùng rác', 'Đã khôi phục nhân sự Trần Hải Yến');
  await expect(person).toBeVisible();

  await createKycCustomer(page, 'Lý Thu Hoàn');
  const profile = new URL(page.url()).hash;
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('1/9');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('400tr');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  const policy = card.getByRole('listitem').filter({ hasText: 'Nộp 01/09 · 400 tr' });
  await policy.getByRole('button', { name: 'Sửa HĐ nộp 01/09/2026' }).click();
  await confirm('Sửa HĐ · Lý Thu Hoàn', 'Xóa HĐ…').click();
  await confirm('Xóa HĐ nộp 01/09/2026', 'Xóa HĐ').click();
  await expect(policy).toHaveCount(0);
  await undoFrom(page, 'Đã chuyển HĐ vào Thùng rác', 'Đã khôi phục HĐ nộp 01/09/2026');
  await expect(policy).toBeVisible();

  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  await confirm('Sửa hồ sơ · Lý Thu Hoàn', 'Xóa KH…').click();
  await confirm('Xóa Lý Thu Hoàn?', 'Xóa KH').click();
  // The toast outlives the screen it was shown from: the profile gave way to the list.
  await expect(page).toHaveURL(/#\/customers$/);
  await undoFrom(page, 'Đã chuyển KH vào Thùng rác', 'Đã khôi phục KH Lý Thu Hoàn');
  await page.goto(`/${profile}`);
  await expect(policy).toBeVisible();
  await openTrash(page);
  await expect(trash(page)).toContainText('Thùng rác trống');
});

/**
 * A meeting of 15/09 with the first N3 customer, met with N2 (an RF), then deleted, the clock held
 * so that its toast stays; the customer's profile is the screen shown.
 */
async function deleteMet(page: Page) {
  await page.goto('/#/appointments');
  await book(page, '15/9');
  await recordMet(page, 'N2');
  const profile = await detail(page).getByRole('link', { name: 'Hồ sơ KH →' }).getAttribute('href');
  await holdClock(page);
  await detail(page).getByRole('button', { name: 'Sửa kết quả' }).click();
  const edit = page.getByRole('dialog', { name: 'Sửa kết quả cuộc gặp' });
  await edit.getByRole('button', { name: 'Xóa lịch hẹn' }).click();
  const confirm = page.getByRole('dialog', { name: 'Xóa lịch hẹn 15/09/2026?' });
  await confirm.getByRole('button', { name: 'Xóa lịch hẹn' }).click();
  await expect(toast(page, MOVED)).toBeVisible();
  await page.goto(`/${profile ?? ''}`);
}

/** The dialog "Chuyển nhóm" of the profile shown, where the customer's `stage` reads "hiện tại". */
async function stageDialog(page: Page, stage: string) {
  await page.getByRole('button', { name: 'Chuyển nhóm' }).click();
  const dialog = page.getByRole('dialog', { name: /^Chuyển nhóm · / });
  await expect(dialog.getByRole('radio', { name: /hiện tại$/ })).toHaveAccessibleName(
    `${stage} hiện tại`,
  );
  return dialog;
}

test('Hoàn tác of a met appointment gives the customer the stage it moved to back, unasked', async ({
  page,
}) => {
  await deleteMet(page);
  // The deletion took the move back (D7): N2 → N3.
  await (await stageDialog(page, 'N3')).getByRole('button', { name: 'Hủy' }).click();
  await undoFrom(page, MOVED, 'Đã khôi phục lịch hẹn 15/09/2026');
  await stageDialog(page, 'N2');
});

test('a restore refused at Hoàn tác says why in a red toast that stays; the record keeps to Thùng rác', async ({
  page,
}) => {
  await deleteMet(page);
  // The data changes between the deletion and Hoàn tác: the stage is changed by hand.
  const dialog = await stageDialog(page, 'N3');
  await dialog.getByRole('radio', { name: 'N1', exact: true }).check();
  await dialog.getByRole('button', { name: 'Chuyển nhóm' }).click();
  await expect(dialog).toHaveCount(0);

  await undo(page).click();
  const refused = page.getByRole('alert');
  await expect(refused).toHaveText(
    'Nhóm KH đã đổi ngày 15/09/2026, ghi sau lúc xóa cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10).',
  );
  await expect(undo(page)).toHaveCount(0);
  // An error does not leave by itself.
  await page.clock.runFor(60_000);
  await expect(refused).toBeVisible();
  await refused.getByRole('button', { name: 'Đóng thông báo' }).click();
  await expect(refused).toHaveCount(0);
  await openTrash(page);
  await expect(trash(page)).toContainText('1 bản ghi');
});

test('an appointment made in the scope says so in a toast, at the middle of the bottom edge and under a dialog', async ({
  page,
}) => {
  await page.goto('/#/appointments');
  await holdClock(page);
  await book(page, '15/9', undefined, '14:00');
  // Mockup 08: "Đã tạo lịch hẹn · Thứ Hai 28/09/2026 14:00".
  const made = toast(page, 'Đã tạo lịch hẹn');
  await expect(made).toHaveText('Đã tạo lịch hẹn · Thứ Ba 15/09/2026 14:00');
  await expect(made.getByRole('button')).toHaveCount(0);
  const place = await made.evaluate((node) => {
    const { left, right, bottom } = node.getBoundingClientRect();
    const middle = document.documentElement.clientWidth / 2;
    return { offCentre: Math.abs((left + right) / 2 - middle), fromBottom: innerHeight - bottom };
  });
  expect(place.offCentre).toBeLessThan(1);
  expect(place.fromBottom).toBe(22);

  // A dialog opened meanwhile is over the toast: its main button takes the click at its middle.
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const create = page.getByRole('dialog').getByRole('button', { name: 'Tạo lịch hẹn' });
  const onTop = await create.evaluate((button) => {
    const { left, right, top, bottom } = button.getBoundingClientRect();
    return document.elementFromPoint((left + right) / 2, (top + bottom) / 2) === button;
  });
  expect(onTop).toBe(true);
  // In the region of the dialog now, not read out again.
  await expect(page.getByRole('dialog').getByText('Đã tạo lịch hẹn')).toBeVisible();
});
