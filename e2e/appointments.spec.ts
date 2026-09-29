import { expect, test, type Page } from '@playwright/test';

// The e2e build pins today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).
const TODAY = '15/09/2026';
const TEAMS = ['Bình Minh', 'Hừng Đông', 'Sao Mai'];

function screen(page: Page) {
  const list = page.getByRole('table', { name: 'Danh sách lịch hẹn' });
  return {
    list,
    rows: list.locator('tbody tr'),
    column: (index: number) => list.locator(`tbody tr td:nth-child(${index})`).allTextContents(),
    day: page.getByRole('region', { name: /^Trong ngày/ }),
    calendar: page.getByRole('region', { name: /^Lịch tháng/ }),
    detail: page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' }),
    kinds: page.getByRole('radiogroup', { name: 'Loại kỳ' }),
    coordinator: page.getByRole('combobox', { name: 'Phối hợp' }),
  };
}

const SUMMARY = /\d+ lịch · \d+ đã gặp/;

/** The period's "482 lịch · 349 đã gặp" → 482 (the header comes before the calendar's). */
async function total(page: Page): Promise<number> {
  const text = await page.getByText(SUMMARY).first().textContent();
  return Number(text?.match(/\d+/)?.[0]);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/#/appointments');
  await expect(page.getByRole('table', { name: 'Danh sách lịch hẹn' })).toBeVisible();
});

test("opens on this month, today's day by team → RE, the list matching the summary", async ({
  page,
}) => {
  const { calendar, day, rows, column } = screen(page);

  await expect(calendar.getByRole('heading')).toHaveText('Lịch tháng 09/2026');
  await expect(calendar.getByRole('button', { pressed: true })).toHaveAccessibleName(
    new RegExp(`^${TODAY}: \\d+ lịch hẹn$`),
  );
  await expect(day.getByRole('heading', { level: 2 })).toHaveText(`Trong ngày ${TODAY}`);
  await expect(day.getByRole('heading', { level: 3 })).toHaveText(TEAMS);

  const count = await total(page);
  expect(count).toBeGreaterThan(0);
  await expect(rows).toHaveCount(count);
  for (const date of await column(1)) expect(date).toMatch(/^\d\d\/09\/2026$/);

  // The month's own count matches the period's; only its 30 days are buttons.
  await expect(calendar.getByText(SUMMARY)).toHaveText(
    (await page.getByText(SUMMARY).first().textContent()) ?? '',
  );
  await expect(calendar.getByRole('button')).toHaveCount(30);
});

test('the day period narrows the day and the list to one day', async ({ page }) => {
  const { day, kinds, column } = screen(page);

  await kinds.getByRole('radio', { name: 'Ngày' }).click();
  await page.getByRole('button', { name: 'Kỳ sau' }).click();
  await expect(day.getByRole('heading', { level: 2 })).toHaveText('Trong ngày 16/09/2026');
  const dates = await column(1);
  expect(dates.length).toBeGreaterThan(0);
  expect(new Set(dates)).toEqual(new Set(['16/09/2026']));
});

test('a day in the calendar shows that day, its count matching the list', async ({ page }) => {
  const { calendar, day, kinds, rows } = screen(page);

  const cell = calendar.getByRole('button', { name: /^16\/09\/2026:/ });
  await cell.click();
  await expect(cell).toHaveAttribute('aria-pressed', 'true');
  await expect(day.getByRole('heading', { level: 2 })).toHaveText('Trong ngày 16/09/2026');

  const count = Number((await cell.getAttribute('aria-label'))?.match(/: (\d+)/)?.[1]);
  await kinds.getByRole('radio', { name: 'Ngày' }).click();
  await page.getByRole('button', { name: 'Kỳ sau' }).click();
  await expect(rows).toHaveCount(count);
});

