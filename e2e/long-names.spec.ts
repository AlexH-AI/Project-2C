import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from './fixtures';
import {
  addKycNote,
  asExe,
  createKycCustomer,
  discoveryFacts,
  panelOf,
  pastTheWindow,
  pickScope,
  right,
  scopePill,
  screenSub,
  scrolls,
} from './support';

// DR6-148: a name has no length cap (the commands refuse only an empty one), so a name with no
// space is valid input. Where it shows, it breaks inside its box rather than pushing the page, a
// button or the figures of a table out of the window. The windows of the exe: 1 100 the smallest,
// 1 440 the default.
const WIDTHS = [1100, 1440] as const;

// The two sweeps of many screens and dialogs, each at both widths. On the WebKit of the macOS
// runner, with one worker, the first took 19 to 24 s of the 30 s a test has, and ran out of them in
// a run where the runner was slow (CI run 44167332976).
const LONG_SWEEP = 90_000;

/** A name of `length` letters with no space, from `first`. */
const unbroken = (first: string, length: number) => first + 'x'.repeat(length - 1);

/**
 * Neither the page nor the screen under the top bar scrolls sideways, once the window just made
 * narrower has settled: a chart keeps its width until it is drawn again.
 */
async function expectNoSideways(page: Page, at: string) {
  await expect.poll(() => pastTheWindow(page), { message: `page at ${at}` }).toEqual([]);
  await expect.poll(() => scrolls(page.locator('main')), { message: `main at ${at}` }).toBe(false);
}

/** The top of each line the text `text` takes inside `box`. */
const lineTops = (box: Locator, text: string) =>
  box.evaluate((node, text) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    while (walker.nextNode()) {
      if (walker.currentNode.textContent !== text) continue;
      range.selectNodeContents(walker.currentNode);
      return [...new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)))];
    }
    return [];
  }, text);

const top = (box: Locator) => box.evaluate((node) => node.getBoundingClientRect().top);

/** The width of what `box` holds: its own width, less its padding. */
const contentWidth = (box: Locator) =>
  box.evaluate((node) => {
    const style = getComputedStyle(node);
    return (
      node.getBoundingClientRect().width -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight)
    );
  });

/** `beside` (an arrow, a count) sits by the first of the lines the name `text` takes in `box`. */
async function expectByFirstLine(box: Locator, text: string, beside: Locator, at: string) {
  const tops = await lineTops(box, text);
  expect(tops.length, `lines of the name, ${at}`).toBeGreaterThan(1);
  expect(Math.abs((await top(beside)) - tops[0]!), at).toBeLessThanOrEqual(3);
}

const teamList = (page: Page) => page.getByRole('region', { name: 'Team', exact: true });

/** Team & nhân sự: `from` picked in the list, so it stays shown under its new name. */
async function renameTeam(page: Page, from: string, to: string) {
  await teamList(page)
    .getByRole('button', { name: new RegExp(`^${from} `) })
    .click();
  await page
    .getByRole('region', { name: `Thành viên team ${from}` })
    .getByRole('button', { name: 'Đổi tên team' })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Đổi tên team' });
  await dialog.getByRole('textbox', { name: 'Tên team' }).fill(to);
  await dialog.getByRole('button', { name: 'Lưu' }).click();
  await expect(dialog).toBeHidden();
}

/** Team & nhân sự: the person whose Sửa is `edit` renamed `to`. */
async function renamePerson(page: Page, edit: Locator, to: string) {
  await edit.click();
  const dialog = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(to);
  await dialog.getByRole('button', { name: 'Lưu' }).click();
  await expect(dialog).toBeHidden();
}

test('a customer name of 81 letters breaks inside the title of its dialogs', async ({ page }) => {
  const name = unbroken('D', 81);
  await createKycCustomer(page, name);
  const edit = page.getByRole('dialog', { name: `Sửa hồ sơ · ${name}` });
  const fits = async (dialog: Locator, title: string, width: number) => {
    const heading = dialog.getByRole('heading', { level: 2 }).first();
    await expect(heading).toHaveText(title);
    expect(await scrolls(heading), `${title} at ${width}`).toBe(false);
    expect(await scrolls(dialog), `dialog ${title} at ${width}`).toBe(false);
  };

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    for (const [button, title] of [
      ['Sửa hồ sơ', `Sửa hồ sơ · ${name}`],
      ['Chuyển nhóm', `Chuyển nhóm · ${name}`],
      ['+ Ghi chú KYC', `Ghi chú KYC · ${name}`],
    ] as const) {
      await page.getByRole('button', { name: button, exact: true }).click();
      const dialog = page.getByRole('dialog', { name: title });
      await fits(dialog, title, width);
      await dialog.getByRole('button', { name: 'Hủy' }).click();
      await expect(dialog).toBeHidden();
    }

    // 5f, opened from 5c: Hủy goes back to 5c.
    await page.getByRole('button', { name: 'Sửa hồ sơ', exact: true }).click();
    await edit.getByRole('button', { name: 'Xóa KH…' }).click();
    const remove = page.getByRole('dialog', { name: `Xóa ${name}?` });
    await fits(remove, `Xóa ${name}?`, width);
    await remove.getByRole('button', { name: 'Hủy' }).click();
    await edit.getByRole('button', { name: 'Hủy' }).click();
    await expect(edit).toBeHidden();
  }
});

