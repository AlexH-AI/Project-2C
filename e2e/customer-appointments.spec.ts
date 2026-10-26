import { expect, test, type Locator, type Page } from './fixtures';
import { scrolls } from './support';

// The e2e build pins today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).

/** Opens the profile of the customer of a past met appointment; returns its name. */
async function openProfile(page: Page): Promise<string> {
  await page.goto('/#/appointments');
  // Yesterday's day alone, so the met ones are among the rows shown (T-150).
  await page
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Ngày' })
    .click();
  await page.getByRole('button', { name: 'Kỳ trước' }).click();
  const list = page.getByRole('table', { name: 'Danh sách lịch hẹn' });
  const met = list.locator('tbody tr').filter({ hasText: 'Đã gặp' }).first();
  const name = (await met.getByRole('button').textContent()) ?? '';
  await met.getByRole('button').click();
  await page.getByRole('link', { name: 'Hồ sơ KH →' }).click();
  // Exact: the detail's heading "date · name" is still up until the profile renders (T-262).
  await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible();
  return name;
}

/** Fills in the open dialog for a new appointment (trigger "Khác") and creates it. */
async function create(page: Page, day: string, time: string | null) {
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: /^Ngày/ }).fill(day);
  if (time) await dialog.getByRole('textbox', { name: /^Giờ/ }).fill(time);
  await dialog.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(dialog).toHaveCount(0);
}

function appointments(page: Page) {
  const card = page.getByRole('region', { name: 'Lịch hẹn', exact: true });
  return { card, rows: card.getByRole('table', { name: 'Lịch hẹn' }).locator('tbody tr') };
}

test('the profile lists its appointments newest first; "Hẹn tiếp" fills in the next one', async ({
  page,
}) => {
  await openProfile(page);
  const { card, rows } = appointments(page);
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
  // DR6-100: the column of the "Hẹn tiếp" buttons has a header for screen readers only, empty on
  // screen as in the mockup: the name is a pixel wide.
  const actions = card.getByRole('columnheader', { name: 'Thao tác' });
  await expect(actions).toHaveCount(1);
  expect((await actions.getByText('Thao tác').boundingBox())?.width).toBeLessThanOrEqual(1);
  // The timeline marks each meeting held "· đã gặp".
  const met = await page
    .getByRole('region', { name: 'Dòng thời gian' })
    .getByRole('listitem')
    .filter({ hasText: '· đã gặp' })
    .count();
  expect(met).toBeGreaterThan(0);
  await expect(card).toContainText(`${count} lịch · ${met} đã gặp`);

  const past = rows.filter({ has: page.getByRole('button', { name: /^Hẹn tiếp sau lịch/ }) });
  const date = (await past.first().locator('td:nth-child(1)').textContent()) ?? '';
  await past.first().getByRole('button').click();

  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Lịch hẹn tiếp theo');
  await expect(dialog.getByRole('button', { name: 'Đổi KH' })).toHaveCount(0);
  await expect(dialog.getByRole('textbox', { name: /^Ngày/ })).toHaveValue(date.slice(0, 5));
  await expect(dialog.getByRole('combobox', { name: /^Trigger/ })).not.toHaveValue('');
  await dialog.getByRole('textbox', { name: /^Ngày/ }).fill('30/9');
  await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();

  await expect(dialog).toHaveCount(0);
  await expect(rows).toHaveCount(count + 1);
  await expect(rows.first()).toContainText('30/09');
  await expect(rows.first()).toContainText('Dự kiến');
});

const NAME = 'Đủ Mọi Kết Quả';

/** On the Appointments screen, books `day` for the customer `NAME`; the detail then shows it. */
async function book(page: Page, day: string, time: string | null) {
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: /^Khách hàng/ }).fill(NAME);
  await dialog
    .getByRole('list', { name: 'KH khớp' })
    .getByRole('button')
    .filter({ hasText: NAME })
    .click();
  await create(page, day, time);
}

/**
 * Records the outcome of the appointment the detail shows: met with the stage after it ("N2",
 * "Mất cơ hội giữ nguyên"…), moved to a new day, or another status.
 */
