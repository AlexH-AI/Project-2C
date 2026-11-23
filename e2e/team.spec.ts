import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from './fixtures';
import { ANCHOR_YEAR } from './anchor';
import {
  asExe,
  pickCustomPeriod,
  pickFirstRm,
  pickPeriodKind,
  pickScope,
  scopePill,
  screenSub,
} from './support';

// The simulated data (spec §7, D8): 3 teams of 1 TL + 10 RM, and a shared IS, BD and BDM.
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
    await expect(teamButton(page, name)).toContainText('TL · 10 RM');
  }
  await expect(page.getByText('3 team · 3 TL · 30 RM · 3 người hỗ trợ')).toBeVisible();

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
  await expect(table.getByRole('cell', { name: 'RM', exact: true })).toHaveCount(10);
  // DR6-100: the column of the "Sửa" buttons has a header for screen readers only, empty on screen
  // as in the mockup: the name is a pixel wide.
  const actions = table.getByRole('columnheader', { name: 'Thao tác' });
  await expect(actions).toHaveCount(1);
  expect((await actions.getByText('Thao tác').boundingBox())?.width).toBeLessThanOrEqual(1);
});

test('the TL sits in the table header with an Edit button (B1)', async ({ page }) => {
  await teamButton(page, 'Sao Mai').click();
  const region = members(page, 'Sao Mai');
  await expect(region.getByRole('heading', { name: 'Team Sao Mai', exact: true })).toBeVisible();
  const edit = region.getByRole('button', { name: /^Sửa / }).first();
  const name = ((await edit.getAttribute('aria-label')) ?? '').replace(/^Sửa /, '');
  await expect(region.getByText(name).first()).toBeVisible();
  await expect(edit.locator('..')).toContainText(/TL.+·\s*Sửa/);
  await edit.click();
  const dialog = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  await expect(dialog.getByRole('textbox', { name: 'Họ tên' })).toHaveValue(name);
  await expect(dialog.getByRole('radio', { name: 'TL', exact: true })).toBeChecked();
});

test('a team without a TL offers "+ Thêm TL", which opens the dialog on TL and that team', async ({
  page,
}) => {
  await createTeam(page, 'Thiên Hà');
  await expect(teamButton(page, 'Thiên Hà')).toContainText('chưa có TL · 0 RM');
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
  await expect(teamButton(page, 'Thiên Hà')).toContainText('chưa có TL · 0 RM');
  // VA3c (components.html 09): empty, the table keeps its headers, over one row holding the note.
  const empty = members(page, 'Thiên Hà').getByRole('table');
  await expect(empty.getByRole('columnheader', { name: 'Họ tên' })).toBeVisible();
  await expect(empty.getByRole('row')).toHaveCount(2);
  await expect(empty.getByRole('row').nth(1)).toContainText('Team chưa có RM.');
  await expect(empty.getByRole('row').nth(1)).toContainText(
    'Bấm "+ Nhân sự" để thêm RM vào team này.',
  );

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
  // Trying again would be refused the same: only the write lock of a data replace says to (S2-2).
  await expect(dialog.getByRole('button', { name: 'Xóa', exact: true })).toBeDisabled();
  await dialog.getByRole('button', { name: 'Đóng', exact: true }).click();
  await expect(teamButton(page, 'Bình Minh')).toBeVisible();
});

