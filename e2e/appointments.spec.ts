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
    detail: page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' }),
    kinds: page.getByRole('radiogroup', { name: 'Loại kỳ' }),
    coordinator: page.getByRole('combobox', { name: 'Phối hợp' }),
  };
}

/** "482 lịch · 349 đã gặp" → 482. */
async function total(page: Page): Promise<number> {
  const text = await page.getByText(/\d+ lịch · \d+ đã gặp/).textContent();
  return Number(text?.match(/\d+/)?.[0]);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/#/appointments');
  await expect(page.getByRole('table', { name: 'Danh sách lịch hẹn' })).toBeVisible();
});

test("opens on this month, today's day by team → RE, the list matching the summary", async ({
  page,
}) => {
  const { day, rows, column } = screen(page);

  await expect(day.getByRole('heading', { level: 2 })).toHaveText(`Trong ngày ${TODAY}`);
  await expect(day.getByRole('heading', { level: 3 })).toHaveText(TEAMS);

  const count = await total(page);
  expect(count).toBeGreaterThan(0);
  await expect(rows).toHaveCount(count);
  for (const date of await column(1)) expect(date).toMatch(/^\d\d\/09\/2026$/);
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
