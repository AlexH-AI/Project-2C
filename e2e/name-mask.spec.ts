import { maskName } from '../apps/desktop/src/shell/name-mask';
import { expect, test, type Page } from './fixtures';
import {
  addKycNote,
  asExe,
  createKycCustomer,
  discoveryFacts,
  fullNamesShown,
  lowestContrast,
  markOs,
  panelOf,
  seededNames,
  setTransparency,
} from './support';

// VA6a (mockup app-shell.html #privacy): the eye of the toolbar masks the names of customers, as
// their first letters, and what was typed or written by the AI about one, as dots, on Khách hàng
// and the profile. Codes, RM and team names, stages and numbers stay.

const eye = (page: Page) =>
  page.getByRole('banner').getByRole('button', { name: 'Che tên khách hàng' });

const toastOf = (page: Page, text: string) =>
  page.locator('[aria-live="polite"]').filter({ hasText: text });

const column = (page: Page, stage: string) =>
  page.getByRole('region', { name: stage, exact: true });

/** Text the mask hides: the dots on screen, "đã ẩn" for a screen reader. */
const HIDDEN = '•••đã ẩn';

// --accent: the gold of the button once on.
const ACCENT = 'rgb(217, 178, 106)';
const ACCENT_SOFT = 'rgba(217, 178, 106, 0.14)';
// --info: the (i) of the toast.
const INFO = 'rgb(111, 168, 255)';

test('the eye is first on the right of the toolbar on every screen', async ({ page }) => {
  await page.goto('/#/overview');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
  const screens = ['Tổng quan', 'Lịch hẹn', 'Khách hàng', 'Báo cáo', 'Team & nhân sự', 'Cài đặt'];
  for (const screen of screens) {
    await nav.getByRole('link', { name: screen }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen);
    await expect(page.getByRole('banner').getByRole('button').first()).toHaveAccessibleName(
      'Che tên khách hàng',
    );
  }
});

test('on: first letters on Khách hàng, codes and RM as they were, a gold button, a toast, kept after a reload; off: names back', async ({
  page,
}) => {
  await page.goto('/#/customers');
  const card = column(page, 'N3').getByRole('link').first();
  const closed = column(page, 'Mất cơ hội').getByRole('link').first();
  const [cardName, closedName] = await Promise.all([
    card.locator('b').textContent(),
    closed.textContent(),
  ]);
  await page.getByRole('radio', { name: 'Bảng' }).click();
  const row = page.getByRole('table', { name: 'Khách hàng' }).getByRole('row').nth(1);
  const [code = '', name = '', , rm = ''] = await row.getByRole('cell').allTextContents();
  expect(code).toMatch(/^K-/);

  await eye(page).click();
  await expect(eye(page)).toHaveAttribute('aria-pressed', 'true');
  await expect(eye(page)).toHaveText('Đang che tên');
  await expect(eye(page)).toHaveCSS('color', ACCENT);
  await expect(eye(page)).toHaveCSS('background-color', ACCENT_SOFT);
  const on = toastOf(page, 'Đang che tên khách hàng');
  await expect(on).toHaveText('Đang che tên khách hàng · bấm lại nút con mắt để hiện');
  await expect(on.locator('svg').first()).toHaveCSS('color', INFO);
  // The table: the name as its first letters, its code, stage and RM as they were.
  await expect(row.getByRole('cell')).toContainText([code, maskName(name), rm]);
  await expect(row).not.toContainText(name);
  // The kanban: a card of an open stage, a row of a closed one.
  await page.getByRole('radio', { name: 'Kanban' }).click();
  await expect(card.locator('b')).toHaveText(maskName(cardName!));
  await expect(card).toContainText(/RM \S/);
  await expect(closed).toHaveText(maskName(closedName!));
  // Remembered when the app opens again; the web build reseeds the same data on a reload.
  await page.reload();
  await expect(eye(page)).toHaveText('Đang che tên');
  await expect(card.locator('b')).toHaveText(maskName(cardName!));

  await eye(page).click();
  await expect(eye(page)).toHaveAttribute('aria-pressed', 'false');
  await expect(eye(page)).toHaveText('');
  await expect(toastOf(page, 'Đã hiện lại tên khách hàng')).toBeVisible();
  await expect(card.locator('b')).toHaveText(cardName!);
  await expect(closed).toHaveText(closedName!);
  await page.reload();
  await expect(eye(page)).toHaveAttribute('aria-pressed', 'false');
  await expect(card.locator('b')).toHaveText(cardName!);
});