test('a customer name of 81 letters breaks inside the subtitle of the dialogs of its appointment', async ({
  page,
}) => {
  const name = unbroken('E', 81);
  await createKycCustomer(page, name);
  // Through the sidebar: a page load would open the simulated data again, without the customer.
  await page.getByRole('link', { name: 'Lịch hẹn' }).click();
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const booking = page.getByRole('dialog', { name: 'Lịch hẹn mới' });
  await booking.getByRole('textbox', { name: /^Khách hàng/ }).fill(name);
  await booking
    .getByRole('list', { name: 'KH khớp' })
    .getByRole('button')
    .filter({ hasText: name })
    .click();
  await booking.getByRole('textbox', { name: /^Ngày/ }).fill('16/9');
  await booking.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await booking.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(booking).toBeHidden();
  const detail = page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    for (const [button, title] of [
      ['Ghi kết quả', 'Kết quả cuộc gặp'],
      ['Dời lịch', 'Dời lịch'],
      ['Xóa', /^Xóa lịch hẹn /],
    ] as const) {
      await detail.getByRole('button', { name: button, exact: true }).click();
      const dialog = page.getByRole('dialog', { name: title });
      const subtitle = dialog.getByText(new RegExp(`^${name} · `));
      await expect(subtitle).toBeVisible();
      expect(await scrolls(subtitle), `subtitle of ${button} at ${width}`).toBe(false);
      expect(await scrolls(dialog), `dialog of ${button} at ${width}`).toBe(false);
      await dialog.getByRole('button', { name: 'Hủy' }).click();
      await expect(dialog).toBeHidden();
    }
  }
});

test('a team and an IS of 160 letters keep Team & nhân sự in the window, each button in its card', async ({
  page,
}) => {
  await page.goto('/#/team');
  const team = unbroken('T', 160);
  await renameTeam(page, 'Bình Minh', team);
  const shared = page.getByRole('region', { name: 'Người hỗ trợ' });
  const is = shared
    .getByRole('listitem')
    .filter({ has: page.getByText('IS', { exact: true }) })
    .first();
  await renamePerson(page, is.getByRole('button', { name: /^Sửa / }), unbroken('S', 160));
  await expect(is).toContainText(unbroken('S', 160));

  const card = page.getByRole('region', { name: `Thành viên team ${team}` });
  await expect(card.getByRole('heading', { level: 2 })).toHaveText(`Team ${team}`);
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await expectNoSideways(page, String(width));
    const list = teamList(page);
    expect(await scrolls(list), `team list at ${width}`).toBe(false);
    const teamButton = list.getByRole('button', { name: new RegExp(`^${team}`) });
    expect(await right(teamButton), `team button at ${width}`).toBeLessThanOrEqual(
      await right(list),
    );
    await expectByFirstLine(teamButton, team, teamButton.getByText(/RM$/), `count at ${width}`);
    for (const label of ['Đổi tên team', 'Xóa team']) {
      const button = card.getByRole('button', { name: label });
      expect(await right(button), `${label} at ${width}`).toBeLessThanOrEqual(await right(card));
    }
    // The TL keeps their name on one line beside the long team name, not squeezed letter by letter.
    expect(await lineTops(card, 'Lý Gia Trang'), `TL at ${width}`).toHaveLength(1);
    expect(await scrolls(shared), `shared at ${width}`).toBe(false);
    expect(
      await right(is.getByRole('button', { name: /^Sửa / })),
      `IS Sửa at ${width}`,
    ).toBeLessThanOrEqual(await right(shared));
  }
});

