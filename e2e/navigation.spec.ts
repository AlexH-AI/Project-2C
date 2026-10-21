import { expect, test, type Locator, type Page } from './fixtures';
import { asExe, trackConsoleErrors } from './support';

const SCREENS = ['Tổng quan', 'Lịch hẹn', 'Khách hàng', 'Báo cáo', 'Team & nhân sự', 'Cài đặt'];

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
    await expect(nav.getByRole('link', { name })).toHaveCSS('color', 'rgb(217, 178, 106)');
  }
  expect(errors).toEqual([]);
});

test('reopening the app returns to the last screen', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Báo cáo' }).click();
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
  await expect(page).toHaveTitle('Khách hàng · Project-2C');
  // Opening the app leaves the focus where it is.
  await expect(heading).not.toBeFocused();

  const card = page.locator('main a[href^="#/customers/"]').first();
  const href = (await card.getAttribute('href')) ?? '';
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(heading).toHaveText('Hồ sơ khách hàng');
  await expect(heading).toBeFocused();
  await expect(page).toHaveTitle('Hồ sơ khách hàng · Project-2C');

  await page.getByRole('link', { name: '← Khách hàng' }).focus();
  await page.keyboard.press('Enter');
  await expect(heading).toHaveText('Khách hàng');
  await expect(page.locator(`main a[href="${href}"]`)).toBeFocused();
  await expect(page).toHaveTitle('Khách hàng · Project-2C');

  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Báo cáo' })
    .click();
  await expect(heading).toHaveText('Báo cáo');
  await expect(heading).toBeFocused();
  await expect(page).toHaveTitle('Báo cáo · Project-2C');
});

test('a screen opened from one scrolled down shows from its top; back on Customers, the row just seen (DR6-81)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
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
}) => {
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

test('the scope switch selects one of All / Team / RE', async ({ page }) => {
  await page.goto('/#/customers');
  const scope = page.getByRole('radiogroup', { name: 'Góc nhìn' });

  await expect(scope.getByRole('radio', { checked: true })).toHaveText('Toàn bộ');
  await scope.getByRole('radio', { name: 'Team' }).click();
  await expect(scope.getByRole('radio', { checked: true })).toHaveText('Team');
});

test('Team and RE scopes pick the team or RE next to the switch', async ({ page }) => {
  await page.goto('/#/customers');
  const scope = page.getByRole('radiogroup', { name: 'Góc nhìn' });
  const team = page.getByRole('combobox', { name: 'Team của góc nhìn' });
  const re = page.getByRole('combobox', { name: 'RE của góc nhìn' });
  await expect(team).toHaveCount(0);

  await scope.getByRole('radio', { name: 'Team' }).click();
  await expect(team.locator('option')).toHaveText(['Bình Minh', 'Hừng Đông', 'Sao Mai']);
  await expect(team).toHaveValue(/.+/);
  await team.selectOption({ label: 'Sao Mai' });
  await expect(team.locator('option:checked')).toHaveText('Sao Mai');
  // Clicking the scope already selected keeps the team picked.
  await scope.getByRole('radio', { name: 'Team' }).click();
  await expect(team.locator('option:checked')).toHaveText('Sao Mai');

  // Only an RE has metrics: the list holds the 30 RE of the simulated data, with their team.
  await scope.getByRole('radio', { name: 'RE' }).click();
  await expect(team).toHaveCount(0);
  await expect(re.locator('option')).toHaveCount(30);
  await expect(re.locator('option').first()).toHaveText(/ · (Bình Minh|Hừng Đông|Sao Mai)$/);
  // All the RE of one team come before the next team's.
  const teamsInOrder = (await re.locator('option').allTextContents()).map(
    (label) => label.split(' · ')[1] ?? '',
  );
  expect([...new Set(teamsInOrder)]).toEqual(['Bình Minh', 'Hừng Đông', 'Sao Mai']);
  expect(teamsInOrder).toEqual([...teamsInOrder].sort(new Intl.Collator('vi').compare));
  await expect(re.locator('option:checked')).toHaveText(/ · Bình Minh$/);
  const secondRe = (await re.locator('option').nth(1).textContent()) ?? '';
  await re.selectOption({ index: 1 });
  await scope.getByRole('radio', { name: 'RE' }).click();
  await expect(re.locator('option:checked')).toHaveText(secondRe);

  await scope.getByRole('radio', { name: 'Toàn bộ' }).click();
  await expect(re).toHaveCount(0);
});

test('the scope picker shows only on Overview, Customers, Appointments and Reports', async ({
  page,
}) => {
  const scope = page.getByRole('radiogroup', { name: 'Góc nhìn' });
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

test('the scope kept while its picker is hidden', async ({ page }) => {
  await page.goto('/#/customers');
  await page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'Team' })
    .click();
  await page
    .getByRole('combobox', { name: 'Team của góc nhìn' })
    .selectOption({ label: 'Sao Mai' });

  await page.getByRole('link', { name: 'Team & nhân sự' }).click();
  await expect(page.getByRole('radiogroup', { name: 'Góc nhìn' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Khách hàng' }).click();

  await expect(
    page.getByRole('radiogroup', { name: 'Góc nhìn' }).getByRole('radio', { checked: true }),
  ).toHaveText('Team');
  await expect(
    page.getByRole('combobox', { name: 'Team của góc nhìn' }).locator('option:checked'),
  ).toHaveText('Sao Mai');
});

test('the scope picker text is 14px; other segmented buttons stay 12.5px', async ({ page }) => {
  await page.goto('/#/customers');
  const size = (locator: import('@playwright/test').Locator) =>
    locator.evaluate((el) => getComputedStyle(el).fontSize);
  const scope = page.getByRole('radiogroup', { name: 'Góc nhìn' });
  await expect.poll(() => size(scope.getByRole('radio').first())).toBe('14px');
  await scope.getByRole('radio', { name: 'Team' }).click();
  await expect
    .poll(() => size(page.getByRole('combobox', { name: 'Team của góc nhìn' })))
    .toBe('14px');
  await expect
    .poll(() => size(page.getByRole('radiogroup', { name: 'Cách xem' }).getByRole('radio').first()))
    .toBe('12.5px');
});
