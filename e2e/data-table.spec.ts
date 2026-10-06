import { expect, test, type Page } from '@playwright/test';

/** dd/mm/yyyy → yyyy-mm-dd, which sorts as text in date order. */
const iso = (date: string) => date.split('/').reverse().join('-');
const collator = new Intl.Collator('vi');

// The appointment list of the current month (simulated data) is the sample table.
async function openTable(page: Page) {
  await page.goto('/#/appointments');
  const table = page.getByRole('table', { name: 'Danh sách lịch hẹn' });
  await expect(table.locator('tbody tr').first()).toBeVisible();
  const header = (name: string) => table.getByRole('columnheader', { name });
  const column = (index: number) =>
    table.locator('tbody tr').locator(`td:nth-child(${index})`).allTextContents();
  return { table, header, column };
}

test('opens sorted by date, newest first', async ({ page }) => {
  const { header, column } = await openTable(page);

  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'descending');
  await expect(header('Khách hàng')).toHaveAttribute('aria-sort', 'none');
  const dates = (await column(1)).map(iso);
  expect(dates).toEqual([...dates].sort().reverse());
});

test('dates sort by time, not as text: 01/10 comes after 30/09', async ({ page }) => {
  const { table, header, column } = await openTable(page);
  // Two months, so dd/mm/yyyy as text would put 01/10 before 30/09.
  await page.getByRole('radio', { name: 'Tùy chọn' }).click();
  await page.getByRole('textbox', { name: 'Từ ngày' }).fill('28/09/2026');
  await page.getByRole('textbox', { name: 'Đến ngày' }).fill('02/10/2026');
  await page.getByRole('textbox', { name: 'Đến ngày' }).press('Enter');
  await expect(table).toContainText('02/10/2026');

  await header('Ngày').click(); // ↓ → none
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'none');
  await header('Ngày').click(); // none → ↑
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'ascending');
  const dates = await column(1);
  expect(dates[0]).toBe('28/09/2026');
  expect(dates.at(-1)).toBe('02/10/2026');
  expect(dates.map(iso)).toEqual(dates.map(iso).sort());
});

test('a header cycles none → ↑ → ↓ → none, one sorted column at a time', async ({ page }) => {
  const { header, column } = await openTable(page);
  const customer = header('Khách hàng');
  await expect(customer).toContainText('↕');

  await customer.click();
  await expect(customer).toHaveAttribute('aria-sort', 'ascending');
  await expect(customer).toContainText('↑');
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'none');
  const names = await column(3);
  expect(names).toEqual([...names].sort(collator.compare));

  await customer.click();
  await expect(customer).toHaveAttribute('aria-sort', 'descending');
  // The first hundred of the whole list sorted the other way (T-150), not the same rows reversed.
  const reversed = await column(3);
  expect(reversed).toEqual([...reversed].sort(collator.compare).reverse());
  expect(collator.compare(reversed[0] ?? '', names.at(-1) ?? '')).toBeGreaterThanOrEqual(0);

  await customer.click();
  await expect(customer).toHaveAttribute('aria-sort', 'none');
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'none');
  // Unsorted, the list keeps its own order: newest first.
  const unsorted = (await column(1)).map(iso);
  expect(unsorted).toEqual([...unsorted].sort().reverse());
});

test('headers sort from the keyboard', async ({ page }) => {
  const { header, column } = await openTable(page);

  await header('Giờ').getByRole('button').focus();
  await page.keyboard.press('Enter');
  await expect(header('Giờ')).toHaveAttribute('aria-sort', 'ascending');
  const times = await column(2);
  expect(times).toEqual([...times].sort());
});

// T-150 (DR-03, mockup table-more.html): a big table shows a hundred rows at a time.
const SUMMARY = /^[\d.]+ lịch · [\d.]+ đã gặp/;
const grouped = (n: number) => n.toLocaleString('vi-VN');

