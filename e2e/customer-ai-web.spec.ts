import { expect, test, type Locator, type Page } from './fixtures';
import {
  addKycNote,
  asExe,
  createKycCustomer,
  discoveryFacts,
  discoveryOutput,
  panelOf,
  right,
  scrolls,
  seededCustomer,
  sideways,
  stubChatGptWeb,
} from './support';

// ChatGPT web (spec Phase 5 §3.1, mockup ai.html 4d–4i) on the web build: no network. The page opens
// chatgpt.com with `window.open` and copies with the clipboard; both are recorded (`stubChatGptWeb`),
// the paste, the check and the save run for real. Today is pinned to 15/09/2026 (playwright.config.ts).

test.beforeEach(async ({ page }) => {
  await stubChatGptWeb(page);
});

const recorded = (page: Page) => page.evaluate(() => window.web);

/** A discovery answer as ChatGPT gives it; `text` replaces the text of its hypothesis. */
const answer = (text?: string) => `Đây là kết quả:\n\`\`\`json\n${discoveryOutput(text)}\n\`\`\``;
const GOOD = answer();

/** A customer the gate lets through in discovery, with the panel open on it. */
async function discoveryCustomer(page: Page, name: string) {
  await createKycCustomer(page, name);
  await addKycNote(page, name, discoveryFacts);
  const panel = panelOf(page);
  await expect(panel).toContainText('PROFILE_DISCOVERY');
  return panel;
}

test('copies the message, opens chatgpt.com, saves a pasted answer as CURRENT ChatGPT web', async ({
  page,
}) => {
  const panel = await discoveryCustomer(page, 'Mai Web');
  const start = panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' });
  const analyse = panel.getByRole('button', { name: 'Phân tích', exact: true });

  await start.click();
  await expect(panel).toContainText('Đã copy tin nhắn và mở ChatGPT');
  await expect(panel).toContainText(/kyc v2 · discovery@4\+web@1 · chụp 15\/09 \d\d:\d\d/);
  await expect(panel).toContainText('Lần thử 1 / 2');
  const { copied, opened } = await recorded(page);
  expect(copied).toHaveLength(1);
  expect(copied[0]).toMatch(/^Tin nhắn này có hai phần/);
  expect(copied[0]).toContain('"mode":"discovery"');
  expect(copied[0]).not.toContain('Mai Web');
  expect(opened).toEqual([['https://chatgpt.com/', '_blank', 'noopener']]);

  // In the session, this customer's AI buttons are off.
  await expect(start).toBeDisabled();
  await expect(analyse).toBeDisabled();
  const save = panel.getByRole('button', { name: 'Kiểm tra và lưu' });
  await expect(save).toBeDisabled();
  const box = panel.getByRole('textbox', { name: 'Dán kết quả' });
  await box.fill('   ');
  await expect(save).toBeDisabled();

  await box.fill(GOOD);
  await save.click();
  await expect(panel).toContainText('CURRENT');
  // Said to a screen reader (DR5-33); the focus is back on the button that opened the session.
  await expect(panel.getByRole('status')).toHaveText('Phân tích xong: đã lưu kết quả.');
  await expect(start).toBeFocused();
  // The head badge; the history names it too.
  await expect(panel.getByText('ChatGPT web', { exact: true }).first()).toBeVisible();
  await expect(panel).toContainText(/kyc v2 · discovery@4\+web@1 · ChatGPT web · 15\/09 \d\d:\d\d/);
  await expect(panel).not.toContainText('Kết quả Mock');
  await expect(start).toBeEnabled();
  await expect(panel.getByRole('button', { name: 'Phân tích lại' })).toBeEnabled();
});

/** A KYC note long enough for AI trích xuất, with no fact. */
const NOTE = 'KH muốn tìm hiểu thêm về quỹ hưu trí cho cả gia đình.';

async function writeNote(page: Page, name: string) {
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${name}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill(NOTE);
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();
}

const extractButton = (page: Page) =>
  page
    .getByRole('region', { name: 'Dòng thời gian' })
    .getByRole('listitem')
    .filter({ hasText: NOTE })
    .getByRole('button', { name: 'AI trích xuất' });

