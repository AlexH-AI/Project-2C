import { expect, test, type Page } from './fixtures';
import { asExe, openProfile, pressButton, tabKey } from './support';

// Keyboard paths of the shared dialog and segmented control (DR-58, 59, 02, 76). The e2e build pins
// today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).

/** Holds every read of a chosen file (`Blob.text`) until `releaseReads`, as a slow disk would. */
async function holdReads(page: Page) {
  await page.evaluate(() => {
    const text = Blob.prototype.text;
    const gate = new Promise<void>((resolve) => Object.assign(window, { releaseReads: resolve }));
    Blob.prototype.text = async function (this: Blob) {
      await gate;
      return text.call(this);
    };
  });
}

const releaseReads = (page: Page) =>
  page.evaluate(() => (window as Window & { releaseReads?: () => void }).releaseReads?.());

test('Escape, Hủy and saving each close the dialog and give focus back to its button', async ({
  page,
}) => {
  await page.goto('/#/team');
  const open = page.getByRole('button', { name: '+ Team' });
  const dialog = page.getByRole('dialog', { name: 'Team mới' });
  const name = dialog.getByRole('textbox', { name: 'Tên team' });

  await open.focus();
  await page.keyboard.press('Enter');
  await expect(name).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();

  await page.keyboard.press('Enter');
  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();

  await page.keyboard.press('Enter');
  await name.fill('Bình Minh 2');
  await page.keyboard.press('Enter');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Team', exact: true })).toContainText(
    'Bình Minh 2',
  );
  await expect(open).toBeFocused();
});

test('dialogs open on the field they ask for first, not on the first one', async ({ page }) => {
  await openProfile(page);

  // Hẹn tiếp: the RM is known, so the day comes first.
  const next = page
    .getByRole('table', { name: 'Lịch hẹn' })
    .getByRole('button', { name: /^Hẹn tiếp sau lịch/ })
    .first();
  await pressButton(next);
  let dialog = page.getByRole('dialog', { name: 'Lịch hẹn tiếp theo' });
  await expect(dialog.getByRole('textbox', { name: /^Ngày/ })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(next).toBeFocused();

  // Phát hành HĐ: the issue day, under the submitted policy's fields.
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('500tr');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toHaveCount(0);
  await card.getByRole('button', { name: 'Phát hành HĐ nộp 10/09/2026' }).click();
  dialog = page.getByRole('dialog', { name: 'Phát hành HĐ' });
  await expect(dialog.getByRole('textbox', { name: /^Ngày phát hành/ })).toBeFocused();
});

test('Dời lịch opens on the new day', async ({ page }) => {
  await page.goto('/#/appointments');
  const planned = page
    .getByRole('table', { name: 'Danh sách lịch hẹn' })
    .locator('tbody tr')
    .filter({ hasText: 'Dự kiến' })
    .first();
  await planned.getByRole('button').click();
  await page
    .getByRole('complementary', { name: 'Chi tiết lịch hẹn' })
    .getByRole('button', { name: 'Dời lịch' })
    .click();
  await expect(page.getByRole('dialog').getByRole('textbox', { name: /^Ngày mới/ })).toBeFocused();
});

// The × heads the dialog (mockup components.html 06): first in the Tab order, yet a dialog that
// marks nothing to focus still opens on the first field or button after it (review #1402).
test('the × comes first in the Tab order; a dialog marking nothing opens on its first button', async ({
  page,
}) => {
  await page.goto('/#/team');
  await page.getByRole('button', { name: 'Xóa team' }).focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: /^Xóa team / });
  await expect(dialog.getByRole('button', { name: 'Đóng', exact: true })).toBeFocused();
  await page.keyboard.press(`Shift+${tabKey(page)}`);
  await expect(dialog.getByRole('button', { name: 'Đóng hộp thoại' })).toBeFocused();
});

