import { expect, test, type Page } from '@playwright/test';

// The e2e build pins today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).
const TODAY = '15/09/2026';

test.beforeEach(async ({ page }) => {
  await page.goto('/#/appointments');
  await expect(page.getByRole('table', { name: 'Danh sách lịch hẹn' })).toBeVisible();
});

const detail = (page: Page) => page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });

/** Books an appointment on `date` for the first matching customer in `stage`; returns the name. */
async function book(page: Page, date: string, stage: string) {
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: /^Khách hàng/ }).fill('K-');
  await dialog
    .getByRole('list', { name: 'KH khớp' })
    .getByRole('button')
    .filter({ hasText: new RegExp(`${stage}$`) })
    .first()
    .click();
  const name = (await dialog.locator('b').first().textContent()) ?? '';
  await dialog.getByRole('textbox', { name: /^Ngày/ }).fill(date);
  await dialog.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(detail(page).getByRole('heading')).toContainText(name);
  return name;
}

function outcome(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Kết quả cuộc gặp' });
  return {
    dialog,
    status: dialog.getByRole('group', { name: 'Trạng thái' }),
    stageAfter: dialog.getByRole('group', { name: 'Nhóm sau cuộc gặp' }),
    nextStep: dialog.getByRole('textbox', { name: /^Việc tiếp theo/ }),
    caseSize: dialog.getByRole('textbox', { name: /^Case size/ }),
    booking: dialog.getByRole('checkbox', { name: 'Hẹn lần tiếp theo' }),
  };
}

test('a meeting met N3 → N2 moves the customer, the timeline says after the meeting', async ({
  page,
}) => {
  const name = await book(page, '15/9', 'N3');
  await detail(page).getByRole('button', { name: 'Ghi kết quả' }).click();
  const o = outcome(page);
  await expect(o.status.getByRole('radio', { name: 'Đã gặp' })).toBeChecked();

  // Met needs a stage after and a next step; the case size may stay empty.
  await o.dialog.getByRole('button', { name: 'Lưu kết quả' }).click();
  await expect(o.dialog).toContainText('Đã gặp thì cần nhóm sau cuộc gặp và việc tiếp theo');
  await expect(o.dialog).toContainText('Chọn nhóm sau cuộc gặp');
  await expect(o.dialog).toContainText('Nhập việc tiếp theo.');
  await expect(o.stageAfter.getByRole('radio', { name: 'N3 giữ nguyên' })).toBeVisible();

  await o.stageAfter.getByRole('radio', { name: 'N2', exact: true }).check();
  await expect(o.dialog).toContainText(`ngày ${TODAY} · tính RF`);
  await o.nextStep.fill('Gửi bảng minh họa');
  await o.caseSize.fill('800tr');
  await expect(o.dialog).toContainText('800.000.000 ₫ (800 tr)');
  await o.caseSize.fill('0');
  await expect(o.dialog).toContainText('Case size phải lớn hơn 0');
  await o.caseSize.fill('');
  await o.dialog.getByRole('button', { name: 'Lưu kết quả' }).click();

  await expect(o.dialog).toHaveCount(0);
  await expect(detail(page)).toContainText('Đã gặp');
  await expect(detail(page)).toContainText('N3 → N2 · RF');
  await expect(detail(page).getByRole('button', { name: 'Ghi kết quả' })).toHaveCount(0);

  await detail(page).getByRole('link', { name: 'Hồ sơ KH →' }).click();
  const profile = page.getByRole('region', { name });
  await expect(profile.getByText('N2', { exact: true }).first()).toBeVisible();
  const moved = page
    .getByRole('region', { name: 'Dòng thời gian' })
    .getByRole('listitem')
    .filter({ hasText: 'sau cuộc gặp' })
    .first();
  await expect(moved).toContainText(TODAY);
  await expect(moved).toContainText('N3');
  await expect(moved).toContainText('N2');
});

