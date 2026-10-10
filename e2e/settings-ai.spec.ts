import { readFile } from 'node:fs/promises';
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
const reasoning = (page: Page) => page.getByRole('combobox', { name: 'Mức suy luận' });
const REASONING_OFF = 'Model này chưa được kiểm với mức suy luận';

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

test('a stored model taken off the list falls back to the defaults with one line (1g, T-180)', async ({
  page,
}) => {
  // Brought by a backup: the settings row `ai` goes into it (§4.1).
  await page.goto('/#/settings');
  const backup = page.getByRole('region', { name: 'Xuất / nhập backup' });
  const download = page.waitForEvent('download');
  await backup.getByRole('button', { name: 'Xuất backup' }).click();
  const file = await download;
  const data = JSON.parse(await readFile(await file.path(), 'utf8'));
  const stored = { provider: 'OPENCODE_GO', opencodePlan: 'CREDIT', model: 'deepseek-v4-pro' };
  data.tables.settings = [
    ...data.tables.settings.filter((row: { key: string }) => row.key !== 'ai'),
    {
      key: 'ai',
      value_json: JSON.stringify({ ...stored, reasoning: 'DEFAULT' }),
      updated_at: '2026-10-09T08:00:00.000Z',
    },
  ];
  await backup.getByLabel('Nhập backup').setInputFiles({
    name: file.suggestedFilename(),
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await page
    .getByRole('dialog', { name: 'Thay toàn bộ dữ liệu?' })
    .getByRole('button', { name: 'Thay dữ liệu', exact: true })
    .click();
  await expect(backup.getByRole('status')).toContainText('Đã nhập backup xuất lúc');

  // Not `openAi`: a new page load would drop the web build's data.
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'AI' })
    .click();
  await expect(page.getByRole('note')).toHaveText(
    'Cài đặt AI đã lưu không hợp lệ (model "deepseek-v4-pro" không còn trong danh sách) — đang dùng mặc định: Mock · DeepSeek V4.1 Flash · Mặc định. Chọn lại để lưu.',
  );
  await expect(provider(page).getByRole('radio', { name: 'Mock' })).toBeChecked();
  await expect(model(page)).toHaveValue('deepseek-v4.1-flash');
  await expect(model(page).getByRole('option')).toHaveText([
    'GLM-5.3',
    'Kimi K3',
    'DeepSeek V4.1 Flash · mặc định',
  ]);
});