test('another team shows its first 100 RM again after "Hiện thêm" (table-more.html, DR6-32)', async ({
  page,
}) => {
  await page.goto('/#/settings');
  const backup = page.getByRole('region', { name: 'Xuất / nhập backup' });
  const download = page.waitForEvent('download');
  await backup.getByRole('button', { name: 'Xuất backup' }).click();
  const file = await download;
  type Row = Record<string, unknown>;
  const data = JSON.parse(await readFile(await file.path(), 'utf8')) as {
    tables: { teams: Row[]; people: Row[] };
  };
  // 101 more RM in two teams: 111 each, over the 100 rows a table shows at first.
  const { teams, people } = data.tables;
  for (const [index, name] of ['Bình Minh', 'Sao Mai'].entries()) {
    const team = teams.find((row) => row.name === name)!;
    const rm = people.find((row) => row.team_id === team.id && row.role === 'RM')!;
    for (let n = 1; n <= 101; n++) {
      const suffix = `${index}-${String(n).padStart(3, '0')}`;
      people.push({ ...rm, id: `E2E-RM-${suffix}`, name: `RM Thêm ${suffix}` });
    }
  }
  await backup.getByLabel('Nhập backup').setInputFiles({
    name: file.suggestedFilename(),
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  const replace = page.getByRole('dialog', { name: 'Thay toàn bộ dữ liệu?' });
  await replace.getByRole('button', { name: 'Thay dữ liệu', exact: true }).click();
  await expect(replace).toBeHidden();

  await page.getByRole('navigation').getByRole('link', { name: 'Team & nhân sự' }).click();
  const rows = (team: string) =>
    members(page, team)
      .getByRole('row')
      .filter({ has: page.getByRole('cell') });
  await teamButton(page, 'Bình Minh').click();
  await expect(rows('Bình Minh')).toHaveCount(100);
  await members(page, 'Bình Minh').getByRole('button', { name: 'Hiện thêm 11 người' }).click();
  await expect(rows('Bình Minh')).toHaveCount(111);

  await teamButton(page, 'Sao Mai').click();
  await expect(rows('Sao Mai')).toHaveCount(100);
  await expect(members(page, 'Sao Mai')).toContainText('Đang hiện 100 / 111 người');
});

async function openPersonDialog(page: Page) {
  await page.getByRole('button', { name: '+ Nhân sự' }).click();
  return page.getByRole('dialog', { name: 'Nhân sự mới' });
}

async function addRm(page: Page, name: string, team: string) {
  const dialog = await openPersonDialog(page);
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(name);
  await dialog.getByRole('radio', { name: 'RM', exact: true }).check();
  await dialog.getByRole('combobox', { name: 'Team' }).selectOption({ label: team });
  await dialog.getByRole('button', { name: 'Thêm' }).click();
  await expect(dialog).toBeHidden();
}

test('adds an RM to a team, renames them, then deletes them', async ({ page }) => {
  await addRm(page, 'Trần Hải Yến', 'Hừng Đông');

  await expect(teamButton(page, 'Hừng Đông')).toHaveAttribute('aria-pressed', 'true');
  await expect(teamButton(page, 'Hừng Đông')).toContainText('TL · 11 RM');
  const table = members(page, 'Hừng Đông').getByRole('table');
  // A new RM: role, then no open customers, no appointments, no policies issued.
  await expect(table.getByRole('row', { name: /Trần Hải Yến/ }).getByRole('cell')).toHaveText([
    /Trần Hải Yến/,
    'RM',
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
  await expect(remove).toContainText('RM · Hừng Đông');
  await remove.getByRole('button', { name: 'Xóa', exact: true }).click();
  await expect(remove).toBeHidden();
  await expect(table.getByRole('row', { name: /Trần Hải Âu/ })).toHaveCount(0);
  await expect(teamButton(page, 'Hừng Đông')).toContainText('TL · 10 RM');
});

// Issue 144: Xóa nhân sự leaves Sửa nhân sự for 9b, and with it what was typed there: asked first.
test('Xóa nhân sự asks first when Sửa nhân sự has changes not saved', async ({ page }) => {
  await addRm(page, 'Trần Hải Yến', 'Hừng Đông');
  const table = members(page, 'Hừng Đông').getByRole('table');
  const edit = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  const name = edit.getByRole('textbox', { name: 'Họ tên' });
  const remove = edit.getByRole('button', { name: 'Xóa nhân sự', exact: true });
  const confirm = page.getByRole('dialog', { name: 'Xóa Trần Hải Yến?' });

  await table.getByRole('button', { name: 'Sửa Trần Hải Yến', exact: true }).click();
  await name.fill('Trần Hải Âu');
  // A double click only asks: going on is a button of its own, in the question (review of PR 841).
  await remove.dblclick();
  await expect(edit.getByRole('alert')).toHaveText(
    'Có thay đổi chưa lưu: Lưu để giữ, hoặc bỏ thay đổi để xóa nhân sự.',
  );
  await expect(confirm).toHaveCount(0);
  await expect(name).toHaveValue('Trần Hải Âu');
  await expect(remove).toBeVisible();

  await edit.getByRole('button', { name: 'Bỏ thay đổi và xóa nhân sự', exact: true }).click();
  await expect(confirm).toBeVisible();
  await confirm.getByRole('button', { name: 'Đóng', exact: true }).click();
  await expect(table.getByRole('row', { name: /Trần Hải Yến/ })).toBeVisible();

  // The team alone changed is a change too (DR6-206): asked first, the team picked kept.
  const team = edit.getByRole('combobox', { name: 'Team' });
  await table.getByRole('button', { name: 'Sửa Trần Hải Yến', exact: true }).click();
  await team.selectOption({ label: 'Sao Mai' });
  await remove.click();
  await expect(edit.getByRole('alert')).toHaveText(
    'Có thay đổi chưa lưu: Lưu để giữ, hoặc bỏ thay đổi để xóa nhân sự.',
  );
  await expect(confirm).toHaveCount(0);
  await expect(team.locator('option:checked')).toHaveText('Sao Mai');

  // Typed back to what is saved, a role and a team there and back with it: nothing to ask. A space
  // at the end of the name is none of a change: saving drops it (CLR6-D10).
  await team.selectOption({ label: 'Hừng Đông' });
  await name.fill('Trần Hải Âu');
  await name.fill('Trần Hải Yến ');
  await edit.getByRole('radio', { name: 'IS', exact: true }).check();
  await edit.getByRole('radio', { name: 'RM', exact: true }).check();
  await remove.click();
  await expect(confirm).toBeVisible();
});

test('refuses an RM without a team, with the reason on the field', async ({ page }) => {
  const dialog = await openPersonDialog(page);
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill('Trần Hải Yến');
  await dialog.getByRole('radio', { name: 'RM', exact: true }).check();
  // The dialog starts on the selected team; clear it.
  const team = dialog.getByRole('combobox', { name: 'Team' });
  await team.selectOption('');
  await dialog.getByRole('button', { name: 'Thêm' }).click();

  await expect(team).toHaveAttribute('aria-invalid', 'true');
  await expect(team).toHaveAccessibleDescription('RM phải thuộc một team.');

  // IS / BD / BDM are shared by every team and need none.
  await dialog.getByRole('radio', { name: 'IS', exact: true }).check();
  await dialog.getByRole('button', { name: 'Thêm' }).click();
  await expect(dialog).toBeHidden();
  const shared = page.getByRole('region', { name: 'Người hỗ trợ' });
  await expect(shared.getByRole('listitem')).toHaveCount(4);
  await expect(shared).toContainText('Trần Hải Yến');
});

test('refuses a second TL in a team and names the current one (B1b)', async ({ page }) => {
  await teamButton(page, 'Sao Mai').click();
  const edit = members(page, 'Sao Mai').getByRole('button', { name: /^Sửa / }).first();
  const lead = ((await edit.getAttribute('aria-label')) ?? '').replace(/^Sửa /, '');

  const dialog = await openPersonDialog(page);
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill('Trần Hải Yến');
  await dialog.getByRole('radio', { name: 'TL', exact: true }).check();
  await dialog.getByRole('combobox', { name: 'Team' }).selectOption({ label: 'Sao Mai' });
  await dialog.getByRole('button', { name: 'Thêm' }).click();

  await expect(dialog.getByRole('alert')).toHaveText(`Team này đã có TL: ${lead}.`);
  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText('Trần Hải Yến')).toHaveCount(0);
  await expect(page.getByText('3 team · 3 TL · 30 RM · 3 người hỗ trợ')).toBeVisible();
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

test('an RM changed to BDM leaves their team; a team picked for them is refused on the field', async ({
  page,
}) => {
  await addRm(page, 'Trần Hải Yến', 'Hừng Đông');
  const table = members(page, 'Hừng Đông').getByRole('table');
  await table.getByRole('button', { name: 'Sửa Trần Hải Yến' }).click();
  const edit = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  const team = edit.getByRole('combobox', { name: 'Team' });
  const own = await team.inputValue();

  await edit.getByRole('radio', { name: 'BDM', exact: true }).check();
  await expect(team).toHaveValue('');
  // Back to RM: their own team returns.
  await edit.getByRole('radio', { name: 'RM', exact: true }).check();
  await expect(team).toHaveValue(own);
  await edit.getByRole('radio', { name: 'BDM', exact: true }).check();
  await team.selectOption({ label: 'Sao Mai' });
  await edit.getByRole('button', { name: 'Lưu' }).click();
  await expect(team).toHaveAttribute('aria-invalid', 'true');
  await expect(team).toHaveAccessibleDescription(
    'IS, BD và BDM không thuộc team nào: bỏ chọn team.',
  );

  await team.selectOption('');
  await edit.getByRole('button', { name: 'Lưu' }).click();
  await expect(edit).toBeHidden();
  await expect(table.getByRole('row', { name: /Trần Hải Yến/ })).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Người hỗ trợ' })).toContainText('Trần Hải Yến');
});

/**
 * How the person gets out of what still points to them (mockup 9b): as an RM; as a reviewer, taken
 * off in Sửa kết quả; as a coordinator, who stays (DR6-80, Q5 a).
 */
const RM_HELP = 'Chuyển KH sang RM khác trước (Sửa hồ sơ KH).';
const REVIEWER_HELP = 'Bỏ nhân sự này khỏi người đánh giá kết quả của các lịch đó (ở Sửa kết quả)';
const COORDINATOR_HELP =
  /người phối hợp của lịch Dời lịch \/ Dự kiến không đổi được — giữ lại thay vì xóa\./i;

test('refuses to delete an RM who still has records, and says how many (9b)', async ({ page }) => {
  await teamButton(page, 'Sao Mai').click();
  const row = members(page, 'Sao Mai')
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: 'RM', exact: true }) })
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
  await expect(alert).toContainText('Chưa xóa được — RM còn dữ liệu');
  await expect(alert).toContainText(/\d+ KH đang phụ trách/);
  await expect(alert).toContainText(/\d+ lịch hẹn, \d+ HĐ ghi cho RM này/);
  await expect(dialog).toContainText(RM_HELP);
  await expect(dialog).not.toContainText(REVIEWER_HELP);
  await expect(dialog).not.toContainText(COORDINATOR_HELP);
  await expect(dialog.getByRole('button', { name: 'Xóa', exact: true })).toBeDisabled();
  await dialog.getByRole('button', { name: 'Đóng', exact: true }).click();
  await expect(members(page, 'Sao Mai').getByRole('row', { name: new RegExp(name) })).toBeVisible();
});

test('refuses to delete the IS who still joins appointments, and says how many (9b)', async ({
  page,
}) => {
  const shared = page.getByRole('region', { name: 'Người hỗ trợ' });
  const is = shared.getByRole('listitem').filter({ hasText: 'IS' });
  const name = (await is.getByRole('button', { name: /^Sửa / }).getAttribute('aria-label'))!.slice(
    'Sửa '.length,
  );
  await is.getByRole('button', { name: /^Sửa / }).click();
  await page
    .getByRole('dialog', { name: 'Sửa nhân sự' })
    .getByRole('button', { name: 'Xóa nhân sự' })
    .click();

  const dialog = page.getByRole('dialog', { name: `Xóa ${name}?` });
  const alert = dialog.getByRole('alert');
  await expect(alert).toContainText('Chưa xóa được — IS còn dữ liệu');
  await expect(alert).toContainText(/[1-9][\d,]* lịch hẹn là người phối hợp/);
  // The way out of an IS, not of an RM (DR6-26); no way to take a coordinator off (DR6-80).
  await expect(dialog).toContainText(COORDINATOR_HELP);
  await expect(dialog).not.toContainText('khỏi người phối hợp');
  await expect(dialog).not.toContainText(RM_HELP);
});

const shared = (page: Page) => page.getByRole('region', { name: 'Người hỗ trợ' });
const detail = (page: Page) => page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });
const goTo = (page: Page, screen: string) =>
  page.getByRole('link', { name: screen, exact: true }).click();

