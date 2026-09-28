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

  await customer.click();
  await expect(customer).toHaveAttribute('aria-sort', 'ascending');
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'none');
  const names = await column(3);
  expect(names).toEqual([...names].sort(collator.compare));

  await customer.click();
  await expect(customer).toHaveAttribute('aria-sort', 'descending');
  expect(await column(3)).toEqual([...names].sort(collator.compare).reverse());

  await customer.click();
  await expect(customer).toHaveAttribute('aria-sort', 'none');
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'none');
});

test('headers sort from the keyboard', async ({ page }) => {
  const { header, column } = await openTable(page);

  await header('Giờ').getByRole('button').focus();
  await page.keyboard.press('Enter');
  await expect(header('Giờ')).toHaveAttribute('aria-sort', 'ascending');
  const times = await column(2);
  expect(times).toEqual([...times].sort());
});