test('with the day period, a day in the calendar moves the period to that day', async ({
  page,
}) => {
  const { calendar, day, kinds, rows, column } = screen(page);

  await kinds.getByRole('radio', { name: 'Ngày' }).click();
  const cell = calendar.getByRole('button', { name: /^18\/09\/2026:/ });
  await cell.click();
  await expect(cell).toHaveAttribute('aria-pressed', 'true');
  await expect(day.getByRole('heading', { level: 2 })).toHaveText('Trong ngày 18/09/2026');

  const count = Number((await cell.getAttribute('aria-label'))?.match(/: (\d+)/)?.[1]);
  expect(count).toBeGreaterThan(0);
  await expect(rows).toHaveCount(count);
  expect(await total(page)).toBe(count);
  expect(new Set(await column(1))).toEqual(new Set(['18/09/2026']));
});

test('with the week period, a day in another week moves the period to that week', async ({
  page,
}) => {
  const { calendar, day, kinds, column } = screen(page);

  await kinds.getByRole('radio', { name: 'Tuần' }).click();
  await calendar.getByRole('button', { name: /^23\/09\/2026:/ }).click();
  await expect(day.getByRole('heading', { level: 2 })).toHaveText('Trong ngày 23/09/2026');

  const week = ['21', '22', '23', '24', '25', '26', '27'].map((d) => `${d}/09/2026`);
  const dates = await column(1);
  expect(dates.length).toBeGreaterThan(0);
  for (const date of dates) expect(week).toContain(date);
});

test('with a custom range, days outside it cannot be picked', async ({ page }) => {
  const { calendar, kinds } = screen(page);

  await kinds.getByRole('radio', { name: 'Tùy chọn' }).click();
  await page.getByRole('textbox', { name: 'Từ ngày' }).fill('10/09/2026');
  await page.getByRole('textbox', { name: 'Đến ngày' }).fill('20/09/2026');
  await page.getByRole('textbox', { name: 'Đến ngày' }).press('Enter');

  await expect(calendar.getByRole('button')).toHaveCount(11);
  await expect(calendar.getByRole('button', { name: /^21\/09\/2026:/ })).toHaveCount(0);
});

test('the scope narrows the day and the list to one team, then one RE', async ({ page }) => {
  const { day, rows, column } = screen(page);
  const all = await total(page);
  const scope = page.getByRole('radiogroup', { name: 'Góc nhìn' });

  await scope.getByRole('radio', { name: 'Team' }).click();
  await page
    .getByRole('combobox', { name: 'Team của góc nhìn' })
    .selectOption({ label: 'Sao Mai' });
  await expect(day.getByRole('heading', { level: 3 })).toHaveText(['Sao Mai']);
  await expect.poll(() => total(page)).toBeLessThan(all);

  await scope.getByRole('radio', { name: 'RE' }).click();
  const re = page.getByRole('combobox', { name: 'RE của góc nhìn' });
  const reName = (await re.locator('option:checked').textContent())?.split(' · ')[0] ?? '';
  await expect.poll(async () => new Set(await column(4))).toEqual(new Set([reName]));
  await expect(rows).toHaveCount(await total(page));
});

test('the coordinator filter keeps the appointments with or without that person', async ({
  page,
}) => {
  const { coordinator, rows, column } = screen(page);
  const all = await total(page);

  await coordinator.selectOption({ label: 'Không có người phối hợp' });
  await expect.poll(() => total(page)).toBeLessThan(all);
  expect(new Set(await column(6))).toEqual(new Set(['—']));

  // The first person (after "Bất kỳ" and "Không có") who joined a meeting this month.
  const people = await coordinator.locator('option').allTextContents();
  for (const someone of people.slice(2)) {
    await coordinator.selectOption({ label: someone });
    if ((await total(page)) === 0) continue;
    await expect(rows).toHaveCount(await total(page));
    const role = someone.split(' ')[0] ?? '';
    for (const cell of await column(6)) expect(cell.split(', ')).toContain(role);
    return;
  }
  throw new Error('Nobody coordinated a meeting this month');
});