async function openYear(page: Page) {
  const opened = await openTable(page);
  await page
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Năm' })
    .click();
  await expect(page.getByRole('region', { name: /^Lịch năm/ })).toBeVisible();
  const text = (await page.getByText(SUMMARY).first().textContent()) ?? '';
  const total = Number(/^[\d.]+/.exec(text)?.[0].replaceAll('.', ''));
  return { ...opened, total, rows: opened.table.locator('tbody tr') };
}

test('the year shows its first hundred rows, a hundred more on each click, counted in full', async ({
  page,
}) => {
  const { rows, total, header } = await openYear(page);
  expect(total).toBeGreaterThan(300);
  const more = page.getByRole('button', { name: 'Hiện thêm 100 lịch' });

  await expect(rows).toHaveCount(100);
  await expect(page.getByText(`Đang hiện 100 / ${grouped(total)} lịch`)).toBeVisible();
  // The count above the table is still the whole year's.
  await expect(page.getByText(SUMMARY).first()).toHaveText(new RegExp(`^${grouped(total)} lịch`));

  await more.click();
  await more.click();
  await expect(rows).toHaveCount(300);
  await expect(page.getByText(`Đang hiện 300 / ${grouped(total)} lịch`)).toBeVisible();

  // A sort keeps the rows shown, sorting the whole year.
  await header('Khách hàng').click();
  await expect(header('Khách hàng')).toHaveAttribute('aria-sort', 'ascending');
  await expect(rows).toHaveCount(300);
});

test('the year sorts in full before it is cut: oldest first starts in its first month', async ({
  page,
}) => {
  const { header, column } = await openYear(page);
  const months = await page
    .getByRole('region', { name: /^Lịch năm/ })
    .getByRole('button')
    .evaluateAll((cells) => cells.map((cell) => cell.getAttribute('aria-label') ?? ''));
  const busy = months.filter((label) => !/: 0 lịch/.test(label));
  const monthOf = (label: string) => Number(/^Tháng (\d+)\//.exec(label)?.[1]);
  const first = monthOf(busy[0] ?? '');
  const last = monthOf(busy.at(-1) ?? '');
  expect(first).toBeLessThan(last);

  expect(Number((await column(1))[0]?.slice(3, 5))).toBe(last);
  await header('Ngày').click(); // ↓ → none
  await header('Ngày').click(); // none → ↑
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'ascending');
  expect(Number((await column(1))[0]?.slice(3, 5))).toBe(first);
});

test('another period goes back to a hundred rows; the last click shows the rest', async ({
  page,
}) => {
  const { rows } = await openYear(page);
  await page.getByRole('button', { name: 'Hiện thêm 100 lịch' }).click();
  await expect(rows).toHaveCount(200);

  await page
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Tháng' })
    .click();
  const text = (await page.getByText(SUMMARY).first().textContent()) ?? '';
  const month = Number(/^[\d.]+/.exec(text)?.[0].replaceAll('.', ''));
  expect(month).toBeGreaterThan(100);
  await expect(rows).toHaveCount(100);

  const more = page.getByRole('button', { name: /^Hiện thêm \d+ lịch$/ });
  for (let shown = 100; shown < month; shown += 100) {
    const next = Math.min(100, month - shown);
    await expect(more).toHaveText(`Hiện thêm ${next} lịch`);
    await more.click();
  }
  await expect(rows).toHaveCount(month);
  await expect(more).toHaveCount(0);
  await expect(page.getByText(`Đã hiện hết ${grouped(month)} lịch`)).toBeVisible();
});

test('a table of a hundred rows or fewer has no foot', async ({ page }) => {
  const { table } = await openTable(page);
  await page
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Ngày' })
    .click();
  await expect(page.getByRole('region', { name: /^Lịch tháng/ })).toBeVisible();
  const count = await table.locator('tbody tr').count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(100);
  await expect(page.getByText(/^Đang hiện |^Đã hiện hết /)).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^Hiện thêm/ })).toHaveCount(0);
});
