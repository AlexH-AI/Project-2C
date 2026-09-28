import { expect, test, type Page } from '@playwright/test';

const SCREENS = [
  'Tổng quan hôm nay',
  'Lịch hẹn',
  'Khách hàng',
  'Báo cáo',
  'Team & nhân sự',
  'Cài đặt',
];

function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test('the sidebar lists the six screens, each with an icon', async ({ page }) => {
  await page.goto('/');

  const links = page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('link');
  await expect(links).toHaveText(SCREENS);
  for (const link of await links.all()) {
    await expect(link.locator('svg')).toHaveCount(1);
  }
});

test('opens on the overview with it selected', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan hôm nay');
  await expect(page.getByRole('link', { name: 'Tổng quan hôm nay' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('clicking each sidebar item switches the screen and marks it current', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });

  for (const name of SCREENS) {
    await nav.getByRole('link', { name }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
    await expect(nav.locator('[aria-current="page"]')).toHaveText([name]);
    await expect(nav.getByRole('link', { name })).toHaveCSS('color', 'rgb(217, 178, 106)');
  }
  expect(errors).toEqual([]);
});

test('reopening the app returns to the last screen', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Báo cáo' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Báo cáo');

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Báo cáo');
  expect(errors).toEqual([]);
});

test('a customer profile keeps Customers selected', async ({ page }) => {
  await page.goto('/#/customers/kh-1');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ khách hàng');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
  await expect(nav.getByRole('link', { name: 'Khách hàng' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('an unknown address falls back to the overview', async ({ page }) => {
  await page.goto('/#/nope');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan hôm nay');
});

test('the scope switch selects one of All / Team / RE', async ({ page }) => {
  await page.goto('/');
  const scope = page.getByRole('radiogroup', { name: 'Góc nhìn' });

  await expect(scope.getByRole('radio', { checked: true })).toHaveText('Toàn bộ');
  await scope.getByRole('radio', { name: 'Team' }).click();
  await expect(scope.getByRole('radio', { checked: true })).toHaveText('Team');
});

test('Team and RE scopes pick the team or RE next to the switch', async ({ page }) => {
  await page.goto('/');
  const scope = page.getByRole('radiogroup', { name: 'Góc nhìn' });
  const team = page.getByRole('combobox', { name: 'Team của góc nhìn' });
  const re = page.getByRole('combobox', { name: 'RE của góc nhìn' });
  await expect(team).toHaveCount(0);

  await scope.getByRole('radio', { name: 'Team' }).click();
  await expect(team.locator('option')).toHaveText(['Bình Minh', 'Hừng Đông', 'Sao Mai']);
  await expect(team).toHaveValue(/.+/);
  await team.selectOption({ label: 'Sao Mai' });
  await expect(team.locator('option:checked')).toHaveText('Sao Mai');
  // Clicking the scope already selected keeps the team picked.
  await scope.getByRole('radio', { name: 'Team' }).click();
  await expect(team.locator('option:checked')).toHaveText('Sao Mai');

  // Only an RE has metrics: the list holds the 30 RE of the simulated data, with their team.
  await scope.getByRole('radio', { name: 'RE' }).click();
  await expect(team).toHaveCount(0);
  await expect(re.locator('option')).toHaveCount(30);
  await expect(re.locator('option').first()).toHaveText(/ · (Bình Minh|Hừng Đông|Sao Mai)$/);
  const secondRe = (await re.locator('option').nth(1).textContent()) ?? '';
  await re.selectOption({ index: 1 });
  await scope.getByRole('radio', { name: 'RE' }).click();
  await expect(re.locator('option:checked')).toHaveText(secondRe);

  await scope.getByRole('radio', { name: 'Toàn bộ' }).click();
  await expect(re).toHaveCount(0);
});
