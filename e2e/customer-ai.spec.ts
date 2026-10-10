import { expect, test, type Page } from '@playwright/test';
import { addKycNote, asExe, createKycCustomer } from './support';

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
  // Mockups 2a, 4d: what Phân tích sends, and where; birth year and gender are facts too.
  await expect(panel).toContainText(
    'Phân tích: Mock trả câu mẫu cố định từ 5 dữ kiện, không gọi AI (đổi ở Cài đặt → AI). ChatGPT web: app copy tin nhắn và mở chatgpt.com — bạn tự dán, rồi dán câu trả lời lại vào đây. Không gửi tên, mã KH, ghi chú.',
  );

  await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panel).toContainText('CURRENT');
  // Said to a screen reader (DR5-33); the help line goes with the first analysis.
  await expect(panel.getByRole('status')).toHaveText('Phân tích xong: đã lưu kết quả.');
  await expect(panel).not.toContainText('Không gửi tên');
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

  // A birth date in the same year replaces F1 by a new fact, with no new version (DR5-15): still
  // CURRENT, and F1 leads to the fact in effect now rather than "không còn hiệu lực".
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  const edit = page.getByRole('dialog', { name: `Sửa hồ sơ · ${name}` });
  await edit.getByRole('textbox', { name: /^Ngày sinh/ }).fill('12/3/1984');
  await edit.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(edit).toBeHidden();
  await expect(panel).toContainText(/kyc v2 · discovery@1/);
  await expect(panel).toContainText('CURRENT');
  await panel
    .getByRole('region', { name: 'Behavioral Hypotheses' })
    .getByRole('button', { name: 'F1', exact: true })
    .click();
  const kyc = page.getByRole('region', { name: 'Dữ kiện KYC' });
  await expect(kyc.locator('[aria-current="true"]')).toContainText('F6 · ');
  await expect(panel).not.toContainText('không còn hiệu lực');

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
  // By the keyboard, the focus goes to the fact too (DR5-38).
  await code.focus();
  await page.keyboard.press('Enter');
  const marked = kyc.locator('[aria-current="true"]');
  await expect(marked).toContainText(`${cited} · `);
  await expect(marked).toBeInViewport();
  await expect(marked).toBeFocused();
  await expect(marked).toHaveCount(0, { timeout: 5000 });
});

/**
 * Settings → AI on OpenCode, through the exe's stand-in, which answers "OK" (no JSON) unless held
 * or failing; then back to the page before, without a reload that would drop the data.
 */
async function useOpenCode(page: Page) {
  await page.getByRole('link', { name: 'Cài đặt' }).click();
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'AI' })
    .click();
  await page
    .getByRole('radiogroup', { name: 'Provider' })
    .getByRole('radio', { name: 'OpenCode' })
    .check();
  await page.goBack();
}

test('a run outlives the profile: left and shown again, it still shows with Hủy (review of PR 439)', async ({
  page,
}) => {
  await asExe(page);
  const name = 'Tú Chờ AI';
  await createKycCustomer(page, name);
  await addKycNote(page, name, [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '2'],
    ['Nghề nghiệp', 'Bác sĩ'],
  ]);
  await useOpenCode(page);
  const panel = panelOf(page);
  const analyse = panel.getByRole('button', { name: 'Phân tích', exact: true });
  await expect(panel).toContainText(
    'Phân tích: gửi 5 dữ kiện đã xác nhận tới OpenCode · Gói Go · DeepSeek V4.1 Flash (đổi ở Cài đặt → AI). ChatGPT web: app copy tin nhắn và mở chatgpt.com — bạn tự dán, rồi dán câu trả lời lại vào đây. Không gửi tên, mã KH, ghi chú.',
  );

  await page.evaluate(() => window.exe.holdAi());
  await analyse.click();
  await expect(panel.getByRole('status')).toContainText('Đang phân tích…');
  await page.goBack();
  await page.goForward();
  await expect(panel.getByRole('status')).toContainText('Đang phân tích…');
  await expect(analyse).toBeDisabled();

  // Hủy holds every AI button off until the request ends (§5.2), also on the profile shown again.
  await panel.getByRole('button', { name: 'Hủy' }).click();
  await expect(panel.getByRole('status')).toContainText('Đang hủy…');
  await page.goBack();
  await page.goForward();
  await expect(panel.getByRole('status')).toContainText('Đang hủy…');
  await page.evaluate(() => window.exe.releaseAi());
  await expect(panel.getByRole('status')).toHaveCount(0);
  await expect(analyse).toBeEnabled();
  // Nothing was saved after Hủy.
  await expect(panel).toContainText('Chưa có phân tích AI cho KH này.');
});

