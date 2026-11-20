import { expect, test, type Page } from './fixtures';
import { pickFirstRm, pickScope, scopePill } from './support';

const OPEN = ['N4', 'N3', 'N2', 'N1'];
const CLOSED = ['Tạm hoãn', 'Mất cơ hội'];

const column = (page: Page, stage: string) =>
  page.getByRole('region', { name: stage, exact: true });

/** "884 KH đang mở · 316 đã đóng" → [884, 316]. */
async function summary(page: Page): Promise<[number, number]> {
  const text = await page.getByText(/KH đang mở/).textContent();
  const [open = NaN, closed = NaN] = (text?.match(/\d+/g) ?? []).map(Number);
  return [open, closed];
}

/** The count in each column head, in the order given. */
const counts = (page: Page, stages: string[]) =>
  Promise.all(
    stages.map(async (stage) =>
      Number(
        (await column(page, stage).locator('> div > span').last().textContent())?.replace(
          /\./g,
          '',
        ),
      ),
    ),
  );

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

test.beforeEach(async ({ page }) => {
  await page.goto('/#/customers');
  await expect(page.getByText(/KH đang mở/)).toBeVisible();
});

test('the kanban shows N4 → N1 and the closed stages, adding up to the summary', async ({
  page,
}) => {
  const [open, closed] = await summary(page);
  expect(open).toBeGreaterThan(0);
  expect(closed).toBeGreaterThan(0);
  expect(sum(await counts(page, OPEN))).toBe(open);
  expect(sum(await counts(page, CLOSED))).toBe(closed);

  for (const stage of OPEN) {
    await expect(column(page, stage).getByRole('link')).toHaveCount(6);
  }
});

test('the scope narrows the customers to one team, then to one RM', async ({ page }) => {
  const [allOpen] = await summary(page);

  await pickScope(page, { team: 'Sao Mai' });
  await expect.poll(async () => (await summary(page))[0]).toBeLessThan(allOpen);
  const [teamOpen] = await summary(page);

  await pickFirstRm(page, 'Sao Mai');
  await expect.poll(async () => (await summary(page))[0]).toBeLessThan(teamOpen);
  await page.getByRole('radio', { name: 'Bảng' }).click();
  // The pill of the scope names the RM alone.
  const rmName = (await scopePill(page).textContent()) ?? '';
  const rows = page.getByRole('table').getByRole('row');
  const [rmOpen, rmClosed] = await summary(page);
  await expect(rows).toHaveCount(1 + rmOpen + rmClosed);
  await expect(rows.nth(1).getByRole('cell').nth(3)).toHaveText(rmName);
});

// The table of an RM with no customer yet keeps its seven columns over the note saying so
// (components.html 09, PR #1406).
test('the table of an RM with no customer says so under its columns', async ({ page }) => {
  const rm = 'Lý Chưa Có Khách';
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Team & nhân sự' })
    .click();
  await page.getByRole('button', { name: '+ Nhân sự' }).click();
  const person = page.getByRole('dialog', { name: 'Nhân sự mới' });
  await person.getByRole('textbox', { name: 'Họ tên' }).fill(rm);
  await person.getByRole('radio', { name: 'RM', exact: true }).check();
  await person.getByRole('combobox', { name: 'Team' }).selectOption({ label: 'Sao Mai' });
  await person.getByRole('button', { name: 'Thêm' }).click();
  await expect(person).toBeHidden();
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Khách hàng' })
    .click();

  await pickScope(page, { team: 'Sao Mai', rm });
  await page.getByRole('radio', { name: 'Bảng' }).click();
  const table = page.getByRole('table', { name: 'Khách hàng' });
  await expect(table.getByRole('columnheader')).toHaveCount(7);
  await expect(table).toContainText('Chưa có KH nào trong góc nhìn này');
  await expect(table).toContainText('Bấm "+ Khách hàng" để thêm.');
});

test('a card opens the customer profile with its code, stage and policies', async ({ page }) => {
  const card = column(page, 'N2').getByRole('link').first();
  const name = (await card.locator('b').textContent()) ?? '';
  await card.click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ khách hàng');
  const profile = page.getByRole('region', { name });
  await expect(profile).toContainText('N2');
  await expect(profile).toContainText(/K-[0-9A-HJKMNP-TV-Z]{4} · /);
  await expect(profile).toContainText(/Đã có HĐ \(\d+\)|Chưa có HĐ/);

  await page.getByRole('link', { name: '← Khách hàng' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Khách hàng');
});

test('an unknown customer shows a message instead of a profile', async ({ page }) => {
  await page.goto('/#/customers/nobody');
  await expect(page.getByText('Không tìm thấy KH này (có thể đã bị xóa).')).toBeVisible();
});

test('the RM strip shows on the Team scope only, with the RM of the team', async ({ page }) => {
  const strip = page.getByRole('region', { name: /^RM của team/ });
  await expect(strip).toHaveCount(0);

  await pickScope(page, { team: 'Sao Mai' });
  await expect(strip).toHaveAccessibleName('RM của team Sao Mai');
  await expect(strip.getByRole('button')).toHaveCount(11);
  await expect(strip.getByRole('button', { name: /^Cả team/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByText(/KH đang mở/)).toContainText('Cả team Sao Mai');

  await pickFirstRm(page, 'Sao Mai');
  await expect(strip).toHaveCount(0);
  await pickScope(page, 'all');
  await expect(strip).toHaveCount(0);
});

test('an RM picked in the strip narrows the customers to it, until picked again', async ({
  page,
}) => {
  await pickScope(page, { team: 'Sao Mai' });
  const [teamOpen] = await summary(page);
  const strip = page.getByRole('region', { name: 'RM của team Sao Mai' });
  const chip = strip.getByRole('button').nth(1);
  const name = (await chip.locator('span').first().textContent()) ?? '';

  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText(/KH đang mở/)).toContainText(name);
  const [rmOpen] = await summary(page);
  expect(rmOpen).toBe(Number(await chip.locator('span').last().textContent()));
  expect(rmOpen).toBeLessThan(teamOpen);
  for (const stage of OPEN) {
    for (const card of await column(page, stage).getByRole('link').all()) {
      await expect(card).toContainText(`RM ${name}`);
    }
  }

  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(async () => (await summary(page))[0]).toBe(teamOpen);
});

test('another team drops the RM picked in the strip', async ({ page }) => {
  await pickScope(page, { team: 'Sao Mai' });
  await page
    .getByRole('region', { name: 'RM của team Sao Mai' })
    .getByRole('button')
    .nth(1)
    .click();

  await pickScope(page, { team: 'Bình Minh' });
  const strip = page.getByRole('region', { name: 'RM của team Bình Minh' });
  await expect(strip.getByRole('button', { pressed: true })).toHaveText(/^Cả team/);
});
