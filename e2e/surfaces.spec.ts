import { expect, test, type Locator, type Page } from './fixtures';
import {
  drawnCorner,
  lowestContrast,
  markOs,
  openProfile,
  pressButton,
  setTransparency,
  token,
} from './support';

// VA3a (mockup components.html 04, 05, 06): a card has no border, a table of numbers shows the row
// whose details are open, a dialog is the focus layer in three parts. ADR-0013: text at 4.5:1.
const TEXT_CONTRAST = 4.5;
const SYSTEMS = ['win', 'mac'] as const;

/**
 * `card` is drawn as a card of the system the page is marked with: material, no border. Its text
 * reads 4.5:1 on it; of a table that sorts, `text` is its rows: the arrow of a column not sorted is
 * no text, and stands out 3:1 (theme.spec.ts).
 */
async function expectCard(page: Page, card: Locator, at: string, text = card) {
  await expect(card, at).toBeVisible();
  for (const os of SYSTEMS) {
    await markOs(page, os);
    for (const side of ['top', 'right', 'bottom', 'left']) {
      await expect(card, `${at}, ${os}`).toHaveCSS(`border-${side}-width`, '0px');
    }
    await expect(card, `${at}, ${os}`).toHaveCSS('background-image', /^linear-gradient\(/);
    await expect(card, `${at}, ${os}`).not.toHaveCSS('box-shadow', 'none');
    await expect(card, `${at}, ${os}`).toHaveCSS(
      'border-radius',
      await drawnCorner(page, { win: 8, mac: 16 }),
    );
  }
  expect(await lowestContrast(text), `text of ${at}`).toBeGreaterThanOrEqual(TEXT_CONTRAST);
}

const region = (page: Page, name: string) => page.getByRole('region', { name, exact: true });

test('the cards of Tổng quan, Lịch hẹn, a profile and Cài đặt have no border, the material and the corner of a card', async ({
  page,
}) => {
  await page.goto('/');
  await expectCard(page, region(page, 'Chuyển RF'), 'a tile of Tổng quan');
  await expectCard(page, region(page, 'So sánh team'), 'a block of Tổng quan');

  await page.goto('/#/appointments');
  const list = region(page, 'Danh sách lịch hẹn');
  await expectCard(page, list, 'the list of Lịch hẹn', list.getByRole('rowgroup').last());
  expect(await lowestContrast(list.getByRole('heading'))).toBeGreaterThanOrEqual(TEXT_CONTRAST);
  await expectCard(
    page,
    page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' }),
    'the detail of Lịch hẹn',
  );

  await openProfile(page);
  await expectCard(page, region(page, 'Hợp đồng'), 'Hợp đồng of a profile');

  await page.goto('/#/settings');
  await expectCard(
    page,
    page.getByRole('navigation', { name: 'Mục cài đặt' }),
    'the sections of Cài đặt',
  );
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'Dữ liệu' })
    .click();
  await expectCard(page, region(page, 'Xuất / nhập backup'), 'a section of Cài đặt');
});

/** `colors`, each as painted on the ground of the content (--bg-0): its red, green and blue. */
const onGround = (page: Page, colors: string[]) =>
  page.evaluate((colors) => {
    const context = document
      .createElement('canvas')
      .getContext('2d', { willReadFrequently: true })!;
    const ground = getComputedStyle(document.documentElement).getPropertyValue('--bg-0');
    return colors.map((color) => {
      for (const paint of [ground, color]) {
        context.fillStyle = paint;
        context.fillRect(0, 0, 1, 1);
      }
      return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)];
    });
  }, colors);

