import { maskName } from '../apps/desktop/src/shell/name-mask';
import { expect, test, type Page } from './fixtures';
import {
  addKycNote,
  createKycCustomer,
  discoveryFacts,
  fullNamesShown,
  lowestContrast,
  markOs,
  panelOf,
  readWorkbook,
  seededNames,
} from './support';

// VA6b (mockup app-shell.html #privacy): the mask of VA6a on every other screen: Lịch hẹn and its
// dialogs, Tổng quan, Báo cáo, Team & nhân sự, the trash, and the toasts and lines that name a
// customer. The e2e build pins today to Tuesday 15/09/2026 (playwright.config.ts).

const eye = (page: Page) =>
  page.getByRole('banner').getByRole('button', { name: 'Che tên khách hàng' });
const go = async (page: Page, screen: string) => {
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: screen })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen);
};
const list = (page: Page) => page.getByRole('table', { name: 'Danh sách lịch hẹn' });
const detail = (page: Page) => page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });
const kinds = (page: Page) => page.getByRole('radiogroup', { name: 'Loại kỳ' });
const toastOf = (page: Page, text: string) =>
  page.locator('[aria-live="polite"]').filter({ hasText: text });

/** Text the mask hides: the dots on screen, "đã ẩn" for a screen reader. */
const HIDDEN = '•••đã ẩn';

/** No full name of `names` on the page, a dialog open or not. */
async function noneOf(page: Page, names: readonly string[], where: string) {
  expect(await fullNamesShown(page, names), where).toEqual([]);
}

/** The dialog `open` opens shows no full name of `names`; Escape closes it again. */
async function dialogShowsNone(
  page: Page,
  names: readonly string[],
  where: string,
  open: () => Promise<void>,
) {
  await open();
  await expect(page.getByRole('dialog')).toBeVisible();
  await noneOf(page, names, where);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
}

test('masked, no full name of a seeded customer is left on any screen nor in the dialogs of Lịch hẹn', async ({
  page,
}) => {
  test.setTimeout(180_000);
  const names = await seededNames(page);
  expect(names.length).toBeGreaterThan(500);
  await eye(page).click();
  await go(page, 'Tổng quan');
  await noneOf(page, names, 'Tổng quan');

  // The month, a planned appointment in the detail and its dialogs, a new one.
  await go(page, 'Lịch hẹn');
  await list(page)
    .locator('tbody tr')
    .filter({ hasText: 'Dự kiến' })
    .first()
    .getByRole('button')
    .click();
  await expect(detail(page).getByRole('heading', { level: 2 })).toBeVisible();
  await noneOf(page, names, 'Lịch hẹn, Tháng');
  for (const action of ['Ghi kết quả', 'Dời lịch', 'Xóa'])
    await dialogShowsNone(page, names, action, () =>
      detail(page).getByRole('button', { name: action, exact: true }).click(),
    );
  await dialogShowsNone(page, names, 'Lịch hẹn mới', () =>
    page.getByRole('button', { name: '+ Lịch hẹn' }).click(),
  );
  // Today, then yesterday: a met appointment, its outcome and the next one with its history.
  await kinds(page).getByRole('radio', { name: 'Ngày' }).click();
  await noneOf(page, names, 'Lịch hẹn, Ngày');
  await page.getByRole('button', { name: 'Kỳ trước' }).click();
  await list(page)
    .locator('tbody tr')
    .filter({ hasText: 'Đã gặp' })
    .first()
    .getByRole('button')
    .click();
  await noneOf(page, names, 'Lịch hẹn, a met one');
  for (const action of ['Sửa kết quả', 'Tạo lịch hẹn tiếp theo'])
    await dialogShowsNone(page, names, action, () =>
      detail(page).getByRole('button', { name: action, exact: true }).click(),
    );
  await kinds(page).getByRole('radio', { name: 'Năm' }).click();
  await noneOf(page, names, 'Lịch hẹn, Năm');

  await go(page, 'Khách hàng');
  await page.getByRole('radio', { name: 'Kanban' }).click();
  await noneOf(page, names, 'Khách hàng');
  await page.getByRole('region', { name: 'N3', exact: true }).getByRole('link').first().click();
  await expect(page.getByRole('region', { name: 'Dòng thời gian' })).toBeVisible();
  await noneOf(page, names, 'Hồ sơ KH');

  await go(page, 'Báo cáo');
  const tables = page.getByRole('radiogroup', { name: 'Bảng báo cáo' }).getByRole('radio');
  for (const table of await tables.all()) {
    await table.click();
    await noneOf(page, names, `Báo cáo, ${await table.textContent()}`);
  }
  await go(page, 'Team & nhân sự');
  for (const team of await page
    .getByRole('region', { name: 'Team', exact: true })
    .getByRole('button')
    .all()) {
    await team.click();
    await noneOf(page, names, `Team ${await team.textContent()}`);
  }
  await go(page, 'Cài đặt');
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'Thùng rác' })
    .click();
  await noneOf(page, names, 'Thùng rác');
});

