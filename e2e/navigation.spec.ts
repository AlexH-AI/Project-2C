import { expect, test, type Locator, type Page } from './fixtures';
import {
  asExe,
  lowestContrast,
  periodPill,
  pickScope,
  scopeMenu,
  scopePill,
  screenSub,
  teamRow,
  trackConsoleErrors,
} from './support';

const SCREENS = ['Tổng quan', 'Lịch hẹn', 'Khách hàng', 'Báo cáo', 'Team & nhân sự', 'Cài đặt'];
// --accent and --text-2, as the browser reports them.
const ACCENT = 'rgb(217, 178, 106)';
const TEXT_2 = 'rgb(174, 185, 200)';

test('the sidebar lists the six screens, each with an icon', async ({ page }) => {
  await page.goto('/');

  const links = page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('link');
  await expect(links).toHaveText(SCREENS);
  // Team & nhân sự and Cài đặt sit under the "Quản lý" group label.
  await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })).toContainText(
    /Báo cáoQuản lýTeam & nhân sự/,
  );
  for (const link of await links.all()) {
    await expect(link.locator('svg')).toHaveCount(1);
  }
});

test('the smallest window shows the logo, the last item, the save state and the slogan without scrolling (T-308, VA4a)', async ({
  page,
}) => {
  // tauri.conf.json minWidth / minHeight. The save state of web mode is the longest it reads.
  await page.setViewportSize({ width: 1100, height: 700 });
  await page.goto('/');
  const sidebar = page.getByRole('complementary');
  const last = sidebar.getByRole('link', { name: 'Cài đặt' });
  const saveState = sidebar.getByText('Bản web — dữ liệu chỉ trong trình duyệt');

  await expect(sidebar.getByRole('img', { name: 'Heritas L-CRM' })).toBeInViewport({ ratio: 1 });
  await expect(last).toBeInViewport({ ratio: 1 });
  await expect(saveState).toBeInViewport({ ratio: 1 });
  await expect(sidebar.getByText('Where legacy meets trust')).toBeInViewport({ ratio: 1 });
  // The save state is at the foot of the sidebar: it does not cover the last item.
  const lastBox = (await last.boundingBox())!;
  expect(lastBox.y + lastBox.height).toBeLessThanOrEqual((await saveState.boundingBox())!.y);
});

test('opens on the overview with it selected', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan');
  await expect(page.getByRole('link', { name: 'Tổng quan' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('clicking each sidebar item switches the screen and marks it current', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });

  for (const name of SCREENS) {
    await nav.getByRole('link', { name }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
    await expect(nav.locator('[aria-current="page"]')).toHaveText([name]);
    // The chosen item: its icon in the accent, its fill an element of its own (VA4a).
    await expect(nav.getByRole('link', { name }).locator('svg')).toHaveCSS(
      'color',
      'rgb(217, 178, 106)',
    );
  }
  expect(errors).toEqual([]);
});

test('reopening the app returns to the last screen', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto('/');
  // The sidebar's: each KPI tile of Tổng quan is a link to Báo cáo too ("Mở … ở Báo cáo").
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Báo cáo' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Báo cáo');

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Báo cáo');
  expect(errors).toEqual([]);
});