test('a request running elsewhere says why the buttons of another customer are off (DR5-40)', async ({
  page,
}) => {
  await asExe(page);
  const busy = 'Đang có một yêu cầu AI khác — chờ xong rồi thử lại.';
  const first = 'Tú Chạy Trước';
  await createKycCustomer(page, first);
  await addKycNote(page, first, [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '2'],
    ['Nghề nghiệp', 'Bác sĩ'],
  ]);
  await useOpenCode(page);
  await page.evaluate(() => window.exe.holdAi());
  await panelOf(page).getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panelOf(page).getByRole('status')).toContainText('Đang phân tích…');
  // Its own run says "Đang phân tích…" instead.
  await expect(panelOf(page)).not.toContainText(busy);

  const second = 'Lan Chờ Sau';
  await createKycCustomer(page, second);
  await addKycNote(page, second, [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '1'],
    ['Nghề nghiệp', 'Kỹ sư'],
  ]);
  const panel = panelOf(page);
  await expect(panel).toContainText('PROFILE_DISCOVERY');
  await expect(panel.getByRole('button', { name: 'Phân tích bằng ChatGPT web' })).toBeDisabled();
  await expect(panel).toContainText(busy);
  await page.evaluate(() => window.exe.releaseAi());
  await expect(panel).not.toContainText(busy);
});

// AI trích xuất (spec Phase 5 §8, mockup ai.html 3b–3f). The Mock proposes "<n> con" and "kết hôn".
const NOTE = 'Hai vợ chồng đã kết hôn, có 2 con đang học cấp 1.';
const NOTHING = 'KH muốn tìm hiểu thêm về quỹ hưu trí cho cả gia đình.';

/** A KYC note with no fact confirmed, as the RE writes it before AI trích xuất. */
async function writeNote(page: Page, name: string, text: string) {
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${name}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill(text);
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();
}

const noteOf = (page: Page, text: string) =>
  page
    .getByRole('region', { name: 'Dòng thời gian' })
    .getByRole('listitem')
    .filter({ hasText: text });

