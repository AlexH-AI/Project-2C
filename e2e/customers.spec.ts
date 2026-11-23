import { expect, test, type Page } from './fixtures';
import {
  asExe,
  lowestContrast,
  markOs,
  pickFirstRm,
  pickScope,
  scopePill,
  setTransparency,
} from './support';

const OPEN = ['N4', 'N3', 'N2', 'N1'];
const CLOSED = ['Tạm hoãn', 'Mất cơ hội'];

const column = (page: Page, stage: string) =>
  page.getByRole('region', { name: stage, exact: true });

/** "884 KH đang mở · 316 đã đóng" → [884, 316]. */
async function summary(page: Page): Promise<[number, number]> {
  const text = await page.getByText(/KH đang mở/).textContent();
  const [open = NaN, closed = NaN] = (text?.match(/\d+/g) ?? []).map(Number);
  return [open, closed];
}

/** The count in each column head, in the order given. */
const counts = (page: Page, stages: string[]) =>
  Promise.all(
    stages.map(async (stage) =>
      Number(
        (await column(page, stage).locator('> div > span').last().textContent())?.replace(
          /\./g,
          '',
        ),
      ),
    ),
  );

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

test.beforeEach(async ({ page }) => {
  await page.goto('/#/customers');
  await expect(page.getByText(/KH đang mở/)).toBeVisible();
});

test('the kanban shows N4 → N1 and the closed stages, adding up to the summary', async ({
  page,
}) => {
  const [open, closed] = await summary(page);
  expect(open).toBeGreaterThan(0);
  expect(closed).toBeGreaterThan(0);
  expect(sum(await counts(page, OPEN))).toBe(open);
  expect(sum(await counts(page, CLOSED))).toBe(closed);

  for (const stage of OPEN) {
    await expect(column(page, stage).getByRole('link')).toHaveCount(6);
  }
});

test('the scope narrows the customers to one team, then to one RM', async ({ page }) => {
  const [allOpen] = await summary(page);

  await pickScope(page, { team: 'Sao Mai' });
  await expect.poll(async () => (await summary(page))[0]).toBeLessThan(allOpen);
  const [teamOpen] = await summary(page);

  await pickFirstRm(page, 'Sao Mai');
  await expect.poll(async () => (await summary(page))[0]).toBeLessThan(teamOpen);
  await page.getByRole('radio', { name: 'Bảng' }).click();
  // The pill of the scope names the RM alone.
  const rmName = (await scopePill(page).textContent()) ?? '';
  const rows = page.getByRole('table').getByRole('row');
  const [rmOpen, rmClosed] = await summary(page);
  await expect(rows).toHaveCount(1 + rmOpen + rmClosed);
  await expect(rows.nth(1).getByRole('cell').nth(3)).toHaveText(rmName);
});

// The table of an RM with no customer yet keeps its seven columns over the note saying so
// (components.html 09, PR #1406).
test('the table of an RM with no customer says so under its columns', async ({ page }) => {
  const rm = 'Lý Chưa Có Khách';
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Team & nhân sự' })
    .click();
  await page.getByRole('button', { name: '+ Nhân sự' }).click();
  const person = page.getByRole('dialog', { name: 'Nhân sự mới' });
  await person.getByRole('textbox', { name: 'Họ tên' }).fill(rm);
  await person.getByRole('radio', { name: 'RM', exact: true }).check();
  await person.getByRole('combobox', { name: 'Team' }).selectOption({ label: 'Sao Mai' });
  await person.getByRole('button', { name: 'Thêm' }).click();
  await expect(person).toBeHidden();
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Khách hàng' })
    .click();

  await pickScope(page, { team: 'Sao Mai', rm });
  await page.getByRole('radio', { name: 'Bảng' }).click();
  const table = page.getByRole('table', { name: 'Khách hàng' });
  await expect(table.getByRole('columnheader')).toHaveCount(7);
  await expect(table).toContainText('Chưa có KH nào trong góc nhìn này');
  await expect(table).toContainText('Bấm "+ Khách hàng" để thêm.');
});

