import { expect, test, type Page } from '@playwright/test';
import { addKycNote, createKycCustomer } from './support';

// ChatGPT web (spec Phase 5 §3.1, mockup ai.html 4d–4i) on the web build: no network. The page opens
// chatgpt.com with `window.open` and copies with the clipboard; both are recorded here, the paste,
// the check and the save run for real. Today is pinned to 15/09/2026 (playwright.config.ts).

declare global {
  interface Window {
    web: { copied: string[]; opened: unknown[][]; failCopy: boolean; breakCopy: boolean };
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const web = {
      copied: [] as string[],
      opened: [] as unknown[][],
      failCopy: false,
      breakCopy: false,
    };
    Object.assign(window, { web });
    window.open = (...args: unknown[]) => {
      web.opened.push(args);
      return null;
    };
    navigator.clipboard.writeText = (text: string) => {
      // A bug of the app, not a refusal: the click fails as a whole.
      if (web.breakCopy) throw new TypeError('broken');
      if (web.failCopy) return Promise.reject(new DOMException('denied', 'NotAllowedError'));
      web.copied.push(text);
      return Promise.resolve();
    };
  });
});

const panelOf = (page: Page) => page.getByRole('region', { name: 'KYC Intelligence' });
const recorded = (page: Page) => page.evaluate(() => window.web);

/** A discovery answer that passes for a customer of the facts F1–F5, as ChatGPT gives it. */
const GOOD = `Đây là kết quả:
\`\`\`json
${JSON.stringify({
  hypotheses: [{ text: 'Khách hàng sẵn lòng chia sẻ về gia đình', evidence: ['F1', 'F2'] }],
  discoveryStrategy: [
    { text: 'Hỏi thêm về điều khách hàng quan tâm', evidence: ['F3'] },
    { text: 'Hỏi sâu thêm về công việc', evidence: ['F5'] },
  ],
  nextBestActions: [{ text: 'Hẹn buổi gặp tiếp để tìm hiểu thêm', evidence: ['F1'] }],
  personalityNotes: [],
})}
\`\`\``;

/** A customer the gate lets through in discovery, with the panel open on it. */
async function discoveryCustomer(page: Page, name: string) {
  await createKycCustomer(page, name);
  await addKycNote(page, name, [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '2'],
    ['Nghề nghiệp', 'Bác sĩ'],
  ]);
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
  await expect(panel).toContainText(/kyc v2 · discovery@1\+web@1 · chụp 15\/09 \d\d:\d\d/);
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
  await expect(panel.getByText('ChatGPT web', { exact: true })).toBeVisible();
  await expect(panel).toContainText(/kyc v2 · discovery@1\+web@1 · ChatGPT web · 15\/09 \d\d:\d\d/);
  await expect(panel).not.toContainText('Kết quả Mock');
  await expect(start).toBeEnabled();
  await expect(panel.getByRole('button', { name: 'Phân tích lại' })).toBeEnabled();
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
  await expect(panel).toContainText(/discovery@1\+web@1 · ChatGPT web/);

  await start.click();
  await panel.getByRole('textbox', { name: 'Dán kết quả' }).fill('Lần 1');
  await save.click();
  await panel.getByRole('textbox', { name: 'Dán kết quả (lần thử 2 / 2)' }).fill('{"x": 1}');
  await save.click();
  await expect(panel).toContainText(/Lần phân tích 15\/09 bị loại: .+ \(V1\)\./);
  // The ACCEPTED one stays below.
  await expect(panel).toContainText('CURRENT');
});

test('a KYC change while the session is open leaves the saved result STALE', async ({ page }) => {
  const name = 'Cúc Web';
  const panel = await discoveryCustomer(page, name);
  await panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' }).click();
  await expect(panel).toContainText('kyc v2 · discovery@1+web@1');

  await addKycNote(page, name, [['Nơi sinh sống', 'Huế']]);
  await panel.getByRole('textbox', { name: 'Dán kết quả' }).fill(GOOD);
  await panel.getByRole('button', { name: 'Kiểm tra và lưu' }).click();
  await expect(panel).toContainText('STALE');
  await expect(panel).toContainText('KYC có thay đổi nhỏ từ 15/09.');
  await expect(panel).toContainText(/kyc v2 · discovery@1\+web@1 · ChatGPT web/);
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