test('a TL of 160 letters keeps Đổi tên team and Xóa team in the card of the team', async ({
  page,
}) => {
  await page.goto('/#/team');
  await teamList(page)
    .getByRole('button', { name: /^Bình Minh / })
    .click();
  const card = page.getByRole('region', { name: 'Thành viên team Bình Minh' });
  const lead = unbroken('L', 160);
  await renamePerson(page, card.getByRole('button', { name: 'Sửa Lý Gia Trang' }), lead);
  await expect(card).toContainText(lead);

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await expectNoSideways(page, String(width));
    expect(await scrolls(card), `card at ${width}`).toBe(false);
    for (const label of ['Đổi tên team', 'Xóa team']) {
      const button = card.getByRole('button', { name: label });
      expect(await right(button), `${label} at ${width}`).toBeLessThanOrEqual(await right(card));
    }
    // The title keeps its line beside the long TL name, not squeezed letter by letter.
    expect(await lineTops(card, 'Team Bình Minh'), `title at ${width}`).toHaveLength(1);
  }
});

test('a team of 160 letters keeps So sánh team of Tổng quan in the window', async ({ page }) => {
  await page.goto('/#/team');
  const team = unbroken('W', 160);
  await renameTeam(page, 'Bình Minh', team);
  // Through the sidebar: a page load would open the simulated data again, without the new name.
  await page.getByRole('link', { name: 'Tổng quan' }).click();
  const region = page.getByRole('region', { name: 'So sánh team' });
  const table = region.getByRole('table');
  await table.getByRole('button', { name: team }).click();
  await expect(table.getByRole('row')).toHaveCount(15);

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await expectNoSideways(page, String(width));
    expect(await right(table), `table at ${width}`).toBeLessThanOrEqual(await right(region));
    const button = table.getByRole('button', { name: team });
    await expectByFirstLine(button, team, button.getByText('▾'), `arrow at ${width}`);
  }
});

test('an RM and a team of 160 letters leave the figures of Báo cáo readable, scrolled to the far right', async ({
  page,
}) => {
  await page.goto('/#/team');
  const team = unbroken('M', 160);
  const rm = unbroken('R', 160);
  await renameTeam(page, 'Bình Minh', team);
  const members = page.getByRole('region', { name: `Thành viên team ${team}` });
  await renamePerson(
    page,
    members.getByRole('table').getByRole('button', { name: /^Sửa / }).first(),
    rm,
  );
  await page.getByRole('link', { name: 'Báo cáo' }).click();
  const tables = page.getByRole('radiogroup', { name: 'Bảng báo cáo' });

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    for (const [label, name] of [
      ['Theo team', team],
      ['Theo RM', rm],
    ] as const) {
      await tables.getByRole('radio', { name: label }).click();
      const table = page.getByRole('table', { name: label });
      await expect(table.getByRole('rowheader', { name, exact: true })).toBeVisible();
      // Scrolled to the far right: the pinned name column takes well under half of the box, and
      // each figure of the row right of it is the element seen there, not covered.
      const seen = await table.evaluate((element, name) => {
        const box = element.parentElement!;
        const row = [...element.querySelectorAll('tbody tr')].find(
          (tr) => tr.querySelector('th')?.textContent === name,
        )!;
        row.scrollIntoView({ block: 'center' });
        box.scrollLeft = box.scrollWidth;
        const view = box.getBoundingClientRect();
        const pinned = row.querySelector('th')!.getBoundingClientRect();
        const figures: string[] = [];
        const covered: string[] = [];
        for (const cell of row.querySelectorAll('td')) {
          const rect = cell.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          if (x <= pinned.right || x >= view.right) continue;
          (document.elementFromPoint(x, y) === cell ? figures : covered).push(
            cell.textContent ?? '',
          );
        }
        return {
          narrow: pinned.right - view.left <= view.width * 0.4,
          figures: figures.length,
          covered,
        };
      }, name);
      expect(seen, `${label} at ${width}`).toEqual({
        narrow: true,
        figures: expect.any(Number),
        covered: [],
      });
      expect(seen.figures, `${label} at ${width}`).toBeGreaterThanOrEqual(8);
    }
    // The Team column of Theo RM, not pinned, breaks the long team name at the cap of a name too
    // (DR6-174 c).
    const teamCell = page
      .getByRole('table', { name: 'Theo RM' })
      .getByRole('cell', { name: team, exact: true })
      .first();
    expect(await contentWidth(teamCell), `Team of Theo RM at ${width}`).toBeLessThanOrEqual(240);
  }
});

/** The scopes of the top bar: everyone, the team of 160 letters, its RM of 160 letters. */
type ScopeKind = 'Toàn bộ' | 'Team' | 'RM';

