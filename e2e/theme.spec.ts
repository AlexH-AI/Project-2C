import { readFile } from 'node:fs/promises';
import { expect, test, type Locator } from './fixtures';
import {
  addKycNote,
  createKycCustomer,
  discoveryFacts,
  drawnCorner,
  lowestContrast,
  markOs,
  panelOf,
  setTransparency,
  stubChatGptWeb,
  token,
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

test('the page is marked with its system, and its text is in the font of that system (VA1)', async ({
  page,
  browserName,
}) => {
  await page.goto('/');
  // Playwright's WebKit runs on a Mac only (macos.yml); Edge is the web view of Windows.
  const mac = browserName === 'webkit';
  await expect(page.locator('html')).toHaveAttribute('data-os', mac ? 'mac' : 'win');

  const body = page.locator('body');
  await expect(body).toHaveCSS('background-color', BG_0);
  await expect(body).toHaveCSS('color', TEXT);
  // ADR-0013 appendix 11/11/2026 §1: SF Pro on macOS; Segoe UI Variable on Windows 11, Segoe UI
  // where Windows has no Variable.
  await expect(body).toHaveCSS(
    'font-family',
    mac
      ? /^-apple-system, BlinkMacSystemFont, /
      : '"Segoe UI Variable Text", "Segoe UI Variable", "Segoe UI", system-ui, sans-serif',
  );
  await test.step('Vietnamese text is drawn with that font, no glyph from another', async (step) => {
    step.skip(mac, 'the font a text is drawn with is read through CDP, Chromium only (NT-MAC-18)');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText('Tổng quan');
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'h1' });
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    expect(fonts.map((font) => font.familyName)).toEqual([
      expect.stringMatching(/^Segoe UI( Variable( Text| Display| Small)?)?$/),
    ]);
  });
});

test('the app loads no font file but Playfair Display, the font of the slogan (VA1)', async ({
  page,
}) => {
  const fonts: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'font' || /\.(woff2?|[ot]tf)\b/.test(request.url())) {
      fonts.push(new URL(request.url()).pathname);
    }
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // Text of every weight the app writes, Vietnamese marks too: none asks for a file.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');

  expect(fonts).toEqual([expect.stringMatching(/^\/assets\/playfair-display-latin-400-italic-/)]);
  const families = await page.evaluate(() => [...document.fonts].map((face) => face.family));
  expect(families.map((family) => family.replaceAll('"', ''))).toEqual(['Playfair Display']);
});

// The slogan of the logo (T-308, G3 27/10): its champagne.
const SLOGAN = 'rgb(232, 211, 162)';

test('the slogan is in Playfair Display italic, loaded from the app itself (T-308)', async ({
  page,
}) => {
  const font = page.waitForResponse((response) =>
    /\/playfair-display-latin-400-italic-[\w-]+\.woff2$/.test(response.url()),
  );
  await page.goto('/');

  const slogan = page.getByRole('complementary').getByText('Where legacy meets trust');
  // English in a Vietnamese page: a screen reader reads it as English (WCAG 3.1.2, review #861).
  await expect(slogan).toHaveAttribute('lang', 'en');
  await expect(slogan).toHaveCSS('font-family', /^"?Playfair Display"?,/);
  await expect(slogan).toHaveCSS('font-style', 'italic');
  await expect(slogan).toHaveCSS('font-size', '13px');
  await expect(slogan).toHaveCSS('color', SLOGAN);
  const response = await font;
  expect(response.ok()).toBe(true);
  expect(new URL(response.url()).hostname).toBe('localhost');
  // One face only, the one the slogan uses.
  const faces = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts]
      .filter((face) => face.family.replaceAll('"', '') === 'Playfair Display')
      .map((face) => `${face.style} ${face.weight} ${face.status}`);
  });
  expect(faces).toEqual(['italic 400 loaded']);
});