test('masked, deleting and restoring a customer, an appointment and a policy names none in full', async ({
  page,
}) => {
  test.setTimeout(90_000);
  // A name no seeded customer's first letters are alike to.
  const name = 'Ửng Ỷ Thùng';
  const masked = maskName(name);
  const names = [name];
  // Its RM, whose delete dialog names their customers in the trash (mockup 9b).
  await page.goto('/#/customers');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const rmLabel =
    (await page
      .getByRole('combobox', { name: 'RM phụ trách' })
      .locator('option')
      .nth(1)
      .textContent()) ?? '';
  await page.keyboard.press('Escape');
  const [rm = '', team = ''] = rmLabel.split(' · ');
  await createKycCustomer(page, name, rmLabel);
  const profile = page.url();
  const policies = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await policies.getByRole('button', { name: '+ Hợp đồng' }).click();
  let dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('500tr');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: /^Ngày/ }).fill('30/9');
  await dialog.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(dialog).toHaveCount(0);
  await eye(page).click();

  // The policy's dialogs (NT-HS-19). It stays, so the customer takes it to the trash, and their
  // RM's delete dialog names them (a customer in the trash with records of the RM).
  await dialogShowsNone(page, names, 'Phát hành HĐ', () =>
    policies.getByRole('button', { name: 'Phát hành HĐ nộp 10/09/2026' }).click(),
  );
  await policies.getByRole('button', { name: 'Sửa HĐ nộp 10/09/2026' }).click();
  await noneOf(page, names, 'Sửa HĐ');
  await page.getByRole('button', { name: 'Xóa HĐ…' }).click();
  dialog = page.getByRole('dialog', { name: 'Xóa HĐ nộp 10/09/2026' });
  await expect(dialog).toBeVisible();
  await noneOf(page, names, 'Xóa HĐ');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  if (await page.getByRole('dialog').isVisible()) await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);

  // The appointment, from Lịch hẹn: its dialog, then the toast of its deletion.
  await go(page, 'Lịch hẹn');
  await list(page).getByRole('button', { name: masked, exact: true }).click();
  await detail(page).getByRole('button', { name: 'Xóa', exact: true }).click();
  dialog = page.getByRole('dialog', { name: 'Xóa lịch hẹn 30/09/2026?' });
  await expect(dialog).toContainText(masked);
  await noneOf(page, names, 'Xóa lịch hẹn');
  await dialog.getByRole('button', { name: 'Xóa lịch hẹn' }).click();
  await expect(toastOf(page, 'Đã chuyển lịch hẹn vào Thùng rác')).toBeVisible();
  await noneOf(page, names, 'the toast of a deleted appointment');

  // The customer: its dialog, then their RM's with them in the trash.
  const deleteCustomer = async () => {
    await page.goto(profile);
    await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
    await page.getByRole('button', { name: 'Xóa KH…' }).click();
    const confirm = page.getByRole('dialog', { name: `Xóa ${masked}?` });
    await expect(confirm).toBeVisible();
    await noneOf(page, names, 'Xóa KH');
    await confirm.getByRole('button', { name: 'Xóa KH' }).click();
    await expect(page).toHaveURL(/#\/customers$/);
  };
  await deleteCustomer();
  await go(page, 'Team & nhân sự');
  await page
    .getByRole('region', { name: 'Team', exact: true })
    .getByRole('button', { name: new RegExp(`^${team} (TL|chưa)`) })
    .click();
  await page
    .getByRole('region', { name: `Thành viên team ${team}` })
    .getByRole('button', { name: `Sửa ${rm}` })
    .click();
  await page.getByRole('button', { name: 'Xóa nhân sự' }).click();
  dialog = page.getByRole('dialog', { name: `Xóa ${rm}?` });
  // One full stop after the first letters, not two.
  await expect(dialog).toContainText(`Có cả dữ liệu của KH đã xóa: ${masked} Dọn sạch Thùng rác`);
  await noneOf(page, names, 'Xóa nhân sự');
  await dialog.getByRole('button', { name: 'Đóng', exact: true }).click();

  // The trash: its rows, one blocked by the customer; the restore dialog and the line of 11e.
  await go(page, 'Cài đặt');
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'Thùng rác' })
    .click();
  const trash = page.getByRole('region', { name: 'Thùng rác' });
  await expect(trash.getByRole('table')).toContainText(`KH ${masked}`);
  await expect(trash.getByRole('table')).toContainText(`Khôi phục KH ${masked} trước.`);
  await noneOf(page, names, 'Thùng rác');
  await trash.getByRole('button', { name: `Khôi phục KH ${masked} · ` }).click();
  dialog = page.getByRole('dialog', { name: `Khôi phục ${masked}?` });
  await expect(dialog).toBeVisible();
  await noneOf(page, names, 'Khôi phục KH');
  await dialog.getByRole('button', { name: 'Khôi phục', exact: true }).click();
  await expect(trash).toContainText(`Đã khôi phục KH ${masked}`);
  await noneOf(page, names, 'the line of a restored customer');

  // Hoàn tác of the toast brings them back and says so, masked.
  await deleteCustomer();
  await toastOf(page, 'Đã chuyển KH vào Thùng rác')
    .getByRole('button', { name: 'Hoàn tác' })
    .click();
  await expect(toastOf(page, `Đã khôi phục KH ${masked}`)).toBeVisible();
  await noneOf(page, names, 'the toast of Hoàn tác');
});