/** Opens `screen` from the sidebar: a page load would open the simulated data again. */
const open = (page: Page, screen: string) =>
  page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: screen, exact: true })
    .click();

const settingsSection = (page: Page, section: string) =>
  page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: section })
    .click();

/** At each width of the exe, neither the page nor the screen scrolls sideways. */
async function sweep(page: Page, at: string) {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await expectNoSideways(page, `${at} at ${width}`);
  }
}

/** The pill of the scope, a name of 160 letters on it, is cut at its cap (`max-w-60`, and its arrow). */
async function expectCapped(picker: Locator) {
  const { width } = (await picker.boundingBox())!;
  expect(width, 'the cap of a picker').toBeLessThanOrEqual(320);
}

/**
 * A name of 160 letters in a cell of a table (`CELL_NAME`) breaks at the cap of a name, 240 px, so
 * the table keeps its other columns in the window.
 */
async function expectNameCapped(page: Page, name: string, at: string) {
  const box = page.getByRole('table').getByText(name, { exact: true }).first();
  await expect(box, at).toBeVisible();
  const width = await box.evaluate((node) => {
    // The box of the name: the cell's own block, whatever the name is written in (a link, text).
    const block = node.closest('td')!.firstElementChild!;
    return block.getBoundingClientRect().width;
  });
  expect(width, at).toBeLessThanOrEqual(240);
  expect((await lineTops(box, name)).length, `lines of ${at}`).toBeGreaterThan(1);
}

/** Each choice of the radio group `name` (a view, a table) in turn, swept. */
async function sweepEach(page: Page, name: string, at: string) {
  const choices = page.getByRole('radiogroup', { name }).getByRole('radio');
  await expect(choices.first()).toBeVisible();
  for (const choice of await choices.all()) {
    await choice.click();
    await sweep(page, `${at}, ${await choice.textContent()}`);
  }
}