async function record(
  page: Page,
  outcome: { met: string } | { moved: string } | { status: string },
) {
  await page
    .getByRole('complementary', { name: 'Chi tiết lịch hẹn' })
    .getByRole('button', { name: 'Ghi kết quả' })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Kết quả cuộc gặp' });
  const status = 'met' in outcome ? 'Đã gặp' : 'moved' in outcome ? 'Dời lịch' : outcome.status;
  await dialog
    .getByRole('radiogroup', { name: 'Trạng thái' })
    .getByRole('radio', { name: status, exact: true })
    .check();
  if ('met' in outcome) {
    await dialog
      .getByRole('radiogroup', { name: 'Nhóm sau cuộc gặp' })
      .getByRole('radio', { name: outcome.met, exact: true })
      .check();
    await dialog.getByRole('textbox', { name: /^Việc tiếp theo/ }).fill('Gửi bảng minh họa');
  }
  if ('moved' in outcome) {
    await dialog.getByRole('textbox', { name: /^Ngày mới/ }).fill(outcome.moved);
    await dialog.getByRole('textbox', { name: /^Lý do dời/ }).fill('KH đi công tác');
  } else {
    // A long note, as in the mockup's rows: its column asks for the room the result needs.
    await dialog
      .getByRole('textbox', { name: /^Ghi chú/ })
      .fill('Gia đình 2 con; AUM ước ~25 tỷ, ưu tiên thanh khoản');
  }
  await dialog
    .getByRole('button', { name: 'moved' in outcome ? 'Dời lịch' : 'Lưu kết quả' })
    .click();
  await expect(dialog).toHaveCount(0);
}

/** Where the text of each cell of `row` starts and ends in the window. */
const textEdges = (row: Locator) =>
  row.getByRole('cell').evaluateAll((cells) =>
    cells.map((cell) => {
      const text = document.createRange();
      text.selectNodeContents(cell);
      const { left, right } = text.getBoundingClientRect();
      return { left, right };
    }),
  );

// Review of PR 746 and of PR 838 (Owner 26/10/2026): in the default 1 440 window every row is one
// line, whatever its result, as the mockup's rows are. Only a move between the two closed stages
// (142 px) takes two. #165: a day of another year writes its time on the line under it.
test('at 1 440 a row is one line whatever its result; another year puts the time under the day', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/customers');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const form = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await form.getByRole('textbox', { name: 'Họ tên' }).fill(NAME);
  await form.getByRole('combobox', { name: 'RE phụ trách' }).selectOption({ index: 1 });
  await form.getByRole('radio', { name: 'N3', exact: true }).check();
  await form.getByRole('textbox', { name: /^Ngày ghi nhận/ }).fill('1/8');
  await form.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(form).toBeHidden();

  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Lịch hẹn' })
    .click();
  // As the customer went: N3 → N2 with the RF, lost, kept lost, back to N3; then the statuses.
  for (const [day, outcome] of [
    ['1/9', { met: 'N2' }],
    ['2/9', { met: 'Mất cơ hội' }],
    ['3/9', { met: 'Mất cơ hội giữ nguyên' }],
    ['5/9', { met: 'N3' }],
    ['7/9', { status: 'Không đến' }],
    ['8/9', { status: 'Hủy' }],
    ['9/9', { moved: '21/9' }],
  ] as const) {
    await book(page, day, null);
    await record(page, outcome);
  }
  // Not recorded: "Chưa ghi kết quả", the widest result, beside one of the widest days and times.
  await book(page, '4/9', '20:44');
  await book(page, '10/12/2025', '16:41');
  await page
    .getByRole('complementary', { name: 'Chi tiết lịch hẹn' })
    .getByRole('link', { name: 'Hồ sơ KH →' })
    .click();
  await expect(page.getByRole('heading', { level: 2, name: NAME, exact: true })).toBeVisible();
  const { card, rows } = appointments(page);

  for (const result of [
    'N3 → N2 · RF',
    'N2 → Mất cơ hội',
    'Giữ Mất cơ hội',
    'Mất cơ hội → N3',
    'Không đến',
    'Hủy',
    'Dời lịch',
    'Dự kiến',
    'Chưa ghi kết quả',
  ]) {
    await expect(rows.filter({ hasText: result }).first()).toBeVisible();
  }
  // One line is about 36 px high; "Không đến" in two made a 55 px row (review of PR 838).
  for (const row of await rows.filter({ hasNotText: /\/\d{4}/ }).all()) {
    const height = (await row.boundingBox())!.height;
    expect(height, (await row.textContent()) ?? '').toBeLessThan(45);
  }
  // The day runs into no result.
  const [day, result] = await textEdges(rows.filter({ hasText: '04/09 20:44' }));
  expect(day!.right).toBeLessThan(result!.left);

  const earlier = rows.filter({ hasText: '16:41' });
  const date = earlier.getByText('10/12/2025', { exact: true });
  const time = earlier.getByText('16:41', { exact: true });
  expect((await time.boundingBox())!.y).toBeGreaterThan((await date.boundingBox())!.y);

  // Nothing past the card's edge, in three columns or two.
  for (const width of [1440, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await scrolls(card)).toBe(false);
  }
});

