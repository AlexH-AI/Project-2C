import { expect, test } from '@playwright/test';

// The team screen draws avatar initials with `toLocaleUpperCase('vi')`; breaking that one call
// makes exactly this screen throw while rendering (T-077), with no test hook in the app.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const upper = String.prototype.toLocaleUpperCase;
    String.prototype.toLocaleUpperCase = function (this: string, ...locales: unknown[]) {
      if (locales[0] === 'vi') throw new Error('e2e: team screen render failure');
      return upper.apply(this, locales as Parameters<typeof upper>);
    };
  });
});

test('a screen that fails to render shows a message and the sidebar still works', async ({
  page,
}) => {
  await page.goto('/#/team');

  const alert = page.getByRole('alert');
  await expect(alert.getByRole('heading')).toHaveText('Màn này gặp lỗi và không hiển thị được');
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
  await expect(page.getByRole('alert').getByRole('heading')).toHaveText(
    'Màn này gặp lỗi và không hiển thị được',
  );
});
