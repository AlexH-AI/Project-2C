import { expect, test, type Page } from './fixtures';
import { ANCHOR_YEAR, toNewYearsEve } from './anchor';
import { createKycCustomer } from './support';

// The e2e build pins today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).

/** Opens the profile of the customer of a past met appointment; returns its name. */
async function openProfile(page: Page): Promise<string> {
  await page.goto('/#/appointments');
  // Yesterday's day alone, so the met ones are among the rows shown (T-150).
  await page
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Ngày' })
    .click();
  await page.getByRole('button', { name: 'Kỳ trước' }).click();
  const list = page.getByRole('table', { name: 'Danh sách lịch hẹn' });
  const met = list.locator('tbody tr').filter({ hasText: 'Đã gặp' }).first();
  const name = (await met.getByRole('button').textContent()) ?? '';
  await met.getByRole('button').click();
  await page.getByRole('link', { name: 'Hồ sơ KH →' }).click();
  // Exact: the detail's heading "date · name" is still up until the profile renders (T-262).
  await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible();
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
  const fyp = dialog.getByRole('textbox', { name: /^FYP nộp/ });
  // Under a million the short form is the full one, said once (review of PR 838).
  await fyp.fill('500k');
  await expect(fyp).toHaveAccessibleDescription('500.000 ₫');
  await fyp.fill('500tr');
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
  await expect(dialog.getByRole('alert')).toHaveText(
    'Chưa lưu được — 1 ô cần sửaKhông có gì được ghi vào dữ liệu.',
  );
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

test('lists the policies by submission day, newest first, whatever order they were added', async ({
  page,
}) => {
  await openProfile(page);
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  for (const day of ['2/1', '14/9']) {
    await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
    await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill(day);
    await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('100tr');
    await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
    await expect(dialog).toBeHidden();
  }

  // dd/mm (this year) or dd/mm/yyyy as yyyy-mm-dd, which sorts as text in date order.
  const days = (await card.getByRole('listitem').allTextContents()).map((text) => {
    const [, day, month, year] = /Nộp (\d\d)\/(\d\d)(?:\/(\d{4}))?/.exec(text)!;
    return `${year ?? ANCHOR_YEAR}-${month}-${day}`;
  });
  expect(days).toContain(`${ANCHOR_YEAR}-01-02`);
  expect(days).toEqual([...days].sort().reverse());
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

// DR6-38 (R38e): the day 8b filled in as dd/mm reads in the year the dialog opened in.
test('a policy issued across New Year keeps the day the dialog showed (8b)', async ({ page }) => {
  await openProfile(page);
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  let dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('317tr');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toBeHidden();
  const row = card.getByRole('listitem').filter({ hasText: '317 tr' });

  // Opened at 23:58 on 31/12/2026, saved past midnight.
  await toNewYearsEve(page);
  await row.getByRole('button', { name: 'Phát hành HĐ nộp 10/09/2026' }).click();
  dialog = page.getByRole('dialog', { name: 'Phát hành HĐ' });
  await expect(dialog.getByRole('textbox', { name: /^Ngày phát hành/ })).toHaveValue('31/12');
  await page.clock.fastForward(3 * 60_000);
  await dialog.getByRole('button', { name: 'Phát hành', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(row).toContainText('Phát hành 31/12/2026 · 317 tr');
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

  // The FYP is compared as typed (DR6-40); moving a day to another month takes the FYP out of the
  // old month and into the new one (DR6-41), and the policy from the count of the old month to that
  // of the new one, a line after the FYP lines of each (mockup 8d "dời tháng", G3 T-284).
  await row.getByRole('button', { name: 'Sửa HĐ nộp 01/09/2026' }).click();
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('25/8');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('390tr');
  await dialog.getByRole('textbox', { name: /^Ngày phát hành/ }).fill('31/8');
  await expect(dialog).toContainText('385.500.000 ₫ (385,5 tr) · khác FYP nộp −4,5 tr');
  await expect(dialog.getByRole('definition').locator('span')).toHaveText([
    /^FYP nộp tháng 09\/2026 của RE .+ giảm 400 tr$/,
    /^FYP nộp tháng 08\/2026 của RE .+ tăng 390 tr$/,
    'tháng 09/2026: −1 HĐ nộp · tháng 08/2026: +1 HĐ nộp',
    /^FYP phát hành tháng 09\/2026 của RE .+ giảm 385,5 tr$/,
    /^FYP phát hành tháng 08\/2026 của RE .+ tăng 385,5 tr$/,
    'tháng 09/2026: −1 HĐ phát hành · tháng 08/2026: +1 HĐ phát hành',
  ]);
  // Back within the month the policy was in, only the FYP lines are left.
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('2/9');
  await dialog.getByRole('textbox', { name: /^Ngày phát hành/ }).fill('14/9');
  await expect(dialog.getByRole('definition').locator('span')).toHaveText([
    /^FYP nộp tháng 09\/2026 của RE .+ giảm 10 tr$/,
  ]);
  await dialog.getByRole('button', { name: 'Xóa HĐ…' }).click();
  const confirm = page.getByRole('dialog', { name: 'Xóa HĐ nộp 01/09/2026' });
  await confirm.getByRole('button', { name: 'Xóa HĐ' }).click();
  await expect(confirm).toBeHidden();
  await expect(row).toHaveCount(0);
  expect(await policyCount(page)).toBe(before);
  await expect(header.locator('span.rounded-full').first()).toHaveText(stage ?? '');
});

// DR6-119: two policies of a customer submitted the same day read alike to a screen reader unless
// each button is named by its FYP too, as the line beside it shows.
test('two policies submitted the same day have four buttons of four different names (DR6-119)', async ({
  page,
}) => {
  await createKycCustomer(page, 'Hà Hai Hợp Đồng');
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  for (const fyp of ['24tr', '48tr']) {
    await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
    await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
    await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill(fyp);
    await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
    await expect(dialog).toBeHidden();
  }
  await expect(card.getByRole('listitem')).toHaveCount(2);

  for (const fyp of ['24.000.000 ₫', '48.000.000 ₫']) {
    for (const name of [
      `Phát hành HĐ nộp 10/09/2026 · ${fyp}`,
      `Sửa HĐ nộp 10/09/2026 · ${fyp} · Đã nộp`,
    ]) {
      await expect(card.getByRole('button', { name, exact: true })).toHaveCount(1);
    }
  }
});

// Review of PR 748: one submitted and one issued, of one day and one FYP, differ by their badges;
// their "Sửa" buttons say the status too (only the first has "Phát hành").
test('a policy submitted and one issued, of one day and one FYP, have two "Sửa" names', async ({
  page,
}) => {
  await createKycCustomer(page, 'Hà Hai Trạng Thái');
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  const submit = async () => {
    await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
    await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
    await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('24tr');
    await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
    await expect(dialog).toBeHidden();
  };
  await submit();
  await card.getByRole('button', { name: 'Phát hành HĐ nộp 10/09/2026 · 24.000.000 ₫' }).click();
  const issue = page.getByRole('dialog', { name: 'Phát hành HĐ' });
  await issue.getByRole('button', { name: 'Phát hành', exact: true }).click();
  await expect(issue).toBeHidden();
  await submit();

  await expect(card.getByRole('listitem')).toHaveCount(2);
  for (const status of ['Đã nộp', 'Đã phát hành']) {
    const edit = card.getByRole('button', {
      name: `Sửa HĐ nộp 10/09/2026 · 24.000.000 ₫ · ${status}`,
      exact: true,
    });
    await expect(edit).toHaveCount(1);
  }
});

// DR6-83: the button that opened the dialog goes with the save (the empty card's "+ Hợp đồng", a
// row's "Phát hành", the row itself); the focus lands on the top of the card, not on the page.
test('by the keyboard, Lưu HĐ from the empty card, Phát hành and Xóa HĐ leave the focus on the card (DR6-83)', async ({
  page,
}) => {
  await createKycCustomer(page, 'Hà Tiêu Điểm');
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  const heading = card.getByRole('heading', { name: 'Hợp đồng', exact: true });
  await expect(card).toContainText('Chưa có HĐ.');
  await card.getByRole('button', { name: '+ Hợp đồng' }).press('Enter');
  let dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('500tr');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).press('Enter');
  await expect(dialog).toBeHidden();
  await expect(card).not.toContainText('Chưa có HĐ.');
  await expect(heading).toBeFocused();

  const issue = card.getByRole('button', { name: 'Phát hành HĐ nộp 10/09/2026' });
  await issue.press('Enter');
  dialog = page.getByRole('dialog', { name: 'Phát hành HĐ' });
  await dialog.getByRole('button', { name: 'Phát hành', exact: true }).press('Enter');
  await expect(dialog).toBeHidden();
  await expect(issue).toHaveCount(0);
  await expect(heading).toBeFocused();

  // 8d: the edit dialog gives way to the delete one, whose policy leaves the card.
  await card.getByRole('button', { name: 'Sửa HĐ nộp 10/09/2026' }).press('Enter');
  await page.getByRole('button', { name: 'Xóa HĐ…' }).press('Enter');
  const confirm = page.getByRole('dialog', { name: 'Xóa HĐ nộp 10/09/2026' });
  await confirm.getByRole('button', { name: 'Xóa HĐ' }).press('Enter');
  await expect(confirm).toBeHidden();
  await expect(card).toContainText('Chưa có HĐ.');
  await expect(heading).toBeFocused();
});
