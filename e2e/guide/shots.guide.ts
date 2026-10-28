import { expect, test, type Locator, type Page } from '@playwright/test';
import { join } from 'node:path';
import { anchorMorning } from '../anchor';
import { addKycNote, createKycCustomer, discoveryFacts, panelOf } from '../support';
import { IMG } from './links';

// The screenshots of docs/user-guide (spec Phase 6 §4.3), named by the guide section that shows
// them: 02-… goes in 02-tong-quan.md. The web build opens on the demo anchor, 15/09/2026, and the
// clock stays on its morning, so a second run writes the same bytes. Each test opens a fresh page
// on the simulated data; a reload would drop what a test changed, so tests move by clicks.

// The morning of the config's time zone, as e2e/fixtures.ts sets it (DR6-129): by the machine's,
// a machine far from that zone would shoot the pages on another day.
test.beforeEach(async ({ page, timezoneId }) => {
  await page.clock.setFixedTime(anchorMorning(timezoneId));
});

type Clip = { x: number; y: number; width: number; height: number };

/** The viewport, a box of it, or one part of the page, as `img/<name>.png`. */
async function shot(page: Page, name: string, part?: Locator | Clip) {
  // A screen opened by a click keeps the scroll of the one before, and the mouse left over a card
  // would hover it.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(0, 899);
  const options = {
    path: join(IMG, `${name}.png`),
    animations: 'disabled',
    caret: 'hide',
    // Playwright scrolls to a part out of view with this style on, then shoots the window alone if
    // the part is no taller than it. The header of the app, which stays at the top of the page as it
    // scrolls, could cover the part's top lines; and the scroll margin that keeps parts below the
    // header (index.css) could push the foot of a part nearly as tall as the window out of the shot.
    style: 'header { position: static !important; } main * { scroll-margin-top: 0 !important; }',
  } as const;
  if (part && 'screenshot' in part) await part.screenshot(options);
  else await page.screenshot({ ...options, clip: part });
}

const sidebar = (page: Page) => page.getByRole('navigation', { name: 'Điều hướng chính' });
const detail = (page: Page) => page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });
const kinds = (page: Page) => page.getByRole('radiogroup', { name: 'Loại kỳ' });
const list = (page: Page) => page.getByRole('table', { name: 'Danh sách lịch hẹn' });

/** Right of the sidebar, which 01 shows, from the top of the page down `height`, or to the foot. */
async function rightOfSidebar(page: Page, height?: number): Promise<Clip> {
  const main = await page.getByRole('main').boundingBox();
  if (!main) throw new Error('no main');
  return { x: main.x, y: 0, width: main.width, height: height ?? main.y + main.height };
}

async function openAppointments(page: Page) {
  await page.goto('/#/appointments');
  await expect(list(page)).toBeVisible();
}

/** Opens the detail of the first planned appointment of the month. */
async function openPlanned(page: Page) {
  await openAppointments(page);
  await list(page)
    .locator('tbody tr')
    .filter({ hasText: 'Dự kiến' })
    .first()
    .getByRole('button')
    .click();
  await expect(detail(page)).toBeVisible();
}

/** The profile of the customer of yesterday's first met appointment; returns its name. */
async function openProfile(page: Page) {
  await openAppointments(page);
  await kinds(page).getByRole('radio', { name: 'Ngày' }).click();
  await page.getByRole('button', { name: 'Kỳ trước' }).click();
  const met = list(page).locator('tbody tr').filter({ hasText: 'Đã gặp' }).first();
  const name = (await met.getByRole('button').textContent()) ?? '';
  await met.getByRole('button').click();
  await page.getByRole('link', { name: 'Hồ sơ KH →' }).click();
  await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible();
  return name;
}

test('01 bắt đầu: the sidebar', async ({ page }) => {
  await page.goto('/#/overview');
  // The sidebar down to its last link, without the empty rest of its height.
  const aside = await page.locator('aside').first().boundingBox();
  const links = await sidebar(page).boundingBox();
  if (!aside || !links) throw new Error('no sidebar');
  await shot(page, '01-bat-dau-sidebar', {
    ...aside,
    height: links.y + links.height + 16 - aside.y,
  });
});

test('02 tổng quan', async ({ page }) => {
  await page.goto('/#/overview');
  await expect(page.getByRole('region', { name: 'Chỉ số của kỳ' })).toBeVisible();
  await shot(page, '02-tong-quan');
  await shot(page, '02-tong-quan-so-sanh-team', page.getByRole('region', { name: 'So sánh team' }));
});

test('03 lịch hẹn: the list, the month, the year', async ({ page }) => {
  await openAppointments(page);
  await shot(page, '03-lich-hen');
  await shot(page, '03-lich-hen-thang', page.getByRole('region', { name: /^Lịch tháng/ }));
  await kinds(page).getByRole('radio', { name: 'Năm' }).click();
  await shot(page, '03-lich-hen-nam', page.getByRole('region', { name: /^Lịch năm/ }));
});