test('a customer profile keeps Customers selected', async ({ page }) => {
  await page.goto('/#/customers/kh-1');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ khách hàng');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
  await expect(nav.getByRole('link', { name: 'Khách hàng' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('a new screen takes the focus on its heading and names the window; back on Customers, the card just seen (DR6-35)', async ({
  page,
}) => {
  await page.goto('/#/customers');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toHaveText('Khách hàng');
  await expect(page).toHaveTitle('Khách hàng · Heritas L-CRM');
  // Opening the app leaves the focus where it is.
  await expect(heading).not.toBeFocused();

  const card = page.locator('main a[href^="#/customers/"]').first();
  const href = (await card.getAttribute('href')) ?? '';
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(heading).toHaveText('Hồ sơ khách hàng');
  await expect(heading).toBeFocused();
  await expect(page).toHaveTitle('Hồ sơ khách hàng · Heritas L-CRM');

  await page.getByRole('link', { name: '← Khách hàng' }).focus();
  await page.keyboard.press('Enter');
  await expect(heading).toHaveText('Khách hàng');
  await expect(page.locator(`main a[href="${href}"]`)).toBeFocused();
  await expect(page).toHaveTitle('Khách hàng · Heritas L-CRM');

  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Báo cáo' })
    .click();
  await expect(heading).toHaveText('Báo cáo');
  await expect(heading).toBeFocused();
  await expect(page).toHaveTitle('Báo cáo · Heritas L-CRM');
});

test('the exe gives its title bar the name of the screen too, which Tauri does not take from the page (review of PR 638)', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  await asExe(page);
  const titleBar = () => page.evaluate(() => window.exe.title);
  await page.goto('/#/customers');
  await expect(page).toHaveTitle('Khách hàng · Heritas L-CRM');
  await expect.poll(titleBar).toBe('Khách hàng · Heritas L-CRM');

  await page.locator('main a[href^="#/customers/"]').first().click();
  await expect(page).toHaveTitle('Hồ sơ khách hàng · Heritas L-CRM');
  await expect.poll(titleBar).toBe('Hồ sơ khách hàng · Heritas L-CRM');
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Báo cáo' })
    .click();
  await expect(page).toHaveTitle('Báo cáo · Heritas L-CRM');
  await expect.poll(titleBar).toBe('Báo cáo · Heritas L-CRM');
  expect(errors).toEqual([]);
});

test('a screen opened from one scrolled down shows from its top; back on Customers, the row just seen (DR6-81)', async ({
  page,
}) => {
  // The lowest window (tauri.conf.json minHeight): in a 900 px one the profile opened below is
  // taller by less than 200 px since its appointments keep one line each (review of PR 838).
  await page.setViewportSize({ width: 1440, height: 700 });
  await page.goto('/#/customers');
  const scrollY = () => page.evaluate(() => window.scrollY);
  const lastCustomer = async () => {
    const last = page.locator('main a[href^="#/customers/"]').last();
    await last.scrollIntoViewIfNeeded();
    expect(await scrollY()).toBeGreaterThan(0);
    return last;
  };
  const profileName = page.locator('#customer-name');

  // From the bottom of the table to a profile taller than the window: its top, not the middle.
  await page.getByRole('radio', { name: 'Bảng' }).click();
  await (await lastCustomer()).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ khách hàng');
  await expect(profileName).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight + 200),
  ).toBe(true);
  await expect.poll(scrollY).toBe(0);
  await expect(profileName).toBeInViewport();

  // From the bottom of that profile to another screen by the sidebar.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(scrollY).toBeGreaterThan(0);
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Lịch hẹn' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lịch hẹn');
  await expect.poll(scrollY).toBe(0);

  // Back on Customers (Kanban again) from the profile of its last card: that card, in view. The
  // board fits a 900 px window; a lower one scrolls it.
  await page.setViewportSize({ width: 1440, height: 500 });
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Khách hàng' })
    .click();
  const card = await lastCustomer();
  const href = (await card.getAttribute('href')) ?? '';
  await card.click();
  await expect(profileName).toBeVisible();
  await expect.poll(scrollY).toBe(0);
  await page.getByRole('link', { name: '← Khách hàng' }).click();
  await expect(page.locator(`main a[href="${href}"]`)).toBeFocused();
  await expect(page.locator(`main a[href="${href}"]`)).toBeInViewport();
  expect(await scrollY()).toBeGreaterThan(0);
});

/** Resolves, in the page, to whether the screen changed within a second from now. */
const screenChange = (page: Page) =>
  page.evaluateHandle(() => ({
    changed: new Promise<boolean>((resolve) => {
      window.addEventListener('hashchange', () => resolve(true), { once: true });
      setTimeout(() => resolve(false), 1_000);
    }),
  }));

/** Presses the mouse's own Back (4) or Forward (5) button over `x`, `y`, as WebView2 gets it. */
async function sideButton(page: Page, button: 'back' | 'forward', [x, y]: [number, number]) {
  const cdp = await page.context().newCDPSession(page);
  for (const type of ['mousePressed', 'mouseReleased'] as const) {
    const buttons = type === 'mouseReleased' ? 0 : button === 'back' ? 8 : 16;
    await cdp.send('Input.dispatchMouseEvent', { type, x, y, button, buttons, clickCount: 1 });
  }
  await cdp.detach();
}

const middleOf = async (locator: Locator): Promise<[number, number]> => {
  const box = (await locator.boundingBox())!;
  return [box.x + box.width / 2, box.y + box.height / 2];
};

test('the exe keeps Back and Forward, as F5, from dropping a dialog half written (DR6-34)', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === 'webkit',
    "presses the mouse's Back and Forward buttons through CDP (Input.dispatchMouseEvent), which only Chromium has",
  );
  await asExe(page);
  await page.goto('/#/customers');
  await page.locator('main a[href^="#/customers/"]').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ khách hàng');
  const profile = page.url();
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const note = page.getByRole('dialog', { name: /^Ghi chú KYC · / });
  const text = note.getByRole('textbox', { name: 'Ghi chú' });
  await text.fill('Ghi chú dài đang soạn dở');

  // The keys the page kept from the webview, read once every listener of the page had them.
  const kept = await page.evaluateHandle(() => {
    const keys: string[] = [];
    window.addEventListener('keydown', (event) => {
      if (event.defaultPrevented) keys.push(event.key);
    });
    return keys;
  });
  await page.keyboard.press('Alt+ArrowLeft');
  await page.keyboard.press('Alt+ArrowRight');
  await page.keyboard.press('F5');
  expect(await kept.jsonValue()).toEqual(['ArrowLeft', 'ArrowRight', 'F5']);

  let change = await screenChange(page);
  await sideButton(page, 'back', await middleOf(text));
  expect(await change.evaluate((wait) => wait.changed)).toBe(false);
  expect(page.url()).toBe(profile);
  await expect(note).toBeVisible();
  await expect(text).toHaveValue('Ghi chú dài đang soạn dở');

  // Forward too, from the customers before the profile.
  await page.goBack();
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const create = page.getByRole('dialog', { name: 'Khách hàng mới' });
  const name = create.getByRole('textbox', { name: 'Họ tên' });
  await name.fill('Lan Đang Gõ');
  change = await screenChange(page);
  await sideButton(page, 'forward', await middleOf(name));
  expect(await change.evaluate((wait) => wait.changed)).toBe(false);
  await expect(name).toHaveValue('Lan Đang Gõ');
});

