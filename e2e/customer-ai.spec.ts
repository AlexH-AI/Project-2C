import { expect, test, type Page } from '@playwright/test';

// playwright.config.ts pins "today" of the simulated data (VITE_DEMO_ANCHOR) to 15/09/2026. The web
// build runs the Mock until Settings → AI exists (T-167).

async function createCustomer(page: Page, name: string) {
  await page.goto('/#/customers');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(name);
  await dialog.getByRole('combobox', { name: 'RE phụ trách' }).selectOption({ index: 1 });
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('1984');
  await dialog.getByRole('radio', { name: 'Nữ' }).check();
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole('link', { name: new RegExp(name) }).click();
}

/** One KYC note confirming `facts` (trường label, value); `conflict` marks them as conflicts. */
async function addNote(
  page: Page,
  name: string,
  facts: readonly (readonly [string, string])[],
  conflict = false,
) {
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${name}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Gặp KH');
  for (const [field, value] of facts) {
    await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: field });
    await dialog.getByRole('textbox', { name: 'Giá trị' }).fill(value);
    if (conflict) await dialog.getByRole('radio', { name: /Đánh dấu mâu thuẫn/ }).check();
    await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  }
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();
}

const panelOf = (page: Page) => page.getByRole('region', { name: 'KYC Intelligence' });

test('discovery with the Mock: the gate, an analysis, STALE after a KYC change, a cốt lõi conflict', async ({
  page,
}) => {
  const name = 'Hoa Khám Phá';
  await createCustomer(page, name);
  const panel = panelOf(page);

  // P2: the gate lets no AI through, so the button is off and nothing is called.
  await expect(panel).toContainText(
    'Cần chăm sóc, KYC thêm thông tin khách hàng. Còn thiếu: Gia đình, Nghề nghiệp / nguồn thu — câu hỏi gợi ý ở thẻ Dữ kiện KYC.',
  );
  await expect(panel.getByRole('button', { name: 'Phân tích' })).toBeDisabled();

  await addNote(page, name, [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '2'],
    ['Nghề nghiệp', 'Bác sĩ'],
  ]);
  await expect(panel).toContainText('PROFILE_DISCOVERY');
  await expect(panel).toContainText('Chưa có phân tích AI cho KH này.');

  await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panel).toContainText('CURRENT');
  await expect(panel.getByText('Mock', { exact: true })).toBeVisible();
  await expect(panel).toContainText(/kyc v2 · discovery@1 · Mock · 15\/09 \d\d:\d\d/);
  await expect(panel).toContainText('Kết quả Mock: câu mẫu cố định để thử app');
  await expect(panel.getByRole('heading', { level: 3 })).toHaveText([
    'Behavioral Hypotheses giả thuyết ban đầu',
    'Discovery Strategy',
    'Next Best Actions',
  ]);
  // The Mock cites the first two facts: birth year and gender, both confirmed today.
  await expect(
    panel.getByRole('region', { name: 'Behavioral Hypotheses' }).getByRole('listitem'),
  ).toContainText([
    'Bằng chứng: F1, F2Mức bằng chứng: trung bình · 2 dữ kiện, mới nhất 15/09/2026',
  ]);
  await expect(panel).toContainText('Hạng mục còn thiếu: Tài sản / AUM');
  await expect(panel).not.toContainText('Thông tin tham khảo');

  // P1: any new KYC version leaves it STALE; a minor trường gives the minor reminder.
  await addNote(page, name, [['Nơi sinh sống', 'Huế']]);
  await expect(panel).toContainText('STALE');
  await expect(panel).toContainText('KYC có thay đổi nhỏ từ 15/09.');
  await panel.getByRole('button', { name: 'Phân tích lại' }).click();
  await expect(panel).toContainText('CURRENT');
  await expect(panel).toContainText(/kyc v3 · discovery@1/);
  await expect(panel).not.toContainText('KYC có thay đổi nhỏ');

  // A cốt lõi conflict blocks the AI again; the analysis stays below, faded.
  await addNote(page, name, [['Số con', '3']], true);
  await expect(panel).toContainText('CONFLICT_RESOLUTION');
  await expect(panel).toContainText('Giải quyết mâu thuẫn ở Số con trước khi phân tích.');
  await expect(panel.getByRole('button', { name: 'Phân tích' })).toBeDisabled();
  await expect(panel).toContainText(/kyc v3 · discovery@1/);
});

test('analysis with the Mock: four blocks, Thông tin tham khảo, the material reminder', async ({
  page,
}) => {
  const name = 'Lan Phân Tích';
  await createCustomer(page, name);
  const panel = panelOf(page);
  await addNote(page, name, [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '2'],
    ['Nghề nghiệp', 'Bác sĩ'],
    ['Mục tiêu chính', 'Học phí cho con'],
    ['Tổng tài sản', '5 tỷ'],
    ['Khẩu vị rủi ro', 'Thận trọng'],
  ]);
  await expect(panel).toContainText('PAIN_POINT_ANALYSIS');

  await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panel).toContainText('CURRENT');
  await expect(panel).toContainText(/kyc v2 · analysis@1 · Mock/);
  await expect(panel.getByRole('heading', { level: 3 })).toHaveText([
    'Behavioral Hypotheses giả thuyết, cần kiểm chứng',
    'Needs · Pain points · Opportunity Themes',
    'Discovery Strategy',
    'Next Best Actions',
    'Thông tin tham khảo — không phải kết luận',
  ]);
  const reference = panel.getByRole('region', {
    name: 'Thông tin tham khảo — không phải kết luận',
  });
  await expect(reference.getByRole('listitem')).toHaveCount(1);
  await expect(reference.getByRole('listitem')).toContainText(/^Tâm lý học: KH có thể/);
  await expect(reference.getByRole('listitem')).toContainText('Mức bằng chứng: thấp · 1 dữ kiện');

  // A cốt lõi trường changed: the material reminder.
  await addNote(page, name, [['Mục tiêu chính', 'Hưu trí sớm']]);
  await expect(panel).toContainText('STALE');
  await expect(panel).toContainText('KYC đã đổi ở trường cốt lõi từ 15/09 — nên phân tích lại.');
  await expect(panel.getByRole('button', { name: 'Phân tích lại' })).toBeEnabled();
});