// The material of a card is see-through, and the name column of a report stays put over figures
// that scroll under it: it is solid, in a shade the card has between its top and its bottom, so
// the column is no band of another colour (review of PR 1402).
test('the name column of a report, which stays put, is a shade of the card around it', async ({
  page,
}) => {
  await page.goto('/#/reports');
  const card = region(page, 'Theo team');
  const name = card.getByRole('rowheader').first();
  await expect(name).toHaveCSS('position', 'sticky');
  const style = (box: Locator, property: 'backgroundColor' | 'backgroundImage') =>
    box.evaluate((node, property) => getComputedStyle(node)[property], property);
  const ends = (await style(card, 'backgroundImage')).match(/rgba?\([^()]*\)/g) ?? [];
  expect(ends).toHaveLength(2);
  const [cell = [], top = [], bottom = []] = await onGround(page, [
    await style(name, 'backgroundColor'),
    ...ends,
  ]);
  expect(top).not.toEqual(bottom);
  cell.forEach((shade, channel) => {
    const [dark = 0, light = 0] = [top[channel]!, bottom[channel]!].sort((a, b) => a - b);
    expect(shade, `channel ${channel}`).toBeGreaterThanOrEqual(dark);
    expect(shade, `channel ${channel}`).toBeLessThanOrEqual(light);
  });
  // Under the light of the card as the rest of it: an index of its own would lift it above.
  await expect(name).toHaveCSS('z-index', 'auto');
});

test('the light of a card follows the pointer over it', async ({ page }) => {
  await page.goto('/#/appointments');
  const card = region(page, 'Danh sách lịch hẹn');
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;
  const light = () =>
    card.evaluate((node) => {
      const style = getComputedStyle(node);
      return [style.getPropertyValue('--mx'), style.getPropertyValue('--my')];
    });

  await page.mouse.move(box.x + box.width / 4, box.y + box.height / 2);
  const [x = 0, y = 0] = (await light()).map(parseFloat);
  expect(Math.round(x)).toBe(25);
  expect(Math.round(y)).toBe(50);
  await expect
    .poll(() => card.evaluate((node) => getComputedStyle(node, '::after').opacity))
    .toBe('1');
});

test('the row of the appointment open in Chi tiết is the current one, painted as chosen (L21)', async ({
  page,
}) => {
  await page.goto('/#/appointments');
  const table = page.getByRole('table', { name: 'Danh sách lịch hẹn' });
  const current = table.locator('tbody tr[aria-current="true"]');
  await expect(table.locator('tbody tr').first()).toBeVisible();
  await expect(current).toHaveCount(0);
  // A table of numbers: one line of heading, as written (components.html 05).
  await expect(table.getByRole('columnheader').first()).toHaveCSS('text-transform', 'none');

  const rows = table.locator('tbody tr');
  for (const index of [1, 0]) {
    const row = rows.nth(index);
    const name = (await row.getByRole('button').textContent())!;
    await row.getByRole('button').click();
    await expect(
      page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' }).getByRole('heading').first(),
    ).toContainText(name);
    await expect(current).toHaveCount(1);
    await expect(row).toHaveAttribute('aria-current', 'true');
    // The pointer off the table: the fill of a chosen row, not of a row under the pointer.
    await page.mouse.move(0, 0);
    await expect(row).toHaveCSS('background-color', 'rgba(217, 178, 106, 0.14)');
    // --text-3 is under 4.5:1 on the chosen row: what the row writes in it is --text-2 there.
    expect(await row.evaluate((node) => getComputedStyle(node).getPropertyValue('--text-3'))).toBe(
      await token(page, '--text-2'),
    );
    expect(await lowestContrast(row), `row ${index}`).toBeGreaterThanOrEqual(TEXT_CONTRAST);
  }
});

// The gold tint on the material of a card: --text-3 is under 4.5:1 there, as on the chosen row
// (ADR-0013 appendix 11/11/2026 §7; review of PR 1402).
test('what is chosen on a card reads 4.5:1 on its gold tint: the team of the list, the month of today', async ({
  page,
}) => {
  await page.goto('/#/team');
  const team = region(page, 'Team').getByRole('button', { pressed: true });
  await expect(team).toHaveCSS('background-color', 'rgba(217, 178, 106, 0.14)');
  expect(await lowestContrast(team), 'the team chosen').toBeGreaterThanOrEqual(TEXT_CONTRAST);

  await page.goto('/#/appointments');
  await page
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Năm' })
    .click();
  const month = page.getByRole('button', { name: /^Tháng 9\/2026:/ });
  await expect(month).toHaveAttribute('aria-current', 'date');
  await expect(month).toHaveCSS('background-color', 'rgba(217, 178, 106, 0.14)');
  expect(await lowestContrast(month), 'the month of today').toBeGreaterThanOrEqual(TEXT_CONTRAST);
});

