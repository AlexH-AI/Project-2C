import { expect, test, type Locator, type Page } from './fixtures';
import {
  asExe,
  contrast,
  drawnCorner,
  holdClock,
  lowestContrast,
  markOs,
  pickFirstRm,
  pickScope,
  right,
  setTransparency,
} from './support';

// The shell of mockup app-shell.html (VA4a): the sidebar with the compact logo (`#sidebar`), and
// the toolbar, where a screen writes a line under its name and puts its main button (`#toolbar`).

const ACCENT = 'rgb(217, 178, 106)';
const TEXT = 'rgb(232, 237, 244)';
// --fill-2, white at 8.5%, as each browser writes it back.
const FILL_2 = /^rgba\(255, 255, 255, 0\.08[56]\d*\)$/;

const sidebar = (page: Page) =>
  page
    .getByRole('complementary')
    .filter({ has: page.getByRole('navigation', { name: 'Điều hướng chính' }) });
const nav = (page: Page) => page.getByRole('navigation', { name: 'Điều hướng chính' });
const toolbar = (page: Page) => page.getByRole('banner');
/** The line under the name of the screen. */
const sub = (page: Page) => toolbar(page).getByRole('paragraph');
const box = async (locator: Locator) => (await locator.boundingBox())!;

test('the sidebar: the compact logo in a row, an icon on every item, the save state then the slogan at its foot', async ({
  page,
}) => {
  await page.goto('/');
  const pieces = sidebar(page).getByRole('img', { name: 'Heritas L-CRM' }).locator('img');
  await expect(pieces).toHaveCount(3);
  await expect
    .poll(() =>
      pieces.evaluateAll((images: HTMLImageElement[]) =>
        images.map((image) => (image.naturalWidth > 0 ? image.width : 0)),
      ),
    )
    // The tree 42 px and "Heritas" 108 px, each in an image with room around it for its outline.
    .toEqual([44, 112, 95]);
  // The tree, then "Heritas" over "L-CRM".
  const [tree, word, lcrm] = await Promise.all([0, 1, 2].map((i) => box(pieces.nth(i))));
  expect(tree!.x + tree!.width).toBeLessThanOrEqual(word!.x);
  expect(lcrm!.x).toBe(word!.x + 2);
  expect(lcrm!.y).toBeGreaterThanOrEqual(word!.y + word!.height);
  expect(lcrm!.y + lcrm!.height).toBeLessThanOrEqual(tree!.y + tree!.height + 1);

  const links = nav(page).getByRole('link');
  await expect(links).toHaveCount(6);
  for (const link of await links.all()) {
    const icon = link.locator('svg');
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveCSS('width', '18px');
    await expect(icon).toHaveCSS('stroke-width', '1.7px');
  }
  // The chosen item: heavier text of the colour of text, its icon gold.
  const current = links.and(page.locator('[aria-current="page"]'));
  await expect(current).toHaveText('Tổng quan');
  await expect(current).toHaveCSS('color', TEXT);
  await expect(current).toHaveCSS('font-weight', '650');
  await expect(current.locator('svg')).toHaveCSS('color', ACCENT);
  const other = links.nth(1);
  await expect(other.locator('svg')).toHaveCSS('color', await other.evaluate(colourOf));

  // The foot: the save state, then the slogan, under the last item.
  const last = await box(links.last());
  const saved = await box(sidebar(page).getByText('Bản web — dữ liệu chỉ trong trình duyệt'));
  const slogan = await box(sidebar(page).getByText('Where legacy meets trust'));
  expect(saved.y).toBeGreaterThanOrEqual(last.y + last.height);
  expect(slogan.y).toBeGreaterThanOrEqual(saved.y + saved.height);
});

const colourOf = (node: Element) => getComputedStyle(node).color;

// F1: each section of Cài đặt has its icon on a tile of a colour of the theme (Kiểu A, `.sq` of
// app-shell.html, G3 11/11/2026; ADR-0013 appendix 11/11/2026 §4). The colours only decorate:
// --info, --n2, --n4. The icon is --bg-0 on them, as in the mockup.
const TILES = [
  { name: 'Dữ liệu', colour: 'rgba(111, 168, 255, 1)' },
  { name: 'AI', colour: 'rgba(180, 154, 251, 1)' },
  { name: 'Thùng rác', colour: 'rgba(148, 163, 184, 1)' },
];
const BG_0 = 'rgba(11, 16, 23, 1)';

/**
 * The colour of the icon on `tile` and each stop of the tile's fill, top to bottom, read through
 * a canvas as `rgba(…)`: a stop may be written `color(srgb …)`, which `contrast` does not read.
 */
const tilePaint = (tile: Locator) =>
  tile.evaluate((node) => {
    const context = document
      .createElement('canvas')
      .getContext('2d', { willReadFrequently: true })!;
    const read = (color: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [r = 0, g = 0, b = 0, a = 0] = context.getImageData(0, 0, 1, 1).data;
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    };
    const STOP = /(?:rgba?|color|oklab|oklch|lab|lch|hsla?)\([^()]*\)/g;
    return {
      icon: read(getComputedStyle(node.querySelector('svg')!).color),
      stops: (getComputedStyle(node).backgroundImage.match(STOP) ?? []).map(read),
    };
  });

test('the sections of Cài đặt: an icon on a tile of its own colour, 3:1 at least, on both systems (F1)', async ({
  page,
}) => {
  await page.goto('/#/settings');
  // Neither the order nor the names of the items of the sidebar and of Cài đặt change.
  await expect(nav(page).getByRole('link')).toHaveText([
    'Tổng quan',
    'Lịch hẹn',
    'Khách hàng',
    'Báo cáo',
    'Team & nhân sự',
    'Cài đặt',
  ]);
  const sections = page.getByRole('navigation', { name: 'Mục cài đặt' }).getByRole('button');
  await expect(sections).toHaveText(TILES.map((tile) => tile.name));
  // The chosen one on the fill of the mockup's `.set-i.on`.
  await expect(sections.first()).toHaveAttribute('aria-current', 'page');
  await expect(sections.first()).toHaveCSS('background-color', FILL_2);

  for (const [index, { name, colour }] of TILES.entries()) {
    const section = sections.nth(index);
    // The icon only decorates: the section is named by its words.
    await expect(section).toHaveAccessibleName(name);
    const icon = section.locator('svg');
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon).toHaveCSS('width', '16px');
    const tile = icon.locator('xpath=..');
    await expect(tile).toHaveCSS('width', '30px');
    await expect(tile).toHaveCSS('height', '30px');
    for (const os of ['win', 'mac'] as const) {
      await markOs(page, os);
      const { icon: drawn, stops } = await tilePaint(tile);
      expect(drawn).toBe(BG_0);
      // Lighter at the top, the colour of the section at its foot.
      expect(stops).toHaveLength(2);
      expect(stops[1], `${name} on ${os}`).toBe(colour);
      // A graphic, not text: 3:1 on every part of the fill (WCAG 1.4.11).
      const lowest = Math.min(...stops.map((stop) => contrast(drawn, stop)));
      expect(lowest, `${name} on ${os}`).toBeGreaterThanOrEqual(3);
      await expect(tile).toHaveCSS('border-radius', await drawnCorner(page, { win: 6, mac: 7 }));
    }
  }
});