test('a card opens the customer profile with its code, stage and policies', async ({ page }) => {
  const card = column(page, 'N2').getByRole('link').first();
  const name = (await card.locator('b').textContent()) ?? '';
  await card.click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ khách hàng');
  const profile = page.getByRole('region', { name });
  await expect(profile).toContainText('N2');
  await expect(profile).toContainText(/K-[0-9A-HJKMNP-TV-Z]{4} · /);
  await expect(profile).toContainText(/Đã có HĐ \(\d+\)|Chưa có HĐ/);

  await page.getByRole('link', { name: '← Khách hàng' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Khách hàng');
});

test('an unknown customer shows a message instead of a profile', async ({ page }) => {
  await page.goto('/#/customers/nobody');
  await expect(page.getByText('Không tìm thấy KH này (có thể đã bị xóa).')).toBeVisible();
});

test('the RM strip shows on the Team scope only, with the RM of the team', async ({ page }) => {
  const strip = page.getByRole('region', { name: /^RM của team/ });
  await expect(strip).toHaveCount(0);

  await pickScope(page, { team: 'Sao Mai' });
  await expect(strip).toHaveAccessibleName('RM của team Sao Mai');
  await expect(strip.getByRole('button')).toHaveCount(11);
  await expect(strip.getByRole('button', { name: /^Cả team/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByText(/KH đang mở/)).toContainText('Cả team Sao Mai');

  await pickFirstRm(page, 'Sao Mai');
  await expect(strip).toHaveCount(0);
  await pickScope(page, 'all');
  await expect(strip).toHaveCount(0);
});

test('an RM picked in the strip narrows the customers to it, until picked again', async ({
  page,
}) => {
  await pickScope(page, { team: 'Sao Mai' });
  const [teamOpen] = await summary(page);
  const strip = page.getByRole('region', { name: 'RM của team Sao Mai' });
  const chip = strip.getByRole('button').nth(1);
  const name = (await chip.locator('span').first().textContent()) ?? '';

  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText(/KH đang mở/)).toContainText(name);
  const [rmOpen] = await summary(page);
  expect(rmOpen).toBe(Number(await chip.locator('span').last().textContent()));
  expect(rmOpen).toBeLessThan(teamOpen);
  for (const stage of OPEN) {
    for (const card of await column(page, stage).getByRole('link').all()) {
      await expect(card).toContainText(`RM ${name}`);
    }
  }

  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(async () => (await summary(page))[0]).toBe(teamOpen);
});

test('another team drops the RM picked in the strip', async ({ page }) => {
  await pickScope(page, { team: 'Sao Mai' });
  await page
    .getByRole('region', { name: 'RM của team Sao Mai' })
    .getByRole('button')
    .nth(1)
    .click();

  await pickScope(page, { team: 'Bình Minh' });
  const strip = page.getByRole('region', { name: 'RM của team Bình Minh' });
  await expect(strip.getByRole('button', { pressed: true })).toHaveText(/^Cả team/);
});

// C1 (spec Phase 6 phản hồi §5; mockup search-rm-team.html #customers, #states, #ask 6): the
// search of Khách hàng lights what it finds on the board and lists it under the field.
const field = (page: Page) => page.getByRole('combobox', { name: 'Tìm khách hàng' });
const list = (page: Page) => page.getByRole('listbox', { name: 'KH khớp' });
const cards = (page: Page, stage: string) => column(page, stage).getByRole('link');

/** A customer of N3 past the six cards its column shows, read from the table: name and code. */
async function pastTheColumn(page: Page): Promise<{ name: string; code: string }> {
  const shown = new Set(await cards(page, 'N3').locator('b').allTextContents());
  expect(shown.size).toBeGreaterThan(0);
  await page.getByRole('radio', { name: 'Bảng' }).click();
  const table = page.getByRole('table', { name: 'Khách hàng' });
  for (;;) {
    const rows = await table.evaluate((t: HTMLTableElement) =>
      [...t.tBodies[0]!.rows].map((row) => [...row.cells].slice(0, 3).map((c) => c.innerText)),
    );
    const row = rows.find(([, name, stage]) => stage === 'N3' && !shown.has(name ?? ''));
    if (row) {
      await page.getByRole('radio', { name: 'Kanban' }).click();
      return { code: row[0] ?? '', name: row[1] ?? '' };
    }
    await page.getByRole('button', { name: /^Hiện thêm/ }).click();
  }
}

test('the search lights a match at the top of its column, one past "+ n KH" too; Esc clears it', async ({
  page,
}) => {
  const { name, code } = await pastTheColumn(page);
  await expect(cards(page, 'N3')).toHaveCount(6);

  await field(page).fill(code);
  await expect(cards(page, 'N3')).toHaveCount(7);
  await expect(cards(page, 'N3').first().locator('b')).toHaveText(name);
  await expect(cards(page, 'N3').first()).toHaveCSS('opacity', '1');
  // The others dim and keep their place.
  await expect(cards(page, 'N3').nth(1)).toHaveCSS('opacity', '0.7');
  await expect(cards(page, 'N2').first()).toHaveCSS('opacity', '0.7');
  await expect(column(page, 'N3')).toContainText('1 khớp');
  await expect(column(page, 'N2')).toContainText('0 khớp');
  await expect(list(page).getByRole('option')).toHaveCount(1);
  await expect(list(page).getByRole('option')).toContainText(name);
  await expect(list(page).getByRole('option')).toContainText(code);
  // The sum of the columns still adds up to the summary.
  const [open] = await summary(page);
  expect(sum(await counts(page, OPEN))).toBe(open);

  await field(page).press('Escape');
  await expect(field(page)).toHaveValue('');
  await expect(list(page)).toHaveCount(0);
  for (const stage of OPEN) {
    await expect(cards(page, stage)).toHaveCount(6);
    await expect(column(page, stage)).not.toContainText('khớp');
    await expect(cards(page, stage).first()).toHaveCSS('opacity', '1');
  }
});

test('↓ Enter on the list opens the customer picked', async ({ page }) => {
  await field(page).fill('nguyen');
  const options = list(page).getByRole('option');
  await expect(options).toHaveCount(8);
  await expect(field(page)).toHaveAttribute('aria-expanded', 'true');
  await field(page).press('ArrowDown');
  const picked = list(page).locator(
    `[id="${await field(page).getAttribute('aria-activedescendant')}"]`,
  );
  await expect(picked).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  const name = (await picked.locator('b').textContent()) ?? '';
  expect(name).toMatch(/^Nguyễn /);

  await field(page).press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ khách hàng');
  await expect(page.getByRole('region', { name })).toBeVisible();
});

test('a customer out of the view is listed apart and opens, the board keeping its view', async ({
  page,
}) => {
  await pickScope(page, { team: 'Bình Minh' });
  await page.getByRole('radio', { name: 'Bảng' }).click();
  const cells = page.getByRole('table', { name: 'Khách hàng' }).locator('tbody tr').first();
  const code = await cells.getByRole('cell').nth(0).innerText();
  const name = await cells.getByRole('cell').nth(1).innerText();
  await pickScope(page, { team: 'Sao Mai' });
  await page.getByRole('radio', { name: 'Kanban' }).click();

  await field(page).fill(code);
  const outside = list(page).getByRole('group', { name: /^Ngoài góc nhìn/ });
  await expect(outside.getByRole('option')).toHaveCount(1);
  await expect(outside.getByRole('option')).toContainText(name);
  await expect(outside.getByRole('option')).toContainText('Bình Minh');
  await expect(list(page).getByRole('group', { name: /^Trong góc nhìn/ })).toHaveCount(0);
  for (const stage of OPEN) await expect(column(page, stage)).toContainText('0 khớp');

  await outside.getByRole('option').click();
  await expect(page.getByRole('region', { name })).toBeVisible();
  await page.getByRole('link', { name: '← Khách hàng' }).click();
  await expect(scopePill(page)).toHaveAccessibleName(/Sao Mai/);
});

test('a search that finds no customer says so, with "Bỏ tìm" and no button to add one', async ({
  page,
}) => {
  await field(page).fill('tran van xyzq');
  const note = page.getByRole('status').filter({ hasText: 'Không có KH nào khớp "tran van xyzq"' });
  await expect(note).toBeVisible();
  await expect(note.getByRole('button')).toHaveText(['Bỏ tìm']);
  await expect(column(page, 'N3')).toHaveCount(0);

  await note.getByRole('button', { name: 'Bỏ tìm' }).click();
  await expect(field(page)).toHaveValue('');
  await expect(field(page)).toBeFocused();
  await expect(cards(page, 'N3')).toHaveCount(6);
});

test('a dimmed card and a dimmed closed row read at AA on both systems, the macOS glass too', async ({
  page,
}) => {
  await asExe(page);
  await page.reload(); // the exe of asExe: beforeEach opened the page before it
  await setTransparency(page, 'no-preference');
  const name = (await cards(page, 'N3').first().locator('b').textContent()) ?? '';
  await field(page).fill(name);
  await expect(column(page, 'N3')).toContainText('khớp');
  // The name and the second line of a card, its "n HĐ", the name and the day of a closed row.
  const dimmed = [
    cards(page, 'N4').first(),
    cards(page, 'N2').filter({ hasText: /\d HĐ/ }).first(),
    column(page, 'Tạm hoãn').getByRole('listitem').first(),
  ];
  for (const area of dimmed) await expect(area).toHaveCSS('opacity', '0.7');
  for (const os of ['win', 'mac'] as const) {
    await markOs(page, os);
    for (const area of dimmed) expect(await lowestContrast(area), os).toBeGreaterThanOrEqual(4.5);
  }
  await page.evaluate(() => {
    document.getElementById('exe-window-stand-in')?.remove();
    document.documentElement.dataset.backdrop = 'glass';
    document.documentElement.style.backgroundColor = 'rgb(80, 83, 91)';
  });
  for (const area of dimmed)
    expect(await lowestContrast(area), 'glass').toBeGreaterThanOrEqual(4.5);
});
