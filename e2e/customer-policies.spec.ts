import { expect, test, type Page } from '@playwright/test';

// The e2e build pins today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).

/** Opens the profile of the customer of a past met appointment; returns its name. */
async function openProfile(page: Page): Promise<string> {
  await page.goto('/#/appointments');
  const list = page.getByRole('table', { name: 'Danh sách lịch hẹn' });
  const met = list.locator('tbody tr').filter({ hasText: 'Đã gặp' }).first();
  const name = (await met.getByRole('button').textContent()) ?? '';
  await met.getByRole('button').click();
  await page.getByRole('link', { name: 'Hồ sơ KH →' }).click();
  await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
  return name;
}

const policyCount = async (page: Page) => {
  const facts = (await page.locator('#customer-name').locator('xpath=../..').textContent()) ?? '';
  return Number(/Đã có HĐ \((\d+)\)/.exec(facts)?.[1] ?? 0);
};

test('submits "500tr", then issues it: the FYP defaults to the submitted one, changed by hand', async ({
  page,
}) => {
  const name = await openProfile(page);
  const header = page.locator('section').filter({ has: page.locator('#customer-name') });
  const stage = await header.locator('span.rounded-full').first().textContent();
  const before = await policyCount(page);
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });

  // 8a: submit.
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  let dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await expect(dialog).toContainText(name);
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
  await expect(dialog).toContainText('Thứ Năm 10/09/2026');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('500tr');
  await expect(dialog).toContainText('500.000.000 ₫ (500 tr)');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toBeHidden();

  const row = card.getByRole('listitem').filter({ hasText: 'Nộp 10/09 · 500 tr' });
  await expect(row).toContainText('Đã nộp');
  await expect(header).toContainText(`Đã có HĐ (${before + 1})`);
  // A policy never moves the customer's stage.
  await expect(header.locator('span.rounded-full').first()).toHaveText(stage ?? '');

  // 8b/8c: issue; the FYP defaults to the submitted one, the day must not come before it.
  await row.getByRole('button', { name: 'Phát hành HĐ nộp 10/09/2026' }).click();
  dialog = page.getByRole('dialog', { name: 'Phát hành HĐ' });
  await expect(dialog.getByRole('textbox', { name: /^FYP phát hành/ })).toHaveValue(
    '500.000.000 ₫',
  );
  await dialog.getByRole('textbox', { name: /^Ngày phát hành/ }).fill('5/9');
  await dialog.getByRole('button', { name: 'Phát hành' }).click();
  await expect(dialog).toContainText('Chưa lưu được — 1 ô cần sửa');
  await expect(dialog).toContainText('05/09/2026 trước ngày nộp 10/09/2026.');
  await dialog.getByRole('textbox', { name: /^Ngày phát hành/ }).fill('12/9');
  await expect(dialog).toContainText('2 ngày sau khi nộp');
  // The issued FYP may differ from the submitted one (G2 D).
  await dialog.getByRole('textbox', { name: /^FYP phát hành/ }).fill('485,5tr');
  await expect(dialog).toContainText('485.500.000 ₫ (485,5 tr)');
  await dialog.getByRole('button', { name: 'Phát hành' }).click();
  await expect(dialog).toBeHidden();
  await expect(row).toContainText('Đã phát hành');
  await expect(row).toContainText('Phát hành 12/09 · 485,5 tr');
  await expect(row.getByRole('button', { name: /^Phát hành HĐ/ })).toHaveCount(0);
  await expect(header).toContainText(`Đã có HĐ (${before + 1})`);
  await expect(header.locator('span.rounded-full').first()).toHaveText(stage ?? '');
});

test('refuses a zero, negative or unreadable FYP', async ({ page }) => {
  await openProfile(page);
  const before = await policyCount(page);
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  const fyp = dialog.getByRole('textbox', { name: /^FYP nộp/ });
  await fyp.fill('0');
  await expect(dialog).toContainText('FYP phải lớn hơn 0.');
  await fyp.fill('năm trăm');
  await expect(dialog).toContainText('Gõ số tiền như');
  await fyp.fill('-50tr');
  await expect(dialog).toContainText('Số tiền không được âm.');
  await fyp.fill('1,2 tỷ');
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('14/9');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toBeHidden();

  const row = card.getByRole('listitem').filter({ hasText: 'Nộp 14/09 · 1,2 tỷ' });
  await expect(row).toContainText('Đã nộp');
  expect(await policyCount(page)).toBe(before + 1);
});

test('edits the issued FYP (8d), then deletes the policy softly', async ({ page }) => {
  const name = await openProfile(page);
  const header = page.locator('section').filter({ has: page.locator('#customer-name') });
  const stage = await header.locator('span.rounded-full').first().textContent();
  const before = await policyCount(page);
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  let dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('1/9');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('400tr');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  const row = card.getByRole('listitem').filter({ hasText: 'Nộp 01/09 · 400 tr' });
  await row.getByRole('button', { name: 'Phát hành HĐ nộp 01/09/2026' }).click();
  await page
    .getByRole('dialog', { name: 'Phát hành HĐ' })
    .getByRole('button', { name: 'Phát hành', exact: true })
    .click();
  await expect(row).toContainText('Phát hành 15/09 · 400 tr');

  await row.getByRole('button', { name: 'Sửa HĐ nộp 01/09/2026' }).click();
  dialog = page.getByRole('dialog', { name: `Sửa HĐ · ${name}` });
  await expect(dialog).toContainText('Đã phát hành 15/09/2026');
  // Mockup 8d: once issued, the issued FYP is a hand correction.
  await dialog.getByRole('textbox', { name: 'FYP phát hành sửa tay' }).fill('385,5tr');
  await expect(dialog).toContainText('385.500.000 ₫ (385,5 tr) · khác FYP nộp −14,5 tr');
  await expect(dialog).toContainText('FYP phát hành tháng 09/2026 của RE');
  await expect(dialog).toContainText('giảm 14,5 tr');
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(row).toContainText('Phát hành 15/09 · 385,5 tr');

  await row.getByRole('button', { name: 'Sửa HĐ nộp 01/09/2026' }).click();
  await dialog.getByRole('button', { name: 'Xóa HĐ…' }).click();
  const confirm = page.getByRole('dialog', { name: 'Xóa HĐ nộp 01/09/2026' });
  await confirm.getByRole('button', { name: 'Xóa HĐ' }).click();
  await expect(confirm).toBeHidden();
  await expect(row).toHaveCount(0);
  expect(await policyCount(page)).toBe(before);
  await expect(header.locator('span.rounded-full').first()).toHaveText(stage ?? '');
});
