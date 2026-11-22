import { expect, test, type Page } from './fixtures';
import { ANCHOR_YEAR, toNewYearsEve } from './anchor';
import { createKycCustomer, gotoScreen, openProfile } from './support';

// The e2e build pins today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).

/** A day or an FYP of invisible characters alone (DR6-173). */
const INVISIBLE = '\u{200B}\u{85}\u{2060}';

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
  // Under 1,000 the short form is the full one, said once (review of PR 838).
  await fyp.fill('950');
  await expect(fyp).toHaveAccessibleDescription('950 VNĐ');
  await fyp.fill('500tr');
  await expect(dialog).toContainText('500,000,000 VNĐ (500 tr)');
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
    '500,000,000 VNĐ',
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
  await dialog.getByRole('textbox', { name: /^FYP phát hành/ }).fill('485.5tr');
  await expect(dialog).toContainText('485,500,000 VNĐ (485.5 tr)');
  await dialog.getByRole('button', { name: 'Phát hành' }).click();
  await expect(dialog).toBeHidden();
  await expect(row).toContainText('Đã phát hành');
  await expect(row).toContainText('Phát hành 12/09 · 485.5 tr');
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
  await expect(dialog).toContainText('Chưa đọc được số tiền. Gõ như 1,500,000 hoặc 1.5 tr.');
  await fyp.fill('-50tr');
  await expect(dialog).toContainText('Số tiền không được âm.');
  // ADR-0018 §5: the marks of today are refused, the way meant offered, never filled by the app.
  await fyp.fill('1,2 tỷ');
  await expect(fyp).toHaveAccessibleDescription('Dấu "," ngăn hàng nghìn, dấu "." cho phần lẻ.');
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('14/9');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog.getByRole('alert')).toHaveText(
    'Chưa lưu được — 1 ô cần sửaKhông có gì được ghi vào dữ liệu.',
  );
  await dialog.getByRole('button', { name: 'Điền 1.2 tỷ = 1,200,000,000 VNĐ' }).click();
  await expect(fyp).toHaveValue('1.2 tỷ');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toBeHidden();

  const row = card.getByRole('listitem').filter({ hasText: 'Nộp 14/09 · 1.2 tỷ' });
  await expect(row).toContainText('Đã nộp');
  expect(await policyCount(page)).toBe(before + 1);
});

// Mockup ngon-ngu-tien-te.html #money (ADR-0018 §5, golden X26, X03, X08): a money field shows how
// to type an amount, refuses what reads two ways or by the marks of today, and offers the ways of
// writing that read as buttons; a click fills the field, which reads it back.
test('offers the ways of writing an FYP refused, filled only when picked (G-03b)', async ({
  page,
}) => {
  await openProfile(page);
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  const fyp = dialog.getByRole('textbox', { name: /^FYP nộp/ });
  await expect(fyp).toHaveAttribute('placeholder', 'vd. 500 tr · 1.5 tỷ');

  // X08: nothing reads, nothing to offer; the sentence says how to type it.
  await fyp.fill('1,5');
  await expect(fyp).toHaveAccessibleDescription(
    'Chưa đọc được số tiền. Gõ như 1,500,000 hoặc 1.5 tr.',
  );
  await expect(dialog.getByRole('button', { name: /^Điền / })).toHaveCount(0);

  // X03: one way of writing, in the new marks.
  await fyp.fill('500.000.000');
  const offered = dialog.getByRole('group', { name: 'Có phải là:' });
  await expect(offered.getByRole('button')).toHaveText(['500,000,000 = 500,000,000 VNĐ']);

  // X26: read two ways, both offered; the field keeps what was typed until one is picked.
  await fyp.fill('1.500 tr');
  await expect(fyp).toHaveAccessibleDescription('"1.500 tr" đọc được theo hai cách.');
  const ways = dialog.getByRole('group', { name: 'Chọn một cách viết:' }).getByRole('button');
  await expect(ways).toHaveText(['1.5 tr = 1,500,000 VNĐ', '1,500 tr = 1,500,000,000 VNĐ']);
  await expect(fyp).toHaveValue('1.500 tr');
  await dialog.getByRole('button', { name: 'Điền 1.5 tr = 1,500,000 VNĐ' }).click();
  await expect(fyp).toHaveValue('1.5 tr');
  await expect(fyp).toBeFocused();
  await expect(fyp).toHaveAccessibleDescription('1,500,000 VNĐ (1.5 tr)');
  await expect(ways).toHaveCount(0);

  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('13/9');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toBeHidden();
  await expect(card.getByRole('listitem').filter({ hasText: 'Nộp 13/09 · 1.5 tr' })).toContainText(
    'Đã nộp',
  );
});

