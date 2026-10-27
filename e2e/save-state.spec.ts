import { expect, test, type Page } from './fixtures';
import { asExe, lowestContrast } from './support';

// The save state at the foot of the sidebar (mockup settings-data 10d), "Thử lại" on the save
// warning, and closing the exe while it saves (T-294). The page's clock starts at 09:30 on the
// anchor day (fixtures.ts), so a save of the first minutes reads "Đã lưu 09:3x".

// The last paragraph of the sidebar: the slogan of the logo at its top is one too (T-308).
const saveState = (page: Page) =>
  page
    .getByRole('complementary')
    .filter({ has: page.getByRole('navigation', { name: 'Điều hướng chính' }) })
    .getByRole('paragraph')
    .last();
const SAVED = /^Đã lưu 09:3\d$/;
const warning = (page: Page) =>
  page.getByRole('alert').filter({ hasText: 'Chưa lưu được dữ liệu vào file' });
const events = (page: Page) => page.evaluate(() => window.exe.events);

async function addTeam(page: Page, name: string) {
  await page.getByRole('button', { name: '+ Team' }).click();
  const dialog = page.getByRole('dialog', { name: 'Team mới' });
  await dialog.getByRole('textbox', { name: 'Tên team' }).fill(name);
  await dialog.getByRole('button', { name: 'Tạo team' }).click();
  await expect(dialog).toHaveCount(0);
}

/** Settings → Nạp lại, confirmed; the exe backs the file up first. */
async function reloadDemoData(page: Page) {
  await page
    .getByRole('region', { name: 'Dữ liệu giả lập' })
    .getByRole('button', { name: 'Nạp lại…' })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Nạp lại dữ liệu giả lập?' });
  await dialog.getByRole('textbox').fill('NẠP LẠI');
  await dialog.getByRole('button', { name: 'Backup rồi nạp lại' }).click();
  return dialog;
}

test('the sidebar says when the data was saved, while it saves, and when it could not be (10d)', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/team');
  const state = saveState(page);
  // The first start saves the simulated data it seeded.
  await expect(state).toHaveText(SAVED);
  expect(await lowestContrast(state)).toBeGreaterThanOrEqual(4.5);

  await page.evaluate(() => window.exe.holdSaves());
  await addTeam(page, 'Bình Minh 2');
  await expect(state).toHaveText('Đang lưu…');
  await page.evaluate(() => window.exe.releaseSaves());
  await expect(state).toHaveText(SAVED);

  await page.evaluate(() => (window.exe.failSaves = 'DISK_FULL'));
  await addTeam(page, 'Bình Minh 3');
  await expect(state).toHaveText('Chưa lưu được vào file');
  await expect(warning(page)).toContainText('ổ đĩa chứa thư mục app đã đầy');
  expect(await lowestContrast(state)).toBeGreaterThanOrEqual(4.5);
  // On every screen.
  await page.getByRole('link', { name: 'Khách hàng' }).click();
  await expect(state).toHaveText('Chưa lưu được vào file');
});

test('web mode says, on every screen, that the data stays in the browser (10d)', async ({
  page,
}) => {
  await page.goto('/#/overview');
  const state = saveState(page);
  const web = 'Bản web — dữ liệu chỉ trong trình duyệt, mất khi tải lại trang';
  await expect(state).toHaveText(web);
  expect(await lowestContrast(state)).toBeGreaterThanOrEqual(4.5);
  await page.getByRole('link', { name: 'Team & nhân sự' }).click();
  await addTeam(page, 'Bình Minh 2');
  await expect(state).toHaveText(web);
});

test('"Thử lại" on the save warning saves at once; Nạp lại, refused before, then runs', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/team');
  await page.evaluate(() => (window.exe.failSaves = true));
  await addTeam(page, 'Bình Minh 2');
  await expect(warning(page)).toBeVisible();

  await page.getByRole('link', { name: 'Cài đặt' }).click();
  await expect(await reloadDemoData(page)).toHaveCount(0);
  const demo = page.getByRole('region', { name: 'Dữ liệu giả lập' });
  await expect(demo.getByRole('alert')).toHaveText(
    'Chưa nạp lại: lần lưu gần nhất bị lỗi, backup sẽ thiếu các thay đổi đó. Bấm "Thử lại" ở dải cảnh báo đầu màn, lưu được rồi thì nạp lại. Dữ liệu hiện tại không bị đổi.',
  );

  // Still failing, for another cause: the warning stays, saying the cause of this try, which shows
  // the try ran (review of PR 817).
  await page.evaluate(() => (window.exe.failSaves = 'DISK_FULL'));
  const retry = warning(page).getByRole('button', { name: 'Thử lại' });
  await expect(warning(page)).not.toContainText('ổ đĩa chứa thư mục app đã đầy');
  await retry.click();
  await expect(warning(page)).toContainText('ổ đĩa chứa thư mục app đã đầy');
  await expect(saveState(page)).toHaveText('Chưa lưu được vào file');

  // The file can be written again: one click saves, and the warning goes, its focus to the heading.
  await page.evaluate(() => (window.exe.failSaves = false));
  await retry.click();
  await expect(warning(page)).toHaveCount(0);
  await expect(saveState(page)).toHaveText(SAVED);
  await expect(page.getByRole('heading', { level: 1, name: 'Cài đặt' })).toBeFocused();

  await expect(await reloadDemoData(page)).toHaveCount(0);
  await expect(demo.getByRole('status')).toContainText('Đã nạp lại dữ liệu giả lập');
});

test('closing the exe while a save runs waits for it, the sidebar saying "Đang lưu…" (review of PR 125)', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/team');
  await expect(saveState(page)).toHaveText(SAVED);
  await page.evaluate(() => window.exe.holdSaves());
  await addTeam(page, 'Bình Minh 2');

  await page.evaluate(() => window.exe.requestClose());
  await expect(saveState(page)).toHaveText('Đang lưu…');
  expect(await events(page)).not.toContain('destroy');
  await page.evaluate(() => window.exe.releaseSaves());

  // The window closes only once the change is in the file.
  await expect.poll(async () => (await events(page)).slice(-2)).toEqual(['save', 'destroy']);
});

test('closing the exe during Nạp lại waits for the new data to be saved, saying "Đang lưu…" (review of PR 125)', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/settings');
  await expect(saveState(page)).toHaveText(SAVED);
  await page.evaluate(() => window.exe.holdBackup());
  const dialog = await reloadDemoData(page);
  await expect(dialog.getByRole('button', { name: 'Đang nạp lại…' })).toBeVisible();

  await page.evaluate(() => window.exe.requestClose());
  await expect(saveState(page)).toHaveText('Đang lưu…');
  const before = (await events(page)).length;
  expect(await events(page)).not.toContain('destroy');
  await page.evaluate(() => window.exe.releaseBackup());

  // The backup, the simulated data seeded and saved, and only then the window closes.
  await expect
    .poll(async () => (await events(page)).slice(before))
    .toEqual(['backup', 'save', 'destroy']);
});
