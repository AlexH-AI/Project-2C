import { expect, test, type Page } from '@playwright/test';

const FAILED = 'Màn này gặp lỗi và không hiển thị được';

// The team screen draws avatar initials with `toLocaleUpperCase('vi')`; breaking that one call
// makes exactly this screen throw while rendering (T-077), with no test hook in the app. The
// failure stops once the test sets `window.p2cRenderFixed`.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const upper = String.prototype.toLocaleUpperCase;
    String.prototype.toLocaleUpperCase = function (this: string, ...locales: unknown[]) {
      const fixed = (window as { p2cRenderFixed?: boolean }).p2cRenderFixed;
      if (locales[0] === 'vi' && !fixed) throw new Error('e2e: team screen render failure');
      return upper.apply(this, locales as Parameters<typeof upper>);
    };
  });
});

const failedHeading = (page: Page) => page.getByRole('alert').getByRole('heading');

test('a screen that fails to render shows a message and the sidebar still works', async ({
  page,
}) => {
  await page.goto('/#/team');

  const alert = page.getByRole('alert');
  await expect(failedHeading(page)).toHaveText(FAILED);
  await expect(alert).toContainText('Chọn một màn khác ở thanh bên');
  await expect(alert.locator('code')).toHaveText('Error: e2e: team screen render failure');
  // Sidebar and topbar stay: the window is not blank.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Team & nhân sự');

  await page.getByRole('link', { name: 'Khách hàng' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Khách hàng');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'N4', exact: true })).toBeVisible();

  // Coming back renders the screen again (and fails again, as nothing changed).
  await page.getByRole('link', { name: 'Team & nhân sự' }).click();
  await expect(failedHeading(page)).toHaveText(FAILED);
});

test('changing the scope renders a failed screen again', async ({ page }) => {
  await page.goto('/#/team');
  await expect(failedHeading(page)).toHaveText(FAILED);

  await page.evaluate(() => ((window as { p2cRenderFixed?: boolean }).p2cRenderFixed = true));
  await page.getByRole('radio', { name: 'Team', exact: true }).click();

  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Team', exact: true })).toBeVisible();
});

// Guards the trigger above: were another screen to call `toLocaleUpperCase('vi')` too, this
// names it, instead of the tests above failing for no clear reason.
test('only the team screen uses the broken call', async ({ page }) => {
  await page.goto('/#/overview');
  for (const name of ['Tổng quan hôm nay', 'Lịch hẹn', 'Khách hàng', 'Báo cáo', 'Cài đặt']) {
    await page.getByRole('link', { name }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
    await expect(page.getByRole('alert'), `${name} renders`).toHaveCount(0);
  }
});