test('AI trích xuất with the Mock: Xác nhận saves the fact on its note, Bỏ saves nothing', async ({
  page,
}) => {
  const name = 'Mai Trích Xuất';
  await createKycCustomer(page, name);
  const kyc = page.getByRole('region', { name: 'Dữ kiện KYC' });

  // None on the SYSTEM note of the birth year; off on a note under 20 characters.
  await expect(noteOf(page, 'Ghi chú hệ thống').getByRole('button')).toHaveCount(0);
  await addKycNote(page, name, []);
  await expect(
    noteOf(page, 'Gặp KH').getByRole('button', { name: 'AI trích xuất' }),
  ).toBeDisabled();
  await expect(noteOf(page, 'Gặp KH')).toContainText('Gặp KH · Ghi chú quá ngắn');

  await writeNote(page, name, NOTE);
  const note = noteOf(page, NOTE);
  await note.getByRole('button', { name: 'AI trích xuất' }).click();
  const proposals = note.getByRole('list', { name: 'Đề xuất của AI' }).getByRole('listitem');
  await expect(note.getByRole('status')).toHaveText(
    'AI trích xuất xong: có đề xuất cần xác nhận bên dưới.',
  );
  await expect(proposals).toHaveText([
    /^AI đề xuất: Tình trạng hôn nhân: Đã kết hôn \("kết hôn"\)/,
    /^AI đề xuất: Số con: 2 \("2 con"\)/,
  ]);
  await expect(note).toContainText('Đề xuất không lưu — rời màn là mất.');

  // Bỏ writes nothing.
  await proposals.filter({ hasText: 'Số con' }).getByRole('button', { name: 'Bỏ' }).click();
  await expect(proposals).toHaveCount(1);
  await expect(kyc).not.toContainText('Số con:');

  // Xác nhận: the fact dialog filled from the proposal, saved on the note (mockup 3f).
  await proposals.getByRole('button', { name: 'Xác nhận' }).click();
  const married = page.getByRole('dialog', { name: '+ Dữ kiện · Tình trạng hôn nhân' });
  await expect(married).toContainText('Từ ghi chú 15/09/2026 · AI đề xuất');
  await expect(married).toContainText('AI trích từ ghi chú: "kết hôn"');
  await expect(married.getByRole('textbox', { name: 'Giá trị' })).toHaveValue('Đã kết hôn');
  await married.getByRole('button', { name: 'Xác nhận dữ kiện' }).click();
  await expect(married).toBeHidden();
  await expect(kyc).toContainText('Tình trạng hôn nhân: Đã kết hôn');
  await expect(note.getByRole('list', { name: 'Đề xuất của AI' })).toHaveCount(0);

  // Again: the value now held is hidden; the RE changes the other one before saving it.
  await note.getByRole('button', { name: 'AI trích xuất' }).click();
  await expect(proposals).toHaveText([/^AI đề xuất: Số con: 2/]);
  await expect(note).toContainText('1 đề xuất trùng dữ kiện đang có đã ẩn.');
  await proposals.getByRole('button', { name: 'Xác nhận' }).click();
  const kids = page.getByRole('dialog', { name: '+ Dữ kiện · Số con' });
  await kids.getByRole('textbox', { name: 'Giá trị' }).fill('3');
  await kids.getByRole('button', { name: 'Xác nhận dữ kiện' }).click();
  await expect(kyc).toContainText('Số con: 3');

  // Proposals are never saved: leaving the profile loses them.
  await note.getByRole('button', { name: 'AI trích xuất' }).click();
  await expect(proposals).toHaveCount(1);
  await page.goBack();
  await page.goForward();
  await expect(noteOf(page, NOTE)).toBeVisible();
  await expect(noteOf(page, NOTE).getByRole('list', { name: 'Đề xuất của AI' })).toHaveCount(0);

  // Nothing found: its line, closed by Đóng (mockup 3e).
  await writeNote(page, name, NOTHING);
  const nothing = noteOf(page, NOTHING);
  await nothing.getByRole('button', { name: 'AI trích xuất' }).click();
  await expect(nothing.getByRole('status')).toHaveText(
    'AI không tìm thấy dữ kiện mới trong ghi chú này.Đóng',
  );
  await nothing.getByRole('button', { name: 'Đóng' }).click();
  await expect(nothing.getByRole('status')).toHaveCount(0);
  // The focus goes back to the button, not to the page (DR5-43).
  await expect(nothing.getByRole('button', { name: 'AI trích xuất' })).toBeFocused();
});

