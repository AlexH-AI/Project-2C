import { expect, test, type Page } from '@playwright/test';
import { asExe } from './support';

// Cài đặt → AI (spec Phase 5 §4, §9.3; mockup ai.html 1a–1g, 4a–4c). The web build has no Rust,
// so OpenCode is off there; `asExe` stands in for the exe and its AI commands (key, ai_complete).

const KEY = 'sk-e2e-0123456789abcdef';

async function openAi(page: Page) {
  await page.goto('/#/settings');
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'AI' })
    .click();
  await expect(page.getByRole('heading', { name: 'Provider & model' })).toBeVisible();
}

const provider = (page: Page) => page.getByRole('radiogroup', { name: 'Provider' });
const plan = (page: Page) => page.getByRole('radiogroup', { name: 'Gói OpenCode' });
const model = (page: Page) => page.getByRole('combobox', { name: 'Model' });
const keyCard = (page: Page) => page.getByRole('region', { name: 'API key OpenCode' });
const checkCard = (page: Page) => page.getByRole('region', { name: 'Kiểm tra kết nối' });

async function chooseOpenCode(page: Page, planLabel: 'Gói Go' | 'Credit') {
  await provider(page).getByRole('radio', { name: 'OpenCode' }).check();
  await plan(page).getByRole('radio', { name: planLabel }).check();
}

test('web mode: only the Mock, OpenCode and the key are for the exe (1c, 4b)', async ({ page }) => {
  await openAi(page);

  await expect(provider(page).getByRole('radio', { name: 'Mock' })).toBeChecked();
  await expect(provider(page).getByRole('radio', { name: 'OpenCode' })).toBeDisabled();
  await expect(provider(page)).toContainText('OpenCode chỉ có trong app exe.');
  await expect(plan(page)).toHaveCount(0);
  await expect(model(page)).toBeDisabled();
  await expect(keyCard(page)).toContainText('Chỉ có trong app exe.');
  await expect(checkCard(page)).toContainText('Mock chạy trong app, không cần kết nối.');
  await expect(checkCard(page).getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Dữ liệu gửi đi' })).toContainText(
    'Phân tích bằng ChatGPT web: bạn tự dán dữ kiện KYC (không có tên, mã KH) vào tài khoản ChatGPT của mình.',
  );
  await expect(page.locator('main')).not.toContainText('OpenCode Go');
});

test('exe: provider, gói OpenCode and model are saved at once and kept (4a, 4b)', async ({
  page,
}) => {
  await asExe(page);
  await openAi(page);

  await chooseOpenCode(page, 'Credit');
  await model(page).selectOption({ label: 'Kimi K3' });
  await expect(page.getByRole('combobox', { name: 'Mức suy luận' })).toBeDisabled();

  // Left and opened again: read back from the data.
  const nav = page.getByRole('navigation', { name: 'Mục cài đặt' });
  await nav.getByRole('button', { name: 'Dữ liệu' }).click();
  await expect(page.getByRole('heading', { name: 'File dữ liệu' })).toBeVisible();
  await nav.getByRole('button', { name: 'AI' }).click();
  await expect(provider(page).getByRole('radio', { name: 'OpenCode' })).toBeChecked();
  await expect(plan(page).getByRole('radio', { name: 'Credit' })).toBeChecked();
  await expect(model(page)).toHaveValue('kimi-k3');

  // Mock hides the plan and turns the model off, keeping both.
  await provider(page).getByRole('radio', { name: 'Mock' }).check();
  await expect(plan(page)).toHaveCount(0);
  await expect(model(page)).toBeDisabled();
  await expect(model(page)).toHaveValue('kimi-k3');
  await provider(page).getByRole('radio', { name: 'OpenCode' }).check();
  await expect(plan(page).getByRole('radio', { name: 'Credit' })).toBeChecked();
  await expect(page.locator('main')).not.toContainText('OpenCode Go');
});

test('exe: the key is checked at the field, saved trimmed, never shown, deleted after a confirmation (1d, 1e)', async ({
  page,
}) => {
  await asExe(page);
  await openAi(page);
  const card = keyCard(page);
  await expect(card).toContainText('Chưa có key');

  await card.getByRole('button', { name: 'Lưu key' }).click();
  await expect(card).toContainText('Chưa nhập key.');
  await card.getByRole('textbox', { name: 'Key' }).fill('x'.repeat(513));
  await card.getByRole('button', { name: 'Lưu key' }).click();
  await expect(card).toContainText('Key dài quá 512 ký tự — kiểm tra lại đoạn đã dán.');

  await card.getByRole('textbox', { name: 'Key' }).fill(`  ${KEY}  `);
  await card.getByRole('button', { name: 'Lưu key' }).click();
  await expect(card.getByRole('status')).toHaveText('Đã lưu key.');
  await expect(card).toContainText('Đã có key');
  await expect(card.getByRole('textbox', { name: 'Key mới' })).toHaveValue('');
  expect(await page.evaluate(() => window.exe.keysSet)).toEqual([KEY]);
  expect(await page.content()).not.toContain(KEY);

  await card.getByRole('button', { name: 'Xóa key…' }).click();
  const dialog = page.getByRole('dialog', { name: 'Xóa API key OpenCode?' });
  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(card).toContainText('Đã có key');

  await card.getByRole('button', { name: 'Xóa key…' }).click();
  await dialog.getByRole('button', { name: 'Xóa key' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(card).toContainText('Chưa có key');
});

test('exe: Kiểm tra kết nối runs under the chosen plan, is off while it runs and shows the errors (1f, 4a, 4c)', async ({
  page,
}) => {
  await asExe(page);
  await openAi(page);
  await expect(checkCard(page)).toContainText('Mock chạy trong app, không cần kết nối.');
  await chooseOpenCode(page, 'Credit');
  const button = checkCard(page).getByRole('button', { name: 'Kiểm tra kết nối' });

  await page.evaluate(() => window.exe.holdAi());
  await button.click();
  await expect(checkCard(page).getByRole('status')).toHaveText('Đang kiểm tra…');
  await expect(button).toBeDisabled();
  await page.evaluate(() => window.exe.releaseAi());
  await expect(checkCard(page).getByRole('status')).toHaveText(
    'Kết nối được · Credit · DeepSeek V4.1 Flash',
  );
  await expect(button).toBeEnabled();
  expect(await page.evaluate(() => window.exe.aiCalls)).toMatchObject([
    { plan: 'CREDIT', model: 'deepseek-v4.1-flash', reasoning: null, maxTokens: 64 },
  ]);

  await page.evaluate(() => (window.exe.aiError = { code: 'AI_UNAUTHORIZED', httpStatus: 401 }));
  await button.click();
  await expect(checkCard(page).getByRole('alert')).toHaveText(
    'Key không hợp lệ hoặc hết hạn. Gói Go đã hết hạn → chọn gói Credit ở Cài đặt → AI. (HTTP 401)',
  );

  await page.evaluate(
    () => (window.exe.aiError = { code: 'AI_HTTP', httpStatus: 502, message: 'Bad gateway' }),
  );
  await plan(page).getByRole('radio', { name: 'Gói Go' }).check();
  await button.click();
  await expect(checkCard(page).getByRole('alert')).toHaveText(
    'OpenCode báo lỗi (HTTP 502): Bad gateway',
  );
  expect((await page.evaluate(() => window.exe.aiCalls)).at(-1)).toMatchObject({ plan: 'GO' });
});