test('exe: provider, gói OpenCode and model are saved at once and kept (4a, 4b)', async ({
  page,
}) => {
  await asExe(page);
  await openAi(page);

  await chooseOpenCode(page, 'Credit');
  await model(page).selectOption({ label: 'Kimi K3' });

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

test('exe: Mức suy luận is on only for a model checked with reasoning_effort, kept and sent (1a, T-179)', async ({
  page,
}) => {
  await asExe(page);
  await openAi(page);
  await chooseOpenCode(page, 'Credit');
  const card = page.getByRole('region', { name: 'Provider & model' });

  await model(page).selectOption({ label: 'GLM-5.3' });
  await expect(reasoning(page)).toBeDisabled();
  await expect(card).toContainText(REASONING_OFF);

  await model(page).selectOption({ label: 'Kimi K3' });
  await expect(reasoning(page)).toBeEnabled();
  await expect(card).not.toContainText(REASONING_OFF);
  await reasoning(page).selectOption({ label: 'Cao' });

  // Left and opened again: read back from the data.
  const nav = page.getByRole('navigation', { name: 'Mục cài đặt' });
  await nav.getByRole('button', { name: 'Dữ liệu' }).click();
  await expect(page.getByRole('heading', { name: 'File dữ liệu' })).toBeVisible();
  await nav.getByRole('button', { name: 'AI' }).click();
  await expect(model(page)).toHaveValue('kimi-k3');
  await expect(reasoning(page)).toHaveValue('HIGH');

  await checkCard(page).getByRole('button', { name: 'Kiểm tra kết nối' }).click();
  await expect(checkCard(page).getByRole('status')).toHaveText('Kết nối được · Credit · Kimi K3');
  expect(await page.evaluate(() => window.exe.aiCalls)).toMatchObject([
    { plan: 'CREDIT', model: 'kimi-k3', reasoning: 'high' },
  ]);
});

test("exe: Nạp lại keeps Settings → AI, which are the machine's (DR5-50)", async ({ page }) => {
  await asExe(page);
  await openAi(page);
  await chooseOpenCode(page, 'Credit');
  await model(page).selectOption({ label: 'Kimi K3' });
  await reasoning(page).selectOption({ label: 'Cao' });

  const nav = page.getByRole('navigation', { name: 'Mục cài đặt' });
  await nav.getByRole('button', { name: 'Dữ liệu' }).click();
  const section = page.getByRole('region', { name: 'Dữ liệu giả lập' });
  await section.getByRole('button', { name: 'Nạp lại…' }).click();
  const dialog = page.getByRole('dialog', { name: 'Nạp lại dữ liệu giả lập?' });
  await dialog.getByRole('textbox').fill('NẠP LẠI');
  await dialog.getByRole('button', { name: 'Backup rồi nạp lại' }).click();
  await expect(section.getByRole('status')).toContainText('Đã nạp lại dữ liệu giả lập');

  await nav.getByRole('button', { name: 'AI' }).click();
  await expect(provider(page).getByRole('radio', { name: 'OpenCode' })).toBeChecked();
  await expect(plan(page).getByRole('radio', { name: 'Credit' })).toBeChecked();
  await expect(model(page)).toHaveValue('kimi-k3');
  await expect(reasoning(page)).toHaveValue('HIGH');
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
  // A password field (DR5-32): no textbox role, nothing shown as typed, no spell check.
  const field = card.getByLabel('Key', { exact: true });
  await expect(field).toHaveAttribute('type', 'password');
  await expect(field).toHaveAttribute('spellcheck', 'false');
  await field.fill('x'.repeat(513));
  await card.getByRole('button', { name: 'Lưu key' }).click();
  await expect(card).toContainText('Key dài quá 512 ký tự — kiểm tra lại đoạn đã dán.');

  await field.fill(`  ${KEY}  `);
  await card.getByRole('button', { name: 'Lưu key' }).click();
  await expect(card.getByRole('status')).toHaveText('Đã lưu key.');
  await expect(card).toContainText('Đã có key');
  await expect(card.getByLabel('Key mới')).toHaveValue('');
  expect(await page.evaluate(() => window.exe.keysSet)).toEqual([KEY]);
  expect(await page.content()).not.toContain(KEY);

  // Lưu key again with the field empty: its error alone, not beside "Đã lưu key." (DR5-46).
  await card.getByRole('button', { name: 'Lưu key' }).click();
  await expect(card).toContainText('Chưa nhập key.');
  await expect(card.getByRole('status')).toHaveCount(0);
  await expect(card).not.toContainText('Đã lưu key.');

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
    {
      sessionId: expect.stringMatching(/^[0-9a-f]{32}$/),
      plan: 'CREDIT',
      model: 'deepseek-v4.1-flash',
      reasoning: null,
      maxTokens: 64,
    },
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

test('exe: a key status read late never overwrites the key just saved (DR5-37)', async ({
  page,
}) => {
  await asExe(page);
  // After `asExe`: holds `ai_key_status` until the test lets it answer, as a slow Rust would.
  await page.addInitScript(() => {
    type Invoke = (command: string, args: unknown) => Promise<unknown>;
    const internals = (window as unknown as { __TAURI_INTERNALS__: { invoke: Invoke } })
      .__TAURI_INTERNALS__;
    const invoke = internals.invoke.bind(internals);
    let release = () => {};
    const held = new Promise<void>((resolve) => (release = resolve));
    Object.assign(window, { releaseKeyStatus: () => release() });
    internals.invoke = async (command: string, args: unknown) => {
      if (command !== 'ai_key_status') return invoke(command, args);
      // What Rust read before the save: no key yet.
      const before = await invoke(command, args);
      await held;
      return before;
    };
  });
  await openAi(page);
  const card = keyCard(page);
  await expect(card).not.toContainText('Chưa có key');

  await card.getByLabel('Key', { exact: true }).fill(KEY);
  await card.getByRole('button', { name: 'Lưu key' }).click();
  await expect(card.getByRole('status')).toHaveText('Đã lưu key.');
  await expect(card).toContainText('Đã có key');

  await page.evaluate(() => (window as unknown as { releaseKeyStatus(): void }).releaseKeyStatus());
  // The late answer said "no key"; give it time to land before checking it did not.
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 100)));
  await expect(card).toContainText('Đã có key');
  await expect(card.getByRole('button', { name: 'Xóa key…' })).toBeVisible();
});