/** The bar of the chosen item, drawn by its pill; `content` is `none` where there is no bar. */
const barOf = (pill: Locator) =>
  pill.evaluate((node) => {
    const bar = getComputedStyle(node, '::before');
    return { content: bar.content, width: bar.width, colour: bar.backgroundColor };
  });

test('the chosen item and the sidebar by system: a gold bar and no pane on Windows 11, a pane of glass on macOS', async ({
  page,
}) => {
  await page.goto('/#/customers');
  const pill = nav(page).locator('[aria-current="page"] [data-slot="nav-pill"]');
  await expect(pill).toHaveCount(1);
  // One pill, of the chosen item: it goes with it.
  await expect(nav(page).locator('[data-slot="nav-pill"]')).toHaveCount(1);

  await markOs(page, 'win');
  expect(await right(sidebar(page))).toBe(236);
  await expect(sidebar(page)).toHaveCSS('background-image', 'none');
  await expect(sidebar(page)).toHaveCSS('box-shadow', 'none');
  await expect(pill).toHaveCSS('background-color', FILL_2);
  await expect(pill).toHaveCSS('border-radius', await drawnCorner(page, { win: 4, mac: 8 }));
  expect(await barOf(pill)).toEqual({ content: '""', width: '3px', colour: ACCENT });
  expect((await box(pill)).x).toBe((await box(nav(page))).x);

  // macOS: the pane floats 8 px inside the window, its corner concentric with it (24 → 16), the
  // chosen item concentric with the pane (16 → 8); no bar.
  await markOs(page, 'mac');
  expect((await box(sidebar(page))).x).toBe(8);
  expect(await right(sidebar(page))).toBe(244);
  // --mat-pane, the glass of the pane.
  await expect(sidebar(page)).toHaveCSS(
    'background-image',
    /^linear-gradient\((180deg, )?rgba\(255, 255, 255, 0\.1\d*\)( 0%)?, rgba\(255, 255, 255, 0\.04\d*\)( 100%)?\)$/,
  );
  await expect(sidebar(page)).not.toHaveCSS('box-shadow', 'none');
  await expect(sidebar(page)).toHaveCSS(
    'border-radius',
    await drawnCorner(page, { win: 0, mac: 16 }),
  );
  await expect(pill).toHaveCSS('background-color', FILL_2);
  await expect(pill).toHaveCSS('border-radius', await drawnCorner(page, { win: 4, mac: 8 }));
  expect((await barOf(pill)).content).toBe('none');
});

test('the sidebar stays in the window as a long screen scrolls', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 700 });
  await page.goto('/#/customers');
  await page.getByRole('radio', { name: 'Bảng' }).click();
  await page.evaluate(() => window.scrollTo(0, 900));
  expect(await page.evaluate(() => window.scrollY)).toBe(900);

  await expect(sidebar(page).getByRole('img', { name: 'Heritas L-CRM' })).toBeInViewport({
    ratio: 1,
  });
  await expect(sidebar(page).getByText('Where legacy meets trust')).toBeInViewport({ ratio: 1 });
});

const MAIN_BUTTONS = [
  ['Lịch hẹn', '+ Lịch hẹn'],
  ['Khách hàng', '+ Khách hàng'],
  ['Báo cáo', 'Xuất Excel'],
  ['Team & nhân sự', '+ Team'],
] as const;

test('the main button of a screen is on the toolbar, after the place kept for "Lưu ý"', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 700 });
  await page.goto('/');
  const title = toolbar(page).getByRole('heading', { level: 1 });
  const headsUp = toolbar(page).locator('[data-slot="heads-up"]');
  for (const [screen, name] of MAIN_BUTTONS) {
    await nav(page).getByRole('link', { name: screen }).click();
    await expect(title).toHaveText(screen);
    const button = toolbar(page).getByRole('button', { name, exact: true });
    await expect(button).toBeVisible();
    // Once on the page: the toolbar took it from the screen.
    await expect(page.getByRole('button', { name, exact: true })).toHaveCount(1);
    await expect(headsUp).toHaveCount(1);
    const [name1, gap, main] = await Promise.all([box(title), box(headsUp), box(button)]);
    expect(gap.x).toBeGreaterThanOrEqual(name1.x + name1.width);
    expect(main.x).toBeGreaterThanOrEqual(gap.x + gap.width);
    // The smallest window: the toolbar keeps its button inside it.
    expect(main.x + main.width).toBeLessThanOrEqual(1100);
  }
  // Cài đặt puts nothing there: the toolbar has the name, "Lưu ý" (VA9), the eye (VA6a) and the
  // magnifier (VA8) of the shell alone.
  await nav(page).getByRole('link', { name: 'Cài đặt' }).click();
  await expect(title).toHaveText('Cài đặt');
  await expect(toolbar(page).getByRole('button')).toHaveCount(3);
  await expect(headsUp.getByRole('button', { name: /^Lưu ý: / })).toBeVisible();
  await expect(toolbar(page).getByRole('button', { name: 'Che tên khách hàng' })).toBeVisible();
  await expect(toolbar(page).getByRole('button', { name: /^Tìm hay chạy lệnh/ })).toBeVisible();
  await expect(sub(page)).toBeHidden();
});