test("the app's own message pasted back counts no attempt; AI trích xuất waits with the session", async ({
  page,
}) => {
  const other = 'Quế Khác';
  await createKycCustomer(page, other);
  await writeNote(page, other);
  const name = 'Hà Web';
  const panel = await discoveryCustomer(page, name);
  await writeNote(page, name);
  const start = panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' });
  const extract = extractButton(page);
  await expect(extract).toBeEnabled();

  await start.click();
  await expect(panel).toContainText('Lần thử 1 / 2');
  // This customer's AI buttons are all off while the session waits (ADR-0009 W-1 item 6).
  await expect(extract).toBeDisabled();

  // The message still in the clipboard, pasted back by mistake (DR5-49).
  const [message] = (await recorded(page)).copied;
  const box = panel.getByRole('textbox', { name: 'Dán kết quả' });
  const save = panel.getByRole('button', { name: 'Kiểm tra và lưu' });
  await box.fill(message!);
  // By the keyboard, the refusal is read: the focus goes to the box it describes (R2-06).
  await save.focus();
  await page.keyboard.press('Enter');
  await expect(box).toBeFocused();
  await expect(box).toHaveAccessibleDescription(
    'Đây là tin nhắn của app — hãy copy câu trả lời của ChatGPT.',
  );
  await expect(panel).toContainText('Lần thử 1 / 2');
  await expect(panel).not.toContainText('Câu trả lời chưa đạt');
  await expect(panel).toContainText('Chưa có phân tích AI cho KH này.');
  // The same paste checked again is refused again, said again.
  await save.focus();
  await page.keyboard.press('Enter');
  await expect(box).toBeFocused();

  // Too long a paste: refused at the box too, and read the same way.
  await box.fill('x'.repeat(20_001));
  await save.focus();
  await page.keyboard.press('Enter');
  await expect(box).toBeFocused();
  await expect(box).toHaveAccessibleDescription(
    'Câu trả lời dài quá 20.000 ký tự — kiểm tra đã copy đúng câu trả lời chưa.',
  );
  await expect(panel).toContainText('Lần thử 1 / 2');

  await box.fill(GOOD);
  await expect(panel).not.toContainText('Đây là tin nhắn của app');
  await save.click();
  await expect(panel).toContainText('CURRENT');
  await expect(panel).toContainText(/kyc v2 · discovery@4\+web@1 · ChatGPT web/);
  await expect(extract).toBeEnabled();

  // Another customer's AI trích xuất does not wait for this one's session.
  await start.click();
  await expect(extract).toBeDisabled();
  await page.getByRole('link', { name: 'Khách hàng' }).first().click();
  await page.getByRole('link', { name: new RegExp(other) }).click();
  await expect(page.getByRole('heading', { name: other })).toBeVisible();
  await expect(extractButton(page)).toBeEnabled();
});

test('a wrong paste then a right one is ACCEPTED; two wrong ones are REJECTED', async ({
  page,
}) => {
  const panel = await discoveryCustomer(page, 'Đào Web');
  const start = panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' });
  const save = panel.getByRole('button', { name: 'Kiểm tra và lưu' });

  await start.click();
  await panel.getByRole('textbox', { name: 'Dán kết quả' }).fill('Xin lỗi, tôi không chắc.');
  await save.click();
  await expect(panel).toContainText('Câu trả lời chưa đạt — còn 1 lần thử');
  await expect(panel.getByRole('listitem')).toHaveText(['V1 · Không có khối JSON hợp lệ']);
  const retryBox = panel.getByRole('textbox', { name: 'Dán kết quả (lần thử 2 / 2)' });
  await expect(retryBox).toHaveValue('');
  await panel.getByRole('button', { name: 'Copy yêu cầu sửa' }).click();
  await expect.poll(async () => (await recorded(page)).copied.at(-1)).toContain('- V1 tại $');
  await retryBox.fill(GOOD);
  await save.click();
  await expect(panel).toContainText('CURRENT');
  await expect(panel).toContainText(/discovery@4\+web@1 · ChatGPT web/);

  await start.click();
  await panel.getByRole('textbox', { name: 'Dán kết quả' }).fill('Lần 1');
  await save.click();
  await panel.getByRole('textbox', { name: 'Dán kết quả (lần thử 2 / 2)' }).fill('{"x": 1}');
  await save.click();
  await expect(panel).toContainText(/Lần phân tích 15\/09 bị loại: .+ \(V1\)\./);
  // The ACCEPTED one stays below.
  await expect(panel).toContainText('CURRENT');

  // Its report lists the issues of each attempt, never the paste (mockup 2k).
  const rows = panel.getByRole('table', { name: 'Lịch sử phân tích' }).getByRole('row');
  await expect(rows.nth(1)).toContainText(/discovery@4\+web@1ChatGPT webREJECTED$/);
  await panel.getByRole('button', { name: 'Xem chi tiết' }).click();
  const report = page.getByRole('dialog', { name: /^Lần phân tích 15\/09 \d\d:\d\d bị loại$/ });
  await expect(report).toContainText('kyc v2 · discovery@4+web@1 · ChatGPT web · 2 lần thử');
  await expect(report).not.toContainText('token');
  await expect(report).toContainText(/Lần thử 1V1 · Không có khối JSON hợp lệLần thử 2V1 · /);
  await expect(report.getByRole('listitem').first()).toHaveText('V1 · Không có khối JSON hợp lệ');
  await expect(report).toContainText('Bản hiện hành vẫn là lần 15/09.');
  await expect(report).not.toContainText('{"x": 1}');
  await report.getByRole('button', { name: 'Đóng' }).click();
  await expect(report).toBeHidden();
  // A history row opens the same report.
  await rows.nth(1).getByRole('button').click();
  await expect(report).toBeVisible();
  await report.getByRole('button', { name: 'Đóng' }).click();

  // The REJECTED line gives way to a new session, and is back once it ends (review of PR 459).
  const line = panel.getByText(/bị loại: /);
  await expect(line).toBeVisible();
  await start.click();
  await expect(panel).toContainText('Lần thử 1 / 2');
  await expect(line).toBeHidden();
  await panel.getByRole('button', { name: 'Hủy' }).click();
  await expect(line).toBeVisible();
});