test('what was typed or written by the AI shows as dots on Lịch hẹn: a trigger, a note, the AI', async ({
  page,
}) => {
  const name = 'Ửng Ghi Chú';
  const trigger = 'Giới thiệu từ KH Phạm Gia Long';
  const note = 'Hẹn lại qua chị Trần Thu Hà';
  await createKycCustomer(page, name);
  await addKycNote(page, name, discoveryFacts);
  await panelOf(page).getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panelOf(page)).toContainText('CURRENT');
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  let dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: /^Ngày/ }).fill('15/9');
  await dialog.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await dialog.getByRole('textbox', { name: /^Mô tả trigger/ }).fill(trigger);
  await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(dialog).toHaveCount(0);
  await go(page, 'Lịch hẹn');
  // Today alone: the month's list starts at its last day.
  await kinds(page).getByRole('radio', { name: 'Ngày' }).click();
  await list(page).getByRole('button', { name, exact: true }).click();
  await detail(page).getByRole('button', { name: 'Ghi kết quả' }).click();
  dialog = page.getByRole('dialog', { name: 'Kết quả cuộc gặp' });
  await dialog.getByRole('radio', { name: 'Không đến' }).check();
  await dialog.getByRole('textbox', { name: /^Ghi chú/ }).fill(note);
  await dialog.getByRole('button', { name: 'Lưu kết quả' }).click();
  await expect(dialog).toHaveCount(0);
  const ai = detail(page).getByRole('region', { name: 'KYC Intelligence' });
  const said = (await ai.getByRole('listitem').first().textContent()) ?? '';
  expect(said).not.toBe('');

  await eye(page).click();
  const row = list(page)
    .locator('tbody tr')
    .filter({ hasText: maskName(name) });
  await expect(row.getByRole('cell')).toContainText([maskName(name), HIDDEN]);
  await expect(row).not.toContainText(trigger);
  await expect(detail(page).getByRole('heading', { level: 2 })).toHaveText(
    `15/09/2026 · ${maskName(name)}`,
  );
  const facts = detail(page).getByRole('definition');
  await expect(facts).toContainText([`Khác · ${HIDDEN}`, HIDDEN]);
  await expect(detail(page)).not.toContainText(trigger);
  await expect(detail(page)).not.toContainText(note);
  await expect(ai.getByRole('listitem').first()).toContainText(HIDDEN);
  await expect(ai).not.toContainText(said.slice(0, 20));
  // The dots read at AA on both systems (VA6a: --text-2, not the mockup's --text-3).
  for (const os of ['win', 'mac'] as const) {
    await markOs(page, os);
    expect(await lowestContrast(facts.last()), os).toBeGreaterThanOrEqual(4.5);
  }
  // A new one's dialog, the customer picked: the note of the one before, in "Các lần hẹn trước".
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  dialog = page.getByRole('dialog', { name: 'Lịch hẹn mới' });
  await dialog.getByRole('textbox', { name: /^Khách hàng/ }).fill(name);
  await dialog.getByRole('list', { name: 'KH khớp' }).getByRole('button').click();
  await expect(dialog).toContainText(maskName(name));
  await expect(dialog).toContainText('Ghi chú: •••');
  await expect(dialog).not.toContainText(note);
  expect(await fullNamesShown(page, [name])).toEqual([]);
});