test('an unknown address falls back to the overview', async ({ page }) => {
  await page.goto('/#/nope');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan');
  await expect(page).toHaveURL(/#\/overview$/);
});

test('the scope pill names the scope shown and says it opens a menu', async ({ page }) => {
  await page.goto('/#/customers');
  const pill = scopePill(page);
  const menu = scopeMenu(page);

  await expect(pill).toHaveText('Toàn bộ');
  await expect(pill).toHaveAccessibleName('Góc nhìn: Toàn bộ');
  await expect(pill).toHaveAttribute('aria-haspopup', 'menu');
  await expect(pill).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toHaveCount(0);

  await pill.click();
  await expect(pill).toHaveAttribute('aria-expanded', 'true');
  const chosen = menu.getByRole('menuitemradio', { checked: true });
  await expect(chosen).toHaveText('Toàn bộ');
  // A row of the first level takes the gold when chosen.
  await expect(chosen).toHaveCSS('color', ACCENT);
  // A press outside closes it with nothing picked. On what takes the focus (the name of the
  // screen does), the focus goes there.
  const heading = page.getByRole('heading', { level: 1 });
  await heading.click();
  await expect(menu).toBeHidden();
  await expect(pill).toHaveText('Toàn bộ');
  await expect(heading).toBeFocused();

  // On an empty place, which takes no focus, the focus goes back to the pill, not to the page.
  await pill.click();
  await expect(menu).toBeVisible();
  await page.getByRole('main').click({ position: { x: 3, y: 3 } });
  await expect(menu).toBeHidden();
  await expect(pill).toBeFocused();
  // The pill closes its own menu too, and has the focus after (a click gives it none on macOS).
  await pill.click();
  await expect(menu).toBeVisible();
  await pill.click();
  await expect(menu).toBeHidden();
  await expect(pill).toBeFocused();
});

test('the menu lists the teams by name, each opening into "Cả team" and its RM', async ({
  page,
}) => {
  await page.goto('/#/customers');
  const pill = scopePill(page);
  const menu = scopeMenu(page);
  const rows = menu.getByRole('menuitemradio');
  await pill.click();
  // Each team with its number of RM; none is open while everyone is shown.
  await expect(menu.getByRole('menuitem')).toHaveText([
    /^Team Bình Minh\s*10 RM$/,
    /^Team Hừng Đông\s*10 RM$/,
    /^Team Sao Mai\s*10 RM$/,
  ]);
  await expect(rows).toHaveText(['Toàn bộ']);

  // A team row opens its rows and picks nothing: the menu stays open, the scope as it was.
  await teamRow(page, 'Sao Mai').click();
  await expect(teamRow(page, 'Sao Mai')).toHaveAttribute('aria-expanded', 'true');
  await expect(rows).toHaveCount(12);
  await expect(rows.nth(1)).toHaveText('Cả team');
  // Only an RM has metrics: the rows are the 10 RM of the team, by name.
  const names = (await rows.allTextContents()).slice(2);
  expect(names).toEqual([...names].sort(new Intl.Collator('vi').compare));
  await expect(pill).toHaveText('Toàn bộ');

  // One team is open at a time.
  await teamRow(page, 'Bình Minh').click();
  await expect(teamRow(page, 'Sao Mai')).toHaveAttribute('aria-expanded', 'false');
  await expect(rows).toHaveCount(12);

  await rows.nth(1).click();
  await expect(menu).toBeHidden();
  await expect(pill).toHaveText('Team Bình Minh');
  await expect(pill).toHaveAccessibleName('Góc nhìn: Team Bình Minh');

  // Opened again, the team of the scope is open and its row the one checked.
  await pill.click();
  await expect(teamRow(page, 'Bình Minh')).toHaveAttribute('aria-expanded', 'true');
  const whole = menu.getByRole('menuitemradio', { checked: true });
  await expect(whole).toHaveText('Cả team');
  // A row under a team keeps the colour of its level when chosen: its weight and the gold check
  // say it (mockup bao-cao.html, `.sub.on`).
  await expect(whole).toHaveCSS('color', TEXT_2);
  await expect(whole).toHaveCSS('font-weight', '600');
  await expect(whole.locator('svg')).toHaveCSS('color', ACCENT);
  const second = (await rows.nth(3).textContent()) ?? '';
  await rows.nth(3).click();
  await expect(pill).toHaveText(second);
  await expect(pill).toHaveAccessibleName(`Góc nhìn: ${second}`);

  await pill.click();
  await expect(menu.getByRole('menuitemradio', { checked: true })).toHaveText(second);
  await menu.getByRole('menuitemradio', { name: 'Toàn bộ' }).click();
  await expect(pill).toHaveText('Toàn bộ');
});

test('the menu of the scope by keyboard: arrows, Home, End, Enter, Esc', async ({ page }) => {
  await page.goto('/#/customers');
  const pill = scopePill(page);
  const menu = scopeMenu(page);
  const everyone = menu.getByRole('menuitemradio', { name: 'Toàn bộ' });

  // Opened, the focus is on the row of the scope shown.
  await pill.press('Enter');
  await expect(everyone).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(teamRow(page, 'Bình Minh')).toBeFocused();
  // Under the focus the row is lighter: its number of RM still reads at 4.5:1.
  expect(await lowestContrast(teamRow(page, 'Bình Minh'))).toBeGreaterThanOrEqual(4.5);
  await page.keyboard.press('End');
  await expect(teamRow(page, 'Sao Mai')).toBeFocused();
  // Around the ends.
  await page.keyboard.press('ArrowDown');
  await expect(everyone).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(teamRow(page, 'Sao Mai')).toBeFocused();

  // Enter on a team opens it; the focus stays on its row, its RM below it.
  await page.keyboard.press('Enter');
  await expect(teamRow(page, 'Sao Mai')).toHaveAttribute('aria-expanded', 'true');
  await expect(teamRow(page, 'Sao Mai')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitemradio', { name: 'Cả team' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(everyone).toBeFocused();

  // Esc closes it with nothing picked, the focus back on the pill.
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(pill).toBeFocused();
  await expect(pill).toHaveText('Toàn bộ');

  // Enter on a row of the choice picks it and closes the menu, the focus back on the pill.
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitemradio', { name: 'Cả team' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menu).toBeHidden();
  await expect(pill).toHaveText('Team Bình Minh');
  await expect(pill).toBeFocused();
});

test('the scope picker shows only on Overview, Customers, Appointments and Reports', async ({
  page,
}) => {
  const scope = scopePill(page);
  for (const [hash, shown] of [
    ['overview', true],
    ['appointments', true],
    ['customers', true],
    ['reports', true],
    ['team', false],
    ['settings', false],
  ] as const) {
    await page.goto(`/#/${hash}`);
    await expect(scope).toHaveCount(shown ? 1 : 0);
  }
  await page.goto('/#/customers');
  await page.locator('a[href^="#/customers/"]').first().click();
  await expect(page).toHaveURL(/#\/customers\/.+/);
  await expect(scope).toHaveCount(0);
});

test('the scope kept while its pill is hidden', async ({ page }) => {
  await page.goto('/#/customers');
  await pickScope(page, { team: 'Sao Mai' });

  await page.getByRole('link', { name: 'Team & nhân sự' }).click();
  await expect(scopePill(page)).toHaveCount(0);
  await page.getByRole('link', { name: 'Khách hàng' }).click();

  await expect(scopePill(page)).toHaveText('Team Sao Mai');
});

// NT-CH-04: one scope for every screen, applied where it lands with nothing to press.
test('the scope goes along from screen to screen; only Tổng quan and Báo cáo have the period pill', async ({
  page,
}) => {
  const sidebar = page.getByRole('navigation', { name: 'Điều hướng chính' });
  await page.goto('/#/customers');
  await pickScope(page, { team: 'Sao Mai' });
  await expect(periodPill(page)).toHaveCount(0);

  // Lịch hẹn keeps its period picker in the screen, the kinds in sight.
  await sidebar.getByRole('link', { name: 'Lịch hẹn' }).click();
  await expect(scopePill(page)).toHaveText('Team Sao Mai');
  await expect(periodPill(page)).toHaveCount(0);
  const picker = page.getByRole('main').getByRole('group', { name: 'Kỳ thống kê' });
  await expect(picker.getByRole('radiogroup', { name: 'Loại kỳ' })).toBeVisible();
  await expect(picker.getByRole('button', { name: 'Hôm nay' })).toBeVisible();

  await sidebar.getByRole('link', { name: 'Báo cáo' }).click();
  await expect(scopePill(page)).toHaveText('Team Sao Mai');
  await expect(periodPill(page)).toBeVisible();
  await expect(screenSub(page)).toHaveText(
    'Tháng 09/2026 · 01/09 – 15/09/2026 (MTD) · Team Sao Mai',
  );
  await expect(page.getByRole('table', { name: 'Tổng hợp' }).getByRole('rowheader')).toHaveText([
    'Team Sao Mai',
  ]);

  // Tổng quan counts every team in the Team scope, and says so.
  await sidebar.getByRole('link', { name: 'Tổng quan' }).click();
  await expect(scopePill(page)).toHaveText('Mọi team');
  await expect(periodPill(page)).toBeVisible();
  await expect(screenSub(page)).toHaveText(
    'Tháng 09/2026 · 01/09 – 15/09/2026 (MTD) · Mọi team (3 team)',
  );
  for (const screen of ['Lịch hẹn', 'Khách hàng', 'Báo cáo', 'Tổng quan']) {
    await sidebar.getByRole('link', { name: screen }).click();
    await expect(page.getByRole('button', { name: 'Lọc', exact: true })).toHaveCount(0);
  }
  // Back on a screen with a team of its own, the team picked is still the one.
  await sidebar.getByRole('link', { name: 'Khách hàng' }).click();
  await expect(scopePill(page)).toHaveText('Team Sao Mai');
});

test('the scope pill and its menu are 14px; a segmented button of the screen stays 12.5px', async ({
  page,
}) => {
  await page.goto('/#/customers');
  const size = (locator: import('@playwright/test').Locator) =>
    locator.evaluate((el) => getComputedStyle(el).fontSize);
  await expect.poll(() => size(scopePill(page))).toBe('14px');
  await scopePill(page).click();
  await expect.poll(() => size(scopeMenu(page).getByRole('menuitemradio').first())).toBe('14px');
  await page.keyboard.press('Escape');
  await expect
    .poll(() => size(page.getByRole('radiogroup', { name: 'Cách xem' }).getByRole('radio').first()))
    .toBe('12.5px');
});
