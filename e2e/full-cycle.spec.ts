import { expect, test, type Locator, type Page } from '@playwright/test';
import {
  addKycNote,
  asExe,
  createKycCustomer,
  discoveryFacts,
  trackConsoleErrors,
} from './support';

// Spec Phase 6 §5 item 1: the whole business round on the web build, every step through the UI as
// a user would. The e2e build pins today to Tuesday 15/09/2026 (playwright.config.ts), so September
// is the month to date. `asExe` runs it as the exe, whose backup goes through `export_write` and is
// imported back after a reload, which opens a database seeded anew.

// Names the simulated data never gives, so the team's figures are this test's alone.
const TEAM = 'Trọn Vòng';
const RE = 'Lương Trọn Vòng';
const RE_LABEL = `${RE} · ${TEAM}`;
const CUSTOMER = 'Khải Trọn Vòng';

// What the round records for the team in September: one meeting met on 15/09 moving N4 → N2 (an
// RF), one appointment planned on 22/09, one deleted; a policy submitted 500 tr on 10/09 and issued
// 485,5 tr on 12/09, another submitted 120 tr on 14/09 and not issued.
/** So sánh team: Đã gặp · Chuyển RF · HĐ nộp · Case size · HĐ phát hành · Doanh số · Tỉ lệ chốt. */
const COMPARED = ['1', '1', '2', '620 tr', '1', '485,5 tr', '100%'];
/**
 * Tổng hợp: Đã gặp · Dời – hủy – không đến · Chưa ghi kết quả · Dự kiến · Tổng, then the columns of
 * COMPARED from Chuyển RF, then the customers at the end of the day N4 · N3 · N2 · N1 · Tạm hoãn ·
 * Mất cơ hội.
 */
const SUMMARY = ['1', '0', '0', '1', '2', ...COMPARED.slice(1), '0', '0', '1', '0', '0', '0'];
/** The Tổng hợp columns that So sánh team shows too, in its order. */
const SUMMARY_OF_COMPARED = [0, 5, 6, 7, 8, 9, 10];

const sidebar = (page: Page) => page.getByRole('navigation', { name: 'Điều hướng chính' });
const scope = (page: Page) => page.getByRole('radiogroup', { name: 'Góc nhìn' });
const filter = (page: Page) => page.getByRole('button', { name: 'Lọc', exact: true });
const detail = (page: Page) => page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });
const trash = (page: Page) => page.getByRole('region', { name: 'Thùng rác' });
const backup = (page: Page) => page.getByRole('region', { name: 'Xuất / nhập backup' });

/**
 * Picks `label` in a select, failing at once when the data has no such option rather than waiting
 * for it until the test times out.
 */
async function pick(page: Page, name: string, label: string) {
  const select = page.getByRole('combobox', { name });
  await expect(select.getByRole('option', { name: label, exact: true }), label).toHaveCount(1);
  await select.selectOption({ label });
}

/** The scope of the top bar on RE, ours. */
async function scopeOnRe(page: Page) {
  await scope(page).getByRole('radio', { name: 'RE' }).click();
  await pick(page, 'RE của góc nhìn', RE_LABEL);
}

async function openSettings(page: Page, section: 'Dữ liệu' | 'Thùng rác') {
  await sidebar(page).getByRole('link', { name: 'Cài đặt' }).click();
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: section })
    .click();
}

/** Books an appointment of the customer on `day` from Lịch hẹn, which opens it in the detail. */
async function book(page: Page, day: string, time?: string) {
  await page.goto('/#/appointments');
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: /^Khách hàng/ }).fill(CUSTOMER);
  await dialog.getByRole('list', { name: 'KH khớp' }).getByRole('button').first().click();
  await expect(dialog.locator('b').first()).toHaveText(CUSTOMER);
  await dialog.getByRole('textbox', { name: /^Ngày/ }).fill(day);
  if (time) await dialog.getByRole('textbox', { name: /^Giờ/ }).fill(time);
  await dialog.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(detail(page).getByRole('heading', { level: 2 })).toContainText(CUSTOMER);
}

/** Submits a policy on the profile; `issued` issues it next with its day and FYP. */
async function addPolicy(page: Page, day: string, fyp: string, issued?: [string, string]) {
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill(day);
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill(fyp);
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toBeHidden();
  if (!issued) return;
  await card.getByRole('button', { name: `Phát hành HĐ nộp ${day}/2026` }).click();
  const issue = page.getByRole('dialog', { name: 'Phát hành HĐ' });
  await issue.getByRole('textbox', { name: /^Ngày phát hành/ }).fill(issued[0]);
  await issue.getByRole('textbox', { name: /^FYP phát hành/ }).fill(issued[1]);
  await issue.getByRole('button', { name: 'Phát hành' }).click();
  await expect(issue).toBeHidden();
}