test('Tổng quan and Báo cáo: the scope pill, then the period pill, then the main button (VA4b)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 700 });
  await page.goto('/#/reports');
  const scope = toolbar(page).getByRole('button', { name: 'Góc nhìn: Toàn bộ' });
  const period = toolbar(page).getByRole('group', { name: 'Kỳ thống kê' });
  const main = toolbar(page).getByRole('button', { name: 'Xuất Excel', exact: true });
  const headsUp = toolbar(page).locator('[data-slot="heads-up"]');
  // ‹, the name of the period, ›.
  await expect(period.getByRole('button')).toHaveText(['‹', 'Tháng 09/2026', '›']);
  const [gap, first, second, last] = await Promise.all([
    box(headsUp),
    box(scope),
    box(period),
    box(main),
  ]);
  expect(first.x).toBeGreaterThanOrEqual(gap.x + gap.width);
  expect(second.x).toBeGreaterThanOrEqual(first.x + first.width);
  expect(last.x).toBeGreaterThanOrEqual(second.x + second.width);
  expect(last.x + last.width).toBeLessThanOrEqual(1100);
  // The pills are as high as the buttons beside them, and painted as the secondary button.
  expect(first.height).toBe(34);
  expect(second.height).toBe(34);
  await expect(scope).toHaveCSS('background-color', FILL_2);

  // The layers hang from their pill, inside the window, over the screen.
  await scope.click();
  const menu = page.getByRole('menu', { name: 'Góc nhìn' });
  const menuBox = await box(menu);
  expect(menuBox.y).toBeGreaterThanOrEqual(first.y + first.height);
  expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(first.x + first.width + 1);
  expect(menuBox.x).toBeGreaterThanOrEqual(0);
  for (const os of ['win', 'mac'] as const) {
    await markOs(page, os);
    await expect(menu).toHaveCSS('border-radius', await drawnCorner(page, { win: 8, mac: 14 }));
  }
  await page.keyboard.press('Escape');

  // Tổng quan has "Lưu ý" (VA9), the eye of the name mask (VA6a), the magnifier (VA8), the two
  // pills and no main button yet (D8).
  await nav(page).getByRole('link', { name: 'Tổng quan' }).click();
  await expect(toolbar(page).getByRole('button', { name: /^Góc nhìn: / })).toBeVisible();
  await expect(period).toBeVisible();
  await expect(toolbar(page).getByRole('button')).toHaveCount(7);
  await expect(sub(page)).toHaveText('Tháng 09/2026 · 01/09 – 15/09/2026 (MTD) · Toàn bộ');
});

