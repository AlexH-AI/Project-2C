import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const section = (page: Page) => page.getByRole('region', { name: 'Xuất / nhập backup' });
const nav = (page: Page, name: string) =>
  page.getByRole('navigation').getByRole('link', { name }).click();
const teamList = (page: Page) => page.getByRole('region', { name: 'Team', exact: true });

async function exportFile(page: Page): Promise<{ name: string; text: string }> {
  const download = page.waitForEvent('download');
  await section(page).getByRole('button', { name: 'Xuất backup' }).click();
  const file = await download;
  return { name: file.suggestedFilename(), text: await readFile(await file.path(), 'utf8') };
}

async function chooseFile(page: Page, name: string, text: string) {
  await section(page)
    .getByLabel('Nhập backup')
    .setInputFiles({ name, mimeType: 'application/json', buffer: Buffer.from(text) });
}

test('exports, then imports the file back after confirming: later changes are gone', async ({
  page,
}) => {
  await page.goto('/#/settings');
  const exported = await exportFile(page);
  expect(exported.name).toMatch(/^project2c-\d{8}-\d{4}\.p2cbackup$/);
  expect(JSON.parse(exported.text)).toMatchObject({ format: 'project2c-backup' });
  await expect(section(page).getByRole('status')).toHaveText(`Đã xuất backup: ${exported.name}`);

  // A change made after the export, which the import must undo.
  await nav(page, 'Team & nhân sự');
  await page.getByRole('button', { name: '+ Team' }).click();
  const create = page.getByRole('dialog', { name: 'Team mới' });
  await create.getByRole('textbox', { name: 'Tên team' }).fill('Bình Minh 2');
  await create.getByRole('button', { name: 'Tạo team' }).click();
  await expect(teamList(page).getByRole('button')).toHaveCount(4);

  await nav(page, 'Cài đặt');
  await chooseFile(page, exported.name, exported.text);
  const dialog = page.getByRole('dialog', { name: 'Thay toàn bộ dữ liệu?' });
  await expect(dialog).toContainText(exported.name);
  await expect(dialog).toContainText('schema v5 (bằng app)');
  await expect(dialog).toContainText(/Trong file\s*3 team · 36 nhân sự · 1\.\d{3} KH/);
  await expect(dialog).toContainText(/Hiện tại\s*4 team/);
  await expect(dialog).toContainText('Bản web không lưu file');
  await dialog.getByRole('button', { name: 'Thay dữ liệu', exact: true }).click();

  await expect(dialog).toBeHidden();
  await expect(section(page).getByRole('status')).toContainText('Đã nhập backup xuất lúc');
  await nav(page, 'Team & nhân sự');
  await expect(teamList(page).getByRole('button')).toHaveCount(3);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('cancelling the import changes nothing', async ({ page }) => {
  await page.goto('/#/settings');
  const exported = await exportFile(page);
  await chooseFile(page, exported.name, exported.text);
  const dialog = page.getByRole('dialog', { name: 'Thay toàn bộ dữ liệu?' });

  await dialog.getByRole('button', { name: 'Hủy' }).click();

  await expect(dialog).toBeHidden();
  await expect(section(page).getByRole('status')).toHaveCount(0);
});

test('refuses a file that is not a Project-2C backup', async ({ page }) => {
  await page.goto('/#/settings');

  await chooseFile(page, 'old.p2backup', '{"format":"project2-backup","tables":{}}');

  const dialog = page.getByRole('dialog', { name: 'Không nhập được file' });
  await expect(dialog.getByRole('alert')).toContainText(
    'File hỏng hoặc không phải backup Project-2C',
  );
  await dialog.getByRole('button', { name: 'Đóng' }).click();
  await expect(dialog).toBeHidden();
});
