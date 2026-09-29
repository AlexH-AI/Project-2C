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
