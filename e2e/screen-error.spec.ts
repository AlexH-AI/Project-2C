import { expect, test, type Page } from '@playwright/test';

const FAILED = 'Màn này gặp lỗi và không hiển thị được';

// The customers board formats its dates with `padStart`, which the app shell itself never calls;
// breaking that call while the hash is `#/customers` makes exactly this screen throw while
// rendering (T-077), with no test hook in the app. The customers screen keeps its scope picker,
// which the reset test needs. Startup formats dates too, so the tests open the app on another
// screen first. The failure stops once the test sets `window.p2cRenderFixed`.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const pad = String.prototype.padStart;
    String.prototype.padStart = function (this: string, ...args: Parameters<typeof pad>) {
      const fixed = (window as { p2cRenderFixed?: boolean }).p2cRenderFixed;
      if (location.hash === '#/customers' && !fixed) {
        throw new Error('e2e: customers screen render failure');
      }
      return pad.apply(this, args);
    };
  });
});

const failedHeading = (page: Page) => page.getByRole('alert').getByRole('heading');

/** Opens the app on the overview, then goes to the customers screen from the sidebar. */
async function openCustomers(page: Page) {
  await page.goto('/#/overview');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan');
  await page.getByRole('link', { name: 'Khách hàng' }).click();
}

test('a screen that fails to render shows a message and the sidebar still works', async ({
  page,
}) => {
  await openCustomers(page);

  const alert = page.getByRole('alert');
  await expect(failedHeading(page)).toHaveText(FAILED);
  await expect(alert).toContainText('Chọn một màn khác ở thanh bên');
  await expect(alert.locator('code')).toHaveText('Error: e2e: customers screen render failure');
  // Sidebar and topbar stay: the window is not blank.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Khách hàng');

  await page.getByRole('link', { name: 'Lịch hẹn' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lịch hẹn');
  await expect(page.getByRole('alert')).toHaveCount(0);

  // Coming back renders the screen again (and fails again, as nothing changed).
  await page.getByRole('link', { name: 'Khách hàng' }).click();
  await expect(failedHeading(page)).toHaveText(FAILED);
});

test('changing the scope renders a failed screen again', async ({ page }) => {
  await openCustomers(page);
  await expect(failedHeading(page)).toHaveText(FAILED);

  await page.evaluate(() => ((window as { p2cRenderFixed?: boolean }).p2cRenderFixed = true));
  await page.getByRole('radio', { name: 'Team', exact: true }).click();

  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'N4', exact: true })).toBeVisible();
});

// Guards the trigger above: the other screens render while it is armed, so the failure is the
// customers screen's alone.
test('only the customers screen breaks', async ({ page }) => {
  await page.goto('/#/overview');
  for (const name of ['Tổng quan', 'Lịch hẹn', 'Báo cáo', 'Team & nhân sự', 'Cài đặt']) {
    await page.getByRole('link', { name }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
    await expect(page.getByRole('alert'), `${name} renders`).toHaveCount(0);
  }
});
