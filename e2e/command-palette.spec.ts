import { maskName } from '../apps/desktop/src/shell/name-mask';
import { expect, test, type Page } from './fixtures';
import { pickPeriodKind, pressButton } from './support';

// VA8 (mockup search-rm-team.html #palette): the command bar, on every screen by ⌘K on macOS and
// Ctrl K on Windows, or the magnifier of the toolbar on both. Four groups: customers, RMs, screens
// and commands; ↑ ↓ pick, Enter opens, Esc or a press on what is dimmed closes.

/** ⌘K on macOS (the WebKit project runs on a Mac), Ctrl K on Windows. */
const paletteKey = (browserName: string) => (browserName === 'webkit' ? 'Meta+k' : 'Control+k');

const palette = (page: Page) => page.getByRole('dialog', { name: 'Ô lệnh' });
const field = (page: Page) => palette(page).getByRole('combobox', { name: 'Ô lệnh' });
const options = (page: Page) => palette(page).getByRole('option');
const magnifier = (page: Page) =>
  page.getByRole('banner').getByRole('button', { name: /^Tìm hay chạy lệnh/ });

/** A name as one types it with no accents (`searchText` reads it the same). */
const plain = (name: string) =>
  name.normalize('NFD').replace(/\p{M}/gu, '').replace(/[đĐ]/g, 'd').toLowerCase();

/** Types `text` in the bar, then ↓ to the option that holds `name` and Enter. */
async function open(page: Page, text: string, name: string | RegExp) {
  await field(page).fill(text);
  await expect(options(page).filter({ hasText: name }).first()).toBeVisible();
  const all = await options(page).allTextContents();
  const at = all.findIndex((option) =>
    typeof name === 'string' ? option.includes(name) : name.test(option),
  );
  expect(at, `${String(name)} among ${all.join(' | ')}`).toBeGreaterThanOrEqual(0);
  for (let step = 0; step < at; step += 1) await field(page).press('ArrowDown');
  await expect(options(page).nth(at)).toHaveAttribute('aria-selected', 'true');
  await field(page).press('Enter');
  await expect(palette(page)).toBeHidden();
}

/** The first customer of the N3 column of Khách hàng: its name and its RM. */
async function aCustomer(page: Page) {
  await page.goto('/#/customers');
  const card = page.getByRole('region', { name: 'N3', exact: true }).getByRole('link').first();
  const name = (await card.locator('b').textContent())!.trim();
  return name;
}

test('⌘K / Ctrl K opens the bar on every screen, a field being typed in too; again closes it', async ({
  page,
  browserName,
}) => {
  await page.goto('/#/overview');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
  for (const screen of [
    'Tổng quan',
    'Lịch hẹn',
    'Khách hàng',
    'Báo cáo',
    'Team & nhân sự',
    'Cài đặt',
  ]) {
    await nav.getByRole('link', { name: screen }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen);
    await page.keyboard.press(paletteKey(browserName));
    await expect(field(page)).toBeFocused();
    // Nothing typed: the screens and the first commands.
    await expect(palette(page).getByRole('group')).toHaveText([/^Đi tới/, /^Lệnh/]);
    await page.keyboard.press(paletteKey(browserName));
    await expect(palette(page)).toBeHidden();
  }

  // In the search of Khách hàng: the key opens the bar, and Esc gives the focus back to the field,
  // what was typed there kept.
  await nav.getByRole('link', { name: 'Khách hàng' }).click();
  const search = page.getByRole('combobox', { name: 'Tìm khách hàng' });
  await search.fill('abc');
  await search.press(paletteKey(browserName));
  await expect(field(page)).toBeFocused();
  await field(page).press('Escape');
  await expect(palette(page)).toBeHidden();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('abc');
});

test('the magnifier of the toolbar opens the bar; a press on what is dimmed closes it, the focus back on the magnifier', async ({
  page,
}) => {
  await page.goto('/#/reports');
  await expect(magnifier(page)).toHaveAccessibleName(/^Tìm hay chạy lệnh \((⌘|Ctrl\+)K\)$/);
  await pressButton(magnifier(page));
  await expect(field(page)).toBeFocused();
  // Outside the box of the bar, on what it dims.
  await page.mouse.click(12, 400);
  await expect(palette(page)).toBeHidden();
  await expect(magnifier(page)).toBeFocused();
});

test('the eye and the magnifier are the same icon button of packages/ui', async ({ page }) => {
  await page.goto('/#/overview');
  const eye = page.getByRole('banner').getByRole('button', { name: 'Che tên khách hàng' });
  const look = (button: typeof eye) =>
    button.evaluate((node) => {
      const style = getComputedStyle(node);
      const { width, height } = node.getBoundingClientRect();
      return [width, height, style.borderRadius, style.backgroundColor, style.boxShadow];
    });
  expect(await look(magnifier(page))).toEqual(await look(eye));
  expect((await look(eye)).slice(0, 2)).toEqual([34, 34]);
});