test('a KYC change while the session is open leaves the saved result STALE', async ({ page }) => {
  const name = 'Cúc Web';
  const panel = await discoveryCustomer(page, name);
  // The badge after the heading: the state of the analysis shown, or the mode of the session.
  const badge = panel
    .getByRole('heading', { name: 'KYC Intelligence' })
    .locator('xpath=following-sibling::span[1]');
  await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(badge).toHaveText('CURRENT');
  const head = panel
    .getByRole('heading', { name: 'KYC Intelligence' })
    .locator('xpath=following-sibling::span');
  await expect(head).toHaveText(['CURRENT', 'Mock']);
  await panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' }).click();
  await expect(panel).toContainText('kyc v2 · discovery@4+web@1');
  // The mode of the input taken (§9.1, mockup 4e), whatever the saved one or the KYC become; not
  // the source of the analysis saved before (R2-18).
  await expect(head).toHaveText(['PROFILE_DISCOVERY']);

  await addKycNote(page, name, [['Nơi sinh sống', 'Huế']]);
  await expect(badge).toHaveText('PROFILE_DISCOVERY');
  await panel.getByRole('textbox', { name: 'Dán kết quả' }).fill(GOOD);
  await panel.getByRole('button', { name: 'Kiểm tra và lưu' }).click();
  await expect(panel).toContainText('STALE');
  await expect(panel).toContainText('KYC có thay đổi nhỏ từ 15/09.');
  await expect(panel).toContainText(/kyc v2 · discovery@4\+web@1 · ChatGPT web/);
});

test('the session leaves the panel once the data is replaced under it (DR6-15)', async ({
  page,
}) => {
  await asExe(page);
  // A seeded customer the gate lets through: Nạp lại of the same day gives it the same ID (DR5-36).
  const profile = (await (await seededCustomer(page, 'Phan Thanh Bình')).getAttribute('href'))!;

  // Nạp lại held at its backup, as Rust copying the file; the profile opened meanwhile.
  await page.goto('/#/settings');
  await page.evaluate(() => window.exe.holdBackup());
  await page.getByRole('button', { name: 'Nạp lại…' }).click();
  await page.getByRole('textbox', { name: /^Gõ NẠP LẠI/ }).fill('NẠP LẠI');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Đang nạp lại…' })).toBeVisible();
  await page.evaluate((hash) => (window.location.hash = hash), profile);
  const panel = panelOf(page);
  const start = panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' });
  await start.click();
  const box = panel.getByRole('textbox', { name: 'Dán kết quả' });
  await expect(box).toBeVisible();

  // An answer now could only be for the data gone: the session ends, nothing left to paste.
  await page.evaluate(() => window.exe.releaseBackup());
  await expect(box).toBeHidden();
  await expect(start).toBeEnabled();
});