test('the logo keeps its colours on the dark sidebar, the navy tree and "Heritas" outlined (T-308)', async ({
  page,
}) => {
  await page.goto('/');

  // Tree, "Heritas", "L-CRM": three pieces cut from the Owner's logo, which the block names.
  const pieces = page.getByRole('img', { name: 'Heritas L-CRM' }).locator('img');
  await expect(pieces).toHaveCount(3);
  await expect
    .poll(() =>
      pieces.evaluateAll((images: HTMLImageElement[]) =>
        images.map((image) => ({
          alt: image.alt,
          width: image.width,
          loaded: image.naturalWidth > 0,
        })),
      ),
    )
    .toEqual([
      { alt: '', width: 44, loaded: true },
      { alt: '', width: 112, loaded: true },
      { alt: '', width: 95, loaded: true },
    ]);
  // The outline of the tree and of "Heritas" is in their images, with room around each
  // (shell.spec.ts measures it): no filter draws it, which the macOS app left out (L179). "L-CRM"
  // is gold already.
  for (const piece of await pieces.all()) await expect(piece).toHaveCSS('filter', 'none');
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

test('a corner takes the radius and the curve of the system the page is marked with (VA1)', async ({
  page,
}) => {
  await page.goto('/');
  // A tile is a card (`rounded-card`); a button of it, the next step of a guide, a control.
  const tile = page.getByRole('region', { name: 'Chuyển RF' });
  const mark = (os: 'mac' | 'win') => markOs(page, os);

  // Windows 11 (Fluent): circular arcs, 8 px surfaces, 4 px controls.
  await mark('win');
  expect(await token(page, '--r-card')).toBe('8px');
  expect(await token(page, '--r-control')).toBe('4px');
  expect(await token(page, '--r-k')).toBe('1');
  await expect(tile).toHaveCSS('border-radius', '8px');

  await mark('mac');
  expect(await token(page, '--r-card')).toBe('16px');
  expect(await token(page, '--r-control')).toBe('10px');
  const drawn = await drawnCorner(page, { win: 8, mac: 16 });
  expect(await token(page, '--r-k')).toBe(drawn === '24px' ? '1.5' : '1');
  await expect(tile).toHaveCSS('border-radius', drawn);
  if (drawn === '24px') await expect(tile).toHaveCSS('corner-shape', 'superellipse(1.7)');
});

test('with "Giảm độ trong suốt" the window and the focus layer are solid, nothing blurred (VA1)', async ({
  page,
  browserName,
}) => {
  await page.goto('/');
  // Not the setting of the machine of the run: Playwright gives this media feature no default (L194).
  await setTransparency(page, 'no-preference');
  expect(await token(page, '--mat-pop')).not.toBe(await token(page, '--bg-2'));
  expect(await token(page, '--mat-window')).not.toBe(await token(page, '--bg-1'));
  expect(await token(page, '--blur-pop')).toMatch(/^blur\(/);

  await test.step('the system asks for less transparency', async (step) => {
    // Playwright has no option for this media feature; CDP sets it, on Chromium only. Whether
    // WKWebView answers the query is checked on the app (NT-MAC-19).
    step.skip(browserName === 'webkit', 'prefers-reduced-transparency is set through CDP');
    await setTransparency(page, 'reduce');
    expect(await token(page, '--mat-pop')).toBe(await token(page, '--bg-2'));
    expect(await token(page, '--mat-window')).toBe(await token(page, '--bg-1'));
    expect(await token(page, '--blur-pop')).toBe('none');
  });
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
    .getByRole('radio', { name: 'RM' })
    .click();
  await expectBorderStandsOut(page.getByRole('combobox', { name: 'RM của góc nhìn' }));

  // A text field and a list of a dialog.
  await page.goto('/#/customers');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await expectBorderStandsOut(dialog.getByRole('textbox', { name: 'Họ tên' }));
  await expectBorderStandsOut(dialog.getByRole('combobox', { name: 'RM phụ trách' }));
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

// Mockup components.html 03 "Viên chọn" (ui2.css `.choice`, VA2; before it forms.css, DR6-149): no
// fill, an edge of --border-control, 30 px, 12 px either side, --text-2, 550; `.choice.on`: --accent
// on --accent-soft, a heavier edge of --accent (half a pixel more, inside), 650. One that cannot be
// picked: 0.4, struck out. The corner is the chip's: a capsule on macOS, 4 px on Windows 11.
const CHOICE = {
  'background-color': 'rgba(0, 0, 0, 0)',
  'border-color': 'rgb(104, 120, 144)',
  'box-shadow': 'none',
  'min-height': '30px',
  padding: '0px 12px',
  'font-size': '12.5px',
  color: 'rgb(174, 185, 200)',
  'font-weight': '550',
};
const CHOICE_ON = {
  ...CHOICE,
  'background-color': 'rgba(217, 178, 106, 0.14)',
  'border-color': 'rgb(217, 178, 106)',
  'box-shadow': 'rgb(217, 178, 106) 0px 0px 0px 0.5px inset',
  color: 'rgb(217, 178, 106)',
  'font-weight': '650',
};

/** The chip of a radio of `Choices` (the label around it), drawn in `style`, its text at AA. */
async function expectChoice(radio: Locator, style: Record<string, string>) {
  const chip = radio.locator('..');
  for (const [property, value] of Object.entries(style)) {
    await expect(chip).toHaveCSS(property, value);
  }
  await expect(chip).toHaveCSS(
    'border-radius',
    await drawnCorner(chip.page(), { win: 4, mac: 999 }),
  );
  expect(await lowestContrast(chip)).toBeGreaterThanOrEqual(4.5);
  return chip;
}

test('the choices of a dialog are drawn as the mockup draws them, and read at AA (5a, 5d)', async ({
  page,
}) => {
  await page.goto('/#/customers');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const create = page.getByRole('dialog', { name: 'Khách hàng mới' });
  const gender = create.getByRole('radiogroup', { name: 'Giới tính' });
  await gender.getByRole('radio', { name: 'Nữ' }).check();
  const female = await expectChoice(gender.getByRole('radio', { name: 'Nữ' }), CHOICE_ON);
  // The chip that is on says so by its border too, 3:1 either side (WCAG 1.4.11); so does the edge
  // of one that is off, --border-control (components.html#contrast).
  expect(await lowestContrast(female, 'border')).toBeGreaterThanOrEqual(CONTROL_CONTRAST);
  const male = await expectChoice(gender.getByRole('radio', { name: 'Nam' }), CHOICE);
  expect(await lowestContrast(male, 'border')).toBeGreaterThanOrEqual(CONTROL_CONTRAST);
  // A new customer starts in N4.
  const stages = create.getByRole('radiogroup', { name: 'Nhóm ban đầu' });
  await expectChoice(stages.getByRole('radio', { name: 'N4' }), CHOICE_ON);
  await expectChoice(stages.getByRole('radio', { name: 'N3' }), CHOICE);
  await create.getByRole('button', { name: 'Hủy' }).click();

  await page.getByRole('region', { name: 'N2', exact: true }).getByRole('link').first().click();
  await page.getByRole('button', { name: 'Chuyển nhóm' }).click();
  const change = page.getByRole('dialog', { name: /^Chuyển nhóm · / });
  const to = change.getByRole('radio', { name: 'N3', exact: true });
  await to.check();
  const n3 = await expectChoice(to, CHOICE_ON);
  expect(await lowestContrast(n3, 'border')).toBeGreaterThanOrEqual(CONTROL_CONTRAST);
  await expectChoice(change.getByRole('radio', { name: 'Mất cơ hội' }), CHOICE);
  // Its own stage cannot be picked.
  const current = change.getByRole('radio', { name: 'N2 hiện tại' }).locator('..');
  await expect(current).toHaveCSS('opacity', '0.4');
  await expect(current).toHaveCSS('text-decoration-line', 'line-through');
});

test('the tab shows the icon of the app, built from its one source', async ({ page, request }) => {
  await page.goto('/');

  // `tauri icon app-icon.png` makes every icon of the exe; the tab takes its 32 px one (T-308).
  const href = (await page.locator('link[rel="icon"]').getAttribute('href')) ?? '';
  expect(href).toMatch(/^\/assets\/32x32-[\w-]+\.png$/);
  const icon = await readFile(
    new URL('../apps/desktop/src-tauri/icons/32x32.png', import.meta.url),
  );
  expect((await (await request.get(href)).body()).equals(icon)).toBe(true);
  // The server sends no other icon: the old public/favicon.svg is gone (T-300). Asked of the server,
  // not of a build on disk that may be another one (CLR6-F13); an unknown path gets the page.
  for (const name of ['/favicon.svg', '/favicon.ico', '/favicon.png']) {
    const response = await request.get(name);
    expect(response.ok() && /^image\//.test(response.headers()['content-type'] ?? ''), name).toBe(
      false,
    );
  }
});
