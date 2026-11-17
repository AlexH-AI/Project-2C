import { expect, test, type Locator, type Page } from './fixtures';
import {
  addKycNote,
  createKycCustomer,
  discoveryFacts,
  drawnCorner,
  lowestContrast,
  markOs,
  pickTeam,
  token,
} from './support';

// VA2 (ADR-0013 appendix 11/11/2026; mockup components.html 01, 02, 03, 07): the shared controls
// as each system draws them. A page is marked with its system once, by `main.tsx`; a test marks it
// with the other one too, so Edge checks the tokens of macOS and WebKit those of Windows 11.
const SYSTEMS = ['win', 'mac'] as const;

// tokens.css
const ACCENT = 'rgb(217, 178, 106)';
const BORDER_CONTROL = 'rgb(104, 120, 144)';
const BORDER_STRONG = 'rgb(52, 66, 90)';
const HAIRLINE = 'rgba(255, 255, 255, 0.09)';
const SHRUNK = 'matrix(0.96, 0, 0, 0.96, 0, 0)';

/** The colour a token paints, as the browser writes a computed colour. */
const painted = (page: Page, name: string) =>
  page.evaluate((name) => {
    const probe = document.body.appendChild(document.createElement('i'));
    probe.style.color = `var(${name})`;
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, name);

const openBooking = async (page: Page) => {
  await page.goto('/#/appointments');
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  return page.getByRole('dialog', { name: 'Lịch hẹn mới' });
};

test('a button has the fill of its level, 34 px and the corner of its system; a compact one 28 px (VA2)', async ({
  page,
}) => {
  const name = 'Hà Nút Gọn';
  await createKycCustomer(page, name);
  await addKycNote(page, name, discoveryFacts);
  const compact = page.getByRole('button', { name: 'AI trích xuất' }).first();
  const secondary = page.getByRole('button', { name: 'Sửa hồ sơ' });
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const primary = page
    .getByRole('dialog', { name: /^Lịch hẹn mới/ })
    .getByRole('button', { name: 'Tạo lịch hẹn' });

  for (const os of SYSTEMS) {
    await markOs(page, os);
    // The one fill of --accent-fill; --accent stays the colour of text, focus and selection.
    await expect(primary).toHaveCSS('background-color', await painted(page, '--accent-fill'));
    await expect(primary).toHaveCSS('color', await painted(page, '--on-accent'));
    await expect(primary).toHaveCSS('height', '34px');
    // 10 px on macOS, a rounded rectangle with a straight side (Owner 11/11: "A · Bo 10 px");
    // 4 px on Windows 11. Drawn: the nominal radius × --r-k.
    expect(await token(page, '--r-control')).toBe(os === 'mac' ? '10px' : '4px');
    await expect(primary).toHaveCSS('border-radius', await drawnCorner(page, { win: 4, mac: 10 }));
    await expect(secondary).toHaveCSS('height', '34px');
    await expect(secondary).toHaveCSS('background-color', await painted(page, '--fill-2'));
    await expect(secondary).toHaveCSS(
      'border-radius',
      await drawnCorner(page, { win: 4, mac: 10 }),
    );
    expect(await token(page, '--r-control-sm')).toBe(os === 'mac' ? '8px' : '4px');
    await expect(compact).toHaveCSS('height', '28px');
    await expect(compact).toHaveCSS('border-radius', await drawnCorner(page, { win: 4, mac: 8 }));
  }
});

test('under the pointer a button changes its light only; pressed it shrinks 4%, not with "Giảm chuyển động" (VA2)', async ({
  page,
}) => {
  const dialog = await openBooking(page);
  const primary = dialog.getByRole('button', { name: 'Tạo lịch hẹn' });
  const secondary = dialog.getByRole('button', { name: 'Hủy' });
  /** The pointer down on `button`, then up away from it: pressed, not clicked. */
  const whilePressed = async (button: Locator, check: () => Promise<void>) => {
    await button.hover();
    await page.mouse.down();
    await check();
    await page.mouse.move(0, 0);
    await page.mouse.up();
  };

  await primary.hover();
  await expect(primary).toHaveCSS('filter', 'brightness(1.07)');
  await expect(primary).toHaveCSS('transform', 'none');
  await secondary.hover();
  await expect(secondary).toHaveCSS('background-color', await painted(page, '--fill-3'));
  await expect(secondary).toHaveCSS('transform', 'none');
  // It springs back in --t-3 by --spring-snappy; the light changes in --t-1.
  await expect(secondary).toHaveCSS('transition-duration', /^0\.12s, .*, 0\.4s$/);

  await whilePressed(primary, () => expect(primary).toHaveCSS('transform', SHRUNK));
  await expect(primary).toHaveCSS('transform', 'none');
  await whilePressed(secondary, () => expect(secondary).toHaveCSS('transform', SHRUNK));

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await whilePressed(primary, () => expect(primary).toHaveCSS('transform', 'none'));
  await whilePressed(secondary, () => expect(secondary).toHaveCSS('transform', 'none'));
  // Neither was clicked: the dialog is still there.
  await expect(dialog).toBeVisible();
});

test('a field carries its edge as its system does, keeps its fill under the pointer, and says an error by a mark too (VA2)', async ({
  page,
}) => {
  const dialog = await openBooking(page);
  const field = dialog.getByRole('textbox', { name: /^Giờ/ });
  const date = dialog.getByRole('textbox', { name: /^Ngày/ });
  const edges = (box: Locator) =>
    box.evaluate((node) => {
      const style = getComputedStyle(node);
      return [style.borderTopColor, style.borderRightColor, style.borderBottomColor];
    });

  // Windows 11: the weight is on the bottom edge, gold while typed in.
  await markOs(page, 'win');
  await date.focus();
  await expect(field).toHaveCSS('border-bottom-color', BORDER_CONTROL);
  expect(await edges(field)).toEqual([HAIRLINE, HAIRLINE, BORDER_CONTROL]);
  await expect(field).toHaveCSS('border-radius', await drawnCorner(page, { win: 4, mac: 10 }));
  await field.focus();
  await expect(field).toHaveCSS('border-bottom-color', ACCENT);
  expect(await edges(field)).toEqual([HAIRLINE, HAIRLINE, ACCENT]);
  await expect(field).toHaveCSS('outline-style', 'none');

  // macOS: an even edge; gold with a soft halo while typed in.
  await markOs(page, 'mac');
  await date.focus();
  await expect(field).toHaveCSS('border-bottom-color', BORDER_CONTROL);
  expect(await edges(field)).toEqual([BORDER_CONTROL, BORDER_CONTROL, BORDER_CONTROL]);
  await expect(field).toHaveCSS('border-radius', await drawnCorner(page, { win: 4, mac: 10 }));
  await field.focus();
  await expect(field).toHaveCSS('border-bottom-color', ACCENT);
  expect(await edges(field)).toEqual([ACCENT, ACCENT, ACCENT]);
  await expect(field).toHaveCSS('box-shadow', 'rgba(217, 178, 106, 0.14) 0px 0px 0px 3px');

  // The fill stays under the pointer on either system: --border-control needs 3:1 against it.
  const fill = await painted(page, '--fill-1');
  for (const os of SYSTEMS) {
    await markOs(page, os);
    await date.focus();
    await page.mouse.move(0, 0);
    await expect(field).toHaveCSS('background-color', fill);
    await field.hover();
    await expect(field).toHaveCSS('border-top-color', os === 'mac' ? /^rgb\(140, 153/ : HAIRLINE);
    await expect(field).toHaveCSS('background-color', fill);
    expect(await lowestContrast(field, 'border'), os).toBeGreaterThanOrEqual(3);
  }

  // An error: the edge is red, and its line starts with a mark that is drawn, not read.
  await date.fill('31/02');
  await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(date).toHaveAttribute('aria-invalid', 'true');
  await expect(date).toHaveCSS('border-bottom-color', await painted(page, '--danger'));
  const line = dialog.locator(`[id="${await date.getAttribute('aria-describedby')}"]`);
  await expect(line).toHaveText(/\S/);
  const mark = line.locator('svg');
  await expect(mark).toBeVisible();
  await expect(mark).toHaveAttribute('aria-hidden', 'true');
  await expect(mark).toHaveCSS('color', await painted(page, '--danger'));
  await expect(date).toHaveAccessibleDescription((await line.textContent())!);
});

test('the closed box of a list is a field with an arrow, dashed with no fill when locked; its list stays the system’s (VA2)', async ({
  page,
}) => {
  await page.goto('/#/settings');
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'AI' })
    .click();
  // The web build has the Mock only: its model cannot be changed.
  const locked = page.getByRole('combobox', { name: 'Model' });
  await expect(locked).toBeDisabled();
  for (const os of SYSTEMS) {
    await markOs(page, os);
    await expect(locked).toHaveCSS('border-top-style', 'dashed');
    await expect(locked).toHaveCSS('border-top-color', BORDER_STRONG);
    await expect(locked).toHaveCSS('border-bottom-color', BORDER_STRONG);
    await expect(locked).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await locked.hover();
    await expect(locked).toHaveCSS('border-bottom-color', BORDER_STRONG);
  }

  const dialog = await openBooking(page);
  const list = dialog.getByRole('combobox', { name: /^Trigger/ });
  await expect(list).toHaveCSS('appearance', 'none');
  await expect(list).toHaveCSS('background-color', await painted(page, '--fill-1'));
  await expect(list).toHaveCSS('border-top-style', 'solid');
  for (const os of SYSTEMS) {
    await markOs(page, os);
    await expect(list).toHaveCSS('border-radius', await drawnCorner(page, { win: 4, mac: 10 }));
    expect(await lowestContrast(list, 'border'), os).toBeGreaterThanOrEqual(3);
  }
  // Its arrow is drawn over its right end, inside it, and lets a click through to the list.
  const arrow = list.locator('xpath=following-sibling::*[name()="svg"]');
  await expect(arrow).toHaveAttribute('aria-hidden', 'true');
  await expect(arrow).toHaveCSS('pointer-events', 'none');
  const [box, mark] = [(await list.boundingBox())!, (await arrow.boundingBox())!];
  expect(mark.x).toBeGreaterThan(box.x + box.width - 32);
  expect(mark.x + mark.width).toBeLessThan(box.x + box.width);
  // Still the system's own list (Owner 17/11/2026): a `select`, picked as one.
  expect(await list.evaluate((node) => node.tagName)).toBe('SELECT');
  await list.selectOption({ label: 'Khác' });
  await expect(list.locator('option:checked')).toHaveText('Khác');
});

