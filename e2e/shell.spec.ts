import { expect, test, type Locator, type Page } from './fixtures';
import { drawnCorner, markOs, pickFirstRm, pickScope, right, setTransparency } from './support';

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
  // Cài đặt puts nothing there: the toolbar has the name alone.
  await nav(page).getByRole('link', { name: 'Cài đặt' }).click();
  await expect(title).toHaveText('Cài đặt');
  await expect(toolbar(page).getByRole('button')).toHaveCount(0);
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

  // Tổng quan has the two pills and no main button yet (D8).
  await nav(page).getByRole('link', { name: 'Tổng quan' }).click();
  await expect(toolbar(page).getByRole('button', { name: /^Góc nhìn: / })).toBeVisible();
  await expect(period).toBeVisible();
  await expect(toolbar(page).getByRole('button')).toHaveCount(4);
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

  await test.step('the system asks for less transparency: a solid edge, nothing blurred', async (step) => {
    // Set through CDP, on Chromium only; on the macOS app it is checked by hand (NT-MAC-19).
    step.skip(browserName === 'webkit', 'prefers-reduced-transparency is set through CDP');
    await setTransparency(page, 'reduce');
    expect((await edge()).image).toMatch(/^linear-gradient\(.*rgb\(11, 16, 23\) 50%, .*\)$/);
    expect((await edge()).blur).toBe('none');
  });
});

/**
 * How many pixels of a screenshot are the champagne of the outline: light, and warm, where the
 * navy of the logo and the dark behind it are both blue. Counted on a blank page of the same
 * browser, which decodes the PNG.
 */
async function champagnePixels(page: Page, png: Buffer, rows: { from: number; to: number }) {
  const blank = await page.context().newPage();
  try {
    return await blank.evaluate(
      async ({ data, rows }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${data}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);
        const top = Math.round(canvas.height * rows.from);
        const height = Math.round(canvas.height * rows.to) - top;
        const { data: pixels } = context.getImageData(0, top, canvas.width, height);
        let count = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i]! > 90 && pixels[i]! - pixels[i + 2]! > 20) count++;
        }
        return count;
      },
      { data: png.toString('base64'), rows },
    );
  } finally {
    await blank.close();
  }
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
