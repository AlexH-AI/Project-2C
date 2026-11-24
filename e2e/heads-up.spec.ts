import { maskName } from '../apps/desktop/src/shell/name-mask';
import { expect, test, type Page } from './fixtures';
import { pickScope } from './support';

// VA9 (mockup search-rm-team.html #now): "Lưu ý", a pill between the name of the screen and its
// buttons on every screen, with the next appointment of the scope picked and the time left; a
// press opens the panel of today under it.

const toolbar = (page: Page) => page.getByRole('banner');
const pill = (page: Page) => toolbar(page).getByRole('button', { name: /^Lưu ý: / });
const panel = (page: Page) => page.getByRole('dialog', { name: 'Lưu ý' });
const rows = (page: Page) => panel(page).getByRole('listitem');
/** The row of the next appointment: the time left until it in place of a status. */
const nextRow = (page: Page) => rows(page).filter({ hasText: /còn \d|đến giờ/ });

/**
 * 13:00 on the e2e day, the page's clock held there: the morning has passed, the afternoon is
 * still ahead, and the minutes left stay as read.
 */
async function toOnePm(page: Page) {
  await page.clock.fastForward('03:30:00');
  await page.clock.pauseAt(new Date((await page.evaluate(() => Date.now())) + 1_000));
}

test('the pill is on every screen, between the name of the screen and its buttons', async ({
  page,
}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
  for (const screen of [
    'Tổng quan',
    'Lịch hẹn',
    'Khách hàng',
    'Báo cáo',
    'Team & nhân sự',
    'Cài đặt',
  ]) {
    await nav.getByRole('link', { name: screen }).click();
    await expect(toolbar(page).getByRole('heading', { level: 1 })).toHaveText(screen);
    await expect(pill(page)).toBeVisible();
    await expect(pill(page)).toHaveAttribute('aria-expanded', 'false');
  }
});

test('a press opens the panel of today: by time, the next one on gold, Ghi kết quả for one passed', async ({
  page,
}) => {
  await page.goto('/#/customers');
  await toOnePm(page);
  await expect(pill(page)).toHaveAccessibleName(/^Lưu ý: \d\d:\d\d .+ · (còn \d|đến giờ)/);
  await pill(page).click();
  await expect(panel(page)).toBeFocused();
  await expect(panel(page).getByRole('heading', { name: /^Hôm nay/ })).toContainText(
    'Thứ Ba 15/09/2026 · Toàn bộ',
  );
  // By time, those with no time last.
  const times = (await rows(page).allTextContents()).map((row) => row.slice(0, 5));
  const timed = times.filter((time) => /^\d\d:\d\d$/.test(time));
  expect(timed).toEqual([...timed].sort());
  // The next one is the one the pill names, and the only one on gold.
  await expect(nextRow(page)).toHaveCount(1);
  const [, time, name] = /^Lưu ý: (\d\d:\d\d) (.+) · /.exec(
    (await pill(page).getAttribute('aria-label'))!,
  )!;
  await expect(nextRow(page)).toContainText(`${time}${name}`);
  const fills = await rows(page).evaluateAll((items) =>
    items.map((item) => getComputedStyle(item).backgroundColor),
  );
  const clear = 'rgba(0, 0, 0, 0)';
  expect(fills.filter((fill) => fill !== clear)).toHaveLength(1);

  // A session of the morning with no outcome: Ghi kết quả opens 6c; closed, the focus is back.
  const passed = rows(page).filter({ hasText: 'Chưa ghi kết quả' }).first();
  await passed.getByRole('button', { name: 'Ghi kết quả' }).click();
  const outcome = page.getByRole('dialog', { name: 'Kết quả cuộc gặp' });
  await expect(outcome).toBeVisible();
  await expect(panel(page)).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(outcome).toBeHidden();
  await expect(pill(page)).toBeFocused();

  // Esc closes the panel, the focus back on the pill; so does a press outside.
  await pill(page).press('Enter');
  await expect(panel(page)).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(panel(page)).toBeHidden();
  await expect(pill(page)).toBeFocused();
  await pill(page).click();
  await page.getByRole('heading', { level: 1 }).click();
  await expect(panel(page)).toBeHidden();
});

test('"Cần làm" counts the sessions passed with no outcome and leads to Lịch hẹn', async ({
  page,
}) => {
  await page.goto('/#/reports');
  await toOnePm(page);
  await pill(page).click();
  const todo = panel(page).getByRole('button', { name: /^\d+ buổi chưa ghi kết quả$/ });
  await expect(todo).toBeVisible();
  await todo.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lịch hẹn');
  await expect(panel(page)).toBeHidden();
});

test('the pill and its panel follow the scope picked on the toolbar', async ({ page }) => {
  await page.goto('/#/appointments');
  await toOnePm(page);
  await pickScope(page, { team: 'Sao Mai' });
  await pill(page).click();
  await expect(panel(page).getByRole('heading', { name: /^Hôm nay/ })).toContainText(
    'Team Sao Mai',
  );
  // Every row of the panel is of an RM of the team.
  const teams = await rows(page).allTextContents();
  for (const row of teams) expect(row).toContain('Sao Mai');
});

test('a narrow window leaves the name out of the pill; the mask hides it in the pill and the panel', async ({
  page,
}) => {
  await page.goto('/#/reports');
  await toOnePm(page);
  const wide = (await pill(page).getAttribute('aria-label'))!;
  const [, time, name, left] = /^Lưu ý: (\d\d:\d\d) (.+) · (.+)$/.exec(wide)!;
  await expect(pill(page)).toContainText(name!);

  await page.setViewportSize({ width: 1100, height: 700 });
  await expect(pill(page)).toHaveAccessibleName(`Lưu ý: ${time} ${left}`);
  await expect(pill(page)).not.toContainText(name!);
  // Every button of the toolbar of Báo cáo is still in the window, after the pill.
  const buttons = toolbar(page).getByRole('button');
  const last = (await buttons.last().boundingBox())!;
  expect(last.x + last.width).toBeLessThanOrEqual(1100);
  const [title, heads] = await Promise.all([
    toolbar(page).getByRole('heading', { level: 1 }).boundingBox(),
    pill(page).boundingBox(),
  ]);
  expect(heads!.x).toBeGreaterThanOrEqual(title!.x + title!.width);

  await page.setViewportSize({ width: 1440, height: 900 });
  await toolbar(page).getByRole('button', { name: 'Che tên khách hàng' }).click();
  await expect(pill(page)).toHaveAccessibleName(`Lưu ý: ${time} ${maskName(name!)} · ${left}`);
  await pill(page).click();
  await expect(nextRow(page)).toContainText(maskName(name!));
  await expect(panel(page)).not.toContainText(name!);
});
