import { expect, test, type Page } from '@playwright/test';

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
  await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
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