test('a capped list names its choice once to a screen reader, and whole under the pointer (DR6-187)', async ({
  page,
}) => {
  await page.goto('/#/appointments');
  await pickTeam(page, 'Bình Minh');
  const picker = page.getByRole('combobox', { name: 'Team của góc nhìn' });
  await expect(picker.locator('option:checked')).toHaveText('Bình Minh');
  // No title while the pointer is elsewhere: it would be the description of the list, and the
  // choice would be said twice.
  await page.mouse.move(0, 0);
  await expect(picker).not.toHaveAttribute('title');
  await expect(picker).toHaveAccessibleDescription('');
  await picker.hover();
  await expect(picker).toHaveAttribute('title', 'Bình Minh');
  await page.mouse.move(0, 0);
  await expect(picker).not.toHaveAttribute('title');
});

test('the chosen segment has a thumb of its own under its words, the others none (VA2)', async ({
  page,
}) => {
  await page.goto('/#/appointments');
  const group = page.getByRole('radiogroup', { name: 'Góc nhìn' });
  await expect(group).toHaveCSS('background-color', await painted(page, '--fill-2'));
  const chosen = group.getByRole('radio', { checked: true });
  const thumb = chosen.locator('[aria-hidden="true"]');
  await expect(thumb).toHaveCount(1);
  await expect(thumb).toHaveCSS('background-color', await painted(page, '--fill-3'));
  await expect(chosen).toHaveCSS('color', await painted(page, '--text'));
  // The thumb fills its segment; the well is concentric with it, 2 px out.
  expect(await thumb.boundingBox()).toEqual(await chosen.boundingBox());
  for (const os of SYSTEMS) {
    await markOs(page, os);
    await expect(thumb).toHaveCSS('border-radius', await drawnCorner(page, { win: 4, mac: 8 }));
    await expect(group).toHaveCSS('border-radius', await drawnCorner(page, { win: 6, mac: 10 }));
  }
  const other = group.getByRole('radio', { checked: false }).first();
  await expect(other.locator('[aria-hidden="true"]')).toHaveCount(0);
  await expect(other).toHaveCSS('color', await painted(page, '--text-2'));
  // The same weight on or off: a segment keeps its width when chosen.
  await expect(chosen).toHaveCSS('font-weight', '550');
  await expect(other).toHaveCSS('font-weight', '550');
});