test('another status than met has no stage after; a past next day saves nothing', async ({
  page,
}) => {
  await book(page, '15/9', 'N3');
  await detail(page).getByRole('button', { name: 'Ghi kết quả' }).click();
  const o = outcome(page);

  await o.status.getByRole('radio', { name: 'Không đến' }).check();
  await expect(o.stageAfter).toHaveCount(0);
  await expect(o.nextStep).toHaveCount(0);
  await expect(o.dialog.getByRole('combobox', { name: /^Người đánh giá/ })).toHaveCount(0);
  await expect(o.dialog).toContainText('Không đến / Hủy: không có nhóm sau cuộc gặp');

  await o.booking.check();
  await o.dialog.getByRole('textbox', { name: /^Ngày hẹn tiếp/ }).fill('10/9');
  await expect(o.dialog).toContainText(`10/09/2026 đã qua. Lịch mới phải từ hôm nay (${TODAY})`);
  await o.dialog.getByRole('button', { name: 'Lưu kết quả + tạo lịch' }).click();
  await expect(o.dialog).toBeVisible();
  await o.dialog.getByRole('button', { name: 'Hủy', exact: true }).last().click();
  await expect(o.dialog).toHaveCount(0);
  await expect(detail(page)).toContainText('Dự kiến');
});

test('no-show with a next appointment records both in one go', async ({ page }) => {
  const name = await book(page, '15/9', 'N2');
  await detail(page).getByRole('button', { name: 'Ghi kết quả' }).click();
  const o = outcome(page);

  await o.status.getByRole('radio', { name: 'Không đến' }).check();
  await o.dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Gọi lại không nghe máy');
  await o.booking.check();
  await o.dialog.getByRole('textbox', { name: /^Ngày hẹn tiếp/ }).fill('1/10');
  await o.dialog.getByRole('textbox', { name: /^Giờ hẹn tiếp/ }).fill('9:00');
  await expect(o.dialog).toContainText('Tạo lịch hẹn mới 01/10/2026 09:00 · Dự kiến');
  await o.dialog.getByRole('button', { name: 'Lưu kết quả + tạo lịch' }).click();

  await expect(o.dialog).toHaveCount(0);
  await expect(detail(page)).toContainText('Không đến');
  await expect(detail(page)).toContainText('Gọi lại không nghe máy');
  await page.getByRole('button', { name: 'Kỳ sau' }).click();
  await page
    .getByRole('region', { name: /^Lịch tháng/ })
    .getByRole('button', { name: /^01\/10\/2026:/ })
    .click();
  await expect(page.getByRole('region', { name: /^Trong ngày/ })).toContainText(name);
});

/** Books a meeting today for an N3 customer and records it met, N3 → N2; returns the name. */
async function metToN2(page: Page) {
  const name = await book(page, '15/9', 'N3');
  await detail(page).getByRole('button', { name: 'Ghi kết quả' }).click();
  const o = outcome(page);
  await o.stageAfter.getByRole('radio', { name: 'N2', exact: true }).check();
  await o.nextStep.fill('Gửi bảng minh họa');
  await o.dialog.getByRole('button', { name: 'Lưu kết quả' }).click();
  await expect(o.dialog).toHaveCount(0);
  return name;
}

const editDialog = (page: Page) => page.getByRole('dialog', { name: 'Sửa kết quả cuộc gặp' });

test('the outcome of a meeting is edited, its details with it', async ({ page }) => {
  await metToN2(page);
  await detail(page).getByRole('button', { name: 'Sửa kết quả' }).click();
  const dialog = editDialog(page);

  await expect(dialog.getByRole('textbox', { name: /^Việc tiếp theo/ })).toHaveValue(
    'Gửi bảng minh họa',
  );
  await expect(dialog.getByRole('radio', { name: 'N3 giữ nguyên' })).toBeVisible();
  await dialog.getByRole('radio', { name: 'N1', exact: true }).check();
  await expect(dialog).toContainText(`ngày ${TODAY} · tính RF`);
  await dialog
    .getByRole('combobox', { name: /^Trigger/ })
    .selectOption({ label: 'Hội thảo / sự kiện' });
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();

  await expect(dialog).toHaveCount(0);
  await expect(detail(page)).toContainText('N3 → N1 · RF');
  await expect(detail(page)).toContainText('Hội thảo / sự kiện');
});

