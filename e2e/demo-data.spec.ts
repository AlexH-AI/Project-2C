import { expect, test } from '@playwright/test';

// playwright.config.ts pins the anchor day of the simulated data (VITE_DEMO_ANCHOR).
const ANCHOR = '15/09/2026';

test('Settings reloads the simulated data after typing the confirmation word', async ({ page }) => {
  await page.goto('/#/settings');
  const section = page.getByRole('region', { name: 'Dữ liệu giả lập' });
  await section.getByRole('button', { name: 'Nạp lại…' }).click();

  const dialog = page.getByRole('dialog', { name: 'Nạp lại dữ liệu giả lập?' });
  await expect(dialog).toContainText(`neo ở ngày ${ANCHOR}`);
  await expect(dialog).toContainText('Bản web không lưu file');
  const confirm = dialog.getByRole('button', { name: 'Nạp lại', exact: true });
  await expect(confirm).toBeDisabled();

  await dialog.getByRole('textbox').fill('NẠP LẠI');
  await confirm.click();

  await expect(dialog).toBeHidden();
  await expect(section.getByRole('status')).toHaveText(
    `Đã nạp lại dữ liệu giả lập, neo ở ngày ${ANCHOR}.`,
  );
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('cancelling the reload dialog changes nothing', async ({ page }) => {
  await page.goto('/#/settings');
  await page.getByRole('button', { name: 'Nạp lại…' }).click();
  const dialog = page.getByRole('dialog', { name: 'Nạp lại dữ liệu giả lập?' });

  await dialog.getByRole('button', { name: 'Hủy' }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByRole('status')).toHaveCount(0);
});