/** The figures of the team and its RE on Tổng quan and Báo cáo, for September to date. */
async function figures(page: Page) {
  await page.goto('/#/overview');
  await scope(page).getByRole('radio', { name: 'Team' }).click();
  await filter(page).click();
  await expect(page.locator('p', { hasText: 'Đang xem:' })).toContainText(
    'Tháng 09/2026MTD 01/09 – 15/09/2026 · Team',
  );
  const compared = page
    .getByRole('table', { name: 'So sánh team' })
    .getByRole('row')
    .filter({ has: page.getByRole('button', { name: TEAM }) })
    .getByRole('cell');
  await expect(compared, 'So sánh team lists the team').toHaveCount(COMPARED.length);
  const overview = await compared.allInnerTexts();

  await scopeOnRe(page);
  await filter(page).click();
  await expect(page.locator('p', { hasText: 'Đang xem:' })).toContainText(`· RE ${RE}`);
  const tile = page.getByRole('region', { name: 'Lịch hẹn · cả tháng' });
  const appointments = [
    (await tile.getByRole('paragraph').first().innerText()).replace(/\s/g, ''),
    ...(await tile.getByRole('listitem').locator('b').allInnerTexts()),
  ];

  await sidebar(page).getByRole('link', { name: 'Báo cáo' }).click();
  await scope(page).getByRole('radio', { name: 'Team' }).click();
  await pick(page, 'Team của góc nhìn', TEAM);
  await filter(page).click();
  await expect(page.locator('p', { hasText: 'Đang xem:' })).toContainText(
    `Tháng 09/2026MTD 01/09 – 15/09/2026 · Team ${TEAM}`,
  );
  const summary = page.getByRole('table', { name: 'Tổng hợp' }).getByRole('cell');
  await expect(summary).toHaveCount(SUMMARY.length);
  return { overview, appointments, reports: await summary.allInnerTexts() };
}

/**
 * What the data shows of the round: the customer in its RE's list and on its profile (KYC,
 * policies, appointments, timeline, AI analysis), Thùng rác, and the figures of `figures`.
 */
async function snapshot(page: Page, profile: string) {
  const text = async (name: string, locator: Locator) => {
    await expect(locator, name).toBeVisible();
    return (await locator.innerText()).trim();
  };
  await page.goto('/#/customers');
  await scopeOnRe(page);
  const customers = {
    summary: await text('the customers of the RE', page.getByText(/KH đang mở/)),
    n2: await text(
      'the customer in N2',
      page.getByRole('region', { name: 'N2', exact: true }).getByRole('link'),
    ),
  };

  await page.goto(profile);
  const region = (name: string) => page.getByRole('region', { name, exact: true });
  const shown = {
    head: await text('the profile', region(CUSTOMER)),
    kyc: await text('Dữ kiện KYC', region('Dữ kiện KYC')),
    policies: await text('Hợp đồng', region('Hợp đồng')),
    appointments: await text('Lịch hẹn', region('Lịch hẹn')),
    timeline: await text('Dòng thời gian', region('Dòng thời gian')),
    ai: await text('KYC Intelligence', region('KYC Intelligence')),
  };

  await openSettings(page, 'Thùng rác');
  const trashed = {
    kinds: await text(
      'the kinds of Thùng rác',
      page.getByRole('radiogroup', { name: 'Loại bản ghi' }),
    ),
    rows: await text('Thùng rác', page.getByRole('table', { name: 'Bản ghi đã xóa' })),
  };
  return { customers, shown, trashed, figures: await figures(page) };
}

