import { expect, test, type Locator, type Page } from './fixtures';
import { createKycCustomer, right, scrolls, sideways } from './support';

// DR6-148: a name has no length cap (the commands refuse only an empty one), so a name with no
// space is valid input. Where it shows, it breaks inside its box rather than pushing the page, a
// button or the figures of a table out of the window. The windows of the exe: 1 100 the smallest,
// 1 440 the default.
const WIDTHS = [1100, 1440] as const;

/** A name of `length` letters with no space, from `first`. */
const unbroken = (first: string, length: number) => first + 'x'.repeat(length - 1);

/**
 * Neither the page nor the screen under the top bar scrolls sideways, once the window just made
 * narrower has settled: a chart keeps its width until it is drawn again.
 */
async function expectNoSideways(page: Page, at: string) {
  await expect.poll(() => sideways(page), { message: `page at ${at}` }).toBe(false);
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
    await expectByFirstLine(teamButton, team, teamButton.getByText(/RE$/), `count at ${width}`);
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

test('an RE and a team of 160 letters leave the figures of Báo cáo readable, scrolled to the far right', async ({
  page,
}) => {
  await page.goto('/#/team');
  const team = unbroken('M', 160);
  const re = unbroken('R', 160);
  await renameTeam(page, 'Bình Minh', team);
  const members = page.getByRole('region', { name: `Thành viên team ${team}` });
  await renamePerson(
    page,
    members.getByRole('table').getByRole('button', { name: /^Sửa / }).first(),
    re,
  );
  await page.getByRole('link', { name: 'Báo cáo' }).click();
  const tables = page.getByRole('radiogroup', { name: 'Bảng báo cáo' });

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    for (const [label, name] of [
      ['Theo team', team],
      ['Theo RE', re],
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
  }
});