// DR6-170 (Q4 (a), Owner 05/11/2026): a sweep of every main screen with the longest names found
// so far, so a screen added later that lets one push the window sideways fails here.
test('a customer of 81 letters, an RM and a team of 160, a model of 100 push no main screen sideways, in any scope', async ({
  page,
}) => {
  test.setTimeout(LONG_SWEEP);
  const customer = unbroken('K', 81);
  const rm = unbroken('R', 160);
  const team = unbroken('T', 160);
  const model = unbroken('W', 100);
  const lead = unbroken('L', 160);
  const scopes: readonly ScopeKind[] = ['Toàn bộ', 'Team', 'RM'];
  /** The scope `kind` picked in the menu of the toolbar: the whole team, or its RM. */
  const setScope = async (kind: ScopeKind) => {
    if (kind === 'Toàn bộ') return pickScope(page, 'all');
    await pickScope(page, kind === 'Team' ? { team } : { team, rm });
    // Narrower than the name, the pill says it whole under the pointer (and only there: a title
    // kept on it would be read as its description, DR6-187).
    const pill = scopePill(page);
    await expectCapped(pill);
    await pill.hover();
    await expect(pill).toHaveAttribute('title', kind === 'Team' ? `Team ${team}` : rm);
    await page.mouse.move(0, 0);
  };

  // A customer with an analysis by the Mock, which the file below makes one by OpenCode.
  await createKycCustomer(page, customer);
  await addKycNote(page, customer, discoveryFacts);
  const profile = await page.evaluate(() => location.hash);
  await panelOf(page).getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panelOf(page)).toContainText('CURRENT');

  // The customer's RM and their team renamed, the analysis's model one no list has: as in a
  // backup edited by hand, the only way to such a model.
  await open(page, 'Cài đặt');
  await settingsSection(page, 'Dữ liệu');
  const backup = page.getByRole('region', { name: 'Xuất / nhập backup' });
  const download = page.waitForEvent('download');
  await backup.getByRole('button', { name: 'Xuất backup' }).click();
  const file = JSON.parse(await readFile(await (await download).path(), 'utf8')) as {
    tables: Record<string, Record<string, unknown>[]>;
  };
  const rows = (table: string) => file.tables[table]!;
  const ours = rows('customers').find((row) => row.name === customer)!;
  const person = rows('people').find((row) => row.id === ours.rm_id)!;
  rows('teams').find((row) => row.id === person.team_id)!.name = team;
  person.name = rm;
  // Someone who is no RM too: a name of 160 letters among those who coordinate (review of #1360).
  rows('people').find((row) => row.role !== 'RM')!.name = lead;
  Object.assign(
    rows('ai_analyses').find((row) => row.customer_id === ours.id)!,
    {
      provider: 'OPENCODE_GO',
      model,
      reasoning: 'DEFAULT',
    },
  );
  await backup.getByLabel('Nhập backup').setInputFiles({
    name: 'long-names.p2cbackup',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(file)),
  });
  await page
    .getByRole('dialog', { name: 'Thay toàn bộ dữ liệu?' })
    .getByRole('button', { name: 'Thay dữ liệu', exact: true })
    .click();
  await expect(backup.getByRole('status')).toContainText('Đã nhập backup xuất lúc');

  // Lịch hẹn: the list and the detail of an appointment of the customer, in each scope.
  await open(page, 'Lịch hẹn');
  // The filter of who coordinates sits in a box of its own width, narrower than the name picked:
  // the name is cut in the field, and widens neither the page nor the screen. WebKit counts the
  // cut text of a list in the scrolling width of whatever holds it (Mac-7b), so any list held
  // narrower than its choice is swept, not only the capped pickers of the top bar.
  const coordinator = page.getByRole('combobox', { name: 'Phối hợp' });
  const leadChoice = await coordinator.locator('option', { hasText: lead }).textContent();
  await coordinator.selectOption({ label: leadChoice! });
  await expect(coordinator.locator('option:checked')).toHaveText(leadChoice!);
  await sweep(page, 'Lịch hẹn, a coordinator of 160 letters');
  await coordinator.selectOption({ index: 0 });
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const booking = page.getByRole('dialog', { name: 'Lịch hẹn mới' });
  await booking.getByRole('textbox', { name: /^Khách hàng/ }).fill(customer);
  await booking
    .getByRole('list', { name: 'KH khớp' })
    .getByRole('button')
    .filter({ hasText: customer })
    .click();
  await booking.getByRole('textbox', { name: /^Ngày/ }).fill('16/9');
  await booking.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await booking.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(booking).toBeHidden();
  const detail = page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });
  for (const kind of scopes) {
    await setScope(kind);
    await expect(detail).toContainText(`${rm} · ${team}`);
    await sweep(page, `Lịch hẹn, ${kind}`);
  }
  // Into Thùng rác, below: its row there names the customer and the RM.
  await detail.getByRole('button', { name: 'Xóa', exact: true }).click();
  const remove = page.getByRole('dialog', { name: 'Xóa lịch hẹn 16/09/2026?' });
  await remove.getByRole('button', { name: 'Xóa lịch hẹn' }).click();
  await expect(remove).toBeHidden();

  for (const kind of scopes) {
    await open(page, 'Khách hàng');
    await setScope(kind);
    if (kind !== 'Toàn bộ') {
      // The line under the name of the screen: cut short by the name of the team, it is read
      // whole under the pointer, the count of customers at its end too; with an RM picked in the
      // menu it is the count alone, whole in the line, and takes no tooltip.
      const sub = screenSub(page);
      await expect(sub).toHaveText(/KH đang mở · [\d,]+ đã đóng$/);
      await sub.hover();
      await expect(sub).toHaveAttribute(
        'title',
        kind === 'Team' ? /^Cả team T.+ KH đang mở · [\d,]+ đã đóng$/ : '',
      );
      await page.mouse.move(0, 0);
    }
    for (const view of ['Bảng', 'Kanban']) {
      await page
        .getByRole('radiogroup', { name: 'Cách xem' })
        .getByRole('radio', { name: view })
        .click();
      await expect(page.getByRole('link', { name: customer })).toBeVisible();
      await sweep(page, `Khách hàng, ${view}, ${kind}`);
      if (view === 'Bảng') {
        await expectNameCapped(page, customer, `the customer of Khách hàng, ${kind}`);
        await expectNameCapped(page, rm, `the RM of Khách hàng, ${kind}`);
      }
    }
    // Tổng quan and Báo cáo are for the scope picked, at once.
    await open(page, 'Tổng quan');
    await sweep(page, `Tổng quan, ${kind}`);
    await open(page, 'Báo cáo');
    await sweepEach(page, 'Bảng báo cáo', `Báo cáo, ${kind}`);
  }

  await open(page, 'Team & nhân sự');
  await teamList(page)
    .getByRole('button', { name: new RegExp(`^${team}`) })
    .click();
  await expect(page.getByRole('region', { name: `Thành viên team ${team}` })).toContainText(rm);
  await sweep(page, 'Team & nhân sự');
  // "Sửa nhân sự" of the RM: the list Team of the dialog holds the team of 160 letters, cut in the
  // field, which stays in the dialog; the dialog does not scroll sideways for it.
  await page
    .getByRole('region', { name: `Thành viên team ${team}` })
    .getByRole('button', { name: `Sửa ${rm}`, exact: true })
    .click();
  const edit = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  const teamOfPerson = edit.getByRole('combobox', { name: /^Team/ });
  await expect(teamOfPerson.locator('option:checked')).toHaveText(team);
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await expectNoSideways(page, `Sửa nhân sự at ${width}`);
    expect(await scrolls(edit), `Sửa nhân sự at ${width}`).toBe(false);
    expect(await right(teamOfPerson), `Team of Sửa nhân sự at ${width}`).toBeLessThanOrEqual(
      await right(edit),
    );
  }
  await edit.getByRole('button', { name: 'Hủy' }).click();
  await expect(edit).toBeHidden();
  // Into Thùng rác, below: a team of 160 letters, its name the first line of "Bản ghi".
  const gone = unbroken('G', 160);
  await page.getByRole('button', { name: '+ Team' }).click();
  const create = page.getByRole('dialog', { name: 'Team mới' });
  await create.getByRole('textbox', { name: 'Tên team' }).fill(gone);
  await create.getByRole('button', { name: 'Tạo team' }).click();
  await expect(create).toBeHidden();
  await teamList(page)
    .getByRole('button', { name: new RegExp(`^${gone} `) })
    .click();
  await page
    .getByRole('region', { name: `Thành viên team ${gone}` })
    .getByRole('button', { name: 'Xóa team' })
    .click();
  const removeTeam = page.getByRole('dialog', { name: `Xóa team ${gone}?` });
  await removeTeam.getByRole('button', { name: 'Xóa', exact: true }).click();
  await expect(removeTeam).toBeHidden();

  // The profile: its line under the name, Hợp đồng with a policy by the RM, the history of AI.
  await page.evaluate((hash) => (location.hash = hash), profile);
  const policies = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await policies.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  const submit = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await submit.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
  await submit.getByRole('textbox', { name: /^FYP nộp/ }).fill('500tr');
  await submit.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(submit).toBeHidden();
  await expect(policies).toContainText(rm);
  await expect(panelOf(page).getByRole('table', { name: 'Lịch sử phân tích' })).toContainText(
    model,
  );
  await sweep(page, 'hồ sơ');

  // The customer deleted: in Thùng rác, with the appointment and the team deleted above, its name
  // is the first line of "Bản ghi", its RM and team are "Thuộc".
  await page.getByRole('button', { name: 'Sửa hồ sơ', exact: true }).click();
  await page
    .getByRole('dialog', { name: `Sửa hồ sơ · ${customer}` })
    .getByRole('button', { name: 'Xóa KH…' })
    .click();
  await page
    .getByRole('dialog', { name: `Xóa ${customer}?` })
    .getByRole('button', { name: 'Xóa KH' })
    .click();
  await expect(page).toHaveURL(/#\/customers$/);
  await open(page, 'Cài đặt');
  await settingsSection(page, 'Thùng rác');
  const records = page.getByRole('region', { name: 'Thùng rác' }).getByRole('table');
  for (const name of [customer, gone, `RM ${rm}`]) await expect(records).toContainText(name);
  await sweep(page, 'Thùng rác');
});

