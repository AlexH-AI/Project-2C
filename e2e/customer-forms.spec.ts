import { expect, pasteAsIs, test, type Page } from './fixtures';

// playwright.config.ts pins "today" of the simulated data (VITE_DEMO_ANCHOR) to 15/09/2026.
const NAME = 'An Thử Nghiệm';

const column = (page: Page, stage: string) =>
  page.getByRole('region', { name: stage, exact: true });
// The stage changes of the timeline, newest first; KYC notes and versions sit between them.
const history = (page: Page) =>
  page
    .getByRole('region', { name: 'Dòng thời gian' })
    .getByRole('listitem')
    .filter({ hasText: /tạo KH|chuyển tay|sau cuộc gặp/ });

async function openCreate(page: Page) {
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  return page.getByRole('dialog', { name: 'Khách hàng mới' });
}

async function changeStage(page: Page, to: string) {
  await page.getByRole('button', { name: 'Chuyển nhóm' }).click();
  const dialog = page.getByRole('dialog', { name: /^Chuyển nhóm · / });
  await dialog.getByRole('radio', { name: to, exact: true }).check();
  await dialog.getByRole('button', { name: 'Chuyển nhóm' }).click();
  await expect(dialog).toBeHidden();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/#/customers');
  await expect(page.getByText(/KH đang mở/)).toBeVisible();
});

test('creates a customer in N4 on the kanban, then moves it to N2 by hand', async ({ page }) => {
  // One RE's board, so the new card is among the few shown per column.
  await page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'RE' })
    .click();
  const re = await page
    .getByRole('combobox', { name: 'RE của góc nhìn' })
    .locator('option:checked')
    .textContent();

  const dialog = await openCreate(page);
  await expect(dialog).toContainText('Mã KH (vd. K-9A1C) sinh khi lưu');
  const stages = dialog.getByRole('radiogroup', { name: 'Nhóm ban đầu' }).getByRole('radio');
  await expect(stages).toHaveCount(4);
  await expect(stages.nth(0)).toBeChecked();
  await expect(dialog.getByRole('radio', { name: 'Tạm hoãn' })).toHaveCount(0);
  await expect(dialog.getByRole('radio', { name: 'Mất cơ hội' })).toHaveCount(0);

  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(NAME);
  await expect(
    dialog.getByRole('combobox', { name: 'RE phụ trách' }).locator('option:checked'),
  ).toHaveText(re ?? '');
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('1984');
  // Screen readers hear what the app understood, not only sighted users.
  await expect(dialog.getByRole('textbox', { name: /^Ngày sinh/ })).toHaveAccessibleDescription(
    'Chỉ năm sinh 1984 · 42 tuổi trong năm 2026',
  );
  await dialog.getByRole('radio', { name: 'Nữ' }).check();
  await expect(dialog.getByRole('textbox', { name: 'Ngày ghi nhận KH' })).toHaveValue('15/09/2026');
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();

  await expect(dialog).toBeHidden();
  // In the scope: the card shows, no line says otherwise.
  await expect(page.getByText(/ngoài góc nhìn/)).toHaveCount(0);
  await column(page, 'N4')
    .getByRole('link', { name: new RegExp(NAME) })
    .click();
  const profile = page.getByRole('region', { name: NAME });
  await expect(profile).toContainText(/K-[0-9A-HJKMNP-TV-Z]{4} · Nữ · 1984 \(42 tuổi\)/);
  await expect(history(page)).toHaveText(['15/09/2026N4tạo KH']);

  await changeStage(page, 'N2');
  await expect(profile).toContainText('N2');
  // A manual change points to no appointment, so it never counts as an RF (#44).
  await expect(history(page).first()).toHaveText('15/09/2026N4→N2chuyển tay · không tính RF');
});