test('03 lịch hẹn: detail, booking, rescheduling', async ({ page }) => {
  await openPlanned(page);
  await shot(page, '03-chi-tiet-lich-hen', detail(page));
  await detail(page).getByRole('button', { name: 'Dời lịch' }).click();
  await shot(page, '03-doi-lich', page.getByRole('dialog'));
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const book = page.getByRole('dialog');
  await book.getByRole('textbox', { name: /^Khách hàng/ }).fill('K-');
  await book
    .getByRole('list', { name: 'KH khớp' })
    .getByRole('button')
    .filter({ hasText: /N3$/ })
    .first()
    .click();
  await book.getByRole('textbox', { name: /^Ngày/ }).fill('15/9');
  await book.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await shot(page, '03-dat-lich', book);
  await book.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(book).toHaveCount(0);

  await detail(page).getByRole('button', { name: 'Ghi kết quả' }).click();
  const outcome = page.getByRole('dialog', { name: 'Kết quả cuộc gặp' });
  await outcome
    .getByRole('radiogroup', { name: 'Trạng thái' })
    .getByRole('radio', { name: 'Đã gặp' })
    .check();
  await shot(page, '03-ket-qua', outcome);
});

test('04 khách hàng: Kanban, table, a new customer', async ({ page }) => {
  await page.goto('/#/customers');
  await expect(page.getByRole('region', { name: 'N4', exact: true })).toBeVisible();
  // Down to the foot of the board: the whole screen, or its top alone, passes 150 KiB, a card with
  // an "n HĐ" badge standing taller than the others.
  await shot(page, '04-khach-hang', await rightOfSidebar(page));
  await page.getByRole('radio', { name: 'Bảng' }).click();
  // The top of the screen: the whole of it passes 150 KiB.
  await shot(page, '04-khach-hang-bang', { x: 0, y: 0, width: 1440, height: 600 });
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  await shot(page, '04-khach-hang-moi', page.getByRole('dialog', { name: 'Khách hàng mới' }));
});

test('04, 05 hồ sơ KH: the profile and its dialogs', async ({ page }) => {
  const name = await openProfile(page);
  // The top of the screen: the whole of it passes 150 KiB, and so does its top with the sidebar,
  // whose logo weighs ≈ 26 KB.
  await shot(page, '05-ho-so-kh', await rightOfSidebar(page, 600));

  await page.getByRole('button', { name: 'Chuyển nhóm' }).click();
  await shot(page, '04-chuyen-nhom', page.getByRole('dialog', { name: /^Chuyển nhóm · / }));
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  await shot(page, '05-ghi-chu-kyc', page.getByRole('dialog', { name: `Ghi chú KYC · ${name}` }));
  await page.keyboard.press('Escape');

  const policies = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await policies.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  await shot(page, '05-hop-dong-moi', page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' }));
  await page.keyboard.press('Escape');

  await shot(page, '05-du-kien-kyc', page.getByRole('region', { name: 'Dữ kiện KYC' }));
});

test('06 AI: KYC Intelligence after an analysis with the Mock', async ({ page }) => {
  const name = 'Hoa Khám Phá';
  await createKycCustomer(page, name);
  await addKycNote(page, name, discoveryFacts);
  const panel = panelOf(page);
  await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panel.getByRole('region', { name: 'Behavioral Hypotheses' })).toBeVisible();
  await shot(page, '06-ai-phan-tich', panel);
});

test('07 báo cáo', async ({ page }) => {
  await page.goto('/#/reports');
  await expect(page.getByRole('table', { name: 'Tổng hợp' })).toBeVisible();
  await shot(page, '07-bao-cao');
  const tables = page.getByRole('radiogroup', { name: 'Bảng báo cáo' });
  await tables.getByRole('radio', { name: 'Theo mốc' }).click();
  await shot(page, '07-bao-cao-theo-moc', page.getByRole('region', { name: 'Theo mốc' }));
});

test('08 team', async ({ page }) => {
  await page.goto('/#/team');
  await expect(page.getByRole('button', { name: '+ Nhân sự' })).toBeVisible();
  await shot(page, '08-team');
  await page.getByRole('button', { name: '+ Nhân sự' }).click();
  await shot(page, '08-nhan-su-moi', page.getByRole('dialog', { name: 'Nhân sự mới' }));
});

test('09 cài đặt: Dữ liệu, AI', async ({ page }) => {
  await page.goto('/#/settings');
  await expect(page.getByRole('region', { name: 'Dữ liệu giả lập' })).toBeVisible();
  await shot(page, '09-cai-dat-du-lieu');
  await page.getByRole('button', { name: 'Nạp lại…' }).click();
  await shot(page, '09-nap-lai', page.getByRole('dialog', { name: 'Nạp lại dữ liệu giả lập?' }));
  await page.keyboard.press('Escape');

  await page.goto('/#/settings/ai');
  await expect(page.getByRole('radiogroup', { name: 'Provider' })).toBeVisible();
  await shot(page, '09-cai-dat-ai');
});

test('09 cài đặt: Thùng rác with a deleted appointment', async ({ page }) => {
  await openPlanned(page);
  await detail(page).getByRole('button', { name: 'Xóa', exact: true }).click();
  const confirm = page.getByRole('dialog', { name: /^Xóa lịch hẹn / });
  await shot(page, '09-xoa-lich-hen', confirm);
  await confirm.getByRole('button', { name: 'Xóa lịch hẹn' }).click();
  await expect(confirm).toHaveCount(0);

  await sidebar(page).getByRole('link', { name: 'Cài đặt' }).click();
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'Thùng rác' })
    .click();
  await expect(page.getByRole('region', { name: 'Thùng rác' })).toContainText('1 bản ghi');
  await shot(page, '09-cai-dat-thung-rac');
});