test('the gold button reads at AA on both systems, the macOS glass too', async ({ page }) => {
  await asExe(page);
  await page.goto('/#/customers');
  await setTransparency(page, 'no-preference');
  await eye(page).click();
  await expect(eye(page)).toHaveText('Đang che tên');
  for (const os of ['win', 'mac'] as const) {
    await markOs(page, os);
    expect(await lowestContrast(eye(page)), os).toBeGreaterThanOrEqual(4.5);
  }
  // The toolbar of the macOS exe over the glass at its brightest (shell.spec.ts, PR 1414).
  await page.evaluate(() => {
    document.getElementById('exe-window-stand-in')?.remove();
    document.documentElement.dataset.backdrop = 'glass';
    document.documentElement.style.backgroundColor = 'rgb(80, 83, 91)';
  });
  expect(await lowestContrast(eye(page)), 'mac glass').toBeGreaterThanOrEqual(4.5);
});

test('the profile and its dialogs: the name as first letters, the code whole, a field typed in kept', async ({
  page,
}) => {
  const name = 'Trịnh Minh Anh';
  await createKycCustomer(page, name);
  const profile = page.getByRole('region', { name });
  const facts = (await profile.getByRole('paragraph').textContent()) ?? '';
  const code = facts.match(/K-\w+/)?.[0] ?? '';
  expect(code).not.toBe('');

  await eye(page).click();
  const masked = page.getByRole('region', { name: 'T. M. A.' });
  await expect(masked.getByRole('heading', { level: 2 })).toHaveText('T. M. A.');
  // Code, gender, birth, RM, team, policies: as they were.
  await expect(masked.getByRole('paragraph')).toHaveText(facts);
  await expect(page.getByRole('main')).not.toContainText(name);

  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  const edit = page.getByRole('dialog', { name: 'Sửa hồ sơ · T. M. A.' });
  // The field being typed in shows what is typed (Issue #1391, "Không che").
  await expect(edit.getByRole('textbox', { name: 'Họ tên' })).toHaveValue(name);
  await edit.getByRole('button', { name: 'Hủy' }).click();
  await page.getByRole('button', { name: 'Chuyển nhóm' }).click();
  await expect(page.getByRole('dialog', { name: 'Chuyển nhóm · T. M. A.' })).toContainText(code);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  await expect(page.getByRole('dialog', { name: 'Ghi chú KYC · T. M. A.' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  const policy = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await expect(policy).toContainText(`T. M. A. · ${code}`);
  await expect(policy).not.toContainText(name);
  await page.keyboard.press('Escape');
  await expect(policy).toBeHidden();
});

test('what was typed or written by the AI shows as dots: a note, a trigger, KYC facts in words, AI', async ({
  page,
}) => {
  const name = 'Hoa Che Tên';
  await createKycCustomer(page, name);
  // A note the AI proposes facts from, before they are known.
  const note = 'Hai vợ chồng đã kết hôn, có 2 con đang học cấp 1.';
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const writing = page.getByRole('dialog', { name: `Ghi chú KYC · ${name}` });
  await writing.getByRole('textbox', { name: 'Ghi chú' }).fill(note);
  await writing.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(writing).toBeHidden();
  const timeline = page.getByRole('region', { name: 'Dòng thời gian' });
  const noted = timeline.getByRole('listitem').filter({ hasText: note });
  await noted.getByRole('button', { name: 'AI trích xuất' }).click();
  const proposals = page.getByRole('list', { name: 'Đề xuất của AI' }).getByRole('listitem');
  await expect(proposals).toHaveCount(2);
  // What the AI proposes and quotes: a value in words and the quote as dots, a number as it is.
  // Proposed facts confirmed later leave the list, so they are looked at now.
  await eye(page).click();
  await expect(proposals).toHaveText([
    /^AI đề xuất: Tình trạng hôn nhân: ••• \("•••"\)/,
    /^AI đề xuất: Số con: 2 \("•••"\)/,
  ]);
  await eye(page).click();
  await expect(proposals.first()).toContainText('Đã kết hôn');
  // Facts in words and numbers, and an analysis of them.
  await addKycNote(page, name, discoveryFacts);
  const panel = panelOf(page);
  await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
  const hypotheses = panel.getByRole('region', { name: 'Behavioral Hypotheses' });
  const item = hypotheses.getByRole('listitem').first();
  const said = (await item.textContent()) ?? '';
  // A trigger described.
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const booking = page.getByRole('dialog');
  await booking.getByRole('textbox', { name: /^Ngày/ }).fill('20/9');
  await booking.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await booking
    .getByRole('textbox', { name: /^Mô tả trigger/ })
    .fill('Giới thiệu từ KH Phạm Gia Long');
  await booking.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(booking).toHaveCount(0);

  await eye(page).click();
  const kyc = page.getByRole('region', { name: 'Dữ kiện KYC' });
  await expect(kyc).toContainText('Nghề nghiệp: •••');
  await expect(kyc).toContainText('Tình trạng hôn nhân: •••');
  // Numbers, and what the profile wrote, stay.
  await expect(kyc).toContainText('Số con: 2');
  await expect(kyc).toContainText('Năm sinh: 1984');
  await expect(timeline).toContainText('Trigger: •••');
  await expect(timeline).not.toContainText('Phạm Gia Long');
  await expect(timeline.getByRole('blockquote')).toContainText([HIDDEN, HIDDEN]);
  await expect(timeline).toContainText('Hồ sơ KH: năm sinh 1984');
  await expect(timeline).not.toContainText(note);
  await expect(item).toContainText(HIDDEN);
  await expect(item).not.toContainText(said.slice(0, 20));
  // A trường's current value, said in a new note's dialog: dots too.
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const another = page.getByRole('dialog', { name: 'Ghi chú KYC · H. C. T.' });
  await another.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Nghề nghiệp' });
  await expect(another).toContainText('Đang có: •••');
  await expect(another).not.toContainText('Bác sĩ');
  await page.keyboard.press('Escape');
});

test('masked, no full name of a seeded customer is left on Khách hàng and on profiles, nor what was typed', async ({
  page,
}) => {
  test.setTimeout(120_000);
  // Every customer of the seed, Khách hàng left as a table with all its rows.
  const names = await seededNames(page);
  expect(names.length).toBeGreaterThan(500);
  const typed: string[] = [];

  await eye(page).click();
  expect(await fullNamesShown(page, names)).toEqual([]);
  await page.getByRole('radio', { name: 'Kanban' }).click();
  expect(await fullNamesShown(page, names)).toEqual([]);
  for (const stage of ['N4', 'N3', 'N2', 'N1', 'Tạm hoãn']) {
    await column(page, stage).getByRole('link').first().click();
    await expect(page.getByRole('region', { name: 'Dòng thời gian' })).toBeVisible();
    expect(await fullNamesShown(page, names), stage).toEqual([]);
    // The notes of its meetings as typed, read with the mask off: gone with it on.
    await eye(page).click();
    const notes = await page
      .getByRole('table', { name: 'Lịch hẹn' })
      .evaluate((element: HTMLTableElement) =>
        [...element.tBodies[0]!.rows].map((row) => row.cells[2]?.innerText ?? ''),
      );
    typed.push(...notes.filter(Boolean));
    await eye(page).click();
    expect(await fullNamesShown(page, notes.filter(Boolean)), stage).toEqual([]);
    await page.goto('/#/customers');
  }
  expect(typed.length, 'notes seen on the profiles').toBeGreaterThan(0);
});