test('Hủy and leaving the profile save nothing; a failed copy shows the message to copy', async ({
  page,
}) => {
  const name = 'Lý Web';
  const panel = await discoveryCustomer(page, name);
  const start = panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' });

  await page.evaluate(() => (window.web.failCopy = true));
  await start.click();
  await expect(panel).toContainText('Không copy được — chọn hết đoạn dưới');
  await expect(panel).not.toContainText('Đã copy tin nhắn');
  await expect(panel.getByRole('textbox', { name: 'Tin nhắn để copy' })).toHaveValue(
    /^Tin nhắn này có hai phần/,
  );
  const box = panel.getByRole('textbox', { name: 'Dán kết quả' });
  await box.fill('x'.repeat(20_001));
  await panel.getByRole('button', { name: 'Kiểm tra và lưu' }).click();
  await expect(panel).toContainText('Câu trả lời dài quá 20.000 ký tự');
  await expect(panel).toContainText('Lần thử 1 / 2');

  await panel.getByRole('button', { name: 'Hủy' }).click();
  await expect(box).toBeHidden();
  await expect(panel).toContainText('Chưa có phân tích AI cho KH này.');
  await expect(start).toBeEnabled();
  await expect(start).toBeFocused();

  await page.evaluate(() => (window.web.failCopy = false));
  await start.click();
  await page.getByRole('link', { name: 'Khách hàng' }).first().click();
  await page.getByRole('link', { name: new RegExp(name) }).click();
  await expect(panelOf(page)).toContainText('Chưa có phân tích AI cho KH này.');
  await expect(panelOf(page).getByRole('textbox', { name: 'Dán kết quả' })).toBeHidden();
});

test('a failure to start the session offers Thử lại of ChatGPT web, never a call to the AI', async ({
  page,
}) => {
  const panel = await discoveryCustomer(page, 'Sen Web');
  await page.evaluate(() => (window.web.breakCopy = true));
  await panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' }).click();
  const alert = panel.getByRole('alert');
  await expect(alert).toContainText('Có lỗi trong app khi gọi AI');

  await page.evaluate(() => (window.web.breakCopy = false));
  await alert.getByRole('button', { name: 'Thử lại' }).click();
  await expect(panel).toContainText('Đã copy tin nhắn và mở ChatGPT');
  await expect(panel).toContainText('Chưa có phân tích AI cho KH này.');
  await expect(panel).not.toContainText('Có lỗi trong app khi gọi AI');
});

