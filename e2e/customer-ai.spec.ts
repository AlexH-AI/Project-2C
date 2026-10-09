import { expect, test, type Page } from '@playwright/test';
import { addKycNote, createKycCustomer } from './support';

// playwright.config.ts pins "today" of the simulated data (VITE_DEMO_ANCHOR) to 15/09/2026. The web
// build runs the Mock until Settings → AI exists (T-167).

const panelOf = (page: Page) => page.getByRole('region', { name: 'KYC Intelligence' });

test('discovery with the Mock: the gate, an analysis, STALE after a KYC change, a cốt lõi conflict', async ({
  page,
}) => {
  const name = 'Hoa Khám Phá';
  await createKycCustomer(page, name);
  const panel = panelOf(page);

  // P2: the gate lets no AI through, so the button is off and nothing is called.
  await expect(panel).toContainText(
    'Cần chăm sóc, KYC thêm thông tin khách hàng. Còn thiếu: Gia đình, Nghề nghiệp / nguồn thu — câu hỏi gợi ý ở thẻ Dữ kiện KYC.',
  );
  await expect(panel.getByRole('button', { name: 'Phân tích', exact: true })).toBeDisabled();
  await expect(panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' })).toBeDisabled();

  await addKycNote(page, name, [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '2'],
    ['Nghề nghiệp', 'Bác sĩ'],
  ]);
  await expect(panel).toContainText('PROFILE_DISCOVERY');
  await expect(panel).toContainText('Chưa có phân tích AI cho KH này.');

  await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panel).toContainText('CURRENT');
  // The head badge; the history names it too.
  await expect(panel.getByText('Mock', { exact: true }).first()).toBeVisible();
  await expect(panel).toContainText(/kyc v2 · discovery@1 · Mock · 15\/09 \d\d:\d\d/);
  await expect(panel).toContainText('Kết quả Mock: câu mẫu cố định để thử app');
  await expect(panel.getByRole('heading', { level: 3 })).toHaveText([
    'Behavioral Hypotheses giả thuyết ban đầu',
    'Discovery Strategy',
    'Next Best Actions',
    'Lịch sử phân tích bấm một dòng để xem',
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
  await addKycNote(page, name, [['Nơi sinh sống', 'Huế']]);
  await expect(panel).toContainText('STALE');
  await expect(panel).toContainText('KYC có thay đổi nhỏ từ 15/09.');
  await panel.getByRole('button', { name: 'Phân tích lại' }).click();
  await expect(panel).toContainText('CURRENT');
  await expect(panel).toContainText(/kyc v3 · discovery@1/);
  await expect(panel).not.toContainText('KYC có thay đổi nhỏ');

  // A cốt lõi conflict blocks the AI again; the analysis stays below, faded.
  await addKycNote(page, name, [['Số con', '3']], true);
  await expect(panel).toContainText('CONFLICT_RESOLUTION');
  await expect(panel).toContainText('Giải quyết mâu thuẫn ở Số con trước khi phân tích.');
  await expect(panel.getByRole('button', { name: 'Phân tích', exact: true })).toBeDisabled();
  await expect(panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' })).toBeDisabled();
  await expect(panel).toContainText(/kyc v3 · discovery@1/);
});

test('analysis with the Mock: four blocks, Thông tin tham khảo, the material reminder', async ({
  page,
}) => {
  const name = 'Lan Phân Tích';
  await createKycCustomer(page, name);
  const panel = panelOf(page);
  await addKycNote(page, name, [
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
    'Lịch sử phân tích bấm một dòng để xem',
  ]);
  const reference = panel.getByRole('region', {
    name: 'Thông tin tham khảo — không phải kết luận',
  });
  await expect(reference.getByRole('listitem')).toHaveCount(1);
  await expect(reference.getByRole('listitem')).toContainText(/^Tâm lý học: KH có thể/);
  await expect(reference.getByRole('listitem')).toContainText('Mức bằng chứng: thấp · 1 dữ kiện');

  // A cốt lõi trường changed: the material reminder.
  await addKycNote(page, name, [['Mục tiêu chính', 'Hưu trí sớm']]);
  await expect(panel).toContainText('STALE');
  await expect(panel).toContainText('KYC đã đổi ở trường cốt lõi từ 15/09 — nên phân tích lại.');
  await expect(panel.getByRole('button', { name: 'Phân tích lại' })).toBeEnabled();
});

test('the history of a seeded customer: latest first, a STALE one opened, F codes to the facts', async ({
  page,
}) => {
  // Seed 1 on 15/09/2026 gives this customer three Mock analyses: one CURRENT, two STALE before it.
  const name = 'Phan Thanh Bình';
  await page.goto('/#/customers');
  await page.getByRole('radio', { name: 'Bảng' }).click();
  const link = page.getByRole('link', { name, exact: true });
  const more = page.getByRole('button', { name: /^Hiện thêm/ });
  while (!(await link.isVisible())) await more.click();
  await link.click();

  const panel = panelOf(page);
  const rows = panel.getByRole('table', { name: 'Lịch sử phân tích' }).getByRole('row');
  // Latest first by seq: the header, then CURRENT and the two STALE.
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(1)).toContainText(/^23\/03 \d\d:\d\dv\d+analysis@1MockCURRENT$/);
  await expect(rows.nth(2)).toContainText(/^25\/10 \d\d:\d\dv\d+discovery@1MockSTALE$/);
  await expect(rows.nth(3)).toContainText(/^24\/09 \d\d:\d\dv\d+discovery@1MockSTALE$/);
  await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true');

  // An older STALE one shows in place of the latest, faded, under "Đang xem lần …".
  await rows
    .nth(2)
    .getByRole('button', { name: /^Xem lần 25\/10/ })
    .click();
  await expect(panel).toContainText(
    /Đang xem lần 25\/10 \d\d:\d\d · kyc v\d+ STALE ← Về bản mới nhất/,
  );
  await expect(panel).toContainText(/kyc v\d+ · discovery@1 · Mock · 25\/10 \d\d:\d\d/);
  await expect(rows.nth(2)).toHaveAttribute('aria-current', 'true');
  await expect(panel).toContainText('CURRENT');
  await panel.getByRole('button', { name: '← Về bản mới nhất' }).click();
  await expect(panel).not.toContainText('Đang xem lần');
  await expect(panel).toContainText(/kyc v\d+ · analysis@1 · Mock · 23\/03/);

  // The facts list names each fact F{seq}; a code cited leads to its fact, outlined for a moment.
  const kyc = page.getByRole('region', { name: 'Dữ kiện KYC' });
  await expect(kyc).toContainText(/F\d+ · \d\d\/\d\d\/\d{4}/);
  const code = panel
    .getByRole('region', { name: 'Behavioral Hypotheses' })
    .getByRole('button')
    .first();
  const cited = (await code.textContent()) ?? '';
  await code.click();
  const marked = kyc.locator('[aria-current="true"]');
  await expect(marked).toContainText(`${cited} · `);
  await expect(marked).toBeInViewport();
  await expect(marked).toHaveCount(0, { timeout: 5000 });
});