test('times line up in tabular figures; a customer opens the detail and its profile', async ({
  page,
}) => {
  const { rows, detail } = screen(page);
  const row = rows.first();
  await expect(row.locator('td:nth-child(2) span')).toHaveCSS(
    'font-variant-numeric',
    'tabular-nums',
  );

  const name = (await row.getByRole('button').textContent()) ?? '';
  await row.getByRole('button').click();
  await expect(detail.getByRole('heading')).toContainText(name);
  await expect(detail).toContainText('Trigger');

  await detail.getByRole('link', { name: 'Hồ sơ KH →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ khách hàng');
  await expect(page.getByRole('region', { name })).toBeVisible();
});

function form(page: Page) {
  const dialog = page.getByRole('dialog');
  return {
    dialog,
    date: dialog.getByRole('textbox', { name: /^Ngày/ }),
    time: dialog.getByRole('textbox', { name: /^Giờ/ }),
    trigger: dialog.getByRole('combobox', { name: /^Trigger/ }),
    create: dialog.getByRole('button', { name: 'Tạo lịch hẹn' }),
    history: dialog.getByRole('region', { name: 'Các lần hẹn trước' }),
  };
}

test('creates an appointment: the day is read back, a trigger is required, the day lists it', async ({
  page,
}) => {
  const { day, detail } = screen(page);
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const f = form(page);

  await f.dialog.getByRole('textbox', { name: /^Khách hàng/ }).fill('K-');
  await f.dialog.getByRole('list', { name: 'KH khớp' }).getByRole('button').first().click();
  const name = (await f.dialog.locator('b').first().textContent()) ?? '';
  const re = f.dialog.getByRole('combobox', { name: /^RE/ });
  await expect(re).not.toHaveValue('');
  // The RE option reads "RE · team".
  const [reName, team] = ((await re.locator('option:checked').textContent()) ?? '').split(' · ');

  await f.date.fill('30/9');
  await expect(f.dialog).toContainText('Thứ Tư 30/09/2026 · 15 ngày nữa');
  await f.time.fill('14:00');
  await f.dialog.getByRole('combobox', { name: 'Thêm người phối hợp' }).selectOption({ index: 1 });
  await expect(f.dialog.getByRole('button', { name: /^Bỏ / })).toHaveCount(1);

  // No trigger yet: nothing is created and the dialog says why.
  await f.create.click();
  await expect(f.dialog).toContainText('Chọn loại trigger');
  await f.trigger.selectOption({ label: 'Hội thảo / sự kiện' });
  await f.create.click();

  await expect(f.dialog).toHaveCount(0);
  await expect(day.getByRole('heading', { level: 2 })).toHaveText('Trong ngày 30/09/2026');
  await expect(
    day
      .getByRole('region', { name: team, exact: true })
      .getByRole('region', { name: reName, exact: true })
      .getByRole('button', { name }),
  ).toBeVisible();
  await expect(detail.getByRole('heading')).toContainText(`30/09/2026 14:00 · ${name}`);
  await expect(detail).toContainText('Hội thảo / sự kiện');
});

test('a day long past without a year offers next year; the RE picks', async ({ page }) => {
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const f = form(page);

  await f.date.fill('5/1');
  await expect(f.dialog).toContainText('05/01/2026 đã qua 253 ngày. Ý anh là 05/01/2027?');
  await f.dialog.getByRole('button', { name: 'Dùng 05/01/2027' }).click();
  await expect(f.date).toHaveValue('05/01/2027');
  await expect(f.dialog).toContainText('Thứ Ba 05/01/2027');

  await f.date.fill('29/02');
  await expect(f.dialog).toContainText('Ngày này không tồn tại.');
  await f.date.fill('28-9');
  await expect(f.dialog).toContainText('Gõ dd/mm hoặc dd/mm/yyyy.');
  await f.time.fill('25:00');
  await expect(f.dialog).toContainText('Giờ từ 00:00 đến 23:59.');
});

test('the next appointment from a past one is filled in and must be from today on', async ({
  page,
}) => {
  const { rows, detail } = screen(page);
  const past = rows.filter({ hasText: 'Đã gặp' }).filter({ hasNotText: TODAY }).first();
  await past.getByRole('button').click();
  const date = (await past.locator('td:nth-child(1)').textContent()) ?? '';
  await detail.getByRole('button', { name: 'Tạo lịch hẹn tiếp theo' }).click();

  const f = form(page);
  await expect(f.dialog.getByRole('heading', { level: 2 })).toHaveText('Lịch hẹn tiếp theo');
  await expect(f.dialog).toContainText(date);
  await expect(f.date).toHaveValue(date.slice(0, 5));
  await expect(f.trigger).not.toHaveValue('');
  await expect(f.dialog).toContainText(`${date} đã qua`);
  // The history shows at most five earlier appointments, newest first.
  await expect(f.history.getByRole('listitem')).not.toHaveCount(0);
  expect(await f.history.getByRole('listitem').count()).toBeLessThanOrEqual(5);

  await f.create.click();
  await expect(f.dialog).toBeVisible();
  await f.date.fill('15/09');
  await expect(f.dialog).toContainText('Thứ Ba 15/09/2026 · hôm nay');
  await f.create.click();
  await expect(f.dialog).toHaveCount(0);
  await expect(page.getByRole('region', { name: /^Trong ngày/ })).toContainText('Dự kiến');
});

test('rescheduling keeps the old appointment with its reason and links it to the new one', async ({
  page,
}) => {
  const { rows, detail } = screen(page);
  const planned = rows.filter({ hasText: 'Dự kiến' }).first();
  const oldDate = (await planned.locator('td:nth-child(1)').textContent()) ?? '';
  const oldTime = (await planned.locator('td:nth-child(2)').textContent()) ?? '';
  const name = (await planned.getByRole('button').textContent()) ?? '';
  await planned.getByRole('button').click();
  await detail.getByRole('button', { name: 'Dời lịch' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText(`${name} · `);
  const time = dialog.getByRole('textbox', { name: /^Giờ mới/ });
  await expect(time).toHaveValue(oldTime);
  await dialog.getByRole('textbox', { name: /^Ngày mới/ }).fill('2/10');
  await expect(dialog).toContainText('Thứ Sáu 02/10/2026 · 17 ngày nữa');
  await time.fill('10:00');
  await dialog.getByRole('textbox', { name: /^Lý do dời/ }).fill('KH đi công tác Đà Nẵng');
  await expect(dialog).toContainText('Tạo lịch hẹn mới 02/10/2026 10:00 · Dự kiến');
  await dialog.getByRole('button', { name: 'Dời lịch' }).click();

  // The new appointment is shown, pointing back to the old one.
  await expect(dialog).toHaveCount(0);
  await expect(detail.getByRole('heading')).toHaveText(`02/10/2026 10:00 · ${name}`);
  await expect(detail).toContainText('Dự kiến');
  const back = [oldDate, oldTime].filter(Boolean).join(' ');
  await detail.getByRole('button', { name: back }).click();

  // The old one stays, rescheduled, with the reason in its note and a link forward.
  await expect(detail.getByRole('heading')).toHaveText(`${back} · ${name}`);
  await expect(detail).toContainText('Dời lịch');
  await expect(detail).toContainText('Dời sang 02/10');
  await expect(detail).toContainText('KH đi công tác Đà Nẵng');
  await expect(detail.getByRole('button', { name: 'Dời lịch' })).toHaveCount(0);
  await detail.getByRole('button', { name: '02/10/2026 10:00' }).click();
  await expect(detail.getByRole('heading')).toHaveText(`02/10/2026 10:00 · ${name}`);
});

test('a rescheduled day already past is refused unless it back-fills a meeting held then', async ({
  page,
}) => {
  const { rows, detail } = screen(page);
  const planned = rows.filter({ hasText: 'Dự kiến' }).first();
  const name = (await planned.getByRole('button').textContent()) ?? '';
  await planned.getByRole('button').click();
  await detail.getByRole('button', { name: 'Dời lịch' }).click();

  const dialog = page.getByRole('dialog');
  const backfill = dialog.getByRole('checkbox', { name: /^Nhập bù/ });
  await expect(backfill).toHaveCount(0);
  await dialog.getByRole('textbox', { name: /^Ngày mới/ }).fill('10/9');
  await expect(dialog).toContainText(
    `10/09/2026 đã qua. Ngày dời phải từ hôm nay (${TODAY}) trở đi`,
  );
  await dialog.getByRole('button', { name: 'Dời lịch' }).click();
  await expect(dialog).toBeVisible();

  await backfill.check();
  await expect(dialog).toContainText('Thứ Năm 10/09/2026 · đã qua 5 ngày');
  await dialog.getByRole('button', { name: 'Dời lịch' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(detail.getByRole('heading')).toContainText(`10/09/2026`);
  await expect(detail.getByRole('heading')).toContainText(name);
});

/** Opens the dialog and fills a customer (its RE, or another team's), `date` and a trigger. */
async function fillAppointment(page: Page, date: string, otherTeam?: string) {
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const f = form(page);
  await f.dialog.getByRole('textbox', { name: /^Khách hàng/ }).fill('K-');
  await f.dialog.getByRole('list', { name: 'KH khớp' }).getByRole('button').first().click();
  const name = (await f.dialog.locator('b').first().textContent()) ?? '';
  const re = f.dialog.getByRole('combobox', { name: /^RE/ });
  if (otherTeam) {
    const options = await re.locator('option').allTextContents();
    const other = options.find((option) => option.includes(' · ') && !option.endsWith(otherTeam));
    await re.selectOption({ label: other ?? '' });
  }
  const reName = ((await re.locator('option:checked').textContent()) ?? '').split(' · ')[0] ?? '';
  await f.date.fill(date);
  await f.trigger.selectOption({ label: 'Hội thảo / sự kiện' });
  return { ...f, name, reName };
}

test('keeping a day long past records a late appointment on that day', async ({ page }) => {
  const { day, detail } = screen(page);
  const f = await fillAppointment(page, '5/1');
  await expect(f.dialog).toContainText('Ý anh là 05/01/2027?');
  await f.create.click();

  await expect(f.dialog).toHaveCount(0);
  await expect(day.getByRole('heading', { level: 2 })).toHaveText('Trong ngày 05/01/2026');
  await expect(detail.getByRole('heading')).toContainText(`05/01/2026 · ${f.name}`);
});

test('a coordinator filter hiding the new appointment is cleared', async ({ page }) => {
  const { coordinator, day, detail } = screen(page);
  await coordinator.selectOption({ label: 'Không có người phối hợp' });
  const f = await fillAppointment(page, '30/9');
  await f.dialog.getByRole('combobox', { name: 'Thêm người phối hợp' }).selectOption({ index: 1 });
  await f.create.click();

  await expect(f.dialog).toHaveCount(0);
  await expect(coordinator).toHaveValue('any');
  await expect(day.getByRole('button', { name: f.name })).toBeVisible();
  await expect(detail.getByRole('heading')).toContainText(`30/09/2026 · ${f.name}`);
});

test('an appointment for an RE outside the scope says so; the scope stays', async ({ page }) => {
  const { detail } = screen(page);
  await page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'Team' })
    .click();
  const team = page.getByRole('combobox', { name: 'Team của góc nhìn' });
  await team.selectOption({ label: 'Sao Mai' });
  const f = await fillAppointment(page, '30/9', 'Sao Mai');
  await f.create.click();

  await expect(f.dialog).toHaveCount(0);
  const notice = page.getByRole('status').filter({ hasText: 'Đã tạo lịch hẹn' });
  await expect(notice).toHaveText(
    `Đã tạo lịch hẹn 30/09/2026 cho ${f.reName}. RE này nằm ngoài góc nhìn hiện tại nên lịch không hiện ở đây; đổi góc nhìn để xem.`,
  );
  await expect(team.locator('option:checked')).toHaveText('Sao Mai');
  await expect(detail).toContainText('Chọn một lịch hẹn để xem chi tiết.');

  await page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'Toàn bộ' })
    .click();
  await expect(notice).toHaveCount(0);
  await expect(detail.getByRole('heading')).toContainText(`30/09/2026 · ${f.name}`);
});
