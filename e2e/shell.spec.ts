import { expect, test, type Locator, type Page } from './fixtures';
import {
  asExe,
  contrast,
  drawnCorner,
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
  // Cài đặt puts nothing there: the toolbar has the name and the eye of the shell alone (VA6a).
  await nav(page).getByRole('link', { name: 'Cài đặt' }).click();
  await expect(title).toHaveText('Cài đặt');
  await expect(toolbar(page).getByRole('button')).toHaveCount(1);
  await expect(toolbar(page).getByRole('button', { name: 'Che tên khách hàng' })).toBeVisible();
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

  // Tổng quan has the eye of the name mask (VA6a), the two pills and no main button yet (D8).
  await nav(page).getByRole('link', { name: 'Tổng quan' }).click();
  await expect(toolbar(page).getByRole('button', { name: /^Góc nhìn: / })).toBeVisible();
  await expect(period).toBeVisible();
  await expect(toolbar(page).getByRole('button')).toHaveCount(5);
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

// L228: lost, the attribute leaves every test green while the macOS window no longer moves by the
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
  // Not the setting of the machine of the run: Playwright gives this media feature no default (L194).
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
    // Solid over the whole bar, fading out in the 18 px below it only (L225).
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

// L179: in the macOS app the outline drawn by four `drop-shadow` of half a pixel did not show, and
// the navy "Heritas" was lost on the dark sidebar; the outline is now in the image. Its letters are
// navy below the gold leaf of the "i": there, any champagne is the outline, and with no outline
// there is none.
const LETTERS = { from: 0.45, to: 1 };

test('the navy "Heritas" of the logo is outlined in champagne, on Edge and on WebKit (L179)', async ({
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