test('the button on the toolbar works as it did in the screen, and takes the focus back from its dialog', async ({
  page,
}) => {
  await page.goto('/#/team');
  const add = toolbar(page).getByRole('button', { name: '+ Team', exact: true });
  await add.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Team mới' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(add).toBeFocused();
  // "+ Nhân sự", the other button of the screen's head, went up with it.
  await toolbar(page).getByRole('button', { name: '+ Nhân sự', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Nhân sự mới' })).toBeVisible();
});

test('the line under the name of the screen: team → RM on Lịch hẹn, the customers shown, the teams and RM', async ({
  page,
}) => {
  await page.goto('/#/team');
  await expect(sub(page)).toHaveText('3 team · 3 TL · 30 RM · 3 người hỗ trợ');
  // Under the name, in the toolbar.
  const title = await box(toolbar(page).getByRole('heading', { level: 1 }));
  const line = await box(sub(page));
  expect(line.y).toBeGreaterThanOrEqual(title.y + title.height - 1);
  expect(line.x).toBe(title.x);

  await nav(page).getByRole('link', { name: 'Khách hàng' }).click();
  await expect(sub(page)).toHaveText(/^[\d,]+ KH đang mở · [\d,]+ đã đóng$/);
  await pickScope(page, { team: 'Sao Mai' });
  await expect(sub(page)).toHaveText(/^Cả team Sao Mai · [\d,]+ KH đang mở · [\d,]+ đã đóng$/);

  // The scope is the one of every screen: Lịch hẹn opens on the team.
  await nav(page).getByRole('link', { name: 'Lịch hẹn' }).click();
  await expect(sub(page)).toHaveText('Cả team Sao Mai');
  const strip = page.getByRole('region', { name: 'RM của team Sao Mai' });
  const rm = strip.getByRole('button').nth(1);
  const name = (await rm.locator('span').first().textContent()) ?? '';
  expect(name).not.toBe('');
  await rm.click();
  await expect(sub(page)).toHaveText(`Team Sao Mai → ${name}`);

  await pickFirstRm(page);
  await expect(sub(page)).toHaveText(/^Team .+ → .+$/);
  await pickScope(page, 'all');
  await expect(sub(page)).toHaveText('Toàn bộ');
});

// Review #1414: lost, the attribute leaves every test green while the macOS window no longer moves by the
// toolbar. Tauri reads `''` as a press on the element itself, `deep` as one anywhere inside it.
test('the macOS window moves by the free space of the toolbar and the top of the sidebar; Windows keeps its title bar (VA5)', async ({
  page,
  browserName,
}) => {
  await page.goto('/#/overview');
  const places = [
    [page.getByRole('banner'), ''],
    [page.locator('[data-slot="heads-up"]'), ''],
    [page.locator('[data-slot="window-controls"]').locator('..'), 'deep'],
  ] as const;
  for (const [place, reach] of places) {
    if (browserName === 'webkit')
      await expect(place).toHaveAttribute('data-tauri-drag-region', reach);
    else await expect(place).not.toHaveAttribute('data-tauri-drag-region');
  }
});

test('the toolbar is 68 px high and what scrolls under it fades at its edge', async ({
  page,
  browserName,
}) => {
  await page.goto('/#/customers');
  // Not the setting of the machine of the run: Playwright gives this media feature no default (review #1398).
  await setTransparency(page, 'no-preference');
  expect((await box(toolbar(page))).height).toBe(68);
  await expect(toolbar(page)).toHaveCSS('position', 'sticky');
  await expect(toolbar(page)).toHaveCSS('border-bottom-width', '0px');
  // The scroll edge: --mat-edge fading out below the toolbar, over what scrolls under it, blurred.
  const edge = () =>
    toolbar(page).evaluate((node) => {
      const style = getComputedStyle(node, '::before');
      return { image: style.backgroundImage, bottom: style.bottom, blur: style.backdropFilter };
    });
  expect((await edge()).image).toMatch(
    /^linear-gradient\(.*rgba\(11, 16, 23, 0\.9\d*\) 50%, .*\)$/,
  );
  expect((await edge()).bottom).toBe('-18px');
  expect((await edge()).blur).toBe('blur(14px)');

  await test.step('the system asks for less transparency: solid down to the foot of the bar, nothing blurred', async (step) => {
    // Set through CDP, on Chromium only; on the macOS app it is checked by hand (NT-MAC-19).
    step.skip(browserName === 'webkit', 'prefers-reduced-transparency is set through CDP');
    await setTransparency(page, 'reduce');
    // Solid over the whole bar, fading out in the 18 px below it only (review #1408).
    expect((await edge()).image).toMatch(
      /^linear-gradient\(.*rgb\(11, 16, 23\) calc\(100% - 18px\), .*\)$/,
    );
    expect((await edge()).blur).toBe('none');
    expect(
      await toolbar(page).evaluate((node) => getComputedStyle(node, '::before').maskImage),
    ).toBe('none');
  });
});

// VA5: main.tsx marks the exe's page `data-backdrop`, the material under its transparent window;
// the web build has no window and no mark. The mark is set here by hand to read the exe's CSS.
test('the page lets the material of the exe window through, and the web build stays solid (VA5)', async ({
  page,
  browserName,
}) => {
  await page.goto('/#/customers');
  await setTransparency(page, 'no-preference');
  const html = page.locator('html');
  const controls = sidebar(page).locator('[data-slot="window-controls"]');
  const pane = page.locator('[data-slot="content-pane"]');
  const column = toolbar(page).locator('xpath=..');
  const mark = (os: 'mac' | 'win', backdrop?: 'glass' | 'solid') =>
    page.evaluate(
      ([os, backdrop]) => {
        document.documentElement.dataset.os = os;
        if (backdrop) document.documentElement.dataset.backdrop = backdrop;
        else delete document.documentElement.dataset.backdrop;
      },
      [os, backdrop] as const,
    );

  // The web build: --bg-0 under everything, no row kept for the buttons of a macOS window.
  await expect(html).not.toHaveAttribute('data-backdrop');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(11, 16, 23)');
  await expect(controls).toBeHidden();
  await mark('win');
  await expect(controls).toBeHidden();
  // Windows: the content on a pane of --bg-0, its top left corner rounded, right of the sidebar;
  // the column keeps the 1 px of its edge, so the layout is as before VA5.
  await expect(pane).toHaveCSS('position', 'fixed');
  await expect(pane).toHaveCSS('border-top-left-radius', '8px');
  await expect(pane).toHaveCSS('background-color', 'rgb(11, 16, 23)');
  expect((await box(pane)).x).toBe((await box(sidebar(page))).width);
  expect((await box(toolbar(page))).x).toBe((await box(pane)).x + 1);
  await expect(column).toHaveCSS('border-left-width', '1px');
  // The hairline of the pane shows on top and on the left, the scroll edge of the toolbar over it:
  // the edge is a line lighter than the pane next to it, as painted.
  const left = (await box(pane)).x;
  const top = await shade(page, { x: left + 120, y: 0, width: 1, height: 4 });
  expect(top.at(0)! - top.at(-1)!, 'the top edge').toBeGreaterThan(10);
  const side = await shade(page, { x: left, y: 40, width: 4, height: 1 });
  expect(side.at(0)! - side.at(-1)!, 'the left edge').toBeGreaterThan(10);
  await mark('mac');
  await expect(pane).toBeHidden();

  // The macOS exe: glass under the sidebar's pane, through --mat-window as in ui2.css .win, fading
  // into --bg-0; a row of 20 px at the top of the pane for the window's three buttons.
  await mark('mac', 'glass');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(html).toHaveCSS(
    'background-image',
    /^linear-gradient\(90deg, rgba\(11, 16, 23, 0\.62\) 0(px)?, rgba\(11, 16, 23, 0\.62\) 226px, rgb\(11, 16, 23\) 300px\)$/,
  );
  await expect(controls).toBeVisible();
  expect((await box(controls)).height).toBe(20);
  // Windows 11: Mica under the whole window; Windows 10: --bg-1, nothing shows through.
  await mark('win', 'glass');
  await expect(controls).toBeHidden();
  await expect(html).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await mark('win', 'solid');
  await expect(html).toHaveCSS('background-color', 'rgb(17, 24, 34)');

  await test.step('the system asks for less transparency: the window is solid', async (step) => {
    // Set through CDP, on Chromium only; on the macOS app it is checked by hand (NT-MAC-26).
    step.skip(browserName === 'webkit', 'prefers-reduced-transparency is set through CDP');
    await setTransparency(page, 'reduce');
    await mark('win', 'glass');
    await expect(html).toHaveCSS('background-color', 'rgb(17, 24, 34)');
  });
});

// main.tsx marks the exe's page with the material under its window (VA5), never the web build (the
// case above): glass on macOS; on Windows by the client hints of the machine (Playwright's Desktop
// Edge says Windows 10: solid).
test('the exe marks its page with the material under its window (VA5)', async ({
  page,
  browserName,
}) => {
  await asExe(page);
  await page.goto('/#/team');
  await expect(page.locator('html')).toHaveAttribute(
    'data-backdrop',
    browserName === 'webkit' ? 'glass' : /^(glass|solid)$/,
  );
});

// The macOS glass under the sidebar is the system's material, as light as the wallpaper makes it
// (ADR-0013 appendix 11/11/2026 §7). On the Owner's Mac, under a dark wallpaper, it measured
// rgb(50, 52, 57) beneath the pane (3.77:1 for "Đã lưu" in --text-3; PR 1414, 19/11/2026). Here
// it stands at 1.6 times that, for a light wallpaper (NT-MAC-26 (g) measures it on the Mac): every
// text of the sidebar reads at AA on it, at the lightest place of the pane.
const BRIGHTEST_GLASS = 'rgb(80, 83, 91)';

test('the text of the macOS sidebar reads at AA on the glass at its brightest (VA5)', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/team');
  await setTransparency(page, 'no-preference');
  await expect(sidebar(page).getByRole('paragraph').first()).toHaveText(/^Đã lưu/);
  // The exe's window on macOS, the system's material under the page instead of the stand-in's.
  await page.evaluate((glass) => {
    document.getElementById('exe-window-stand-in')?.remove();
    document.documentElement.dataset.os = 'mac';
    document.documentElement.dataset.backdrop = 'glass';
    document.documentElement.style.backgroundColor = glass;
  }, BRIGHTEST_GLASS);
  expect(await lowestContrast(sidebar(page))).toBeGreaterThanOrEqual(4.5);
});

// The warning of a failed save sits in the column above the toolbar (SaveWarning): the Windows pane
// keeps its one corner and its edge at the top of the window, and no edge crosses it where the
// toolbar starts (review of PR 1414 @574f57e).
test('the Windows pane keeps its edge at the top of the window while the save warning shows (VA5)', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/team');
  await markOs(page, 'win');
  await page.evaluate(() => (window.exe.failSaves = 'DISK_FULL'));
  await page.getByRole('button', { name: '+ Team' }).click();
  const dialog = page.getByRole('dialog', { name: 'Team mới' });
  await dialog.getByRole('textbox', { name: 'Tên team' }).fill('Bình Minh 2');
  await dialog.getByRole('button', { name: 'Tạo team' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('alert').filter({ hasText: 'Chưa lưu được' })).toBeVisible();

  const left = (await box(page.locator('[data-slot="content-pane"]'))).x;
  const bar = await box(toolbar(page));
  expect(bar.y).toBeGreaterThan(20);
  // The top edge and the left edge of the pane, at the top of the window.
  const top = await shade(page, { x: left + 120, y: 0, width: 1, height: 4 });
  expect(top.at(0)! - top.at(-1)!, 'the top edge').toBeGreaterThan(10);
  const side = await shade(page, { x: left, y: bar.y + 2, width: 4, height: 1 });
  expect(side.at(0)! - side.at(-1)!, 'the left edge by the toolbar').toBeGreaterThan(10);
  // Where the toolbar starts, the pane goes on: no line across it (left of the warning, which has
  // a border of its own, 28 px in).
  const across = await shade(page, { x: left + 14, y: bar.y - 2, width: 1, height: 5 });
  expect(Math.max(...across) - Math.min(...across), 'no line at the toolbar').toBeLessThan(8);
});

/**
 * The pixels of a PNG screenshot, as RGBA rows of its device pixels, with its width. Decoded on a
 * blank page of the same browser, which decodes the PNG.
 */
async function decoded(page: Page, png: Buffer) {
  const blank = await page.context().newPage();
  try {
    return await blank.evaluate(async (data) => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      const { data: pixels } = context.getImageData(0, 0, canvas.width, canvas.height);
      return { width: canvas.width, height: canvas.height, pixels: [...pixels] };
    }, png.toString('base64'));
  } finally {
    await blank.close();
  }
}