// DR6-173: a day or an FYP of invisible characters alone shows nothing and waits for "Lưu HĐ" as an
// empty field does (as 6b, 6c and 6e since DR6-150); saving still asks for both.
test('a day or an FYP of invisible characters alone is asked for only on saving (8a, DR6-173)', async ({
  page,
}) => {
  await openProfile(page);
  const before = await policyCount(page);
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  const day = dialog.getByRole('textbox', { name: /^Ngày nộp/ });
  const fyp = dialog.getByRole('textbox', { name: /^FYP nộp/ });
  await day.fill(INVISIBLE);
  await fyp.fill(INVISIBLE);
  await expect(day).not.toHaveAttribute('aria-invalid');
  await expect(fyp).not.toHaveAttribute('aria-invalid');
  await expect(dialog).not.toContainText('Nhập ngày.');
  await expect(dialog).not.toContainText('Chưa nhập số tiền.');

  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(day).toHaveAttribute('aria-invalid', 'true');
  await expect(fyp).toHaveAttribute('aria-invalid', 'true');
  await expect(day).toHaveAccessibleDescription(/Nhập ngày\./);
  await expect(fyp).toHaveAccessibleDescription(/Chưa nhập số tiền\./);
  await dialog.getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(dialog).toBeHidden();
  expect(await policyCount(page)).toBe(before);
});