test('the whole round: team → customer → KYC → meeting → policy → figures → AI → Thùng rác → backup', async ({
  page,
}) => {
  test.setTimeout(120_000);
  await asExe(page);
  const errors = trackConsoleErrors(page);

  await test.step('a new team and its RE', async () => {
    await page.goto('/#/team');
    await page.getByRole('button', { name: '+ Team' }).click();
    const team = page.getByRole('dialog', { name: 'Team mới' });
    await team.getByRole('textbox', { name: 'Tên team' }).fill(TEAM);
    await team.getByRole('button', { name: 'Tạo team' }).click();
    await expect(team).toBeHidden();
    await page.getByRole('button', { name: '+ Nhân sự' }).click();
    const person = page.getByRole('dialog', { name: 'Nhân sự mới' });
    await person.getByRole('textbox', { name: 'Họ tên' }).fill(RE);
    await person.getByRole('radio', { name: 'RE', exact: true }).check();
    await person.getByRole('combobox', { name: 'Team' }).selectOption({ label: TEAM });
    await person.getByRole('button', { name: 'Thêm' }).click();
    await expect(person).toBeHidden();
    await expect(
      page.getByRole('region', { name: 'Team', exact: true }).getByRole('button', { name: TEAM }),
    ).toContainText('chưa có TL · 1 RE');
  });

  let profile = '';
  await test.step('a customer of the RE, a KYC note confirming three facts', async () => {
    await createKycCustomer(page, CUSTOMER, RE_LABEL);
    profile = new URL(page.url()).hash;
    await expect(page.getByRole('region', { name: CUSTOMER })).toContainText(
      `RE ${RE} · Team ${TEAM}`,
    );
    await addKycNote(page, CUSTOMER, discoveryFacts);
    const kyc = page.getByRole('region', { name: 'Dữ kiện KYC' });
    await expect(kyc).toContainText('3/8 hạng mục · v2');
    await expect(kyc).toContainText('Cổng KYC PROFILE_DISCOVERY');
    await expect(kyc).toContainText('Nghề nghiệp: Bác sĩ');
  });

  await test.step('appointments: one met N4 → N2, one planned, one deleted', async () => {
    await book(page, '15/9', '9:00');
    await detail(page).getByRole('button', { name: 'Ghi kết quả' }).click();
    const outcome = page.getByRole('dialog', { name: 'Kết quả cuộc gặp' });
    await expect(
      outcome
        .getByRole('radiogroup', { name: 'Trạng thái' })
        .getByRole('radio', { name: 'Đã gặp' }),
    ).toBeChecked();
    await outcome
      .getByRole('radiogroup', { name: 'Nhóm sau cuộc gặp' })
      .getByRole('radio', { name: 'N2', exact: true })
      .check();
    await outcome.getByRole('textbox', { name: /^Việc tiếp theo/ }).fill('Gửi bảng minh họa');
    await outcome.getByRole('button', { name: 'Lưu kết quả' }).click();
    await expect(outcome).toHaveCount(0);
    await expect(detail(page)).toContainText('N4 → N2 · RF');

    await book(page, '22/9');
    await expect(detail(page)).toContainText('Dự kiến');

    await book(page, '25/9');
    await detail(page).getByRole('button', { name: 'Xóa', exact: true }).click();
    const remove = page.getByRole('dialog', { name: 'Xóa lịch hẹn 25/09/2026?' });
    await remove.getByRole('button', { name: 'Xóa lịch hẹn' }).click();
    await expect(remove).toHaveCount(0);
  });

  await test.step('policies: one issued, one only submitted', async () => {
    await page.goto(profile);
    await addPolicy(page, '10/09', '500tr', ['12/9', '485,5tr']);
    await addPolicy(page, '14/09', '120tr');
    const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
    await expect(card.getByRole('listitem')).toHaveText([
      /^Đã nộpNộp 14\/09 · 120 tr/,
      /^Đã phát hànhNộp 10\/09 · 500 trPhát hành 12\/09 · 485,5 tr/,
    ]);
    await expect(page.getByRole('region', { name: CUSTOMER })).toContainText('Đã có HĐ (2)');
  });

  await test.step('Tổng quan and Báo cáo count what the round recorded, and agree', async () => {
    const { overview, appointments, reports } = await figures(page);
    expect(overview).toEqual(COMPARED);
    // "met / total", then Đã gặp · Dời lịch / hủy / không đến · Chưa ghi kết quả · Dự kiến.
    expect(appointments).toEqual(['1/2', '1', '0', '0', '1']);
    expect(reports).toEqual(SUMMARY);
    expect(SUMMARY_OF_COMPARED.map((index) => reports[index])).toEqual(overview);
    expect(reports.slice(0, 4)).toEqual(appointments.slice(1));
    expect(`${reports[0]}/${reports[4]}`).toBe(appointments[0]);
  });

  await test.step('an AI analysis with the Mock', async () => {
    await page.goto(profile);
    const panel = page.getByRole('region', { name: 'KYC Intelligence' });
    await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
    await expect(panel.getByRole('status')).toHaveText('Phân tích xong: đã lưu kết quả.');
    await expect(panel).toContainText('CURRENT');
    await expect(panel).toContainText(/kyc v2 · discovery@3 · Mock · 15\/09 \d\d:\d\d/);
  });

  await test.step('the customer deleted, found in Thùng rác, restored to its list', async () => {
    await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
    await page
      .getByRole('dialog', { name: `Sửa hồ sơ · ${CUSTOMER}` })
      .getByRole('button', { name: 'Xóa KH…' })
      .click();
    await page
      .getByRole('dialog', { name: `Xóa ${CUSTOMER}?` })
      .getByRole('button', { name: 'Xóa KH' })
      .click();
    await expect(page).toHaveURL(/#\/customers$/);
    await scopeOnRe(page);
    await expect(page.getByText(/KH đang mở/)).toContainText('0 KH đang mở');
    await expect(page.getByRole('link', { name: new RegExp(CUSTOMER) })).toHaveCount(0);

    await openSettings(page, 'Thùng rác');
    const rows = trash(page).getByRole('table', { name: 'Bản ghi đã xóa' }).getByRole('row');
    const ofKind = (kind: string) =>
      rows.filter({ has: page.getByRole('cell', { name: kind, exact: true }) });
    await expect(rows).toHaveCount(3);
    await expect(ofKind('KH')).toContainText(CUSTOMER);
    await expect(ofKind('Lịch hẹn')).toContainText('25/09/2026');
    await expect(ofKind('Lịch hẹn')).toContainText(`Khôi phục KH ${CUSTOMER} trước.`);
    await ofKind('KH')
      .getByRole('button', { name: `Khôi phục KH ${CUSTOMER}` })
      .click();
    const dialog = page.getByRole('dialog', { name: `Khôi phục ${CUSTOMER}?` });
    await expect(dialog).toContainText('Hiện lại cùng KH2 lịch hẹn (');
    await dialog.getByRole('button', { name: 'Khôi phục', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(trash(page).getByRole('status')).toContainText(`Đã khôi phục KH ${CUSTOMER}`);
    // The appointment deleted on its own stays (TR-4), and goes into the backup with the rest.
    await expect(rows).toHaveCount(2);
    await expect(ofKind('Lịch hẹn')).toContainText('25/09/2026');

    await sidebar(page).getByRole('link', { name: 'Khách hàng' }).click();
    await expect(page.getByText(/KH đang mở/)).toContainText('1 KH đang mở');
    await expect(
      page.getByRole('region', { name: 'N2', exact: true }).getByRole('link'),
    ).toContainText(CUSTOMER);
  });

  const before = await test.step('what the data shows before the export', () =>
    snapshot(page, profile));

  let file = '';
  await test.step('the backup exported', async () => {
    await openSettings(page, 'Dữ liệu');
    await backup(page).getByRole('button', { name: 'Xuất backup' }).click();
    await expect(backup(page).getByRole('status')).toContainText('Đã xuất backup: ');
    file = await page.evaluate(() => window.exe.exports.at(-1) ?? '');
    expect(JSON.parse(file)).toMatchObject({ format: 'project2c-backup' });
  });

  await test.step('a reload opens new data, without the round', async () => {
    await page.reload();
    await expect(page.getByRole('region', { name: 'File dữ liệu' })).toContainText('Nội dung');
    await sidebar(page).getByRole('link', { name: 'Team & nhân sự' }).click();
    const teams = page.getByRole('region', { name: 'Team', exact: true });
    await expect(teams).toContainText('Bình Minh');
    await expect(teams.getByRole('button', { name: new RegExp(TEAM) })).toHaveCount(0);
  });

  await test.step('the backup imported', async () => {
    await openSettings(page, 'Dữ liệu');
    await backup(page)
      .getByLabel('Nhập backup')
      .setInputFiles({
        name: 'project2c-20260915-0930.p2cbackup',
        mimeType: 'application/json',
        buffer: Buffer.from(file),
      });
    const dialog = page.getByRole('dialog', { name: 'Thay toàn bộ dữ liệu?' });
    await expect(dialog).toContainText(/Trong file\s*4 team · 37 nhân sự/);
    await dialog.getByRole('button', { name: 'Backup rồi thay dữ liệu' }).click();
    await expect(dialog).toBeHidden();
    await expect(backup(page).getByRole('status')).toContainText('Đã nhập backup xuất lúc');
  });

  await test.step('the data shows the same as before the export', async () => {
    expect(await snapshot(page, profile)).toEqual(before);
  });

  expect(errors).toEqual([]);
});