// DR6-186: a button that goes with its own press, or goes off while it runs, leaves the focus
// on something shown, never on the page itself.
test('the buttons of Lịch hẹn mới that go with their press leave the focus in the dialog', async ({
  page,
}) => {
  await page.goto('/#/appointments');
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const dialog = page.getByRole('dialog', { name: 'Lịch hẹn mới' });
  const search = dialog.getByRole('textbox', { name: /^Khách hàng/ });
  await search.fill('K-');
  await dialog.getByRole('list', { name: 'KH khớp' }).getByRole('button').first().focus();
  await page.keyboard.press('Enter');
  const change = dialog.getByRole('button', { name: 'Đổi KH' });
  await expect(change).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(search).toBeFocused();

  const date = dialog.getByRole('textbox', { name: /^Ngày/ });
  await date.fill('5/1');
  await dialog.getByRole('button', { name: /^Dùng / }).focus();
  await page.keyboard.press('Enter');
  await expect(date).toHaveValue('05/01/2027');
  await expect(date).toBeFocused();

  const coordinators = dialog.getByRole('group', { name: /^Người phối hợp/ });
  const pick = coordinators.getByRole('combobox', { name: 'Thêm người phối hợp' });
  await pick.selectOption({ index: 1 });
  await coordinators.getByRole('button', { name: 'Thêm', exact: true }).click();
  await coordinators.getByRole('button', { name: /^Bỏ / }).focus();
  await page.keyboard.press('Enter');
  await expect(coordinators.getByRole('button', { name: /^Bỏ / })).toHaveCount(0);
  await expect(pick).toBeFocused();
});

test('Xuất Excel and Xuất backup keep the focus while they run (DR6-186)', async ({ page }) => {
  await page.goto('/#/reports');
  const excel = page.getByRole('button', { name: 'Xuất Excel' });
  await excel.focus();
  const sheet = page.waitForEvent('download');
  await page.keyboard.press('Enter');
  await sheet;
  await expect(excel).toBeFocused();

  await page.goto('/#/settings');
  const backup = page
    .getByRole('region', { name: 'Xuất / nhập backup' })
    .getByRole('button', { name: 'Xuất backup' });
  await backup.focus();
  const file = page.waitForEvent('download');
  await page.keyboard.press('Enter');
  await file;
  await expect(backup).toBeFocused();
});

test('arrow keys move the choice around a segmented control, wrapping at both ends', async ({
  page,
}) => {
  await page.goto('/#/appointments');
  const radios = page.getByRole('radiogroup', { name: 'Loại kỳ' }).getByRole('radio');
  // `count` does not wait for the screen to open.
  await expect(radios.first()).toBeVisible();
  const count = await radios.count();
  const checked = async () => {
    for (let i = 0; i < count; i++) {
      if ((await radios.nth(i).getAttribute('aria-checked')) === 'true') return i;
    }
    return -1;
  };

  const start = await checked();
  await radios.nth(start).focus();
  await page.keyboard.press('ArrowRight');
  const right = (start + 1) % count;
  await expect(radios.nth(right)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(right)).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowUp');
  const left = (start - 1 + count) % count;
  await expect(radios.nth(left)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(left)).toBeFocused();

  // Around the start: from the first, left goes to the last.
  for (let i = left; i > 0; i--) await page.keyboard.press('ArrowLeft');
  await expect(radios.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(radios.nth(count - 1)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(count - 1)).toBeFocused();

  // Around the end: from the last, → goes to the first, and so does ↓ (DR6-206).
  await page.keyboard.press('ArrowRight');
  await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(radios.nth(count - 1)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(0)).toBeFocused();
  // ↓ is a step on, as → is, anywhere else too.
  await page.keyboard.press('ArrowDown');
  await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(1)).toBeFocused();
  await expect(radios.and(page.locator('[aria-checked="true"]'))).toHaveCount(1);
});

