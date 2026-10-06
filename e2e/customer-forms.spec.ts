import { expect, test, type Page } from '@playwright/test';

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
  await dialog.getByRole('combobox', { name: 'RE phụ trách' }).selectOption({ label: re ?? '' });
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('1984');
  // Screen readers hear what the app understood, not only sighted users.
  await expect(dialog.getByRole('textbox', { name: /^Ngày sinh/ })).toHaveAccessibleDescription(
    'Chỉ năm sinh 1984 · 42 tuổi trong năm 2026',
  );
  await dialog.getByRole('radio', { name: 'Nữ' }).check();
  await expect(dialog.getByRole('textbox', { name: 'Ngày ghi nhận KH' })).toHaveValue('15/09/2026');
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();

  await expect(dialog).toBeHidden();
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
    'Đổi RE: lịch hẹn và HĐ cũ vẫn tính cho RE đã ghi trên từng bản ghi.',
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

test('refuses a customer with wrong fields and saves nothing', async ({ page }) => {
  const before = await page.getByText(/KH đang mở/).textContent();
  const dialog = await openCreate(page);
  const birth = dialog.getByRole('textbox', { name: /^Ngày sinh/ });

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