/**
 * What of `box` ends past its right edge: a word that does not break, a line that does not wrap.
 * A text field or a list keeps what it holds inside its box, a value longer than it scrolled out of
 * sight: it counts by its box, whatever its `overflow` reads (`clip` on Chromium, `visible` on
 * WebKit, where its `scrollWidth` is the width of the whole value).
 */
const sticksOut = (box: Locator) =>
  box.evaluate((node) => {
    const edge = Math.round(node.getBoundingClientRect().right);
    return [...node.querySelectorAll('*')].flatMap((part) => {
      const rect = part.getBoundingClientRect();
      const shows =
        getComputedStyle(part).overflowX === 'visible' && !part.matches('input, textarea, select');
      const end = Math.round(
        shows ? Math.max(rect.right, rect.left + part.scrollWidth) : rect.right,
      );
      if (!part.checkVisibility() || end <= edge) return [];
      const text = (part.textContent ?? '').slice(0, 40);
      return [`${part.tagName.toLowerCase()} "${text}" ends ${end - edge}px past`];
    });
  });

/**
 * How many pixels of the bottom of `box` do not show: a box around it that does not let what it
 * holds show past its bottom edge cuts it there.
 */
const cutBelow = (box: Locator) =>
  box.evaluate((node) => {
    const { bottom } = node.getBoundingClientRect();
    let shown = bottom;
    for (let around = node.parentElement; around; around = around.parentElement) {
      if (getComputedStyle(around).overflowY === 'visible') continue;
      shown = Math.min(shown, around.getBoundingClientRect().bottom);
    }
    return Math.round(bottom - shown);
  });