/**
 * The lightness (the sum of red, green and blue) of each device pixel of a strip of the page, in
 * order: down a strip one pixel wide, across one a pixel high.
 */
async function shade(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const { pixels } = await decoded(page, await page.screenshot({ clip }));
  const sums: number[] = [];
  for (let i = 0; i < pixels.length; i += 4)
    sums.push(pixels[i]! + pixels[i + 1]! + pixels[i + 2]!);
  return sums;
}

/**
 * How many pixels of a screenshot are the champagne of the outline: light, and warm, where the
 * navy of the logo and the dark behind it are both blue.
 */
async function champagnePixels(page: Page, png: Buffer, rows: { from: number; to: number }) {
  const { width, height, pixels } = await decoded(page, png);
  const top = Math.round(height * rows.from);
  const bottom = Math.round(height * rows.to);
  let count = 0;
  for (let i = top * width * 4; i < bottom * width * 4; i += 4) {
    if (pixels[i]! > 90 && pixels[i]! - pixels[i + 2]! > 20) count++;
  }
  return count;
}

// Review #1344: in the macOS app the outline drawn by four `drop-shadow` of half a pixel did not show, and
// the navy "Heritas" was lost on the dark sidebar; the outline is now in the image. Its letters are
// navy below the gold leaf of the "i": there, any champagne is the outline, and with no outline
// there is none.
const LETTERS = { from: 0.45, to: 1 };

test('the navy "Heritas" of the logo is outlined in champagne, on Edge and on WebKit (review #1344)', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  const word = sidebar(page).getByRole('img', { name: 'Heritas L-CRM' }).locator('img').nth(1);
  await expect
    .poll(() => word.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .not.toBe(0);
  const logo = await sidebar(page).getByRole('img', { name: 'Heritas L-CRM' }).screenshot();
  await testInfo.attach('logo', { body: logo, contentType: 'image/png' });

  const shot = await word.screenshot();
  // The outline of the seven letters counts some 440 pixels at 1x and 1 330 at 2x, on Edge and on
  // WebKit alike. Drawn by `drop-shadow`, Playwright's WebKit showed a fainter one, 199 and 541
  // (run 44290278598 of macos.yml): under these.
  const scale = await page.evaluate(() => devicePixelRatio);
  expect([1, 2]).toContain(scale);
  expect(await champagnePixels(page, shot, LETTERS)).toBeGreaterThan(scale === 1 ? 300 : 800);
});

// ---- The toast and the command bar (VA9 brings their review notes) ----

/** The polite live region while it holds a toast of these words: what a screen reader reads out. */
const toastRegion = (page: Page, text: string) =>
  page.locator('[aria-live="polite"]').filter({ hasText: text });
const DELETED = 'Đã chuyển team vào Thùng rác';

/**
 * On Team & nhân sự, the clock held: a new team deleted, its toast shown in the live region of the
 * window, which was there before it (a screen reader reads what comes in). The confirm closed as
 * the toast showed: the toast is in that same region.
 */
async function deletedTeamToast(page: Page) {
  await page.goto('/#/team');
  await holdClock(page);
  await page.getByRole('button', { name: '+ Team' }).click();
  const made = page.getByRole('dialog', { name: 'Team mới' });
  await made.getByRole('textbox', { name: 'Tên team' }).fill('Thiên Hà');
  await made.getByRole('button', { name: 'Tạo team' }).click();
  await page
    .getByRole('region', { name: 'Thành viên team Thiên Hà' })
    .getByRole('button', { name: 'Xóa team' })
    .click();
  const live = await page.evaluateHandle(() =>
    [...document.querySelectorAll('[aria-live="polite"]')].find((n) => !n.closest('dialog'))!,
  );
  await page
    .getByRole('dialog', { name: 'Xóa team Thiên Hà?' })
    .getByRole('button', { name: 'Xóa', exact: true })
    .click();
  await expect(toastRegion(page, DELETED)).toBeVisible();
  expect(await live.evaluate((n) => n.isConnected && n.textContent)).toContain(DELETED);
  // Wherever it shows from now on, read out or not.
  return { made, deleted: page.getByText(DELETED) };
}

/**
 * `deletedTeamToast`, then "Team mới" open over it: the toast moves into the region of the dialog,
 * its Hoàn tác in reach.
 */
async function toastInDialog(page: Page) {
  const shown = await deletedTeamToast(page);
  await page.getByRole('button', { name: '+ Team' }).click();
  await expect(shown.made.getByRole('button', { name: 'Hoàn tác', exact: true })).toBeVisible();
  return shown;
}

