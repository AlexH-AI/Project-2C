import { expect, test, type Page } from '@playwright/test';

// playwright.config.ts pins "today" of the simulated data (VITE_DEMO_ANCHOR) to 15/09/2026.
const NAME = 'An Thử Nghiệm';

const column = (page: Page, stage: string) =>
  page.getByRole('region', { name: stage, exact: true });
const history = (page: Page) => page.getByRole('region', { name: 'Lịch sử nhóm' });

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
  const stages = dialog.getByRole('group', { name: 'Nhóm ban đầu' }).getByRole('radio');
  await expect(stages).toHaveCount(4);
  await expect(stages.nth(0)).toBeChecked();
  await expect(dialog.getByRole('radio', { name: 'Tạm hoãn' })).toHaveCount(0);
  await expect(dialog.getByRole('radio', { name: 'Mất cơ hội' })).toHaveCount(0);

  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(NAME);
  await dialog.getByRole('combobox', { name: 'RE phụ trách' }).selectOption({ label: re ?? '' });
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('1984');
  await expect(dialog).toContainText('Chỉ năm sinh 1984 · 42 tuổi trong năm 2026');
  await dialog.getByRole('radio', { name: 'Nữ' }).check();
  await expect(dialog.getByRole('textbox', { name: 'Ngày ghi nhận KH' })).toHaveValue('15/09/2026');
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();

  await expect(dialog).toBeHidden();
  await column(page, 'N4')
    .getByRole('link', { name: new RegExp(NAME) })
    .click();
  const profile = page.getByRole('region', { name: NAME });
  await expect(profile).toContainText(/K-[0-9A-HJKMNP-TV-Z]{4} · Nữ · 1984 \(42 tuổi\)/);
  await expect(history(page).getByRole('listitem')).toHaveText(['15/09/2026N4tạo KH']);

  await changeStage(page, 'N2');
  await expect(profile).toContainText('N2');
  // A manual change points to no appointment, so it never counts as an RF (#44).
  await expect(history(page).getByRole('listitem').first()).toHaveText(
    '15/09/2026N4→N2chuyển tay · không tính RF',
  );
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
  await page.getByRole('button', { name: 'Chuyển nhóm' }).click();
  const dialog = page.getByRole('dialog', { name: /^Chuyển nhóm · / });

  for (const stage of ['N4', 'N2', 'N1', 'Tạm hoãn hiện tại']) {
    await expect(dialog.getByRole('radio', { name: stage, exact: true })).toBeDisabled();
  }
  await expect(dialog.getByRole('radio', { name: 'N3 mở lại' })).toBeEnabled();
  await expect(dialog.getByRole('radio', { name: 'Mất cơ hội' })).toBeEnabled();
  await dialog.getByRole('button', { name: 'Hủy' }).click();

  await changeStage(page, 'N3 mở lại');
  await expect(history(page).getByRole('listitem').first()).toContainText('Tạm hoãn→N3chuyển tay');
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

  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText(/KH đang mở/)).toHaveText(before ?? '');
});