/**
 * `box`, a dialog or a line said after an action, holds all it says at each width of the exe:
 * nothing of it ends past its edge or scrolls it sideways, and the page stays in the window.
 */
async function expectHolds(page: Page, box: Locator, at: string) {
  await expect(box, at).toBeVisible();
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    expect(await sticksOut(box), `${at} at ${width}`).toEqual([]);
    expect(await scrolls(box), `${at} at ${width}`).toBe(false);
    await expectNoSideways(page, `${at} at ${width}`);
  }
}

// DR6-183 (L16): the sweep above is of each screen at rest. What a screen says after an action,
// the body of a dialog, an error of the AI and the tooltip of a chart break a name with no space
// too: once in what they share (the body of `Dialog`, `ALERT`, the theme of a chart).
test('names of 160 letters, an error of 200, break in the body of a dialog, a line said after an action and a tooltip', async ({
  page,
}) => {
  test.setTimeout(LONG_SWEEP);
  await asExe(page);
  const customer = unbroken('K', 160);
  const rm = unbroken('R', 160);
  const team = unbroken('T', 160);
  await page.goto('/#/team');
  await renameTeam(page, 'Bình Minh', team);
  const members = page.getByRole('region', { name: `Thành viên team ${team}` });
  const editRm = members.getByRole('table').getByRole('button', { name: /^Sửa / }).first();
  await renamePerson(page, editRm, rm);

  // 9c: a second team of that name is refused, in a line of the dialog that names it.
  await page.getByRole('button', { name: '+ Team' }).click();
  const create = page.getByRole('dialog', { name: 'Team mới' });
  await create.getByRole('textbox', { name: 'Tên team' }).fill(team);
  await create.getByRole('button', { name: 'Tạo team' }).click();
  await expect(create).toContainText(`Đã có team "${team}".`);
  await expectHolds(page, create, '9c, a team that exists');
  await create.getByRole('button', { name: 'Hủy' }).click();

  // 9b: "Xóa nhân sự" of an RM who has records is refused, in the body of the dialog.
  await members.getByRole('button', { name: `Sửa ${rm}`, exact: true }).click();
  const edit = page.getByRole('dialog', { name: 'Sửa nhân sự' });
  await edit.getByRole('button', { name: 'Xóa nhân sự' }).click();
  const removeRm = page.getByRole('dialog', { name: `Xóa ${rm}?` });
  await expect(removeRm.getByRole('alert')).toContainText('RM còn dữ liệu');
  await expectHolds(page, removeRm, '9b, refused');
  await removeRm.getByRole('button', { name: 'Đóng', exact: true }).click();
  await expect(removeRm).toBeHidden();

  // A customer of that RM, then an appointment made while the scope is another team: the line
  // said after it names the RM (6a).
  await open(page, 'Khách hàng');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const person = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await person.getByRole('textbox', { name: 'Họ tên' }).fill(customer);
  const rmList = person.getByRole('combobox', { name: 'RM phụ trách' });
  await rmList.selectOption({
    label: (await rmList.locator('option', { hasText: rm }).textContent())!,
  });
  await person.getByRole('textbox', { name: /^Ngày sinh/ }).fill('1984');
  await person.getByRole('radio', { name: 'Nữ' }).check();
  await person.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(person).toBeHidden();
  await open(page, 'Lịch hẹn');
  await pickScope(page, { team: 'Sao Mai' });
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const booking = page.getByRole('dialog', { name: 'Lịch hẹn mới' });
  await booking.getByRole('textbox', { name: /^Khách hàng/ }).fill(customer);
  await booking
    .getByRole('list', { name: 'KH khớp' })
    .getByRole('button')
    .filter({ hasText: customer })
    .click();
  await booking.getByRole('textbox', { name: /^Ngày/ }).fill('16/9');
  await booking.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await booking.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(booking).toBeHidden();
  const outside = page.getByRole('status').filter({ hasText: 'ngoài góc nhìn' });
  await expect(outside).toContainText(`Đã tạo lịch hẹn 16/09/2026 cho ${rm}.`);
  await expectHolds(page, outside, 'the line of an appointment made out of the scope');

  // Tổng quan, the scope Team: the tooltip of the chart of the team names it, inside the chart.
  await open(page, 'Tổng quan');
  const chart = page.getByRole('img', {
    name: `Diễn biến khách hàng theo nhóm · Team ${team}`,
    exact: true,
  });
  await chart.scrollIntoViewIfNeeded();
  await chart.hover();
  const tooltip = chart.locator('div').filter({ hasText: team }).first();
  await expect(tooltip).toBeVisible();
  const [tip, box] = [(await tooltip.boundingBox())!, (await chart.boundingBox())!];
  expect(tip.x, 'the tooltip, left').toBeGreaterThanOrEqual(Math.floor(box.x));
  expect(tip.x + tip.width, 'the tooltip, right').toBeLessThanOrEqual(Math.ceil(box.x + box.width));
  expect(await sticksOut(tooltip), 'what the tooltip holds').toEqual([]);
  // The name takes lines of the width of the chart, so the tooltip is taller than the chart: it
  // shows past the bottom of it, down to its last line (review of PR 1402).
  expect(tip.height, 'a tooltip taller than its chart').toBeGreaterThan(box.height);
  expect(await cutBelow(tooltip), 'the tooltip, cut at the bottom').toBe(0);
  // On WebKit the box of the chart counted a width past the window while the tooltip, and all
  // else in it, sat inside (CI run 44214901028): the chart clips at its sides, so it pushes nothing.
  await expect(chart).toHaveCSS('overflow-x', 'clip');
  await expectNoSideways(page, 'under a tooltip');
  await page.mouse.move(0, 0);

  // The customer deleted, then restored: the dialog that asks (11b) and the line said after (11e).
  await open(page, 'Khách hàng');
  await pickScope(page, 'all');
  await page
    .getByRole('radiogroup', { name: 'Cách xem' })
    .getByRole('radio', { name: 'Bảng' })
    .click();
  await page.getByRole('link', { name: customer }).click();
  await page.getByRole('button', { name: 'Sửa hồ sơ', exact: true }).click();
  await page
    .getByRole('dialog', { name: `Sửa hồ sơ · ${customer}` })
    .getByRole('button', { name: 'Xóa KH…' })
    .click();
  await page
    .getByRole('dialog', { name: `Xóa ${customer}?` })
    .getByRole('button', { name: 'Xóa KH' })
    .click();
  await expect(page).toHaveURL(/#\/customers$/);
  await open(page, 'Cài đặt');
  await settingsSection(page, 'Thùng rác');
  const trash = page.getByRole('region', { name: 'Thùng rác' });
  await trash.getByRole('button', { name: new RegExp(`^Khôi phục KH ${customer}`) }).click();
  const restore = page.getByRole('dialog', { name: `Khôi phục ${customer}?` });
  await expectHolds(page, restore, 'the dialog that restores');
  await restore.getByRole('button', { name: 'Khôi phục', exact: true }).click();
  await expect(restore).toBeHidden();
  const restored = trash.getByRole('status');
  await expect(restored).toContainText(`Đã khôi phục KH ${customer}`);
  await expectHolds(page, restored, '11e, the line of a restore');

  // An error of OpenCode whose message has no space, at Kiểm tra kết nối.
  await settingsSection(page, 'AI');
  await page
    .getByRole('radiogroup', { name: 'Provider' })
    .getByRole('radio', { name: 'OpenCode' })
    .check();
  const message = unbroken('E', 200);
  await page.evaluate(
    (message) => (window.exe.aiError = { code: 'AI_HTTP', httpStatus: 502, message }),
    message,
  );
  const check = page.getByRole('region', { name: 'Kiểm tra kết nối' });
  await check.getByRole('button', { name: 'Kiểm tra kết nối' }).click();
  await expect(check.getByRole('alert')).toContainText(message);
  await expectHolds(page, check, 'the error of Kiểm tra kết nối');

  // The same error at Phân tích, said in the shape of every error with its Thử lại (VA3c): the
  // first line of the shape breaks as its next one does (review of PR 1406).
  await open(page, 'Khách hàng');
  await page.getByRole('link', { name: customer }).click();
  await addKycNote(page, customer, discoveryFacts);
  const panel = panelOf(page);
  await panel.getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText(message);
  await expect(panel.getByRole('alert').getByRole('button', { name: 'Thử lại' })).toBeVisible();
  await expectHolds(page, panel, 'the error of Phân tích');
});
