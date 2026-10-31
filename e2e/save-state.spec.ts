import { expect, test, type Page } from './fixtures';
import {
  addKycNote,
  asExe,
  createKycCustomer,
  discoveryFacts,
  discoveryOutput,
  lowestContrast,
  panelOf,
  useOpenCode,
} from './support';

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

/** A change whose save fails, then "Thử lại" clicked, its save held while the file can be written. */
async function retryHeld(page: Page, team: string) {
  await page.evaluate(() => (window.exe.failSaves = true));
  await addTeam(page, team);
  await page.evaluate(() => {
    window.exe.failSaves = false;
    window.exe.holdSaves();
  });
  await warning(page).getByRole('button', { name: 'Thử lại' }).click();
}

test('"Thử lại" leaves the focus where the user moved it while the save ran, and gives the heading one that fell to the page (DR6-146)', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/team');

  await retryHeld(page, 'Bình Minh 2');
  // On to the screen's first button while it saves.
  await page.keyboard.press('Tab');
  const moved = page.getByRole('button', { name: '+ Nhân sự' });
  await expect(moved).toBeFocused();
  await page.evaluate(() => window.exe.releaseSaves());
  await expect(warning(page)).toHaveCount(0);
  await expect(saveState(page)).toHaveText(SAVED);
  await expect(moved).toBeFocused();

  await retryHeld(page, 'Bình Minh 3');
  // A click on an empty part of the page while it saves: nothing has the focus.
  await page.getByRole('main').click({ position: { x: 2, y: 2 } });
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
  await page.evaluate(() => window.exe.releaseSaves());
  await expect(warning(page)).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1, name: 'Team & nhân sự' })).toBeFocused();
});

test('another save that succeeds while "Thử lại" has the focus takes it to the heading, not the page (DR6-147)', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/team');
  await page.evaluate(() => (window.exe.failSaves = true));
  await addTeam(page, 'Bình Minh 2');
  // Another change, its save still running when the file can be written again, as an AI answer's.
  await page.evaluate(() => window.exe.holdSaves());
  await addTeam(page, 'Bình Minh 3');
  const retry = warning(page).getByRole('button', { name: 'Thử lại' });
  await retry.focus();
  await expect(retry).toBeFocused();

  await page.evaluate(() => {
    window.exe.failSaves = false;
    window.exe.releaseSaves();
  });
  await expect(warning(page)).toHaveCount(0);
  await expect(saveState(page)).toHaveText(SAVED);
  await expect(page.getByRole('heading', { level: 1, name: 'Team & nhân sự' })).toBeFocused();
});

test('the close question goes, and the window closes, once another save succeeds while it asks (DR6-147)', async ({
  page,
}) => {
  await asExe(page);
  const name = 'Tú Đóng App';
  await createKycCustomer(page, name);
  await addKycNote(page, name, discoveryFacts);
  await useOpenCode(page);
  // An analysis by OpenCode that passes, its answer held.
  await page.evaluate((output) => {
    window.exe.aiContent = output;
    window.exe.holdAi();
  }, discoveryOutput());
  await panelOf(page).getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panelOf(page).getByRole('status')).toContainText('Đang phân tích…');

  // Meanwhile a change the file refuses, then the window's X.
  await page.evaluate(() => (window.exe.failSaves = 'READ_ONLY'));
  await page.getByRole('link', { name: 'Team & nhân sự' }).click();
  await addTeam(page, 'Bình Minh 2');
  await page.evaluate(() => window.exe.requestClose());
  const ask = page.getByRole('dialog', { name: 'Chưa lưu được thay đổi' });
  await expect(ask).toContainText('đang ở chế độ chỉ đọc');
  // Each text it says from now on, however briefly.
  await ask.evaluate((question) => {
    const said: string[] = [];
    Object.assign(window, { said });
    new MutationObserver(() => said.push(question.textContent ?? '')).observe(question, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  });

  // The file can be written again and the analysis ends, saved with the change: nothing is left
  // unsaved, so the question goes instead of naming a program holding the file, and the window
  // closes.
  await page.evaluate(() => {
    window.exe.failSaves = false;
    window.exe.releaseAi();
  });
  await expect.poll(async () => (await events(page)).slice(-2)).toEqual(['save', 'destroy']);
  await expect(ask).toHaveCount(0);
  const said = await page.evaluate(() => (window as unknown as { said: string[] }).said);
  expect(said.join('\n')).not.toContain('chương trình khác');
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