test('a double click starts one session; a late copy of a session ended leaves the next alone', async ({
  page,
}) => {
  const panel = await discoveryCustomer(page, 'Ngọc Web');
  const start = panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' });

  // The button is off as soon as it is clicked, while the copy is on its way (§3.1 item 4).
  await page.evaluate(() => (window.web.holdCopy = true));
  await start.dblclick();
  await expect.poll(() => page.evaluate(() => window.web.waiting())).toBe(1);
  await page.evaluate(() => {
    window.web.holdCopy = false;
    window.web.settleCopies(true);
  });
  await expect(panel).toContainText('Đã copy tin nhắn và mở ChatGPT');
  expect((await recorded(page)).copied).toHaveLength(1);
  expect((await recorded(page)).opened).toHaveLength(1);

  // "Copy lại" answered by the clipboard only after Hủy and a new session: it is that
  // session's own answer, the new one stays as it is (review of PR 459).
  await page.evaluate(() => (window.web.holdCopy = true));
  await panel.getByRole('button', { name: 'Copy lại', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.web.waiting())).toBe(1);
  await page.evaluate(() => (window.web.holdCopy = false));
  await panel.getByRole('button', { name: 'Hủy' }).click();
  await start.click();
  await expect(panel).toContainText('Đã copy tin nhắn và mở ChatGPT');
  await page.evaluate(async () => {
    window.web.settleCopies(false);
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  await expect(panel).toContainText('Đã copy tin nhắn và mở ChatGPT');
  await expect(panel).not.toContainText('Không copy được');
});

test('an answer with HTML or a link in its text shows that text, never markup of the model', async ({
  page,
}) => {
  const panel = await discoveryCustomer(page, 'Vy Web');
  await panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' }).click();
  const html = '<b data-model="html">KH ưu tiên gia đình</b> <a href="https://example.com">xem</a>';
  await panel.getByRole('textbox', { name: 'Dán kết quả' }).fill(answer(html));
  await panel.getByRole('button', { name: 'Kiểm tra và lưu' }).click();
  await expect(panel).toContainText('CURRENT');

  await expect(panel.getByRole('region', { name: 'Behavioral Hypotheses' })).toContainText(html);
  await expect(panel.locator('[data-model]')).toHaveCount(0);
  await expect(panel.getByRole('link', { name: 'xem' })).toHaveCount(0);
});

/** The right edge of the content of `box`, inside its border and padding. */
const contentRight = (box: Locator) =>
  box.evaluate((node) => {
    const style = getComputedStyle(node);
    return (
      node.getBoundingClientRect().right -
      parseFloat(style.paddingRight) -
      parseFloat(style.borderRightWidth)
    );
  });

/** How far the farthest element in `box` reaches past the right edge of its content. */
const overhang = async (box: Locator) => {
  const edge = await contentRight(box);
  return box.evaluate(
    (node, edge) =>
      Math.max(
        ...[...node.querySelectorAll('*')].map(
          (child) => child.getBoundingClientRect().right - edge,
        ),
      ),
    edge,
  );
};

// DR6-118: the default window gives the panel 376 px (three columns, DR6-30). After an answer of
// ChatGPT web its history keeps its badges inside the panel; a word of the AI with no place to break,
// a list of codes or an email, breaks inside the panel and inside the AI block of the appointment's
// detail, and the page does not scroll sideways.
test('the history and a long word of the AI stay in the panel and in the appointment detail at 1 440 × 900', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const name = 'Tú Dài Web';
  const codes = Array.from({ length: 20 }, (_, index) => `F${index + 1}`).join('/');
  const email = 'nguyen.van.khach.hang.rat.dai.ten.khong.the.ngat.dong.a@vidu.congty.vn';
  expect([codes.length, email.length]).toEqual([70, 70]);
  const panel = await discoveryCustomer(page, name);
  await panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' }).click();
  const output = JSON.stringify({
    hypotheses: [{ text: `Hỏi lại các dữ kiện ${codes}`, evidence: ['F1', 'F2'] }],
    discoveryStrategy: [
      { text: `Gửi tài liệu tới ${email}`, evidence: ['F3'] },
      { text: 'Hỏi sâu thêm về công việc', evidence: ['F5'] },
    ],
    nextBestActions: [{ text: `Xác nhận lại ${codes} với KH`, evidence: ['F1'] }],
    personalityNotes: [],
  });
  await panel
    .getByRole('textbox', { name: 'Dán kết quả' })
    .fill(`Đây là kết quả:\n\`\`\`json\n${output}\n\`\`\``);
  await panel.getByRole('button', { name: 'Kiểm tra và lưu' }).click();
  await expect(panel).toContainText('CURRENT');
  await expect(panel).toContainText(email);

  // Rounding: a pixel at most.
  const history = panel.getByRole('table', { name: 'Lịch sử phân tích' });
  const badge = history.getByText('CURRENT');
  expect(await right(badge), 'CURRENT badge').toBeLessThanOrEqual((await contentRight(panel)) + 1);
  // The badge of ChatGPT web stays on one line, as the state's does.
  const height = (box: Locator) => box.evaluate((node) => node.getBoundingClientRect().height);
  expect(await height(history.getByText('ChatGPT web', { exact: true }))).toBe(await height(badge));
  expect(await overhang(panel), 'panel').toBeLessThanOrEqual(1);
  expect(await scrolls(panel), 'panel scrolls sideways').toBe(false);
  expect(await sideways(page), 'page with the panel').toBe(false);

  // The same lists in the detail of an appointment, read-only.
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const booking = page.getByRole('dialog');
  await booking.getByRole('textbox', { name: /^Ngày/ }).fill('30/9');
  await booking.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await booking.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(booking).toHaveCount(0);
  await page.goto('/#/appointments');
  await page
    .getByRole('table', { name: 'Danh sách lịch hẹn' })
    .getByRole('button', { name })
    .click();
  const ai = page
    .getByRole('complementary', { name: 'Chi tiết lịch hẹn' })
    .getByRole('region', { name: 'KYC Intelligence' });
  await expect(ai).toContainText(email);
  await expect(ai).toContainText(codes);
  expect(await overhang(ai), 'AI block').toBeLessThanOrEqual(1);
  expect(await scrolls(ai), 'AI block scrolls sideways').toBe(false);
  expect(await sideways(page), 'page with the AI block').toBe(false);
});