/** Lịch hẹn → "+ Lịch hẹn": the form 6a, a dialog longer than a low window. */
async function openBooking(page: Page) {
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const dialog = page.getByRole('dialog', { name: 'Lịch hẹn mới' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test('a dialog is the focus layer: × and Escape close it, a click on the dimmed window does not', async ({
  page,
}) => {
  await page.goto('/#/appointments');
  const open = page.getByRole('button', { name: '+ Lịch hẹn' });

  // The see-through material, whatever the machine of the run is set to (L194).
  await setTransparency(page, 'no-preference');
  await pressButton(open);
  let dialog = page.getByRole('dialog', { name: 'Lịch hẹn mới' });
  for (const os of SYSTEMS) {
    await markOs(page, os);
    await expect(dialog).toHaveCSS('border-radius', await drawnCorner(page, { win: 8, mac: 20 }));
  }
  await expect(dialog).toHaveCSS('background-color', 'rgba(28, 37, 50, 0.84)');
  expect(
    await dialog.evaluate((node) => {
      const style = getComputedStyle(node);
      return style.backdropFilter || style.getPropertyValue('-webkit-backdrop-filter');
    }),
  ).toMatch(/^blur\(34px\)/);
  await expect(dialog).toHaveCSS('width', '480px');
  expect(
    await dialog.evaluate((node) => getComputedStyle(node, '::backdrop').backgroundColor),
  ).toBe('rgba(4, 7, 12, 0.55)');
  // The head, its line of context in --text-3, and a line of help under a field.
  for (const text of [
    dialog.getByRole('heading').locator('..'),
    dialog.getByText('Gõ tên hoặc mã KH.'),
  ]) {
    expect(await lowestContrast(text), 'text of the dialog').toBeGreaterThanOrEqual(TEXT_CONTRAST);
  }

  // The dimmed window, well outside the dialog: nothing closes, what was typed stays.
  await dialog.getByRole('textbox', { name: /^Ngày/ }).fill('16/9');
  await page.mouse.click(8, 8);
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: /^Ngày/ })).toHaveValue('16/9');

  await dialog.getByRole('button', { name: 'Đóng hộp thoại' }).click();
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();

  dialog = await openBooking(page);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  // A question to confirm is the narrow one.
  await page.goto('/#/team');
  await page.getByRole('button', { name: '+ Team' }).click();
  await expect(page.getByRole('dialog', { name: 'Team mới' })).toHaveCSS('width', '400px');
});

test('a dialog longer than the window scrolls its body; its head and its foot stay', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 420 });
  await page.goto('/#/appointments');
  const dialog = await openBooking(page);
  const title = dialog.getByRole('heading', { level: 2 });
  const save = dialog.getByRole('button', { name: 'Tạo lịch hẹn' });
  const top = (box: Locator) => box.evaluate((node) => node.getBoundingClientRect().top);
  const before = { title: await top(title), save: await top(save) };

  // The dialog itself does not scroll: its body does, down to its last field.
  expect(await dialog.evaluate((node) => node.scrollHeight - node.clientHeight)).toBe(0);
  const body = await dialog.evaluate((node) => {
    const part = [...node.querySelectorAll('*')].find(
      (element) => getComputedStyle(element).overflowY === 'auto',
    )!;
    const longer = part.scrollHeight > part.clientHeight;
    part.scrollTo(0, part.scrollHeight);
    return {
      longer,
      scrolled: part.scrollTop > 0,
      holdsTheFields: part.contains(node.querySelector('input')),
    };
  });
  expect(body).toEqual({ longer: true, scrolled: true, holdsTheFields: true });
  expect({ title: await top(title), save: await top(save) }).toEqual(before);
  await expect(title).toBeInViewport();
  await expect(save).toBeInViewport();
  await expect(dialog.getByRole('button', { name: 'Đóng hộp thoại' })).toBeInViewport();
});