test('the customer search of Lịch hẹn mới finds by the real name and shows the matches masked', async ({
  page,
}) => {
  const name = 'Ửng Tìm Kiếm';
  await createKycCustomer(page, name);
  await go(page, 'Lịch hẹn');
  await eye(page).click();
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const dialog = page.getByRole('dialog', { name: 'Lịch hẹn mới' });
  const search = dialog.getByRole('textbox', { name: /^Khách hàng/ });
  await search.fill('Ửng Tìm');
  const matches = dialog.getByRole('list', { name: 'KH khớp' }).getByRole('button');
  await expect(matches).toHaveCount(1);
  await expect(matches).toContainText(maskName(name));
  // The field shows what is typed (Issue #1391, "Không che").
  await expect(search).toHaveValue('Ửng Tìm');
  await matches.click();
  await expect(dialog).toContainText(maskName(name));
  expect(await fullNamesShown(page, [name])).toEqual([]);
});

test('Xuất Excel of Báo cáo writes the file masked as unmasked, names in full', async ({
  page,
}) => {
  await page.goto('/#/reports');
  await page
    .getByRole('radiogroup', { name: 'Bảng báo cáo' })
    .getByRole('radio', { name: 'Theo RM' })
    .click();
  const rm =
    (await page
      .getByRole('table', { name: 'Theo RM' })
      .locator('tbody tr th, tbody tr td')
      .first()
      .textContent()) ?? '';
  expect(rm).not.toBe('');
  const exported = async () => {
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Xuất Excel' }).click();
    const workbook = await readWorkbook(await download);
    return workbook.worksheets.map((sheet) => JSON.stringify(sheet.getSheetValues()));
  };
  const shown = await exported();
  await eye(page).click();
  const masked = await exported();
  expect(masked).toEqual(shown);
  expect(masked.join('\n')).toContain(rm);
});
