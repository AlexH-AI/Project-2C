import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { expect, test, type Locator } from './fixtures';
import {
  addKycNote,
  createKycCustomer,
  discoveryFacts,
  lowestContrast,
  panelOf,
  stubChatGptWeb,
} from './support';

// ADR-0013 tokens: --bg-0 #0B1017, --text #E8EDF4.
const BG_0 = 'rgb(11, 16, 23)';
const TEXT = 'rgb(232, 237, 244)';

// WCAG 1.4.11: the edge of a field and the arrow of a column that sorts stand out 3:1 from what is
// next to them (T-284: `--border-control`).
const CONTROL_CONTRAST = 3;

async function expectBorderStandsOut(field: Locator) {
  await expect(field).toBeVisible();
  expect(await lowestContrast(field, 'border')).toBeGreaterThanOrEqual(CONTROL_CONTRAST);
}

test('body uses the ADR-0013 surface, text colour and font', async ({ page }) => {
  await page.goto('/');

  const body = await page.evaluate(() => {
    const style = getComputedStyle(document.body);
    return {
      background: style.backgroundColor,
      color: style.color,
      fontFamily: style.fontFamily,
    };
  });

  expect(body.background).toBe(BG_0);
  expect(body.color).toBe(TEXT);
  expect(body.fontFamily).toMatch(/^"?Be Vietnam Pro"?,/);
});

test('Be Vietnam Pro is loaded from the app itself, including Vietnamese glyphs', async ({
  page,
}) => {
  await page.goto('/');

  const loadedWeights = await page.evaluate(async () => {
    // document.fonts.check() is true when no face matches at all, so inspect the faces instead.
    const weights = ['400', '500', '600', '700'];
    await Promise.all(
      weights.map((w) => document.fonts.load(`${w} 16px "Be Vietnam Pro"`, 'Việt Đ')),
    );
    // Only the vietnamese subset covers U+1EA0–1EF9 ("ệ"); the latin face alone must not pass.
    const faces = [...document.fonts].filter(
      (face) =>
        face.family.replaceAll('"', '') === 'Be Vietnam Pro' &&
        face.status === 'loaded' &&
        /U\+1EA0-1EF9/i.test(face.unicodeRange),
    );
    return weights.filter((w) => faces.some((face) => face.weight === w));
  });

  expect(loadedWeights).toEqual(['400', '500', '600', '700']);
});

test('the app makes no requests to hosts other than localhost', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const { hostname, protocol } = new URL(request.url());
    if (protocol.startsWith('http') && hostname !== 'localhost') external.push(request.url());
  });

  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');

  expect(external).toEqual([]);
});

test('figures use tabular numerals', async ({ page }) => {
  await page.goto('/');

  const value = page.getByRole('region', { name: 'Chuyển RF' }).getByRole('paragraph').first();
  await expect(value).toHaveCSS('font-variant-numeric', 'tabular-nums');
});

test('token-backed corner radius is applied', async ({ page }) => {
  await page.goto('/');

  const tile = page.getByRole('region', { name: 'Chuyển RF' });
  await expect(tile).toHaveCSS('border-radius', '10px');
});

test('fields and the arrows of unsorted columns stand out 3:1 from what is next to them', async ({
  page,
}) => {
  await page.goto('/#/appointments');
  const header = page
    .getByRole('table', { name: 'Danh sách lịch hẹn' })
    .getByRole('columnheader', { name: 'Khách hàng' });
  await expect(header).toHaveAttribute('aria-sort', 'none');
  expect(await lowestContrast(header.getByText('↕'))).toBeGreaterThanOrEqual(CONTROL_CONTRAST);
  // The custom dates of the period picker, on the screen.
  await page.getByRole('radio', { name: 'Tùy chọn' }).click();
  await expectBorderStandsOut(page.getByRole('textbox', { name: 'Từ ngày' }));
  await expectBorderStandsOut(page.getByRole('textbox', { name: 'Đến ngày' }));
  // A list of the bar.
  await page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'RE' })
    .click();
  await expectBorderStandsOut(page.getByRole('combobox', { name: 'RE của góc nhìn' }));

  // A text field and a list of a dialog.
  await page.goto('/#/customers');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await expectBorderStandsOut(dialog.getByRole('textbox', { name: 'Họ tên' }));
  await expectBorderStandsOut(dialog.getByRole('combobox', { name: 'RE phụ trách' }));
});

test('the two fields of the app outside packages/ui stand out 3:1 from their card too', async ({
  page,
}) => {
  await stubChatGptWeb(page);
  const name = 'Hà Viền Ô';
  await createKycCustomer(page, name);
  await addKycNote(page, name, discoveryFacts);
  // The message to copy by hand, once ChatGPT web could not copy it.
  const panel = panelOf(page);
  await page.evaluate(() => (window.web.failCopy = true));
  await panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' }).click();
  await expectBorderStandsOut(panel.getByRole('textbox', { name: 'Tin nhắn để copy' }));
  await panel.getByRole('button', { name: 'Hủy' }).click();

  // The search box of Thùng rác, shown once it holds a record: the customer, deleted.
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  await page
    .getByRole('dialog', { name: `Sửa hồ sơ · ${name}` })
    .getByRole('button', { name: 'Xóa KH…' })
    .click();
  await page
    .getByRole('dialog', { name: `Xóa ${name}?` })
    .getByRole('button', { name: 'Xóa KH' })
    .click();
  await expect(page).toHaveURL(/#\/customers$/);
  await page.goto('/#/settings/trash');
  await expectBorderStandsOut(page.getByRole('searchbox', { name: 'Tìm theo tên' }));
});

test('the tab shows the icon of the app, built from its one source', async ({ page, request }) => {
  await page.goto('/');

  const href = (await page.locator('link[rel="icon"]').getAttribute('href')) ?? '';
  expect(href).toMatch(/^\/assets\/app-icon-[\w-]+\.svg$/);
  const icon = await readFile(new URL('../apps/desktop/app-icon.svg', import.meta.url), 'utf8');
  expect(await (await request.get(href)).text()).toBe(icon);
  expect(existsSync(new URL('../apps/desktop/dist/favicon.svg', import.meta.url))).toBe(false);
});