// The same in 8b (review of PR 1072): its day and FYP come filled in; emptied to invisible
// characters alone, they wait for "Phát hành" as empty fields do, and issuing still asks for both.
test('an issue day or FYP of invisible characters alone is asked for only on issuing (8b, DR6-173)', async ({
  page,
}) => {
  await openProfile(page);
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  let dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('11/9');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('213tr');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toBeHidden();
  const row = card.getByRole('listitem').filter({ hasText: 'Nộp 11/09 · 213 tr' });
  const issue = row.getByRole('button', { name: 'Phát hành HĐ nộp 11/09/2026' });

  await issue.click();
  dialog = page.getByRole('dialog', { name: 'Phát hành HĐ' });
  const day = dialog.getByRole('textbox', { name: /^Ngày phát hành/ });
  const fyp = dialog.getByRole('textbox', { name: /^FYP phát hành/ });
  await day.fill(INVISIBLE);
  await fyp.fill(INVISIBLE);
  await expect(day).not.toHaveAttribute('aria-invalid');
  await expect(fyp).not.toHaveAttribute('aria-invalid');
  await expect(dialog).not.toContainText('Nhập ngày.');
  await expect(dialog).not.toContainText('Chưa nhập số tiền.');

  await dialog.getByRole('button', { name: 'Phát hành', exact: true }).click();
  await expect(day).toHaveAttribute('aria-invalid', 'true');
  await expect(fyp).toHaveAttribute('aria-invalid', 'true');
  await expect(day).toHaveAccessibleDescription(/Nhập ngày\./);
  await expect(fyp).toHaveAccessibleDescription(/Chưa nhập số tiền\./);
  await dialog.getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(row).toContainText('Đã nộp');
  await expect(row).not.toContainText('Đã phát hành');
  await expect(issue).toBeVisible();
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
  await dialog.getByRole('textbox', { name: 'FYP phát hành sửa tay' }).fill('385.5tr');
  await expect(dialog).toContainText('385,500,000 VNĐ (385.5 tr) · khác FYP nộp −14.5 tr');
  await expect(dialog).toContainText('FYP phát hành tháng 09/2026 của RM');
  await expect(dialog).toContainText('giảm 14.5 tr');
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(row).toContainText('Phát hành 15/09 · 385.5 tr');

  // The FYP is compared as typed (DR6-40); moving a day to another month takes the FYP out of the
  // old month and into the new one (DR6-41), and the policy from the count of the old month to that
  // of the new one, a line after the FYP lines of each (mockup 8d "dời tháng", G3 T-284).
  await row.getByRole('button', { name: 'Sửa HĐ nộp 01/09/2026' }).click();
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('25/8');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('390tr');
  await dialog.getByRole('textbox', { name: /^Ngày phát hành/ }).fill('31/8');
  await expect(dialog).toContainText('385,500,000 VNĐ (385.5 tr) · khác FYP nộp −4.5 tr');
  await expect(dialog.getByRole('definition').locator('span')).toHaveText([
    /^FYP nộp tháng 09\/2026 của RM .+ giảm 400 tr$/,
    /^FYP nộp tháng 08\/2026 của RM .+ tăng 390 tr$/,
    'tháng 09/2026: −1 HĐ nộp · tháng 08/2026: +1 HĐ nộp',
    /^FYP phát hành tháng 09\/2026 của RM .+ giảm 385\.5 tr$/,
    /^FYP phát hành tháng 08\/2026 của RM .+ tăng 385\.5 tr$/,
    'tháng 09/2026: −1 HĐ phát hành · tháng 08/2026: +1 HĐ phát hành',
  ]);
  // Back within the month the policy was in, only the FYP lines are left.
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('2/9');
  await dialog.getByRole('textbox', { name: /^Ngày phát hành/ }).fill('14/9');
  await expect(dialog.getByRole('definition').locator('span')).toHaveText([
    /^FYP nộp tháng 09\/2026 của RM .+ giảm 10 tr$/,
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

  for (const fyp of ['24,000,000 VNĐ', '48,000,000 VNĐ']) {
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
  await card.getByRole('button', { name: 'Phát hành HĐ nộp 10/09/2026 · 24,000,000 VNĐ' }).click();
  const issue = page.getByRole('dialog', { name: 'Phát hành HĐ' });
  await issue.getByRole('button', { name: 'Phát hành', exact: true }).click();
  await expect(issue).toBeHidden();
  await submit();

  await expect(card.getByRole('listitem')).toHaveCount(2);
  for (const status of ['Đã nộp', 'Đã phát hành']) {
    const edit = card.getByRole('button', {
      name: `Sửa HĐ nộp 10/09/2026 · 24,000,000 VNĐ · ${status}`,
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

/** A policy of the profile open, submitted on `day` (dd/mm) for `fyp`, then issued on `issued`. */
async function addPolicy(page: Page, day: string, fyp: string, issued?: string) {
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill(day);
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill(fyp);
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toBeHidden();
  if (!issued) return;
  await card
    .getByRole('button', { name: new RegExp(`^Phát hành HĐ nộp ${day}/${ANCHOR_YEAR}`) })
    .click();
  const issue = page.getByRole('dialog', { name: 'Phát hành HĐ' });
  await issue.getByRole('textbox', { name: /^Ngày phát hành/ }).fill(issued);
  await issue.getByRole('button', { name: 'Phát hành', exact: true }).click();
  await expect(issue).toBeHidden();
}

// B2, mockup huy-hd.html #cancel, #effect, #row, #count, #states (G3 13/11/2026).
test('cancels an issued policy: today filled in, the FYP locked, what the metrics do (B2)', async ({
  page,
}) => {
  const name = 'Hà Hủy Hợp Đồng';
  await createKycCustomer(page, name);
  const header = page.locator('section').filter({ has: page.locator('#customer-name') });
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await addPolicy(page, '20/08', '60tr', '25/08');
  const row = card.getByRole('listitem').filter({ hasText: 'Nộp 20/08 · 60 tr' });
  await row.getByRole('button', { name: 'Hủy HĐ nộp 20/08/2026 · 60,000,000 VNĐ' }).click();

  const dialog = page.getByRole('dialog', { name: 'Hủy HĐ' });
  await expect(dialog).toContainText(`${name} · phát hành 25/08/2026 · FYP phát hành 60 tr`);
  const day = dialog.getByRole('textbox', { name: /^Ngày hủy/ });
  await expect(day).toHaveValue('15/09');
  await expect(day).toHaveAccessibleDescription('Thứ Ba 15/09/2026 · 21 ngày sau khi phát hành');
  const fyp = dialog.getByRole('textbox', { name: /^FYP hủy/ });
  await expect(fyp).toBeDisabled();
  await expect(fyp).toHaveValue('60,000,000 VNĐ');
  // Cancelled in another month than the issue: the issue month keeps its numbers.
  const effect = dialog.getByRole('definition');
  await expect(effect.locator('span')).toHaveText([
    /^Doanh số tháng 09\/2026 của RM .+ giảm 60 tr$/,
    'tháng 09/2026: +1 HĐ hủy',
  ]);
  await expect(effect).toContainText(
    'HĐ phát hành tháng 08/2026 vẫn tính phát hành vào tháng 08/2026: số của tháng đó không đổi.',
  );

  // A wrong day: the sentence of the command's code, the button off, no numbers (#states).
  const confirm = dialog.getByRole('button', { name: 'Hủy HĐ', exact: true });
  await day.fill('24/8');
  await expect(day).toHaveAccessibleDescription('Ngày hủy trước ngày phát hành 25/08/2026.');
  await expect(confirm).toBeDisabled();
  await expect(effect).toHaveCount(0);
  await day.fill('16/9');
  await expect(day).toHaveAccessibleDescription(
    'Ngày này sau hôm nay. Ngày của năm trước: gõ đủ dd/mm/yyyy.',
  );
  await expect(confirm).toBeDisabled();
  await day.fill('15/9');
  await confirm.click();
  await expect(dialog).toBeHidden();

  // The toast, in the polite live region a screen reader reads out (VA3b).
  await expect(page.locator('[aria-live="polite"]').filter({ hasText: 'Đã hủy HĐ' })).toHaveText(
    /^Đã hủy HĐ · Doanh số tháng 09\/2026 của RM .+ giảm 60 tr · bỏ hủy ở nút Sửa$/,
  );
  await expect(row).toContainText('Đã hủy 15/09/2026');
  await expect(row.getByRole('button')).toHaveText(['Sửa']);
  // Every policy of the customer cancelled: no "Đã có HĐ", on the profile or its card (#count).
  await expect(card).toContainText('0 HĐ · 1 đã hủy');
  await expect(header).toContainText('Chưa có HĐ');
  await gotoScreen(page, '/#/customers');
  const kanbanCard = page.getByRole('link', { name: new RegExp(name) });
  await expect(kanbanCard).not.toContainText('HĐ');
  await kanbanCard.click();

  // A submitted policy has no "Hủy HĐ", and counts.
  await addPolicy(page, '10/09', '40tr');
  const submitted = card.getByRole('listitem').filter({ hasText: 'Nộp 10/09 · 40 tr' });
  await expect(submitted.getByRole('button')).toHaveText(['Phát hành', 'Sửa']);
  await expect(card).toContainText('1 HĐ · 1 đã hủy');
  await expect(header).toContainText('Đã có HĐ (1)');
});

// DR6-38 for the cancel dialog: today filled in as dd/mm reads in the year the dialog opened in.
test('a policy cancelled across New Year keeps the day the dialog showed (B2)', async ({
  page,
}) => {
  await createKycCustomer(page, 'Hà Giao Thừa');
  await addPolicy(page, '10/09', '317tr', '10/09');
  const row = page.getByRole('region', { name: 'Hợp đồng', exact: true }).getByRole('listitem');

  // Opened at 23:58 on 31/12/2026, saved past midnight.
  await toNewYearsEve(page);
  await row.getByRole('button', { name: /^Hủy HĐ nộp/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Hủy HĐ' });
  await expect(dialog.getByRole('textbox', { name: /^Ngày hủy/ })).toHaveValue('31/12');
  await page.clock.fastForward(3 * 60_000);
  await dialog.getByRole('button', { name: 'Hủy HĐ', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(row).toContainText('Đã hủy 31/12/2026');
});

// B2, mockup huy-hd.html #edit; golden chi-so.md mục 4.4 points 4, 5.
test('8d of a cancelled policy: Bỏ hủy until Hoàn lại, then Lưu; the issue stays before it (B2)', async ({
  page,
}) => {
  const name = 'Hà Bỏ Hủy';
  await createKycCustomer(page, name);
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await addPolicy(page, '20/08', '60tr', '25/08');
  const row = card.getByRole('listitem').filter({ hasText: 'Nộp 20/08 · 60 tr' });
  await row.getByRole('button', { name: /^Hủy HĐ nộp/ }).click();
  let dialog = page.getByRole('dialog', { name: 'Hủy HĐ' });
  await dialog.getByRole('textbox', { name: /^Ngày hủy/ }).fill('10/9');
  await dialog.getByRole('button', { name: 'Hủy HĐ', exact: true }).click();
  await expect(row).toContainText('Đã hủy 10/09/2026');

  const edit = row.getByRole('button', { name: /^Sửa HĐ nộp 20\/08\/2026/ });
  await edit.click();
  dialog = page.getByRole('dialog', { name: `Sửa HĐ · ${name}` });
  await expect(dialog).toContainText('Đã hủy 10/09/2026');
  const day = dialog.getByRole('textbox', { name: /^Ngày hủy/ });
  await expect(day).toHaveValue('10/09');
  const save = dialog.getByRole('button', { name: 'Lưu', exact: true });
  // The issue is neither cleared nor moved past the cancellation: the sentence says how.
  const issued = dialog.getByRole('textbox', { name: /^Ngày phát hành/ });
  await issued.fill('12/9');
  await expect(issued).toHaveAccessibleDescription(
    '12/09/2026 sau ngày hủy 10/09/2026. Bỏ hủy trước, hoặc sửa ngày hủy.',
  );
  await issued.fill('');
  await save.click();
  await expect(dialog.getByRole('alert')).toContainText('Chưa lưu được — 1 ô cần sửa');
  await expect(issued).toHaveAccessibleDescription(
    'HĐ đã hủy phải có ngày phát hành. Muốn xóa ngày phát hành: bỏ hủy trước.',
  );
  await issued.fill('25/8');

  // Bỏ hủy shows the numbers coming back; Hoàn lại before Lưu changes nothing.
  await dialog.getByRole('button', { name: 'Bỏ hủy' }).click();
  const effect = dialog.getByRole('definition');
  await expect(effect.locator('span')).toHaveText([
    /^Doanh số tháng 09\/2026 của RM .+ tăng 60 tr$/,
    'tháng 09/2026: −1 HĐ hủy',
  ]);
  await expect(effect).toContainText('HĐ trở lại Đã phát hành. App không giữ dấu vết lần hủy này.');
  await dialog.getByRole('button', { name: 'Hoàn lại 10/09/2026' }).click();
  await expect(day).toHaveValue('10/09');
  await expect(effect).toHaveCount(0);
  await save.click();
  await expect(dialog).toBeHidden();
  await expect(row).toContainText('Đã hủy 10/09/2026');

  // Bỏ hủy, then Lưu: issued again, counted again.
  await edit.click();
  await dialog.getByRole('button', { name: 'Bỏ hủy' }).click();
  await save.click();
  await expect(dialog).toBeHidden();
  await expect(row).toContainText('Đã phát hành');
  await expect(row.getByRole('button')).toHaveText(['Hủy HĐ', 'Sửa']);
  await expect(card.getByText('1 HĐ', { exact: true })).toBeVisible();
});