/** Adds an IS or a BD: shared by every team, with no team of their own. */
async function addSupport(page: Page, name: string, role: 'IS' | 'BD') {
  const dialog = await openPersonDialog(page);
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(name);
  await dialog.getByRole('radio', { name: role, exact: true }).check();
  await dialog.getByRole('button', { name: 'Thêm' }).click();
  await expect(dialog).toHaveCount(0);
}

/**
 * A meeting met today, its stage kept, that the IS named `reviewer` reviews, for the first customer
 * matching `customer`. Links keep the data, a reload seeds afresh.
 */
async function meetReviewedBy(page: Page, customer: RegExp | string, reviewer: string) {
  await goTo(page, 'Lịch hẹn');
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const booking = page.getByRole('dialog');
  const query = typeof customer === 'string' ? customer : 'K-';
  await booking.getByRole('textbox', { name: /^Khách hàng/ }).fill(query);
  const match = booking.getByRole('list', { name: 'KH khớp' }).getByRole('button');
  await match.filter({ hasText: customer }).first().click();
  await booking.getByRole('textbox', { name: /^Ngày/ }).fill('15/9');
  await booking.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await booking.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(booking).toHaveCount(0);
  await detail(page).getByRole('button', { name: 'Ghi kết quả' }).click();
  const outcome = page.getByRole('dialog', { name: 'Kết quả cuộc gặp' });
  await outcome.getByRole('radio', { name: /giữ nguyên$/ }).check();
  const reviewers = outcome.getByRole('combobox', { name: /^Người đánh giá/ });
  await reviewers.selectOption({ label: `IS ${reviewer}` });
  await outcome.getByRole('textbox', { name: /^Việc tiếp theo/ }).fill('Gửi bảng minh họa');
  await outcome.getByRole('button', { name: 'Lưu kết quả' }).click();
  await expect(outcome).toHaveCount(0);
}