/** `label` reads 4.5:1 on a fill of its own that nothing shows through. */
async function expectLabel(label: Locator, at: string) {
  await expect(label, at).toBeVisible();
  const fill = await label.evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(fill, at).toMatch(/^(rgb\(|color\(srgb [\d. ]+\)$)/);
  expect(await lowestContrast(label), at).toBeGreaterThanOrEqual(4.5);
  await expect(label, at).toHaveCSS('border-top-width', '0px');
}

test('the labels of a stage, a policy and an appointment read 4.5:1 on a fill that is not see-through (VA2)', async ({
  page,
}) => {
  // The stages, in the table of every customer.
  await page.goto('/#/customers');
  await page
    .getByRole('radiogroup', { name: 'Cách xem' })
    .getByRole('radio', { name: 'Bảng' })
    .click();
  const table = page.getByRole('table').first();
  const more = page.getByRole('button', { name: /^Hiện thêm/ });
  const stages = ['N4', 'N3', 'N2', 'N1', 'Tạm hoãn', 'Mất cơ hội'];
  for (const stage of stages) {
    const label = table.getByText(stage, { exact: true }).first();
    while (!(await label.isVisible()) && (await more.isVisible())) await more.click();
    await expectLabel(label, stage);
  }
  for (const os of SYSTEMS) {
    await markOs(page, os);
    // A capsule on macOS, 4 px on Windows 11.
    await expect(table.getByText('N4', { exact: true }).first()).toHaveCSS(
      'border-radius',
      await drawnCorner(page, { win: 4, mac: 999 }),
    );
  }
  // "n HĐ" on the card of a customer with policies.
  await page
    .getByRole('radiogroup', { name: 'Cách xem' })
    .getByRole('radio', { name: 'Kanban' })
    .click();
  await expectLabel(page.getByText(/^\d+ HĐ$/).first(), 'n HĐ');

  // Lịch hẹn: "Chưa ghi kết quả" of a planned appointment whose day has passed; the screen shows
  // the day of the one just made.
  const booking = await openBooking(page);
  await booking.getByRole('textbox', { name: /^Khách hàng/ }).fill('Ng');
  await booking.getByRole('list', { name: 'KH khớp' }).getByRole('button').first().click();
  await booking.getByRole('textbox', { name: /^Ngày/ }).fill('10/9');
  await booking.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await booking.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(booking).toBeHidden();
  const day = page.getByRole('region', { name: 'Trong ngày 10/09/2026' });
  await expectLabel(day.getByText('Chưa ghi kết quả', { exact: true }).first(), 'unrecorded');
});

test('the labels of a policy, submitted and issued, read 4.5:1 on their fill (VA2)', async ({
  page,
}) => {
  const name = 'Hà Nhãn HĐ';
  await createKycCustomer(page, name);
  const policies = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await policies.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  const submit = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await submit.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
  await submit.getByRole('textbox', { name: /^FYP nộp/ }).fill('500tr');
  await submit.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(submit).toBeHidden();
  await expectLabel(policies.getByText('Đã nộp', { exact: true }).first(), 'submitted');
});
