import { expect, test, type Page } from '@playwright/test';

// The simulated data (spec §7, D8): 3 teams of 1 TL + 10 RE, and a shared IS, BD and BDM.
const SEEDED = ['Bình Minh', 'Hừng Đông', 'Sao Mai'];

const teamList = (page: Page) => page.getByRole('region', { name: 'Team', exact: true });
const teamButton = (page: Page, name: string) =>
  teamList(page).getByRole('button', { name: new RegExp(`^${name} (TL|chưa)`) });
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
    await expect(teamButton(page, name)).toContainText('TL · 10 RE');
  }
  await expect(page.getByText('3 team · 3 TL · 30 RE · 3 người hỗ trợ')).toBeVisible();

  const shared = page.getByRole('region', { name: 'Người hỗ trợ' });
  await expect(shared.getByRole('listitem')).toHaveCount(3);
  for (const role of ['IS', 'BD', 'BDM']) {
    await expect(shared.getByText(role, { exact: true })).toBeVisible();
  }

  await teamButton(page, 'Sao Mai').click();
  await expect(teamButton(page, 'Sao Mai')).toHaveAttribute('aria-pressed', 'true');
  const table = members(page, 'Sao Mai').getByRole('table');
  await expect(table.getByRole('row')).toHaveCount(1 + 10);
  await expect(table.getByRole('cell', { name: 'TL', exact: true })).toHaveCount(0);
  await expect(table.getByRole('cell', { name: 'RE', exact: true })).toHaveCount(10);
});

test('the TL sits in the table header with an Edit button (B1)', async ({ page }) => {
  await teamButton(page, 'Sao Mai').click();
  const region = members(page, 'Sao Mai');
  await expect(region.getByRole('heading', { name: 'Team Sao Mai', exact: true })).toBeVisible();
  const edit = region.getByRole('button', { name: /^Sửa / }).first();
  const name = ((await edit.getAttribute('aria-label')) ?? '').replace(/^Sửa /, '');
  await expect(region.getByText(name).first()).toBeVisible();
  await edit.click();
  const dialog = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  await expect(dialog.getByRole('textbox', { name: 'Họ tên' })).toHaveValue(name);
  await expect(dialog.getByRole('radio', { name: 'TL', exact: true })).toBeChecked();
});

test('a team without a TL offers "+ Thêm TL", which opens the dialog on TL and that team', async ({
  page,
}) => {
  await createTeam(page, 'Thiên Hà');
  await expect(teamButton(page, 'Thiên Hà')).toContainText('chưa có TL · 0 RE');
  const region = members(page, 'Thiên Hà');
  await expect(region).toContainText('chưa có TL');
  await region.getByRole('button', { name: '+ Thêm TL' }).click();
  const dialog = page.getByRole('dialog', { name: 'Nhân sự mới' });
  await expect(dialog.getByRole('radio', { name: 'TL', exact: true })).toBeChecked();
  await expect(dialog.getByRole('combobox', { name: 'Team' }).locator('option:checked')).toHaveText(
    'Thiên Hà',
  );
});

test('names show without initials (Owner, 01/10/2026)', async ({ page }) => {
  // Each row's "Sửa <name>" button gives the full name the name text must equal.
  const nameOf = async (edit: ReturnType<Page['getByRole']>) =>
    ((await edit.getAttribute('aria-label')) ?? '').replace(/^Sửa /, '');

  const rows = members(page, 'Bình Minh')
    .getByRole('row')
    .filter({ has: page.getByRole('cell') });
  await expect(rows).toHaveCount(10);
  for (const row of await rows.all()) {
    const name = await nameOf(row.getByRole('button', { name: /^Sửa / }));
    await expect(row.getByRole('cell').first()).toHaveText(name);
  }

  const shared = page.getByRole('region', { name: 'Người hỗ trợ' }).getByRole('listitem');
  await expect(shared).toHaveCount(3);
  for (const item of await shared.all()) {
    const name = await nameOf(item.getByRole('button', { name: /^Sửa / }));
    await expect(item.locator('span').first()).toHaveText(name);
  }
});

