import { expect, test, type Page } from '@playwright/test';

// The e2e build pins today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).

/** Opens the profile of the customer of a past met appointment; returns its name. */
async function openProfile(page: Page): Promise<string> {
  await page.goto('/#/appointments');
  const list = page.getByRole('table', { name: 'Danh sách lịch hẹn' });
  const met = list.locator('tbody tr').filter({ hasText: 'Đã gặp' }).first();
  const name = (await met.getByRole('button').textContent()) ?? '';
  await met.getByRole('button').click();
  await page.getByRole('link', { name: 'Hồ sơ KH →' }).click();
  await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
  return name;
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
  await expect(card).toContainText(`${count} lịch · `);

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

test('the timeline shows the appointments; a past one offers "Hẹn tiếp →"', async ({ page }) => {
  await openProfile(page);
  const timeline = page.getByRole('region', { name: 'Dòng thời gian' });
  await expect(timeline).toContainText(/Lịch hẹn lần \d+/);
  await expect(timeline).toContainText(/\d\d\/\d\d\/\d{4}( \d\d:\d\d)? · Đã gặp/);

  await timeline.getByRole('button', { name: 'Hẹn tiếp →' }).first().click();
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
  await dialog.getByRole('textbox', { name: /^Ngày/ }).fill('1/10');
  await dialog.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await dialog.getByRole('button', { name: 'Tạo lịch hẹn' }).click();

  await expect(dialog).toHaveCount(0);
  await expect(rows).toHaveCount(count + 1);
  // A day ahead offers no next appointment yet.
  await expect(rows.first()).toContainText('01/10');
  await expect(rows.first().getByRole('button')).toHaveCount(0);
});