test('a second Escape does not close the dialog of a running reload', async ({
  page,
  browserName,
}) => {
  await asExe(page);
  await page.goto('/#/settings');
  await page.evaluate(() => window.exe.holdBackup());

  await pressButton(page.getByRole('button', { name: 'Nạp lại…' }));
  const dialog = page.getByRole('dialog', { name: 'Nạp lại dữ liệu giả lập?' });
  await dialog.getByRole('textbox', { name: /^Gõ NẠP LẠI/ }).fill('NẠP LẠI');
  await page.keyboard.press('Enter');
  // DR6-154: the field it was typed in goes off, the focus stays in the dialog, on what runs.
  const running = dialog.getByRole('button', { name: 'Đang nạp lại…' });
  await expect(running).toBeFocused();
  await expect(running).toBeDisabled();
  // The field, locked meanwhile, is outside --border-control: a dashed edge, no fill (VA2).
  const locked = dialog.getByRole('textbox', { name: /^Gõ NẠP LẠI/ });
  await expect(locked).toBeDisabled();
  await expect(locked).toHaveCSS('border-top-style', 'dashed');
  await expect(locked).toHaveCSS('border-bottom-color', 'rgb(52, 66, 90)');
  await expect(locked).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  // Dimmed as a button off is (components.html 01: 0.45), under the pointer too, where it neither
  // lights up nor shrinks.
  await expect(running).toHaveCSS('opacity', '0.45');
  await running.hover({ force: true });
  await expect(running).toHaveCSS('opacity', '0.45');
  await expect(running).toHaveCSS('filter', 'none');

  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  // Still modal: the page behind cannot be used while the reload runs.
  expect(await dialog.evaluate((node) => node.matches(':modal'))).toBe(true);
  // Opened again by the second Escape (DR-58), it still holds the focus.
  await expect(running).toBeFocused();
  await test.step('Tab twice comes back to what runs', async (step) => {
    // On WebKit Option+Tab goes from it out of the page, to Playwright's window, then to the dialog
    // itself, then back to it: never to the page behind, but three stops (CI run 44019009757). The
    // app on a Mac: NT-MAC-14.
    step.skip(
      browserName === 'webkit',
      'Option+Tab stops on the dialog itself and out of the page too (Mac-7b, NT-MAC-14)',
    );
    await page.keyboard.press(tabKey(page));
    await page.keyboard.press(tabKey(page));
    await expect(running).toBeFocused();
  });

  await page.evaluate(() => window.exe.releaseBackup());
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('Đã nạp lại dữ liệu giả lập');
  await expect(page.getByRole('button', { name: 'Nạp lại…' })).toBeFocused();
});

test('the dialog of a running import keeps the focus on what runs (10a, DR6-154)', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/settings');
  const backup = page.getByRole('region', { name: 'Xuất / nhập backup' });
  await backup.getByRole('button', { name: 'Xuất backup' }).click();
  await expect(backup.getByRole('status')).toContainText('Đã xuất backup: ');
  const file = await page.evaluate(() => window.exe.exports.at(-1) ?? '');

  await page.evaluate(() => window.exe.holdBackup());
  const open = backup.getByRole('button', { name: 'Chọn file…' });
  const chooser = page.waitForEvent('filechooser');
  await pressButton(open);
  await (
    await chooser
  ).setFiles({ name: 'export.p2cbackup', mimeType: 'application/json', buffer: Buffer.from(file) });
  const dialog = page.getByRole('dialog', { name: 'Thay toàn bộ dữ liệu?' });
  await expect(dialog.getByRole('button', { name: 'Hủy' })).toBeFocused();
  await page.keyboard.press(tabKey(page));
  await page.keyboard.press('Enter');
  const running = dialog.getByRole('button', { name: 'Đang nhập…' });
  await expect(running).toBeFocused();
  await expect(running).toBeDisabled();
  await expect(dialog.getByRole('button', { name: 'Hủy' })).toBeDisabled();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(running).toBeFocused();
  // DR6-174 (a): pressed while it runs, by Enter, Space or the pointer, it does not import again.
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await running.click({ force: true });
  await expect(running).toBeFocused();

  await page.evaluate(() => window.exe.releaseBackup());
  await expect(dialog).toHaveCount(0);
  await expect(backup.getByRole('status')).toContainText('Đã nhập backup');
  // One import, with its one backup.
  const events = await page.evaluate(() => window.exe.events);
  expect(events.filter((event) => event === 'backup')).toHaveLength(1);
  // The button that chose the file has the focus back (review of PR 924).
  await expect(open).toBeFocused();
});