test('adds a team, then renames it', async ({ page }) => {
  const dialog = await createTeam(page, 'Thiên Hà');

  await expect(dialog).toBeHidden();
  await expect(teamButton(page, 'Thiên Hà')).toHaveAttribute('aria-pressed', 'true');
  await expect(teamButton(page, 'Thiên Hà')).toContainText('chưa có TL · 0 RE');
  await expect(members(page, 'Thiên Hà')).toContainText('Team chưa có RE.');

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

async function openPersonDialog(page: Page) {
  await page.getByRole('button', { name: '+ Nhân sự' }).click();
  return page.getByRole('dialog', { name: 'Nhân sự mới' });
}

async function addRe(page: Page, name: string, team: string) {
  const dialog = await openPersonDialog(page);
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(name);
  await dialog.getByRole('radio', { name: 'RE', exact: true }).check();
  await dialog.getByRole('combobox', { name: 'Team' }).selectOption({ label: team });
  await dialog.getByRole('button', { name: 'Thêm' }).click();
  await expect(dialog).toBeHidden();
}

test('adds an RE to a team, renames them, then deletes them', async ({ page }) => {
  await addRe(page, 'Trần Hải Yến', 'Hừng Đông');

  await expect(teamButton(page, 'Hừng Đông')).toHaveAttribute('aria-pressed', 'true');
  await expect(teamButton(page, 'Hừng Đông')).toContainText('TL · 11 RE');
  const table = members(page, 'Hừng Đông').getByRole('table');
  // A new RE: role, then no open customers, no appointments, no policies issued.
  await expect(table.getByRole('row', { name: /Trần Hải Yến/ }).getByRole('cell')).toHaveText([
    /Trần Hải Yến/,
    'RE',
    '0',
    '0',
    '0',
    /Sửa/,
  ]);

  await table.getByRole('button', { name: 'Sửa Trần Hải Yến' }).click();
  const edit = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  await expect(edit.getByRole('textbox', { name: 'Họ tên' })).toHaveValue('Trần Hải Yến');
  await edit.getByRole('textbox', { name: 'Họ tên' }).fill('Trần Hải Âu');
  await edit.getByRole('button', { name: 'Lưu' }).click();
  await expect(edit).toBeHidden();
  await expect(table.getByRole('row', { name: /Trần Hải Âu/ })).toBeVisible();
  await expect(table.getByRole('row', { name: /Trần Hải Yến/ })).toHaveCount(0);

  await table.getByRole('button', { name: 'Sửa Trần Hải Âu' }).click();
  await edit.getByRole('button', { name: 'Xóa nhân sự' }).click();
  const remove = page.getByRole('dialog', { name: 'Xóa Trần Hải Âu?' });
  await expect(remove).toContainText('RE · Hừng Đông');
  await remove.getByRole('button', { name: 'Xóa', exact: true }).click();
  await expect(remove).toBeHidden();
  await expect(table.getByRole('row', { name: /Trần Hải Âu/ })).toHaveCount(0);
  await expect(teamButton(page, 'Hừng Đông')).toContainText('TL · 10 RE');
});

test('refuses an RE without a team, with the reason on the field', async ({ page }) => {
  const dialog = await openPersonDialog(page);
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill('Trần Hải Yến');
  await dialog.getByRole('radio', { name: 'RE', exact: true }).check();
  // The dialog starts on the selected team; clear it.
  const team = dialog.getByRole('combobox', { name: 'Team' });
  await team.selectOption('');
  await dialog.getByRole('button', { name: 'Thêm' }).click();

  await expect(team).toHaveAttribute('aria-invalid', 'true');
  await expect(team).toHaveAccessibleDescription('RE phải thuộc một team.');

  // IS / BD / BDM are shared by every team and need none.
  await dialog.getByRole('radio', { name: 'IS', exact: true }).check();
  await dialog.getByRole('button', { name: 'Thêm' }).click();
  await expect(dialog).toBeHidden();
  const shared = page.getByRole('region', { name: 'Người hỗ trợ' });
  await expect(shared.getByRole('listitem')).toHaveCount(4);
  await expect(shared).toContainText('Trần Hải Yến');
});

test('a new IS / BD / BDM leaves the selected team for the shared support', async ({ page }) => {
  const dialog = await openPersonDialog(page);
  const team = dialog.getByRole('combobox', { name: 'Team' });
  const selected = await team.inputValue();
  expect(selected).not.toBe('');
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill('Lê Thu Hà');
  await dialog.getByRole('radio', { name: 'BD', exact: true }).check();
  await expect(team).toHaveValue('');
  // Back to a role that needs a team: the selected team returns.
  await dialog.getByRole('radio', { name: 'TL', exact: true }).check();
  await expect(team).toHaveValue(selected);
  await dialog.getByRole('radio', { name: 'BD', exact: true }).check();
  await dialog.getByRole('button', { name: 'Thêm' }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByRole('region', { name: 'Người hỗ trợ' })).toContainText('Lê Thu Hà');
});

test('refuses to delete an RE who still has records, and says how many (9b)', async ({ page }) => {
  await teamButton(page, 'Sao Mai').click();
  const row = members(page, 'Sao Mai')
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: 'RE', exact: true }) })
    .first();
  const name = (await row.getByRole('button', { name: /^Sửa / }).getAttribute('aria-label'))!.slice(
    'Sửa '.length,
  );
  await row.getByRole('button', { name: /^Sửa / }).click();
  await page
    .getByRole('dialog', { name: 'Sửa nhân sự' })
    .getByRole('button', { name: 'Xóa nhân sự' })
    .click();

  const dialog = page.getByRole('dialog', { name: `Xóa ${name}?` });
  const alert = dialog.getByRole('alert');
  await expect(alert).toContainText('Chưa xóa được — RE còn dữ liệu');
  await expect(alert).toContainText(/\d+ KH đang phụ trách/);
  await expect(alert).toContainText(/\d+ lịch hẹn, \d+ HĐ ghi cho RE này/);
  await expect(dialog.getByRole('button', { name: 'Xóa', exact: true })).toBeDisabled();
  await dialog.getByRole('button', { name: 'Đóng' }).click();
  await expect(members(page, 'Sao Mai').getByRole('row', { name: new RegExp(name) })).toBeVisible();
});

test('member columns: an RE open customers match the Customers screen', async ({ page }) => {
  await page.goto('/#/customers');
  await page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'RE' })
    .click();
  // The picker shows "<RE> · <team>".
  const [re, team] = (await page
    .getByRole('combobox', { name: 'RE của góc nhìn' })
    .locator('option:checked')
    .textContent())!.split(' · ') as [string, string];
  const summary = (await page.getByText(/\d+ KH đang mở/).textContent())!;
  const open = /(\d+) KH đang mở/.exec(summary)![1]!;

  await page.goto('/#/team');
  await teamButton(page, team).click();
  const table = members(page, team).getByRole('table');
  // The app counts the year of the machine clock.
  const year = new Date().getFullYear();
  await expect(
    table.getByRole('columnheader', { name: new RegExp(`HĐ năm ${year}`) }),
  ).toBeVisible();
  const row = table.getByRole('row', { name: new RegExp(re) });
  await expect(row.getByRole('cell').nth(2)).toHaveText(open);
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