test('the timeline shows the appointments; a past one offers "Hẹn tiếp →"', async ({ page }) => {
  await openProfile(page);
  const timeline = page.getByRole('region', { name: 'Dòng thời gian' });
  await expect(timeline).toContainText(/Lịch hẹn lần \d+/);
  await expect(timeline).toContainText(/\d\d\/\d\d\/\d{4}( \d\d:\d\d)? · đã gặp/);

  const next = timeline.getByRole('button', { name: /^Hẹn tiếp sau lịch \d\d\/\d\d/ }).first();
  await expect(next).toHaveText('Hẹn tiếp →');
  await next.click();
  await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(
    'Lịch hẹn tiếp theo',
  );
});

test('"+ Lịch hẹn" in the profile makes an appointment for this customer', async ({ page }) => {
  const name = await openProfile(page);
  const { rows } = appointments(page);
  const count = await rows.count();
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Lịch hẹn mới');
  await expect(dialog.locator('b').first()).toHaveText(name);
  await create(page, '1/10', '15:00');

  await expect(rows).toHaveCount(count + 1);
  // A day ahead offers no next appointment yet.
  await expect(rows.first()).toContainText('01/10 15:00');
  await expect(rows.first().getByRole('button')).toHaveCount(0);

  // Two on one day: the later one stays on top.
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  await create(page, '1/10', '9:00');
  await expect(rows).toHaveCount(count + 2);
  await expect(rows.nth(0)).toContainText('01/10 15:00');
  await expect(rows.nth(1)).toContainText('01/10 09:00');
});

test('a customer without appointments says so', async ({ page }) => {
  await page.goto('/#/customers');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill('Chưa Hẹn Lần Nào');
  await dialog.getByRole('combobox', { name: 'RE phụ trách' }).selectOption({ index: 1 });
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole('link', { name: /Chưa Hẹn Lần Nào/ }).click();

  const { card } = appointments(page);
  await expect(card).toContainText('0 lịch · 0 đã gặp');
  await expect(card).toContainText('KH chưa có lịch hẹn.');
  await expect(card.getByRole('table')).toHaveCount(0);
});

test('"Xem tất cả" in the dialog opened on the profile shows the appointments card', async ({
  page,
}) => {
  await openProfile(page);
  const dialog = page.getByRole('dialog');
  const seeAll = dialog.getByRole('link', { name: /^Xem tất cả/ });
  // Past appointments until there are more than the dialog lists.
  for (let day = 1; day <= 6; day += 1) {
    await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
    if ((await seeAll.count()) > 0) break;
    await create(page, `${day}/9`, null);
  }

  await seeAll.click();
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/#\/customers\//);
  await expect(page.getByRole('heading', { name: 'Lịch hẹn', exact: true })).toBeInViewport();
});
