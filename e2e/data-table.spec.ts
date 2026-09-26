import { expect, test, type Page } from '@playwright/test';

async function openTable(page: Page) {
  await page.goto('/#/appointments');
  const table = page.getByRole('table', { name: 'Lịch hẹn mẫu' });
  const header = (name: string) => table.getByRole('columnheader', { name });
  const column = (index: number) =>
    table.locator('tbody tr').locator(`td:nth-child(${index})`).allTextContents();
  return { table, header, column };
}

test('opens sorted by date, newest first', async ({ page }) => {
  const { header, column } = await openTable(page);

  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'descending');
  await expect(header('Khách hàng')).toHaveAttribute('aria-sort', 'none');
  expect(await column(1)).toEqual([
    '03/10/2026',
    '01/10/2026',
    '30/09/2026',
    '28/09/2026',
    '15/08/2026',
    '20/12/2025',
  ]);
});

test('dates sort by time, not as text: 01/10 comes after 30/09', async ({ page }) => {
  const { header, column } = await openTable(page);

  await header('Ngày').click(); // ↓ → none
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'none');
  await header('Ngày').click(); // none → ↑
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'ascending');
  expect(await column(1)).toEqual([
    '20/12/2025',
    '15/08/2026',
    '28/09/2026',
    '30/09/2026',
    '01/10/2026',
    '03/10/2026',
  ]);
});

test('a header cycles none → ↑ → ↓ → none, one sorted column at a time', async ({ page }) => {
  const { header, column } = await openTable(page);
  const customer = header('Khách hàng');

  await customer.click();
  await expect(customer).toHaveAttribute('aria-sort', 'ascending');
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'none');
  expect(await column(3)).toEqual([
    'An Văn Bình',
    'Âu Thị Hà',
    'Bùi Minh Khoa',
    'Đặng Thu Trang',
    'Lê Quốc Huy',
    'Trần Ngọc Mai',
  ]);

  await customer.click();
  await expect(customer).toHaveAttribute('aria-sort', 'descending');
  expect((await column(3))[0]).toBe('Trần Ngọc Mai');

  await customer.click();
  await expect(customer).toHaveAttribute('aria-sort', 'none');
  await expect(header('Ngày')).toHaveAttribute('aria-sort', 'none');
});

test('headers sort from the keyboard', async ({ page }) => {
  const { header, column } = await openTable(page);

  await header('Giờ').getByRole('button').focus();
  await page.keyboard.press('Enter');
  await expect(header('Giờ')).toHaveAttribute('aria-sort', 'ascending');
  expect(await column(2)).toEqual(['08:00', '09:30', '10:15', '14:00', '16:00', '19:45']);
});