test('a customer made for an RE outside the scope is said to be, with a link to it (DR6-31)', async ({
  page,
}) => {
  await page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'RE' })
    .click();
  const scopeRe = await page
    .getByRole('combobox', { name: 'RE của góc nhìn' })
    .locator('option:checked')
    .textContent();
  const summary = page.getByText(/KH đang mở/);
  const before = await summary.textContent();

  const dialog = await openCreate(page);
  const re = dialog.getByRole('combobox', { name: 'RE phụ trách' });
  // The scope's RE to begin with, as the new customer most likely is theirs.
  await expect(re.locator('option:checked')).toHaveText(scopeRe ?? '');
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(NAME);
  const other = (await re.locator('option').nth(2).textContent()) ?? '';
  expect(other).not.toBe(scopeRe);
  await re.selectOption({ label: other });
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();

  await expect(dialog).toBeHidden();
  const created = page.getByRole('status').filter({ hasText: 'ngoài góc nhìn' });
  await expect(created).toContainText(
    `Đã tạo KH ${NAME} cho ${other.split(' · ')[0]}. RE này nằm ngoài góc nhìn hiện tại nên KH không hiện ở đây; đổi góc nhìn để xem.`,
  );
  await expect(summary).toHaveText(before ?? '');
  await created.getByRole('link', { name: 'Hồ sơ KH →' }).click();
  await expect(page.getByRole('region', { name: NAME })).toBeVisible();
});

test('edits the profile, showing the customer code and the birth date as understood', async ({
  page,
}) => {
  const card = column(page, 'N3').getByRole('link').first();
  const name = (await card.locator('b').textContent()) ?? '';
  await card.click();

  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  const dialog = page.getByRole('dialog', { name: `Sửa hồ sơ · ${name}` });
  await expect(dialog).toContainText(/K-[0-9A-HJKMNP-TV-Z]{4} · nhóm N3/);
  await expect(dialog.getByRole('radio', { name: 'N4' })).toHaveCount(0);
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('12/3/1984');
  await expect(dialog).toContainText('12/03/1984 · 42 tuổi');
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByRole('region', { name })).toContainText('12/03/1984 (42 tuổi)');
});

