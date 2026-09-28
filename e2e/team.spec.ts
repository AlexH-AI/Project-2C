import { expect, test, type Page } from '@playwright/test';

// The simulated data (spec §7, D8): 3 teams of 1 TL + 10 RE, and a shared IS, BD and BDM.
const SEEDED = ['Bình Minh', 'Hừng Đông', 'Sao Mai'];

const teamList = (page: Page) => page.getByRole('region', { name: 'Team', exact: true });
const teamButton = (page: Page, name: string) =>
  teamList(page).getByRole('button', { name: new RegExp(`^${name} \\d`) });
const members = (page: Page, team: string) =>
  page.getByRole('region', { name: `Thành viên team ${team}` });

async function createTeam(page: Page, name: string) {
  await page.getByRole('button', { name: '+ Team' }).click();
  const dialog = page.getByRole('dialog', { name: 'Team mới' });
  await dialog.getByRole('textbox', { name: 'Tên team' }).fill(name);
  await dialog.getByRole('button', { name: 'Tạo team' }).click();
  return dialog;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/#/team');
  await expect(teamList(page).getByRole('button')).toHaveCount(SEEDED.length);
});

test('lists the seeded teams, their members and the shared support staff', async ({ page }) => {
  for (const name of SEEDED) {
    await expect(teamButton(page, name)).toContainText('1 TL · 10 RE');
  }
  await expect(page.getByText('3 team · 33 RE / TL · 3 hỗ trợ dùng chung')).toBeVisible();

  const shared = page.getByRole('region', { name: 'Hỗ trợ dùng chung' });
  await expect(shared.getByRole('listitem')).toHaveCount(3);
  for (const role of ['IS', 'BD', 'BDM']) {
    await expect(shared.getByText(role, { exact: true })).toBeVisible();
  }

  await teamButton(page, 'Sao Mai').click();
  await expect(teamButton(page, 'Sao Mai')).toHaveAttribute('aria-pressed', 'true');
  const table = members(page, 'Sao Mai').getByRole('table');
  await expect(table.getByRole('row')).toHaveCount(1 + 11);
  await expect(table.getByRole('cell', { name: 'TL', exact: true })).toHaveCount(1);
  await expect(table.getByRole('cell', { name: 'RE', exact: true })).toHaveCount(10);
});

test('adds a team, then renames it', async ({ page }) => {
  const dialog = await createTeam(page, 'Thiên Hà');

  await expect(dialog).toBeHidden();
  await expect(teamButton(page, 'Thiên Hà')).toHaveAttribute('aria-pressed', 'true');
  await expect(teamButton(page, 'Thiên Hà')).toContainText('0 TL · 0 RE');
  await expect(members(page, 'Thiên Hà')).toContainText('Team chưa có nhân sự.');

  await members(page, 'Thiên Hà').getByRole('button', { name: 'Đổi tên team' }).click();
  const rename = page.getByRole('dialog', { name: 'Đổi tên team' });
  await expect(rename.getByRole('textbox', { name: 'Tên team' })).toHaveValue('Thiên Hà');
  await rename.getByRole('textbox', { name: 'Tên team' }).fill('Ngân Hà');
  await rename.getByRole('button', { name: 'Lưu' }).click();

  await expect(rename).toBeHidden();
  await expect(teamButton(page, 'Ngân Hà')).toHaveAttribute('aria-pressed', 'true');
  await expect(teamButton(page, 'Thiên Hà')).toHaveCount(0);
});

test('refuses a team name already taken, with the reason on the field', async ({ page }) => {
  const dialog = await createTeam(page, 'Sao Mai');

  const field = dialog.getByRole('textbox', { name: 'Tên team' });
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await expect(field).toHaveAccessibleDescription('Đã có team "Sao Mai".');
  await expect(teamList(page).getByRole('button')).toHaveCount(SEEDED.length);

  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toBeHidden();
});

test('refuses to delete a team that still has people', async ({ page }) => {
  await teamButton(page, 'Bình Minh').click();
  await members(page, 'Bình Minh').getByRole('button', { name: 'Xóa team' }).click();
  const dialog = page.getByRole('dialog', { name: 'Xóa team Bình Minh?' });
  await dialog.getByRole('button', { name: 'Xóa', exact: true }).click();

  await expect(dialog.getByRole('alert')).toHaveText(
    'Team còn nhân sự: chuyển hoặc xóa hết nhân sự trước khi xóa team.',
  );
  await dialog.getByRole('button', { name: 'Đóng' }).click();
  await expect(teamButton(page, 'Bình Minh')).toBeVisible();
});

test('deletes an empty team', async ({ page }) => {
  await createTeam(page, 'Thiên Hà');
  await members(page, 'Thiên Hà').getByRole('button', { name: 'Xóa team' }).click();
  const dialog = page.getByRole('dialog', { name: 'Xóa team Thiên Hà?' });
  await dialog.getByRole('button', { name: 'Xóa', exact: true }).click();

  await expect(dialog).toBeHidden();
  await expect(teamButton(page, 'Thiên Hà')).toHaveCount(0);
  await expect(teamList(page).getByRole('button')).toHaveCount(SEEDED.length);
});