// Review of PR 924 (as DR6-83): "Chọn file…" keeps the focus while the file is read, so each dialog
// the read opens gives it back as it goes (10a, 10b); pressed meanwhile, it opens no other chooser.
test('the dialogs of a chosen backup give the focus back to "Chọn file…" (10a, 10b)', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/settings');
  const backup = page.getByRole('region', { name: 'Xuất / nhập backup' });
  await backup.getByRole('button', { name: 'Xuất backup' }).click();
  await expect(backup.getByRole('status')).toContainText('Đã xuất backup: ');
  const file = await page.evaluate(() => window.exe.exports.at(-1) ?? '');
  let choosers = 0;
  page.on('filechooser', () => {
    choosers += 1;
  });
  const open = backup.getByRole('button', { name: 'Chọn file…' });
  // Through the button, as a person chooses a file: the button has the focus.
  const choose = async (text: string) => {
    const chooser = page.waitForEvent('filechooser');
    await pressButton(open);
    await (
      await chooser
    ).setFiles({
      name: 'export.p2cbackup',
      mimeType: 'application/json',
      buffer: Buffer.from(text),
    });
  };
  const confirm = page.getByRole('dialog', { name: 'Thay toàn bộ dữ liệu?' });

  await holdReads(page);
  await choose(file);
  const reading = backup.getByRole('button', { name: 'Đang đọc file…' });
  await expect(reading).toBeFocused();
  await expect(reading).toBeDisabled();
  // Dimmed as a button off is.
  await expect(reading).toHaveCSS('opacity', '0.45');
  await page.keyboard.press('Enter');
  await reading.click({ force: true });
  await releaseReads(page);
  await confirm.getByRole('button', { name: 'Hủy' }).click();
  await expect(confirm).toHaveCount(0);
  await expect(open).toBeFocused();

  await choose(file);
  await expect(confirm).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(confirm).toHaveCount(0);
  await expect(open).toBeFocused();

  await choose('{"format":"project2-backup","tables":{}}');
  const refused = page.getByRole('dialog', { name: 'Không nhập được file' });
  await refused.getByRole('button', { name: 'Đóng', exact: true }).click();
  await expect(refused).toHaveCount(0);
  await expect(open).toBeFocused();
  // Pressed while the first file was read, it opened no chooser of its own.
  expect(choosers).toBe(3);
});

test('closing the exe over a failed save: Escape leaves the window open, and closing still works', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/team');
  await page.evaluate(() => (window.exe.failSaves = true));
  await page.getByRole('button', { name: '+ Team' }).click();
  const create = page.getByRole('dialog', { name: 'Team mới' });
  await create.getByRole('textbox', { name: 'Tên team' }).fill('Bình Minh 2');
  await create.getByRole('button', { name: 'Tạo team' }).click();
  await expect(page.getByRole('alert')).toContainText('Chưa lưu được');

  const ask = page.getByRole('dialog', { name: 'Chưa lưu được thay đổi' });
  const requestClose = () => page.evaluate(() => window.exe.requestClose());
  const destroyed = () => page.evaluate(() => window.exe.destroyed);

  await requestClose();
  // Enter right away must not drop the changes.
  await expect(ask.getByRole('button', { name: 'Thử lại' })).toBeFocused();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(ask).toHaveCount(0);
  expect(await destroyed()).toBe(false);

  // The next close asks again; once the file can be written, "Thử lại" saves and closes.
  await requestClose();
  await expect(ask).toBeVisible();
  await page.evaluate(() => (window.exe.failSaves = false));
  await page.keyboard.press('Enter');
  await expect.poll(destroyed).toBe(true);
});

test('the save warning and the close question name the cause of a failed save that Rust sends (DR6-07, DR6-120)', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/team');
  await page.evaluate(() => (window.exe.failSaves = true));
  await page.getByRole('button', { name: '+ Team' }).click();
  const create = page.getByRole('dialog', { name: 'Team mới' });
  await create.getByRole('textbox', { name: 'Tên team' }).fill('Bình Minh 2');
  await create.getByRole('button', { name: 'Tạo team' }).click();

  const warning = page.getByRole('alert');
  const ask = page.getByRole('dialog', { name: 'Chưa lưu được thay đổi' });
  await expect(warning).toContainText('chương trình khác');
  // Each close saves again first, and that save fails with the cause set here.
  for (const [error, cause] of [
    ['DISK_FULL', 'ổ đĩa chứa thư mục dữ liệu đã đầy'],
    ['READ_ONLY', 'đang ở chế độ chỉ đọc'],
    ['FOLDER_READ_ONLY', 'không cho tài khoản người dùng của máy đang dùng tạo file mới'],
    [true, 'chương trình khác'],
  ] as const) {
    await page.evaluate((error) => (window.exe.failSaves = error), error);
    await page.evaluate(() => window.exe.requestClose());
    await expect(ask, String(error)).toContainText(cause);
    await page.keyboard.press('Escape');
    await expect(ask).toHaveCount(0);
    await expect(warning, String(error)).toContainText(cause);
  }
  expect(await page.evaluate(() => window.exe.destroyed)).toBe(false);
});