test('a closed customer reopens only to N3', async ({ page }) => {
  await column(page, 'Tạm hoãn').getByRole('link').first().click();
  // In Tạm hoãn "từ" the latest stage change, the first of the timeline, not the first made.
  const latest = ((await history(page).first().textContent()) ?? '').slice(0, 10);
  await expect(history(page)).not.toHaveCount(1);
  await expect(page.getByText(`từ ${latest}`, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Chuyển nhóm' }).click();
  const dialog = page.getByRole('dialog', { name: /^Chuyển nhóm · / });

  for (const stage of ['N4', 'N2', 'N1', 'Tạm hoãn hiện tại']) {
    await expect(dialog.getByRole('radio', { name: stage, exact: true })).toBeDisabled();
  }
  await expect(dialog.getByRole('radio', { name: 'N3 mở lại' })).toBeEnabled();
  await expect(dialog.getByRole('radio', { name: 'Mất cơ hội' })).toBeEnabled();
  await dialog.getByRole('button', { name: 'Hủy' }).click();

  await changeStage(page, 'N3 mở lại');
  await expect(history(page).first()).toContainText('Tạm hoãn→N3chuyển tay');
});

test('sums up the fields to fix above the form, and reads the record day with its weekday (5a, 5b)', async ({
  page,
}) => {
  const dialog = await openCreate(page);
  const alert = dialog.getByRole('alert');
  const recorded = dialog.getByRole('textbox', { name: 'Ngày ghi nhận KH' });
  await recorded.fill('10/9');
  await expect(recorded).toHaveAccessibleDescription('Thứ Năm 10/09/2026');
  await expect(dialog.getByText(/^Đổi RE:/)).toHaveCount(0);

  await dialog.getByRole('combobox', { name: 'RE phụ trách' }).selectOption({ index: 1 });
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('31/02/1984');
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(alert).toHaveText('Chưa lưu được — 2 ô cần sửaKhông có gì được ghi vào dữ liệu.');
  await expect(dialog.getByRole('textbox', { name: 'Họ tên' })).toHaveAccessibleDescription(
    'Chưa nhập tên.',
  );

  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(NAME);
  await expect(alert).toHaveText(/^Chưa lưu được — 1 ô cần sửa/);
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('1984');
  await expect(alert).toHaveCount(0);
});

test('editing the profile says what saving records in KYC (5c)', async ({ page }) => {
  const card = column(page, 'N3').getByRole('link').first();
  const name = (await card.locator('b').textContent()) ?? '';
  await card.click();
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  const dialog = page.getByRole('dialog', { name: `Sửa hồ sơ · ${name}` });
  const birth = dialog.getByRole('textbox', { name: /^Ngày sinh/ });
  const kyc = dialog.getByRole('status');
  await expect(dialog.getByRole('combobox', { name: 'RE phụ trách' })).toHaveAccessibleDescription(
    'Đổi RE: lịch hẹn Dự kiến chuyển sang RE mới; lịch hẹn khác và HĐ vẫn tính cho RE đã ghi trên từng bản ghi.',
  );

  // Start from a year alone, saved, so the preview below does not depend on the seed.
  await birth.fill('1984');
  await dialog.getByRole('radio', { name: 'Nữ' }).check();
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  await expect(kyc).toHaveCount(0);

  await birth.fill('1985');
  await expect(kyc).toContainText('"Hồ sơ KH: năm sinh 1985"');
  await expect(kyc).toContainText('birthYear = 1985');
  await expect(kyc).toContainText('tạo phiên bản KYC mới');
  await expect(kyc).not.toContainText('không tạo');

  await birth.fill('12/3/1984');
  await expect(kyc).toContainText(
    'Khi lưu, app tự ghi vào KYCGhi chú KYC nguồn Hệ thống "Hồ sơ KH: ngày sinh 12/03/1984" và xác nhận dữ kiện birthYear = 1984',
  );
  await expect(kyc).toContainText('không tạo phiên bản KYC mới');
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByRole('region', { name: 'Dòng thời gian' })).toContainText(
    'Hồ sơ KH: ngày sinh 12/03/1984',
  );
});

// NT-KH-09 with appointments still ahead (T-233): the new RE takes them over; a past one stays.
test('changing the RE hands the planned appointments over, not the past ones (5c, 6h)', async ({
  page,
}) => {
  const name = 'Bàn Giao Thử';
  const created = await openCreate(page);
  await created.getByRole('textbox', { name: 'Họ tên' }).fill(name);
  const picker = created.getByRole('combobox', { name: 'RE phụ trách' });
  const [, oldRe = '', newRe = ''] = await picker.locator('option').allTextContents();
  await picker.selectOption({ label: oldRe });
  await created.getByRole('button', { name: 'Lưu KH' }).click();
  await page.getByRole('link', { name: new RegExp(name) }).click();
  const dialog = page.getByRole('dialog');
  for (const [day, time] of [
    ['14/9', ''],
    ['20/9', '10:00'],
  ] as const) {
    await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
    await dialog.getByRole('textbox', { name: /^Ngày/ }).fill(day);
    await dialog.getByRole('textbox', { name: /^Giờ/ }).fill(time);
    await dialog.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
    await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
    await expect(dialog).toHaveCount(0);
  }

  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  const re = dialog.getByRole('combobox', { name: 'RE phụ trách' });
  const handover = dialog.getByRole('status');
  await expect(handover).toHaveCount(0);
  await re.selectOption({ label: newRe });
  await expect(handover).toHaveText('Khi lưu: 1 lịch hẹn Dự kiến chuyển sang RE mới.');
  await re.selectOption({ label: oldRe });
  await expect(handover).toHaveCount(0);
  await re.selectOption({ label: newRe });
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(dialog).toHaveCount(0);

  // 6h from the past appointment: the RE in charge now, not the one on it.
  await page
    .getByRole('region', { name: 'Lịch hẹn', exact: true })
    .getByRole('button', { name: /^Hẹn tiếp sau lịch 14\/09/ })
    .click();
  await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Lịch hẹn tiếp theo');
  await expect(
    dialog.getByRole('combobox', { name: 'RE', exact: true }).locator('option:checked'),
  ).toHaveText(newRe);
  await dialog.getByRole('button', { name: 'Hủy' }).click();

  await page.goto('/#/appointments');
  await page
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Ngày' })
    .click();
  const row = page
    .getByRole('table', { name: 'Danh sách lịch hẹn' })
    .locator('tbody tr')
    .filter({ hasText: name });
  for (const [date, label, status] of [
    ['20/09/2026', newRe, 'Dự kiến'],
    ['14/09/2026', oldRe, 'Chưa ghi kết quả'],
  ] as const) {
    await page
      .getByRole('region', { name: /^Lịch tháng/ })
      .getByRole('button', { name: new RegExp(`^${date}:`) })
      .click();
    await expect(row).toContainText(status);
    // The RE column holds the name alone.
    await expect(row.locator('td:nth-child(4)')).toHaveText(label.split(' · ')[0]!);
  }
});

test('picking the gender again clears the failure of the last save (5c, DR6-33)', async ({
  page,
}) => {
  const dialog = await openCreate(page);
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(NAME);
  await dialog.getByRole('combobox', { name: 'RE phụ trách' }).selectOption({ index: 1 });
  await dialog.getByRole('radio', { name: 'Nữ' }).check();
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole('link', { name: new RegExp(NAME) }).click();

  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  const edit = page.getByRole('dialog', { name: `Sửa hồ sơ · ${NAME}` });
  await edit.getByRole('radio', { name: 'Chưa rõ' }).check();
  await edit.getByRole('button', { name: 'Lưu', exact: true }).click();
  const failure = edit.getByRole('alert');
  await expect(failure).toContainText('không xóa hay chọn lại "Chưa rõ" được');

  await edit.getByRole('radio', { name: 'Nữ' }).check();
  await expect(failure).toHaveCount(0);
});

test('refuses a customer with wrong fields and saves nothing', async ({ page }) => {
  const before = await page.getByText(/KH đang mở/).textContent();
  const dialog = await openCreate(page);
  const birth = dialog.getByRole('textbox', { name: /^Ngày sinh/ });

  // DR6-49: a name of invisible characters only is empty, as the command reads it.
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill('​ ⁠');
  await birth.fill('31/02/1984');
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(dialog.getByRole('textbox', { name: 'Họ tên' })).toHaveAccessibleDescription(
    'Chưa nhập tên.',
  );
  await expect(dialog.getByRole('combobox', { name: 'RE phụ trách' })).toHaveAccessibleDescription(
    'Chọn RE phụ trách.',
  );
  await expect(birth).toHaveAccessibleDescription('Ngày này không tồn tại.');

  await birth.fill('12/3/84');
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(birth).toHaveAccessibleDescription('Gõ năm (1984) hoặc dd/mm/yyyy (12/03/1984).');

  // A record date after today would block every stage change dated before it.
  const recorded = dialog.getByRole('textbox', { name: 'Ngày ghi nhận KH' });
  await recorded.fill('16/09');
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(recorded).toHaveAccessibleDescription(
    'Ngày này sau hôm nay. Ngày của năm trước: gõ đủ dd/mm/yyyy.',
  );

  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText(/KH đang mở/)).toHaveText(before ?? '');
});