/** Opens 9b of the person named `name`, from their Sửa button in `where`. */
async function openDelete(page: Page, where: Locator, name: string) {
  await where.getByRole('button', { name: `Sửa ${name}` }).click();
  await page.getByRole('button', { name: 'Xóa nhân sự' }).click();
  return page.getByRole('dialog', { name: `Xóa ${name}?` });
}

test('refuses to delete an IS who only reviews a meeting, and says so (9b, DR6-26)', async ({
  page,
}) => {
  await addSupport(page, 'Lê Thu Hà', 'IS');
  await meetReviewedBy(page, /N3$/, 'Lê Thu Hà');
  await goTo(page, 'Team & nhân sự');

  const dialog = await openDelete(page, shared(page), 'Lê Thu Hà');
  const alert = dialog.getByRole('alert');
  await expect(alert).toContainText('Chưa xóa được — IS còn dữ liệu');
  await expect(alert).toContainText('1 lịch hẹn là người đánh giá kết quả');
  await expect(alert).not.toContainText('người phối hợp');
  await expect(dialog).toContainText(`${REVIEWER_HELP} trước, hoặc giữ lại thay vì xóa.`);
  await expect(dialog).not.toContainText(COORDINATOR_HELP);
  await expect(dialog).not.toContainText(RM_HELP);
  await expect(dialog.getByRole('button', { name: 'Xóa', exact: true })).toBeDisabled();
});