test('AI trích xuất on a trường already held: Xác nhận updates one value, marks a conflict on another', async ({
  page,
}) => {
  const name = 'Hà Thay Thế';
  await createKycCustomer(page, name);
  await addKycNote(page, name, [
    ['Tình trạng hôn nhân', 'Độc thân'],
    ['Số con', '3'],
  ]);
  const kyc = page.getByRole('region', { name: 'Dữ kiện KYC' });
  await writeNote(page, name, NOTE);
  const note = noteOf(page, NOTE);
  await note.getByRole('button', { name: 'AI trích xuất' }).click();
  const proposals = note.getByRole('list', { name: 'Đề xuất của AI' }).getByRole('listitem');
  // Both differ from the values held, so neither is hidden.
  await expect(proposals).toHaveText([/Tình trạng hôn nhân: Đã kết hôn/, /Số con: 2/]);

  // Cập nhật: the new value replaces the one held.
  await proposals.filter({ hasText: 'Số con' }).getByRole('button', { name: 'Xác nhận' }).click();
  const kids = page.getByRole('dialog', { name: '+ Dữ kiện · Số con' });
  await expect(kids).toContainText('Đang có: 3 (15/09/2026)');
  await expect(kids.getByRole('radio', { name: 'Cập nhật', exact: true })).toBeChecked();
  await kids.getByRole('button', { name: 'Xác nhận dữ kiện' }).click();
  await expect(kids).toBeHidden();
  await expect(kyc).toContainText('Số con: 2');
  await expect(kyc).not.toContainText('Số con: 3');
  await expect(kyc).not.toContainText('Trường mâu thuẫn');

  // Đánh dấu mâu thuẫn: both values stay, the cốt lõi trường blocks the gate until resolved.
  await proposals.getByRole('button', { name: 'Xác nhận' }).click();
  const married = page.getByRole('dialog', { name: '+ Dữ kiện · Tình trạng hôn nhân' });
  await expect(married).toContainText('Đang có: Độc thân (15/09/2026)');
  await married.getByRole('radio', { name: /Đánh dấu mâu thuẫn/ }).check();
  await married.getByRole('button', { name: 'Xác nhận dữ kiện' }).click();
  await expect(married).toBeHidden();
  await expect(kyc).toContainText('Cổng KYC CONFLICT_RESOLUTION');
  await expect(kyc).toContainText('Trường mâu thuẫn: Tình trạng hôn nhân');
  await expect(kyc.getByRole('button', { name: 'Giải quyết · Tình trạng hôn nhân' })).toBeVisible();
  await expect(note.getByRole('list', { name: 'Đề xuất của AI' })).toHaveCount(0);
});

test('one AI request at a time: AI trích xuất turns every AI button off, Hủy, the errors (P5)', async ({
  page,
}) => {
  await asExe(page);
  const name = 'Tú Trích Xuất';
  await createKycCustomer(page, name);
  await addKycNote(page, name, [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '2'],
    ['Nghề nghiệp', 'Bác sĩ'],
  ]);
  await writeNote(page, name, NOTE);
  await writeNote(page, name, NOTHING);
  await useOpenCode(page);
  const analyse = panelOf(page).getByRole('button', { name: 'Phân tích', exact: true });
  const note = noteOf(page, NOTE);
  const other = noteOf(page, NOTHING).getByRole('button', { name: 'AI trích xuất' });
  await expect(analyse).toBeEnabled();

  await page.evaluate(() => window.exe.holdAi());
  await note.getByRole('button', { name: 'AI trích xuất' }).click();
  await expect(note.getByRole('status')).toContainText('Đang trích xuất…');
  await expect(note.getByRole('button', { name: 'AI trích xuất' })).toBeDisabled();
  await expect(other).toBeDisabled();
  await expect(analyse).toBeDisabled();

  // Hủy: "Đang hủy…", every AI button still off until the request ends (§5.2).
  await note.getByRole('button', { name: 'Hủy' }).click();
  await expect(note.getByRole('status')).toContainText('Đang hủy…');
  await expect(other).toBeDisabled();
  await page.evaluate(() => window.exe.releaseAi());
  await expect(note.getByRole('status')).toHaveCount(0);
  await expect(other).toBeEnabled();
  await expect(analyse).toBeEnabled();

  // "OK" twice: V1 failed twice (§8 item 5); then a §5.3 error on Thử lại.
  await note.getByRole('button', { name: 'AI trích xuất' }).click();
  await expect(note.getByRole('alert')).toContainText('AI trả kết quả không đọc được.');
  await page.evaluate(() => (window.exe.aiError = { code: 'AI_NETWORK' }));
  await note.getByRole('alert').getByRole('button', { name: 'Thử lại' }).click();
  await expect(note.getByRole('alert')).toContainText('Không kết nối được OpenCode.');
});

