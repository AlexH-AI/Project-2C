import { expect, test, type Locator, type Page } from './fixtures';
import { addKycNote, createKycCustomer, discoveryFacts, panelOf } from './support';

// The topbar stays at the top of the page as it scrolls: what the focus or `scrollIntoView` brings
// into view must come out from under it, a card brought to the top from its own top (WCAG 2.4.11),
// and focus on the bar's own controls must leave the page where it is. The smallest window,
// 1 100 × 700, scrolls the most.

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 700 });
});

const SCREENS = ['Tổng quan', 'Lịch hẹn', 'Khách hàng', 'Báo cáo', 'Team & nhân sự', 'Cài đặt'];

const bar = (page: Page) => page.getByRole('banner');

/** Where the bar ends, from the top of the window. */
async function barBottom(page: Page) {
  const box = (await bar(page).boundingBox())!;
  return box.y + box.height;
}

const top = async (locator: Locator) => (await locator.boundingBox())!.y;

/** Scrolls `target` under the bar: inside the window, where the browser takes it as seen. */
async function hideUnderBar(page: Page, target: Locator) {
  const bottom = await barBottom(page);
  await target.evaluate((element, bottom) => {
    const box = element.getBoundingClientRect();
    window.scrollBy(0, box.top + box.height / 2 - bottom / 2);
  }, bottom);
  const box = (await target.boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(bottom);
}

/** Whether the page scrolls far enough to bring the top of `target` to the top of the window. */
const reachesTop = (target: Locator) =>
  target.evaluate(
    (element) =>
      element.getBoundingClientRect().top + window.scrollY <=
      document.documentElement.scrollHeight - window.innerHeight,
  );

test('what scrolls into view keeps the height of the bar above it, on every screen, at 1 100 and 1 440', async ({
  page,
}) => {
  const sidebar = page.getByRole('navigation', { name: 'Điều hướng chính' });
  const scope = page.getByRole('radiogroup', { name: 'Góc nhìn' });
  const room = () =>
    page
      .getByRole('main')
      .evaluate((main) => parseFloat(getComputedStyle(main.firstElementChild!).scrollMarginTop));
  const fits = async () =>
    expect(await room()).toBeGreaterThanOrEqual((await bar(page).boundingBox())!.height);
  await page.goto('/#/overview');
  for (const width of [1100, 1440]) {
    await page.setViewportSize({ width, height: 700 });
    for (const screen of SCREENS) {
      await sidebar.getByRole('link', { name: screen }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen);
      await fits();
      // The scope picker, where shown, with its team or RE list too.
      for (const kind of (await scope.count()) > 0 ? ['Team', 'RE', 'Toàn bộ'] : []) {
        await scope.getByRole('radio', { name: kind }).click();
        await fits();
      }
    }
    await sidebar.getByRole('link', { name: 'Khách hàng' }).click();
    await page.locator('main a[href^="#/customers/"]').first().click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ khách hàng');
    await fits();
  }
});

test('focus on the scope picker of the bar leaves the page where it is', async ({ page }) => {
  await page.goto('/#/customers');
  await page.getByRole('radio', { name: 'Bảng' }).click();
  await page.evaluate(() => window.scrollTo(0, 500));
  const scrolled = await page.evaluate(() => window.scrollY);
  expect(scrolled).toBeGreaterThan(0);
  const team = page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'Team' });

  await team.focus();
  await expect(team).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);
});

test('Shift+Tab to a link of the customers table under the bar brings it out', async ({ page }) => {
  await page.goto('/#/customers');
  await page.getByRole('radio', { name: 'Bảng' }).click();
  const link = page.getByRole('main').getByRole('table').getByRole('link').nth(8);
  await link.focus();
  await page.keyboard.press('Tab');
  await hideUnderBar(page, link);

  await page.keyboard.press('Shift+Tab');
  await expect(link).toBeFocused();
  expect(await top(link)).toBeGreaterThanOrEqual(await barBottom(page));
});

// DR6-83: Lưu HĐ takes the empty card's "+ Hợp đồng" away, so the focus goes to the card's heading.
test('Lưu HĐ leaves the focus on the Hợp đồng heading out from under the bar (DR6-83)', async ({
  page,
}) => {
  const name = 'Hà Dưới Thanh';
  await createKycCustomer(page, name);
  // An analysis makes the page long enough to scroll the card's heading up under the bar.
  await addKycNote(page, name, discoveryFacts);
  await panelOf(page).getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panelOf(page).getByRole('region', { name: 'Behavioral Hypotheses' })).toBeVisible();
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  const heading = card.getByRole('heading', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('500tr');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).focus();
  await hideUnderBar(page, heading);

  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(heading).toBeFocused();
  expect(await top(heading)).toBeGreaterThanOrEqual(await barBottom(page));
});

test('"Xem tất cả" of the appointment dialog shows the Lịch hẹn card from its top, below the bar', async ({
  page,
}) => {
  await createKycCustomer(page, 'Hà Sáu Lịch');
  const dialog = page.getByRole('dialog');
  // More appointments up to today than the dialog lists.
  for (const time of ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']) {
    await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
    await dialog.getByRole('textbox', { name: /^Ngày/ }).fill('15/9');
    await dialog.getByRole('textbox', { name: /^Giờ/ }).fill(time);
    await dialog.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
    await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
    await expect(dialog).toHaveCount(0);
  }
  const card = page.getByRole('region', { name: 'Lịch hẹn', exact: true });
  expect(await reachesTop(card)).toBe(true);

  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  await dialog.getByRole('link', { name: /^Xem tất cả/ }).click();
  await expect(dialog).toHaveCount(0);
  expect(await top(card)).toBeGreaterThanOrEqual(await barBottom(page));
});

test('the link of the AI panel to the KYC facts shows their card from its top, below the bar', async ({
  page,
}) => {
  const name = 'Hà Mâu Thuẫn';
  await createKycCustomer(page, name);
  await addKycNote(page, name, discoveryFacts);
  await addKycNote(page, name, [['Số con', '3']], true);
  const card = page.getByRole('region', { name: 'Dữ kiện KYC' });
  expect(await reachesTop(card)).toBe(true);

  await panelOf(page).getByRole('link', { name: 'Xem ở Dữ kiện KYC →' }).click();
  await expect(card.getByRole('heading', { name: 'Dữ kiện KYC' })).toBeFocused();
  expect(await top(card)).toBeGreaterThanOrEqual(await barBottom(page));
});