test('a toast lies over the dialog open, and its button takes the click (review #1404)', async ({
  page,
}) => {
  const { made } = await toastInDialog(page);
  const inDialog = await page.evaluateHandle(() =>
    document.querySelector('dialog:modal [aria-live="polite"]')!,
  );
  await page.getByRole('button', { name: 'Hoàn tác', exact: true }).click();
  // The toast of what came back shows while the dialog is open, over it.
  const restored = toastRegion(page, 'Đã khôi phục team Thiên Hà');
  await expect(restored).toBeVisible();
  await expect(made).toBeVisible();
  const box = (await restored.boundingBox())!;
  const top = await page.evaluate(
    ([x, y]) => document.elementFromPoint(x!, y!)?.closest('[aria-live]')?.textContent ?? '',
    [box.x + box.width / 2, box.y + box.height / 2],
  );
  expect(top).toContain('Đã khôi phục team Thiên Hà');
  // Into the region the dialog had before, so it is read; the focus stays in the dialog.
  expect(await inDialog.evaluate((n) => n.isConnected && n.textContent)).toContain('Đã khôi phục');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog:modal'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(made).toBeHidden();
  const teams = page.getByRole('region', { name: 'Team', exact: true });
  await expect(teams.getByRole('button', { name: /^Thiên Hà / })).toBeVisible();
});

test('a new toast that comes under the pointer stays while the pointer is on it (review #1420)', async ({
  page,
}) => {
  await page.goto('/#/customers');
  await holdClock(page);
  const eye = page.getByRole('banner').getByRole('button', { name: 'Che tên khách hàng' });
  await eye.click();
  const masked = toastRegion(page, 'Đang che tên khách hàng');
  await expect(masked).toBeVisible();
  await masked.getByText('Đang che tên khách hàng').hover();
  // By the keyboard, the pointer left where it was: the next toast takes the place under it.
  await eye.focus();
  await page.keyboard.press('Enter');
  const shown = toastRegion(page, 'Đã hiện lại tên khách hàng');
  await expect(shown).toBeVisible();
  await page.clock.runFor(4_300);
  await expect(shown).toBeVisible();
  // Once the pointer leaves, it has 4,2 s again.
  await page.mouse.move(10, 10);
  await page.clock.runFor(4_300);
  await expect(shown).toBeHidden();
});

