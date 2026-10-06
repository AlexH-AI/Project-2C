import { expect, test, type Page } from '@playwright/test';

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

test('the scope narrows the customers to one team, then to one RE', async ({ page }) => {
  const [allOpen] = await summary(page);
  const scope = page.getByRole('radiogroup', { name: 'Góc nhìn' });

  await scope.getByRole('radio', { name: 'Team' }).click();
  const team = page.getByRole('combobox', { name: 'Team của góc nhìn' });
  await expect(team.locator('option')).toHaveText(['Bình Minh', 'Hừng Đông', 'Sao Mai']);
  await team.selectOption({ label: 'Sao Mai' });
  await expect.poll(async () => (await summary(page))[0]).toBeLessThan(allOpen);

  await scope.getByRole('radio', { name: 'RE' }).click();
  const re = page.getByRole('combobox', { name: 'RE của góc nhìn' });
  await expect(re.locator('option')).toHaveCount(30);
  await page.getByRole('radio', { name: 'Bảng' }).click();
  const reName = (await re.locator('option:checked').textContent())?.split(' · ')[0] ?? '';
  const rows = page.getByRole('table').getByRole('row');
  const [reOpen, reClosed] = await summary(page);
  await expect(rows).toHaveCount(1 + reOpen + reClosed);
  await expect(rows.nth(1).getByRole('cell').nth(3)).toHaveText(reName);
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

const pickTeam = async (page: Page, name: string) => {
  await page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'Team' })
    .click();
  await page.getByRole('combobox', { name: 'Team của góc nhìn' }).selectOption({ label: name });
};

test('the RE strip shows on the Team scope only, with the RE of the team', async ({ page }) => {
  const strip = page.getByRole('region', { name: /^RE của team/ });
  await expect(strip).toHaveCount(0);

  await pickTeam(page, 'Sao Mai');
  await expect(strip).toHaveAccessibleName('RE của team Sao Mai');
  await expect(strip.getByRole('button')).toHaveCount(11);
  await expect(strip.getByRole('button', { name: /^Cả team/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByText(/KH đang mở/)).toContainText('Cả team Sao Mai');

  const scope = page.getByRole('radiogroup', { name: 'Góc nhìn' });
  await scope.getByRole('radio', { name: 'RE' }).click();
  await expect(strip).toHaveCount(0);
  await scope.getByRole('radio', { name: 'Toàn bộ' }).click();
  await expect(strip).toHaveCount(0);
});

test('an RE picked in the strip narrows the customers to it, until picked again', async ({
  page,
}) => {
  await pickTeam(page, 'Sao Mai');
  const [teamOpen] = await summary(page);
  const strip = page.getByRole('region', { name: 'RE của team Sao Mai' });
  const chip = strip.getByRole('button').nth(1);
  const name = (await chip.locator('span').first().textContent()) ?? '';

  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText(/KH đang mở/)).toContainText(name);
  const [reOpen] = await summary(page);
  expect(reOpen).toBe(Number(await chip.locator('span').last().textContent()));
  expect(reOpen).toBeLessThan(teamOpen);
  for (const stage of OPEN) {
    for (const card of await column(page, stage).getByRole('link').all()) {
      await expect(card).toContainText(`RE ${name}`);
    }
  }

  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(async () => (await summary(page))[0]).toBe(teamOpen);
});

test('another team drops the RE picked in the strip', async ({ page }) => {
  await pickTeam(page, 'Sao Mai');
  await page
    .getByRole('region', { name: 'RE của team Sao Mai' })
    .getByRole('button')
    .nth(1)
    .click();

  await pickTeam(page, 'Bình Minh');
  const strip = page.getByRole('region', { name: 'RE của team Bình Minh' });
  await expect(strip.getByRole('button', { pressed: true })).toHaveText(/^Cả team/);
});