test('an RM and an IS kept only by a customer in the trash: 9b counts it as the delete does and names it (T-250)', async ({
  page,
}) => {
  // A new RM with one customer, met today with a new IS reviewing.
  await addRm(page, 'Phan Thị Mới', 'Sao Mai');
  await addSupport(page, 'Lê Thu Hà', 'IS');
  const customer = 'Khách Trong Thùng';
  await goTo(page, 'Khách hàng');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const create = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await create.getByRole('textbox', { name: 'Họ tên' }).fill(customer);
  const rm = create.getByRole('combobox', { name: 'RM phụ trách' });
  await rm.selectOption({ label: 'Phan Thị Mới · Sao Mai' });
  await create.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(create).toHaveCount(0);
  await meetReviewedBy(page, customer, 'Lê Thu Hà');

  // 5f: the customer goes to the trash; its meeting is only hidden with it.
  await detail(page).getByRole('link', { name: 'Hồ sơ KH →' }).click();
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  await page.getByRole('button', { name: 'Xóa KH…' }).click();
  await page.getByRole('button', { name: 'Xóa KH', exact: true }).click();
  await expect(page).toHaveURL(/#\/customers$/);

  await goTo(page, 'Team & nhân sự');
  await teamButton(page, 'Sao Mai').click();
  let dialog = await openDelete(page, members(page, 'Sao Mai'), 'Phan Thị Mới');
  await expect(dialog.getByRole('alert')).toContainText('1 lịch hẹn, 0 HĐ ghi cho RM này');
  await expect(dialog.getByRole('alert')).not.toContainText('KH đang phụ trách');
  await expect(dialog).toContainText(RM_HELP);
  await expect(dialog).toContainText(
    `Có cả dữ liệu của KH đã xóa: ${customer}. Dọn sạch Thùng rác (Cài đặt → Thùng rác) xóa hẳn dữ liệu đó; khôi phục KH rồi chuyển sang RM khác chỉ chuyển được lịch Dự kiến.`,
  );
  await expect(dialog.getByRole('button', { name: 'Xóa', exact: true })).toBeDisabled();
  await dialog.getByRole('button', { name: 'Đóng', exact: true }).click();

  dialog = await openDelete(page, shared(page), 'Lê Thu Hà');
  await expect(dialog.getByRole('alert')).toContainText('1 lịch hẹn là người đánh giá kết quả');
  await expect(dialog).toContainText(REVIEWER_HELP);
  await expect(dialog).toContainText(
    `Có cả lịch hẹn của KH đã xóa: ${customer}. Dọn sạch Thùng rác (Cài đặt → Thùng rác) xóa hẳn các lịch đó; khôi phục KH thì sửa được lịch đã có kết quả (Sửa kết quả), còn lịch Dự kiến / Dời lịch chỉ dọn sạch mới gỡ.`,
  );
  await expect(dialog.getByRole('button', { name: 'Xóa', exact: true })).toBeDisabled();
  await dialog.getByRole('button', { name: 'Đóng', exact: true }).click();

  // The customer still comes back, its RM live (TR-2).
  await goTo(page, 'Cài đặt');
  await page.getByRole('button', { name: 'Thùng rác', exact: true }).click();
  await page.getByRole('button', { name: `Khôi phục KH ${customer} · N4`, exact: true }).click();
  await page.getByRole('button', { name: 'Khôi phục', exact: true }).click();
  await expect(page.getByRole('status')).toContainText(`Đã khôi phục KH ${customer}`);
});

test('both delete dialogs leave Xóa on when refused while the data is replaced (DR6-33, S2-2)', async ({
  page,
}) => {
  await asExe(page);
  await page.reload();
  // An empty team and a person nothing points to: deleting them waits only for the replace.
  await createTeam(page, 'Tạm Thời');
  await addSupport(page, 'Người Mới', 'BD');

  // A reload of the simulated data held at its backup, the Team screen opened meanwhile.
  await goTo(page, 'Cài đặt');
  await page.evaluate(() => window.exe.holdBackup());
  await page.getByRole('button', { name: 'Nạp lại…' }).click();
  await page.getByRole('textbox', { name: /^Gõ NẠP LẠI/ }).fill('NẠP LẠI');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Đang nạp lại…' })).toBeVisible();
  await page.evaluate(() => (window.location.hash = '#/team'));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Team & nhân sự');

  const tryDelete = async (dialog: Locator) => {
    await dialog.getByRole('button', { name: 'Xóa', exact: true }).click();
    await expect(dialog.getByRole('alert')).toHaveText(
      'Đang thay toàn bộ dữ liệu (Nạp lại / Nhập backup). Thay đổi này chưa được ghi — thử lại khi xong.',
    );
    await expect(dialog.getByRole('button', { name: 'Xóa', exact: true })).toBeEnabled();
    await dialog.getByRole('button', { name: 'Đóng', exact: true }).click();
  };
  await teamButton(page, 'Tạm Thời').click();
  await members(page, 'Tạm Thời').getByRole('button', { name: 'Xóa team' }).click();
  await tryDelete(page.getByRole('dialog', { name: 'Xóa team Tạm Thời?' }));
  await tryDelete(await openDelete(page, shared(page), 'Người Mới'));
  await page.evaluate(() => window.exe.releaseBackup());
});

test('member columns: an RM open customers match the Customers screen', async ({ page }) => {
  await page.goto('/#/customers');
  const team = 'Bình Minh';
  await pickFirstRm(page, team);
  // The pill of the scope names the RM alone.
  const rm = (await scopePill(page).textContent())!;
  const summary = (await page.getByText(/\d+ KH đang mở/).textContent())!;
  const open = /(\d+) KH đang mở/.exec(summary)![1]!;

  await page.goto('/#/team');
  await teamButton(page, team).click();
  const table = members(page, team).getByRole('table');
  // The app counts the year of its own day, pinned in the e2e build.
  await expect(
    table.getByRole('columnheader', { name: new RegExp(`HĐ năm ${ANCHOR_YEAR}`) }),
  ).toBeVisible();
  const row = table.getByRole('row', { name: new RegExp(rm) });
  await expect(row.getByRole('cell').nth(2)).toHaveText(open);
  const [appointments30, issued] = await Promise.all(
    [3, 4].map((index) => row.getByRole('cell').nth(index).textContent()),
  );

  // The other two match Báo cáo for that RM: the 30 days up to today, and the year so far.
  await page.goto('/#/reports');
  // The scope went along from Khách hàng: the same RM, with nothing to apply.
  await expect(scopePill(page)).toHaveText(rm);
  await pickCustomPeriod(page, '17/08/2026', '15/09/2026');
  const viewing = screenSub(page);
  await expect(viewing).toHaveText(`17/08 – 15/09/2026 · RM ${rm}`);
  const totals = page.getByRole('table', { name: 'Tổng hợp' }).getByRole('cell');
  await expect(totals.nth(4)).toHaveText(appointments30!);

  await pickPeriodKind(page, 'Năm');
  await expect(viewing).toContainText(`Năm ${ANCHOR_YEAR}`);
  await expect(totals.nth(8)).toHaveText(issued!);
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

// DR6-116: the button that opened a dialog goes with its change (the person's row leaves, the TL is
// added or deleted, the team is gone); by the keyboard the focus lands on the top of the card the
// change was made in, not on the page, nor on the "Xóa team" of the team shown next.
const cardTop = (card: Locator, name: string) => card.getByRole('heading', { name, exact: true });

/** Enter on a person's Sửa, on Xóa nhân sự, then on Xóa of 9b, which must say yes. */
async function deleteByKeyboard(page: Page, where: Locator, name: string) {
  await where.getByRole('button', { name: `Sửa ${name}` }).press('Enter');
  await page
    .getByRole('dialog', { name: 'Sửa nhân sự' })
    .getByRole('button', { name: 'Xóa nhân sự' })
    .press('Enter');
  const confirm = page.getByRole('dialog', { name: `Xóa ${name}?` });
  await confirm.getByRole('button', { name: 'Xóa', exact: true }).press('Enter');
  await expect(confirm).toBeHidden();
}

test('by the keyboard, deleting a person or changing their role leaves the focus on the card they left (DR6-116)', async ({
  page,
}) => {
  await addRm(page, 'Trần Hải Yến', 'Hừng Đông');
  const card = members(page, 'Hừng Đông');
  const table = card.getByRole('table');

  // 9b of an RM of the table.
  await deleteByKeyboard(page, table, 'Trần Hải Yến');
  await expect(table.getByRole('row', { name: /Trần Hải Yến/ })).toHaveCount(0);
  await expect(cardTop(card, 'Team Hừng Đông')).toBeFocused();

  // 9a: an RM made IS leaves the table, an IS made RM leaves "Người hỗ trợ".
  await addRm(page, 'Lê Thu Hà', 'Hừng Đông');
  await table.getByRole('button', { name: 'Sửa Lê Thu Hà' }).press('Enter');
  const edit = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  await edit.getByRole('radio', { name: 'IS', exact: true }).check();
  await edit.getByRole('button', { name: 'Lưu' }).press('Enter');
  await expect(edit).toBeHidden();
  await expect(table.getByRole('row', { name: /Lê Thu Hà/ })).toHaveCount(0);
  await expect(cardTop(card, 'Team Hừng Đông')).toBeFocused();

  const support = shared(page);
  await support.getByRole('button', { name: 'Sửa Lê Thu Hà' }).press('Enter');
  await edit.getByRole('radio', { name: 'RM', exact: true }).check();
  await edit.getByRole('combobox', { name: 'Team' }).selectOption({ label: 'Hừng Đông' });
  await edit.getByRole('button', { name: 'Lưu' }).press('Enter');
  await expect(edit).toBeHidden();
  await expect(support).not.toContainText('Lê Thu Hà');
  await expect(cardTop(support, 'Người hỗ trợ')).toBeFocused();

  // 9b of a person of "Người hỗ trợ".
  await addSupport(page, 'Phạm Minh Tú', 'BD');
  await deleteByKeyboard(page, support, 'Phạm Minh Tú');
  await expect(support).not.toContainText('Phạm Minh Tú');
  await expect(cardTop(support, 'Người hỗ trợ')).toBeFocused();
});

test('by the keyboard, + Thêm TL and the delete of a TL leave the focus on the top of the team card (DR6-116)', async ({
  page,
}) => {
  await createTeam(page, 'Thiên Hà');
  const card = members(page, 'Thiên Hà');

  await card.getByRole('button', { name: '+ Thêm TL' }).press('Enter');
  const add = page.getByRole('dialog', { name: 'Nhân sự mới' });
  await add.getByRole('textbox', { name: 'Họ tên' }).fill('Đỗ Gia Bảo');
  await add.getByRole('button', { name: 'Thêm' }).press('Enter');
  await expect(add).toBeHidden();
  await expect(card.getByRole('button', { name: '+ Thêm TL' })).toHaveCount(0);
  await expect(cardTop(card, 'Team Thiên Hà')).toBeFocused();

  await deleteByKeyboard(page, card, 'Đỗ Gia Bảo');
  await expect(card).toContainText('chưa có TL');
  await expect(cardTop(card, 'Team Thiên Hà')).toBeFocused();
});

// Review of PR 744: only the top of the card is the team's (its heading, TL, Đổi tên / Xóa team);
// the table of members stays, with the sort picked there and the rows of the people it shows.
test('the member table keeps the sort picked when another team is shown', async ({ page }) => {
  const header = (team: string, name: string) =>
    members(page, team).getByRole('columnheader', { name, exact: true });
  await teamButton(page, 'Bình Minh').click();
  await members(page, 'Bình Minh').getByRole('button', { name: 'KH đang mở', exact: true }).click();
  await expect(header('Bình Minh', 'KH đang mở')).toHaveAttribute('aria-sort', 'ascending');

  await teamButton(page, 'Sao Mai').click();
  await expect(header('Sao Mai', 'KH đang mở')).toHaveAttribute('aria-sort', 'ascending');
  await expect(header('Sao Mai', 'Họ tên')).toHaveAttribute('aria-sort', 'none');
  const rows = members(page, 'Sao Mai')
    .getByRole('row')
    .filter({ has: page.getByRole('cell') });
  await expect(rows).toHaveCount(10);
  const open: number[] = [];
  for (const row of await rows.all()) {
    open.push(Number(await row.getByRole('cell').nth(2).textContent()));
  }
  expect(open).toEqual([...open].sort((a, b) => a - b));

  // Through a team without RM, whose table keeps its headers over the note (VA3c), too.
  await createTeam(page, 'Thiên Hà');
  await expect(members(page, 'Thiên Hà')).toContainText('Team chưa có RM.');
  await expect(header('Thiên Hà', 'KH đang mở')).toHaveAttribute('aria-sort', 'ascending');
  await teamButton(page, 'Hừng Đông').click();
  await expect(header('Hừng Đông', 'KH đang mở')).toHaveAttribute('aria-sort', 'ascending');
});

test('by the keyboard, moving an RM to another team leaves the focus on their Sửa in that team', async ({
  page,
}) => {
  await addRm(page, 'Trần Hải Yến', 'Hừng Đông');
  const editOf = (team: string) =>
    members(page, team).getByRole('button', { name: 'Sửa Trần Hải Yến', exact: true });
  await editOf('Hừng Đông').press('Enter');
  const edit = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  await edit.getByRole('combobox', { name: 'Team' }).selectOption({ label: 'Sao Mai' });
  await edit.getByRole('button', { name: 'Lưu' }).press('Enter');

  await expect(edit).toBeHidden();
  await expect(teamButton(page, 'Sao Mai')).toHaveAttribute('aria-pressed', 'true');
  await expect(editOf('Sao Mai')).toBeFocused();
});

test('by the keyboard, Xóa team leaves the focus on the list of teams, not on the button of the team shown next (DR6-116)', async ({
  page,
}) => {
  await createTeam(page, 'Thiên Hà');
  await members(page, 'Thiên Hà').getByRole('button', { name: 'Xóa team' }).press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Xóa team Thiên Hà?' });
  await dialog.getByRole('button', { name: 'Xóa', exact: true }).press('Enter');
  await expect(dialog).toBeHidden();
  await expect(teamButton(page, 'Thiên Hà')).toHaveCount(0);

  // The first team shows next, with a "Xóa team" of its own: React would keep the deleted team's.
  await expect(cardTop(teamList(page), 'Team')).toBeFocused();
});

// C2a (spec Phase 6 §5; mockup search-rm-team.html #rm, #states): the page of an RM.
const rmList = (page: Page) => page.getByRole('table', { name: 'Khách hàng phụ trách' });
const STATS = ['Doanh số', 'Tổng số HĐ', 'Tỷ lệ hủy', 'Tỷ lệ chốt'];
const statsOf = (page: Page) =>
  Promise.all(STATS.map((name) => page.getByRole('region', { name, exact: true }).textContent()));

test('the name of an RM opens their page; the way back returns to it, then to Team, each as left', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 700 });
  await teamButton(page, 'Sao Mai').click();
  const table = members(page, 'Sao Mai').getByRole('table');
  const byOpen = table.getByRole('columnheader', { name: 'KH đang mở', exact: true });
  await byOpen.getByRole('button').click();
  await expect(byOpen).toHaveAttribute('aria-sort', 'ascending');
  const name = table.getByRole('row').last().getByRole('link');
  const rm = (await name.textContent())!;
  await name.click();

  await expect(page).toHaveURL(/#\/team\/rm\/[^/]+$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(rm);
  await expect(
    page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('link', {
      name: 'Team & nhân sự',
    }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(screenSub(page)).toContainText(/^RM · Team Sao Mai · Tháng \d\d\/\d{4}/);
  for (const stat of STATS) {
    await expect(page.getByRole('region', { name: stat, exact: true })).toBeVisible();
  }
  const list = rmList(page);
  await expect(list.getByRole('columnheader', { name: /^Gặp gần nhất/ })).toHaveAttribute(
    'aria-sort',
    'ascending',
  );
  // Every customer listed is one this RM is in charge of: KH đang mở of the Team table.
  const open = page.getByRole('radio', { name: 'Đang mở' });
  await expect(open).toBeChecked();
  const policies = list.getByRole('columnheader', { name: /^Số HĐ/ });
  await policies.getByRole('button').click();
  await policies.getByRole('button').click();
  await expect(policies).toHaveAttribute('aria-sort', 'descending');

  const customer = list.getByRole('row').nth(12).getByRole('link');
  await customer.scrollIntoViewIfNeeded();
  const [href, scroll] = [await customer.getAttribute('href'), await page.evaluate(() => scrollY)];
  await customer.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ khách hàng');
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await page.getByRole('link', { name: `← ${rm}` }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(rm);
  await expect(policies).toHaveAttribute('aria-sort', 'descending');
  await expect(list.getByRole('row').nth(12).getByRole('link')).toBeFocused();
  await expect(list.getByRole('row').nth(12).getByRole('link')).toHaveAttribute('href', href!);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);

  await page.getByRole('link', { name: '← Team & nhân sự' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Team & nhân sự');
  await expect(teamButton(page, 'Sao Mai')).toHaveAttribute('aria-pressed', 'true');
  await expect(byOpen).toHaveAttribute('aria-sort', 'ascending');
  await expect(table.getByRole('link', { name: rm, exact: true })).toBeFocused();
});

test('Sửa on the row of an RM opens the staff dialog alone, not their page', async ({ page }) => {
  const table = members(page, 'Bình Minh').getByRole('table');
  await table.getByRole('button', { name: /^Sửa / }).first().click();

  const edit = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  await expect(edit).toBeVisible();
  await expect(page).toHaveURL(/#\/team$/);
  await edit.getByRole('button', { name: 'Hủy' }).click();
  await expect(edit).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Team & nhân sự');
});

test('the period of the toolbar gives the four numbers of the RM page at once', async ({
  page,
}) => {
  const table = members(page, 'Bình Minh').getByRole('table');
  await table.getByRole('row').nth(1).getByRole('link').click();
  await expect(rmList(page)).toBeVisible();
  const month = await statsOf(page);

  await pickPeriodKind(page, 'Năm');
  await expect(screenSub(page)).toContainText(`Năm ${ANCHOR_YEAR}`);
  await expect.poll(() => statsOf(page)).not.toEqual(month);
  const net = page.getByRole('region', { name: 'Tổng số HĐ', exact: true });
  await expect(net).toContainText(/\d+ phát hành − \d+ hủy/);
});

test('an RM in charge of no customer yet: the page says so, with a way to add one', async ({
  page,
}) => {
  await addRm(page, 'Trần Hải Yến', 'Hừng Đông');
  await members(page, 'Hừng Đông').getByRole('link', { name: 'Trần Hải Yến' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Trần Hải Yến');
  const list = rmList(page);
  await expect(list.getByRole('columnheader', { name: /^Khách hàng/ })).toBeVisible();
  await expect(list.getByRole('row').nth(1)).toContainText('RM Trần Hải Yến chưa phụ trách KH nào');
  await expect(list.getByRole('row').nth(1)).toContainText(
    'KH hiện ở đây khi hồ sơ KH ghi RM này là RM phụ trách.',
  );
  await list.getByRole('button', { name: '+ Khách hàng' }).click();
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  const assigned = dialog.getByRole('combobox', { name: 'RM phụ trách' });
  await expect(assigned.locator('option:checked')).toContainText('Trần Hải Yến');
});

test('a page of an RM gone goes to Team & nhân sự, as an unknown address does', async ({
  page,
}) => {
  await page.goto('/#/team/rm/nobody');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Team & nhân sự');
  await expect(page).toHaveURL(/#\/team$/);
});

// CLR6-D6: the team shown stays the one shown when a name changes or one is added.
test('renaming the team shown first keeps it shown, on Team and in the scope of Khách hàng', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { name: 'Team Bình Minh' })).toBeVisible();
  const rename = async (from: string, to: string) => {
    await members(page, from).getByRole('button', { name: 'Đổi tên team' }).click();
    const dialog = page.getByRole('dialog', { name: 'Đổi tên team' });
    await dialog.getByRole('textbox', { name: 'Tên team' }).fill(to);
    await dialog.getByRole('button', { name: 'Lưu' }).click();
    await expect(dialog).toBeHidden();
  };
  await rename('Bình Minh', 'Xuân Thu');
  await expect(page.getByRole('heading', { name: 'Team Xuân Thu' })).toBeVisible();
  await expect(teamButton(page, 'Xuân Thu')).toHaveAttribute('aria-pressed', 'true');

  // Every team together on Tổng quan: on Khách hàng the first one, Hừng Đông, then an RM of it.
  await page.getByRole('link', { name: 'Tổng quan' }).click();
  await pickScope(page, 'teams');
  await page.getByRole('link', { name: 'Khách hàng' }).click();
  const strip = page.getByRole('region', { name: 'RM của team Hừng Đông' });
  const chip = strip.getByRole('button').nth(1);
  const rm = (await chip.locator('span').first().textContent())!;
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');

  // Hừng Đông renamed after Ánh Dương, and An Phú added: both now sort before Sao Mai.
  await page.getByRole('link', { name: 'Team & nhân sự' }).click();
  await teamButton(page, 'Hừng Đông').click();
  await rename('Hừng Đông', 'Ánh Dương');
  await createTeam(page, 'An Phú');
  await page.getByRole('link', { name: 'Khách hàng' }).click();
  const kept = page.getByRole('region', { name: 'RM của team Ánh Dương' });
  await expect(kept.getByRole('button', { pressed: true })).toContainText(rm);
});