// DR6-109: the dialog sends the name as typed, as the team dialogs do. The command checks it can be
// stored before dropping U+200B, so the halves of an emoji around it are refused, never joined.
test('refuses a name broken in a paste as the command does, then saves one as typed (5a)', async ({
  page,
}) => {
  const dialog = await openCreate(page);
  const name = dialog.getByRole('textbox', { name: 'Họ tên' });
  await dialog.getByRole('combobox', { name: 'RE phụ trách' }).selectOption({ index: 1 });
  await pasteAsIs(name, '\uD83D\u{200B}\uDE00 Lan');
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(dialog.getByRole('alert')).toContainText('Chữ có ký tự không lưu được');
  await expect(dialog).toBeVisible();

  // Sent with its extra spaces and U+200B, stored as the screens show it.
  await name.fill(` ${NAME.replace(' ', '  ')}\u{200B}`);
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole('link', { name: new RegExp(NAME) }).click();
  await expect(page.getByRole('region', { name: NAME })).toBeVisible();
});

test('deletes a customer from the profile, counting its records first (5f, TR-9)', async ({
  page,
}) => {
  // "884 KH đang mở · 316 đã đóng" → 884.
  const open = async () =>
    Number(
      (await page.getByText(/KH đang mở/).textContent())?.match(/^[\d.]+/)?.[0].replace(/\./g, ''),
    );
  const before = await open();
  const card = column(page, 'N2').getByRole('link').first();
  const name = (await card.locator('b').textContent()) ?? '';
  await card.click();
  const url = page.url();
  const profile = page.getByRole('region', { name });
  // "7 lịch · 3 đã gặp" above the appointments, "Đã có HĐ (1)" or "Chưa có HĐ" in the basics.
  const [total, met] = (
    (await page.getByText(/^\d+ lịch · \d+ đã gặp$/).textContent())?.match(/\d+/g) ?? []
  ).map(Number);
  const policies = Number((await profile.textContent())?.match(/Đã có HĐ \((\d+)\)/)?.[1] ?? 0);
  // The timeline: "tính 1 RF" on each stage change that counted an RF, and every KYC note, those
  // the app writes too, each quoted in its item, alone or as a KYC update (T-297).
  const timeline = page.getByRole('region', { name: 'Dòng thời gian' }).getByRole('listitem');
  await expect(timeline.first()).toBeVisible();
  const rf = await timeline.filter({ hasText: 'sau cuộc gặp · tính 1 RF' }).count();
  const kyc = await timeline.getByRole('blockquote').count();
  // Two different numbers, so a dialog showing one in place of the other fails.
  expect(rf).not.toBe(kyc);

  const openDelete = async () => {
    await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
    await page
      .getByRole('dialog', { name: `Sửa hồ sơ · ${name}` })
      .getByRole('button', { name: 'Xóa KH…' })
      .click();
    return page.getByRole('dialog', { name: `Xóa ${name}?` });
  };
  let dialog = await openDelete();
  await expect(dialog).toContainText(
    'KH và mọi bản ghi của KH sẽ bị ẩn khỏi danh sách và mọi chỉ số:',
  );
  await expect(dialog).toContainText(`Lịch hẹn${total} (${met} đã gặp · ${rf} lần tính RF)`);
  await expect(dialog).toContainText(`Hợp đồng${policies}`);
  // A number only: the purge of the trash deletes them too (TR-9; mockup 11f).
  await expect(dialog).toContainText(`Ghi chú KYC${kyc}Dữ liệu vẫn còn`);
  await expect(dialog).toContainText('Dữ liệu vẫn còn: khôi phục ở Cài đặt → Thùng rác.');

  // Hủy goes back to the profile form and deletes nothing.
  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toBeHidden();
  const edit = page.getByRole('dialog', { name: `Sửa hồ sơ · ${name}` });
  await edit.getByRole('button', { name: 'Hủy' }).click();
  await expect(edit).toBeHidden();
  await expect(profile).toBeVisible();

  dialog = await openDelete();
  await dialog.getByRole('button', { name: 'Xóa KH' }).click();

  await expect(page).toHaveURL(/#\/customers$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Khách hàng');
  await expect.poll(open).toBe(before - 1);
  // Seeded names may repeat, so the profile, not a card, shows that this customer is gone.
  await page.goBack();
  expect(page.url()).toBe(url);
  await expect(page.getByText('Không tìm thấy KH này (có thể đã bị xóa).')).toBeVisible();
});