test('the focus on the toast of a dialog that closes holds it no longer: it leaves 4,2 s later (review #1404)', async ({
  page,
}) => {
  const { made, deleted } = await toastInDialog(page);
  await made.getByRole('button', { name: 'Hoàn tác', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(made).toBeHidden();
  await page.clock.runFor(4_300);
  await expect(deleted).toBeHidden();
});

test('the copy a dialog leaves for its move out shows no toast of its own (review #1404)', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/team');
  await page.getByRole('button', { name: '+ Team' }).click();
  const made = page.getByRole('dialog', { name: 'Team mới' });
  await made.getByRole('textbox', { name: 'Tên team' }).fill('Thiên Hà');
  await made.getByRole('button', { name: 'Tạo team' }).click();
  await page
    .getByRole('region', { name: 'Thành viên team Thiên Hà' })
    .getByRole('button', { name: 'Xóa team' })
    .click();
  // How the region of the toast is drawn in each copy, as it comes.
  await page.evaluate(() => {
    const seen: string[] = [];
    (window as unknown as { copies: string[] }).copies = seen;
    new MutationObserver((records) => {
      for (const node of records.flatMap((record) => [...record.addedNodes])) {
        const region = node instanceof HTMLDialogElement && node.querySelector('[popover]');
        if (region) seen.push(getComputedStyle(region).display);
      }
    }).observe(document.body, { childList: true, subtree: true });
  });
  await page
    .getByRole('dialog', { name: 'Xóa team Thiên Hà?' })
    .getByRole('button', { name: 'Xóa', exact: true })
    .click();
  const copies = () => page.evaluate(() => (window as unknown as { copies: string[] }).copies);
  await expect.poll(async () => (await copies()).length).toBeGreaterThan(0);
  expect(await copies()).toEqual((await copies()).map(() => 'none'));
});

// Review of PR 1493: the toast moves to the region of the window, or of the dialog, under a pointer
// that stays where it was: it gets no enter of its own, and the pointer still holds it; once the
// pointer moves away, it holds it no longer.
test('the toast of a dialog that closes stays while the pointer stays on it', async ({ page }) => {
  const { made, deleted } = await toastInDialog(page);
  await made.getByText(DELETED).hover();
  await page.keyboard.press('Escape');
  await expect(made).toBeHidden();
  await page.clock.runFor(4_300);
  await expect(deleted).toBeVisible();
  // Once the pointer leaves, it has 4,2 s again.
  await page.mouse.move(10, 10);
  await page.clock.runFor(4_300);
  await expect(deleted).toBeHidden();
});

test('a toast under the pointer as a dialog opens by the keyboard stays while the pointer is on it', async ({
  page,
}) => {
  const { made, deleted } = await deletedTeamToast(page);
  await deleted.hover();
  await page.getByRole('button', { name: '+ Team' }).focus();
  await page.keyboard.press('Enter');
  await expect(made.getByText(DELETED)).toBeVisible();
  await page.clock.runFor(4_300);
  await expect(deleted).toBeVisible();
});

test('a toast that only moves as a dialog opens or closes is not read out again; the next one is', async ({
  page,
}) => {
  const { made, deleted } = await toastInDialog(page);
  const live = () => deleted.evaluate((node) => !!node.closest('[aria-live], [role="alert"]'));
  expect(await live()).toBe(false);
  await page.keyboard.press('Escape');
  await expect(made).toBeHidden();
  await expect(deleted).toBeVisible();
  expect(await live()).toBe(false);
  await page.getByRole('button', { name: 'Hoàn tác', exact: true }).click();
  await expect(toastRegion(page, 'Đã khôi phục team Thiên Hà')).toBeVisible();
});

// Review of PR 1493: at 1 100 × 700 "Khách hàng mới" reaches the bottom of the window, where the toast
// lies: there it lies over the buttons of the foot instead. Measured once the dialog has stopped:
// as it moves in, its buttons stand higher (`motion-dialog`).
for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`the toast over a dialog as tall as the window leaves every point of its buttons in reach (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize({ width: 1100, height: 700 });
    await page.goto('/#/customers');
    await holdClock(page);
    await page.getByRole('banner').getByRole('button', { name: 'Che tên khách hàng' }).click();
    await expect(page.getByText('Đang che tên khách hàng')).toBeVisible();
    await page.getByRole('button', { name: '+ Khách hàng' }).click();
    const create = page.getByRole('dialog', { name: 'Khách hàng mới' });
    await expect(create.getByText('Đang che tên khách hàng')).toBeVisible();
    // Read again until it holds: the page's clock held, no frame of the page can be waited for.
    const measured = () =>
      create.evaluate((dialog) => {
        if (dialog.getAnimations().length > 0) return 'moving';
        // The region of the dialog is as large as its toast.
        const toast = dialog.querySelector('[popover]')!.getBoundingClientRect();
        const foot = [...dialog.querySelectorAll('button')].filter((button) =>
          ['Hủy', 'Lưu KH'].includes(button.textContent ?? ''),
        );
        return {
          toast: [toast.height > 0, toast.bottom <= innerHeight],
          foot: foot.map((button) => {
            const { left, right, top, bottom } = button.getBoundingClientRect();
            const apart =
              toast.bottom <= top ||
              bottom <= toast.top ||
              toast.right <= left ||
              right <= toast.left;
            // Across it and down it, every point takes its click (its rounded corners aside).
            const points: [number, number][] = [];
            for (let x = left + 1; x < right; x += 2) points.push([x, (top + bottom) / 2]);
            for (let y = top + 1; y < bottom; y += 2) points.push([(left + right) / 2, y]);
            const reached = points.every(([x, y]) =>
              button.contains(document.elementFromPoint(x, y)),
            );
            return [button.textContent, apart, reached];
          }),
        };
      });
    await expect.poll(measured).toEqual({
      toast: [true, true],
      foot: [
        ['Hủy', true, true],
        ['Lưu KH', true, true],
      ],
    });
  });
}

// Review of PR 1507: with motion, "Khách hàng mới" opened by the keyboard first leaves the toast at the
// bottom of the window, its buttons higher as the macOS sheet drops in (`motion-dialog`), then lifts
// it clear of them once it has moved in, under a pointer that has not moved: whether the pointer
// holds it is read again there.
const MASKING = 'Đang che tên khách hàng';

/** Khách hàng at 1 100 × 700, motion on, as on macOS, the clock held: the toast of the eye shown. */
async function maskingToast(page: Page) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1100, height: 700 });
  await page.goto('/#/customers');
  await markOs(page, 'mac');
  await holdClock(page);
  await page.getByRole('banner').getByRole('button', { name: 'Che tên khách hàng' }).click();
  await expect(page.getByText(MASKING)).toBeVisible();
  return page.getByText(MASKING);
}

/**
 * "Khách hàng mới" opened by the keyboard, the pointer left where it is; once it has moved in and
 * the toast lies over its buttons, where the toast lies.
 */
async function openLifting(page: Page) {
  await page.getByRole('button', { name: '+ Khách hàng' }).focus();
  await page.keyboard.press('Enter');
  const create = page.getByRole('dialog', { name: 'Khách hàng mới' });
  const toast = create.getByText(MASKING);
  const cancel = create.getByRole('button', { name: 'Hủy', exact: true });
  // Read again until it holds: the page's clock held, no frame of the page can be waited for.
  await expect
    .poll(async () => {
      if (await create.evaluate((dialog) => dialog.getAnimations().length > 0)) return false;
      const [shown, foot] = await Promise.all([box(toast), box(cancel)]);
      return shown.y + shown.height <= foot.y;
    })
    .toBe(true);
  return box(toast);
}

/** Whether the point `x`, `y` is inside `shown`. */
const holds = (shown: Awaited<ReturnType<typeof box>>, x: number, y: number) =>
  x > shown.x && x < shown.x + shown.width && y > shown.y && y < shown.y + shown.height;

test('a toast lifted out from under a still pointer as a dialog moves in leaves on time (review #1507)', async ({
  page,
}) => {
  const toast = await maskingToast(page);
  const before = await box(toast);
  const [x, y] = [before.x + before.width / 2, before.y + before.height / 2];
  await page.mouse.move(x, y);
  const lifted = await openLifting(page);
  expect(holds(lifted, x, y)).toBe(false);
  // Nothing moves from here: a toast that leaves is gone at once.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.runFor(4_300);
  await expect(toast).toBeHidden();
});

test('a toast lifted under a still pointer as a dialog moves in stays while the pointer is on it (review #1507)', async ({
  page,
}) => {
  const toast = await maskingToast(page);
  // Where it lies over the buttons, from a first opening; the pointer then there, off the toast.
  const lifted = await openLifting(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Khách hàng mới' })).toBeHidden();
  // The copy the dialog leaves for its move out gone too.
  await expect(toast).toHaveCount(1);
  const [x, y] = [lifted.x + lifted.width / 2, lifted.y + lifted.height / 2];
  await page.mouse.move(x, y);
  expect(holds(await box(toast), x, y)).toBe(false);
  expect(holds(await openLifting(page), x, y)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.runFor(4_300);
  await expect(toast).toBeVisible();
  // Once the pointer leaves, it has 4,2 s again.
  await page.mouse.move(10, 10);
  await page.clock.runFor(4_300);
  await expect(toast).toBeHidden();
});

// Review of PR 1525: the region of the window lies at the middle of its bottom edge, so the toast
// moves as the window changes size (Win+↑, Snap, Ctrl+Cmd+F), under a pointer that has not moved:
// whether the pointer holds it is read again there. Only the height changes, so the toast only
// moves up or down, and the pointer stays in the window.

/**
 * The corner of the window at `x`, `y` of the screen, as the page reads it (`screenX`, `screenY`
 * and their other names): Playwright changes the size of the page, and says nothing of where its
 * window lies.
 */
async function placeWindow(page: Page, x: number, y: number) {
  await page.evaluate(
    ([x, y]) => {
      const corner = { screenX: x, screenLeft: x, screenY: y, screenTop: y };
      for (const [name, value] of Object.entries(corner))
        Object.defineProperty(window, name, { configurable: true, get: () => value });
    },
    [x, y] as const,
  );
  // Not on a browser that keeps its own.
  const read = await page.evaluate(() => [screenX, screenLeft, screenY, screenTop]);
  expect(read).toEqual([x, x, y, y]);
}

/**
 * Khách hàng at 1 280 × 720, its window not maximised (its corner at 200, 120 of the screen, where
 * it stays unless the case moves it), the clock held: the toast of the eye in the region of the
 * window.
 */
async function windowToast(page: Page) {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/#/customers');
  await placeWindow(page, 200, 120);
  await holdClock(page);
  await page.getByRole('banner').getByRole('button', { name: 'Che tên khách hàng' }).click();
  await expect(page.getByText(MASKING)).toBeVisible();
  return page.getByText(MASKING);
}

/** The window `height` px high, once the page has heard of it: after the app's own listener. */
async function resizeTo(page: Page, height: number) {
  type Resized = { resized: Promise<void> };
  await page.evaluate(() => {
    (window as unknown as Resized).resized = new Promise((done) =>
      addEventListener('resize', () => done(), { once: true }),
    );
  });
  await page.setViewportSize({ width: 1280, height });
  await page.evaluate(() => (window as unknown as Resized).resized);
}

test('a toast that moves from under a still pointer as the window changes size leaves on time (review #1525)', async ({
  page,
}) => {
  const toast = await windowToast(page);
  const before = await box(toast);
  const [x, y] = [before.x + before.width / 2, before.y + before.height / 2];
  await page.mouse.move(x, y);
  await resizeTo(page, 820);
  expect(holds(await box(toast), x, y)).toBe(false);
  await page.clock.runFor(4_300);
  await expect(toast).toBeHidden();
});

test('a toast that moves under a still pointer as the window changes size stays while the pointer is on it (review #1525)', async ({
  page,
}) => {
  const toast = await windowToast(page);
  const before = await box(toast);
  // Where it will lie in a window 100 px lower, off it for now.
  const [x, y] = [before.x + before.width / 2, before.y + before.height / 2 - 100];
  await page.mouse.move(x, y);
  expect(holds(before, x, y)).toBe(false);
  await resizeTo(page, 620);
  expect(holds(await box(toast), x, y)).toBe(true);
  await page.clock.runFor(4_300);
  await expect(toast).toBeVisible();
  // Once the pointer leaves, it has 4,2 s again.
  await page.mouse.move(10, 10);
  await page.clock.runFor(4_300);
  await expect(toast).toBeHidden();
});

// Review of PR 1535: as it changes size, the window may move its corner on the screen too (Win+↑
// from a window not maximised, Snap, Ctrl+Cmd+F). A still pointer is then no longer where it was
// in the window, and the page may hear of no move of it: where it was holds the toast no more,
// until it moves again.

/**
 * The pointer still on the toast of the window as the window moves its corner to the corner of the
 * screen and grows 4 px higher: the toast lies 4 px lower, still under where the pointer was in the
 * window. Where that was.
 */
async function movedUnder(page: Page) {
  const toast = await windowToast(page);
  const before = await box(toast);
  const [x, y] = [before.x + before.width / 2, before.y + before.height / 2];
  await page.mouse.move(x, y);
  await placeWindow(page, 0, 0);
  await resizeTo(page, 724);
  expect(holds(await box(toast), x, y)).toBe(true);
  return { toast, x, y };
}

test('a toast under where a still pointer was as the window moves and changes size leaves on time (review #1535)', async ({
  page,
}) => {
  const { toast } = await movedUnder(page);
  await page.clock.runFor(4_300);
  await expect(toast).toBeHidden();
});

test('the toast of a window that moved as it changed size stays once the pointer moves on it again (review #1535)', async ({
  page,
}) => {
  const { toast, x, y } = await movedUnder(page);
  await page.clock.runFor(2_000);
  await page.mouse.move(x + 2, y);
  // Held: 4,2 s from when the window moved are gone.
  await page.clock.runFor(4_300);
  await expect(toast).toBeVisible();
  // Once the pointer leaves, it has 4,2 s again.
  await page.mouse.move(10, 10);
  await page.clock.runFor(4_300);
  await expect(toast).toBeHidden();
});

const palette = (page: Page) => page.getByRole('dialog', { name: 'Ô lệnh' });
const paletteField = (page: Page) => palette(page).getByRole('combobox', { name: 'Ô lệnh' });

test('the key of the command bar held down opens it once (review #1491)', async ({
  page,
  browserName,
}) => {
  await page.goto('/#/customers');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Khách hàng');
  const modifier = browserName === 'webkit' ? 'Meta' : 'Control';
  await page.keyboard.down(modifier);
  await page.keyboard.down('k');
  // Held, the key repeats: the bar stays open.
  await page.keyboard.down('k');
  await page.keyboard.up('k');
  await page.keyboard.up(modifier);
  await expect(palette(page)).toBeVisible();
});

test('a drag from the field of the command bar out of it keeps the bar and what is typed (review #1491)', async ({
  page,
}) => {
  await page.goto('/#/customers');
  await page
    .getByRole('banner')
    .getByRole('button', { name: /^Tìm hay chạy lệnh/ })
    .click();
  await paletteField(page).fill('nguyen van');
  const field = (await paletteField(page).boundingBox())!;
  const dialog = (await palette(page).boundingBox())!;
  await page.mouse.move(field.x + field.width - 4, field.y + field.height / 2);
  await page.mouse.down();
  await page.mouse.move(field.x + field.width - 4, dialog.y - 30, { steps: 4 });
  await page.mouse.up();
  await expect(palette(page)).toBeVisible();
  await expect(paletteField(page)).toHaveValue('nguyen van');
  // A press and its release both on what is dimmed still close it.
  await page.mouse.click(dialog.x + dialog.width / 2, dialog.y - 30);
  await expect(palette(page)).toBeHidden();
});

test('"no result" of the command bar is said beside its list, not inside it (review #1491)', async ({
  page,
}) => {
  await page.goto('/#/customers');
  await page
    .getByRole('banner')
    .getByRole('button', { name: /^Tìm hay chạy lệnh/ })
    .click();
  await paletteField(page).fill('xyz');
  await expect(palette(page).getByRole('status')).toContainText('xyz');
  await expect(palette(page).getByRole('listbox').getByRole('status')).toHaveCount(0);
});

test('closed when what opened it is gone, the command bar gives the focus to the name of the screen (review #1491)', async ({
  page,
  browserName,
}) => {
  await page.goto('/#/appointments');
  const scope = page.getByRole('banner').getByRole('button', { name: /^Góc nhìn: / });
  await scope.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitemradio', { name: 'Toàn bộ' })).toBeFocused();
  await page.keyboard.press(browserName === 'webkit' ? 'Meta+k' : 'Control+k');
  await expect(palette(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(palette(page)).toBeHidden();
  await expect(page.getByRole('heading', { level: 1, name: 'Lịch hẹn' })).toBeFocused();
});