test('once the customer moved on, status, day and stage after are locked and delete too (D7)', async ({
  page,
}) => {
  const name = await metToN2(page);
  await detail(page).getByRole('link', { name: 'Hồ sơ KH →' }).click();
  await expect(page.getByRole('region', { name })).toBeVisible();
  await page.getByRole('button', { name: 'Chuyển nhóm' }).click();
  const change = page.getByRole('dialog', { name: /^Chuyển nhóm · / });
  await change.getByRole('radio', { name: 'N1', exact: true }).check();
  await change.getByRole('button', { name: 'Chuyển nhóm' }).click();
  await expect(change).toBeHidden();

  await page.goto('/#/appointments');
  await page
    .getByRole('region', { name: /^Trong ngày/ })
    .getByRole('button', { name })
    .click();
  await detail(page).getByRole('button', { name: 'Sửa kết quả' }).click();
  const dialog = editDialog(page);

  await expect(dialog).toContainText('Khóa 3 ô: trạng thái, ngày cuộc hẹn, nhóm sau cuộc gặp');
  await expect(dialog.getByRole('link', { name: 'Chuyển nhóm tay ở Hồ sơ KH' })).toBeVisible();
  await expect(dialog.getByRole('group', { name: 'Trạng thái' })).toHaveCount(0);
  await expect(dialog.getByRole('textbox', { name: /^Ngày cuộc hẹn/ })).toHaveCount(0);
  await expect(dialog.getByRole('group', { name: 'Nhóm sau cuộc gặp' })).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: 'Xóa lịch hẹn' })).toBeDisabled();
  await expect(dialog).toContainText('Xóa cũng bị chặn');

  // The other fields, the reviewer among them, still change.
  await dialog.getByRole('textbox', { name: /^Việc tiếp theo/ }).fill('Gặp cùng TL');
  await dialog.getByRole('combobox', { name: /^Người đánh giá/ }).selectOption({ index: 1 });
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(detail(page)).toContainText('N3 → N2 · RF');
});

test('deleting the meeting that moved the customer takes the move back (6g)', async ({ page }) => {
  const name = await metToN2(page);
  const profile = await detail(page).getByRole('link', { name: 'Hồ sơ KH →' }).getAttribute('href');
  await detail(page).getByRole('button', { name: 'Sửa kết quả' }).click();
  await editDialog(page).getByRole('button', { name: 'Xóa lịch hẹn' }).click();
  const confirm = page.getByRole('dialog', { name: `Xóa lịch hẹn ${TODAY}?` });

  await expect(confirm).toContainText('Cuộc gặp này đã chuyển nhóm KH');
  await expect(confirm).toContainText('(hủy chuyển nhóm 15/09)');
  await expect(confirm).toContainText('bớt 1 (N3 → N2 tính RF)');
  await confirm.getByRole('button', { name: 'Xóa lịch hẹn' }).click();

  await expect(confirm).toHaveCount(0);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(detail(page)).toContainText('Chọn một lịch hẹn');
  await page.goto(`/${profile}`);
  const region = page.getByRole('region', { name });
  await expect(region.getByText('N3', { exact: true }).first()).toBeVisible();
});

test('a day not yet come only reschedules or cancels; rescheduling moves it', async ({ page }) => {
  const name = await book(page, '30/9', 'N3');
  await detail(page).getByRole('button', { name: 'Ghi kết quả' }).click();
  const o = outcome(page);

  await expect(o.status.getByRole('radio', { name: 'Đã gặp' })).toBeDisabled();
  await expect(o.status.getByRole('radio', { name: 'Không đến' })).toBeDisabled();
  await expect(o.dialog).toContainText('Lịch chưa tới ngày');

  await o.status.getByRole('radio', { name: 'Dời lịch' }).check();
  await o.dialog.getByRole('textbox', { name: /^Ngày mới/ }).fill('2/10');
  await o.dialog.getByRole('textbox', { name: /^Lý do dời/ }).fill('KH đi công tác');
  await o.dialog.getByRole('button', { name: 'Dời lịch' }).click();

  await expect(o.dialog).toHaveCount(0);
  await expect(detail(page).getByRole('heading')).toHaveText(`02/10/2026 · ${name}`);
  await expect(detail(page).getByRole('button', { name: '30/09/2026' })).toBeVisible();
});