test('the errors of the panel and AI trích xuất: the HTTP status as in Settings, a link to Settings → AI (DR5-30, DR5-44)', async ({
  page,
}) => {
  await asExe(page);
  const name = 'Tú Báo Lỗi';
  await createKycCustomer(page, name);
  await addKycNote(page, name, [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '2'],
    ['Nghề nghiệp', 'Bác sĩ'],
  ]);
  await writeNote(page, name, NOTE);
  await useOpenCode(page);
  const panel = panelOf(page);
  const note = noteOf(page, NOTE);

  await page.evaluate(
    () => (window.exe.aiError = { code: 'AI_HTTP', httpStatus: 502, message: 'Bad gateway' }),
  );
  await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText('OpenCode báo lỗi (HTTP 502): Bad gateway');
  await page.evaluate(
    () => (window.exe.aiError = { code: 'AI_RATE_LIMITED', httpStatus: 429, message: 'slow' }),
  );
  await panel.getByRole('alert').getByRole('button', { name: 'Thử lại' }).click();
  await expect(panel.getByRole('alert')).toContainText(
    'Đã chạm giới hạn gói Go hoặc hết credit OpenCode — thử lại sau, hoặc đổi gói / nạp credit. (HTTP 429)',
  );

  await page.evaluate(
    () => (window.exe.aiError = { code: 'AI_UNAUTHORIZED', httpStatus: 401, message: 'expired' }),
  );
  await note.getByRole('button', { name: 'AI trích xuất' }).click();
  await expect(note.getByRole('alert')).toContainText(
    'Key không hợp lệ hoặc hết hạn. Gói Go đã hết hạn → chọn gói Credit ở Cài đặt → AI. (HTTP 401)',
  );
  await page.evaluate(
    () => (window.exe.aiError = { code: 'AI_HTTP', httpStatus: 500, message: 'Internal error' }),
  );
  await note.getByRole('alert').getByRole('button', { name: 'Thử lại' }).click();
  await expect(note.getByRole('alert')).toContainText(
    'OpenCode báo lỗi (HTTP 500): Internal error',
  );

  // Mockup 2f: AI_NO_KEY says where to enter it, and goes there.
  await page.evaluate(() => (window.exe.aiError = { code: 'AI_NO_KEY' }));
  await panel.getByRole('alert').getByRole('button', { name: 'Thử lại' }).click();
  const alert = panel.getByRole('alert');
  await expect(alert).toContainText('Chưa có API key OpenCode — nhập ở Cài đặt → AI.');
  await alert.getByRole('link', { name: 'Cài đặt → AI' }).click();
  await expect(page.getByRole('region', { name: 'API key OpenCode' })).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Mục cài đặt' }).getByRole('button', { name: 'AI' }),
  ).toHaveAttribute('aria-current', 'page');
});

test('the run says the model it was started with, whatever Settings → AI say meanwhile (DR5-31)', async ({
  page,
}) => {
  await asExe(page);
  const name = 'Tú Đổi Model';
  await createKycCustomer(page, name);
  await addKycNote(page, name, [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '2'],
    ['Nghề nghiệp', 'Bác sĩ'],
  ]);
  await useOpenCode(page);
  const panel = panelOf(page);
  const running = panel.getByRole('status').filter({ hasText: 'Đang phân tích…' });

  await page.evaluate(() => window.exe.holdAi());
  await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(running).toContainText('Đang phân tích… · DeepSeek V4.1 Flash');

  const settings = async (change: () => Promise<void>) => {
    await page.getByRole('link', { name: 'Cài đặt' }).click();
    await page
      .getByRole('navigation', { name: 'Mục cài đặt' })
      .getByRole('button', { name: 'AI' })
      .click();
    await change();
    await page.goBack();
  };
  await settings(async () => {
    await page.getByRole('combobox', { name: 'Model' }).selectOption({ label: 'Kimi K3' });
  });
  await expect(running).toContainText('Đang phân tích… · DeepSeek V4.1 Flash');
  await settings(() =>
    page.getByRole('radiogroup', { name: 'Provider' }).getByRole('radio', { name: 'Mock' }).check(),
  );
  await expect(running).toContainText('Đang phân tích… · DeepSeek V4.1 Flash');
  expect(await page.evaluate(() => window.exe.aiCalls)).toMatchObject([
    { model: 'deepseek-v4.1-flash' },
  ]);
  await page.evaluate(() => window.exe.releaseAi());
  await expect(running).toHaveCount(0);
});