test('↓ Enter opens a customer, an RM, a screen; a command runs', async ({ page, browserName }) => {
  const name = await aCustomer(page);
  await page.keyboard.press(paletteKey(browserName));
  await open(page, plain(name), name);
  await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible();

  // An RM: the first of the group for a syllable many names have.
  await page.keyboard.press(paletteKey(browserName));
  await field(page).fill('nguyen');
  const rm = palette(page).getByRole('group', { name: 'RM' }).getByRole('option').first();
  const rmName = (await rm.locator('b').textContent())!;
  await open(page, 'nguyen', new RegExp(`^RM ${rmName}`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(rmName);

  await page.keyboard.press(paletteKey(browserName));
  await open(page, 'bao cao', /^Báo cáoMàn/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Báo cáo');

  await page.keyboard.press(paletteKey(browserName));
  await open(page, 'che', 'Che / hiện tên khách hàng');
  const eye = page.getByRole('banner').getByRole('button', { name: 'Che tên khách hàng' });
  await expect(eye).toHaveAttribute('aria-pressed', 'true');
});

// The list is 470 px at most: ↑ ↓ bring the option picked into view of it, as `move()` of the
// mockup does (ui2.js), ↑ from the first going round to the last.
test('↑ ↓ keep the option picked in view of the list', async ({ page, browserName }) => {
  await page.goto('/#/overview');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan');
  await page.keyboard.press(paletteKey(browserName));
  await field(page).fill('n');
  const list = palette(page).getByRole('listbox');
  expect(
    await list.evaluate((node) => node.scrollHeight > node.clientHeight + 200),
    'the options of "n" run far past the list',
  ).toBe(true);
  const picked = palette(page).getByRole('option', { selected: true });
  await field(page).press('ArrowUp');
  await expect(options(page).last()).toHaveAttribute('aria-selected', 'true');
  await expect(picked).toBeInViewport({ ratio: 0.95 });
  await field(page).press('ArrowDown');
  await expect(options(page).first()).toHaveAttribute('aria-selected', 'true');
  await expect(picked).toBeInViewport({ ratio: 0.95 });
  const count = await options(page).count();
  for (let step = 1; step < count; step += 1) {
    await field(page).press('ArrowDown');
    await expect(options(page).nth(step)).toHaveAttribute('aria-selected', 'true');
    await expect(picked).toBeInViewport({ ratio: 0.95 });
  }
});

test('a command opens its dialog on its screen, from another screen or its own', async ({
  page,
  browserName,
}) => {
  await page.goto('/#/overview');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan');
  for (const [text, command, screen, dialog] of [
    ['lich hen moi', 'Lịch hẹn mới…', 'Lịch hẹn', 'Lịch hẹn mới'],
    ['khach hang moi', 'Khách hàng mới…', 'Khách hàng', 'Khách hàng mới'],
    ['team moi', 'Team mới…', 'Team & nhân sự', 'Team mới'],
  ] as const) {
    // Twice: from the screen before, then from its own screen.
    for (let again = 0; again < 2; again += 1) {
      await page.keyboard.press(paletteKey(browserName));
      await open(page, text, command);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen);
      const box = page.getByRole('dialog', { name: dialog });
      await expect(box).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(box).toBeHidden();
    }
  }
});

test('Sao lưu ngay exports a backup in Dữ liệu, from AI of Cài đặt too; Xuất Excel exports this month', async ({
  page,
  browserName,
}) => {
  await page.goto('/#/settings');
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'AI' })
    .click();
  await page.keyboard.press(paletteKey(browserName));
  const backup = page.waitForEvent('download');
  await open(page, 'backup', 'Sao lưu ngay');
  const file = await backup;
  await expect(
    page.getByRole('region', { name: 'Xuất / nhập backup' }).getByRole('status'),
  ).toHaveText(
    new RegExp(`^Đã xuất backup: ${file.suggestedFilename().replaceAll('.', '\\.')} · `),
  );

  // From Báo cáo on another period: the month of today comes back, then its file.
  await page.goto('/#/reports');
  await pickPeriodKind(page, 'Năm');
  await page.keyboard.press(paletteKey(browserName));
  const report = page.waitForEvent('download');
  await open(page, 'xuat file', /^Xuất Excel Báo cáo tháng 09\/2026/);
  expect((await report).suggestedFilename()).toBe('bao-cao_2026-09_toan-bo_2026-09-15.xlsx');
  await expect(page.getByRole('status').filter({ hasText: 'Đã xuất báo cáo' })).toHaveText(
    'Đã xuất báo cáo · 4 sheet: bao-cao_2026-09_toan-bo_2026-09-15.xlsx',
  );
});

test('"xyz" finds nothing; masked, a customer is found by the real name and shown masked', async ({
  page,
  browserName,
}) => {
  const name = await aCustomer(page);
  await page.keyboard.press(paletteKey(browserName));
  await field(page).fill('xyz');
  await expect(options(page)).toHaveCount(0);
  await expect(palette(page).getByRole('status')).toContainText(
    'Không có KH, RM, màn hay lệnh nào khớp "xyz"',
  );
  await field(page).press('Escape');

  await page.getByRole('banner').getByRole('button', { name: 'Che tên khách hàng' }).click();
  await page.keyboard.press(paletteKey(browserName));
  await field(page).fill(plain(name));
  const group = palette(page).getByRole('group', { name: 'Khách hàng' });
  await expect(group.getByRole('option').first()).toContainText(maskName(name));
  await expect(group).not.toContainText(name);
});
