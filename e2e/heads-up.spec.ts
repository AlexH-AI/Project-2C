import { maskName } from '../apps/desktop/src/shell/name-mask';
import { expect, test, type Page } from './fixtures';
import {
  addKycNote,
  asExe,
  createKycCustomer,
  discoveryFacts,
  discoveryOutput,
  panelOf,
  pickPeriodKind,
  pickScope,
  pressButton,
  screenSub,
  useOpenCode,
} from './support';

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
  // A press outside on what takes no focus: the focus back on the pill, as from a menu (L231).
  await pill(page).click();
  await expect(panel(page)).toBeFocused();
  const at = (await pill(page).boundingBox())!;
  await page.mouse.click(at.x - 24, at.y + at.height / 2);
  await expect(panel(page)).toBeHidden();
  await expect(pill(page)).toBeFocused();
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
  // Another screen gives the focus to its name; on Lịch hẹn itself it is back on the pill.
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await pill(page).click();
  await todo.click();
  await expect(panel(page)).toBeHidden();
  await expect(pill(page)).toBeFocused();
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
  await page.keyboard.press('Escape');

  // Tổng quan counts every team together, as its pill says: so does "Lưu ý".
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Tổng quan' })
    .click();
  await pickScope(page, 'teams');
  await pill(page).click();
  await expect(panel(page).getByRole('heading', { name: /^Hôm nay/ })).toContainText('Mọi team');
  expect(
    new Set((await rows(page).allTextContents()).map((row) => /· ([^·]+)$/.exec(row)?.[1])),
  ).not.toEqual(new Set(['Sao Mai']));
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
  // The time left whole, the pill clear of the eye after it.
  const timeLeft = pill(page).locator('span').last();
  expect(await timeLeft.evaluate((span) => span.scrollWidth <= span.clientWidth)).toBe(true);
  const eye = await toolbar(page).getByRole('button', { name: 'Che tên khách hàng' }).boundingBox();
  expect(heads!.x + heads!.width).toBeLessThanOrEqual(eye!.x);

  await page.setViewportSize({ width: 1440, height: 900 });
  await toolbar(page).getByRole('button', { name: 'Che tên khách hàng' }).click();
  await expect(pill(page)).toHaveAccessibleName(`Lưu ý: ${time} ${maskName(name!)} · ${left}`);
  await pill(page).click();
  await expect(nextRow(page)).toContainText(maskName(name!));
  await expect(panel(page)).not.toContainText(name!);
});

// ---- Jobs in the background (VA9b-a, mockup #now, #states): Xuất Excel, a backup, an AI analysis ----

interface Files {
  /** `export_write` waits until `release`, as a slow disk would. */
  held: boolean;
  /** `export_write` fails, as a full disk would. */
  fail: boolean;
  release: () => void;
}
declare global {
  interface Window {
    files: Files;
  }
}

/** The exe (`asExe`), its `export_write` held or failed at will (`window.files`). */
async function asExeWithFiles(page: Page) {
  await asExe(page);
  await page.addInitScript(() => {
    const control: Files = { held: false, fail: false, release: () => undefined };
    type Invoke = (command: string, ...rest: unknown[]) => Promise<unknown>;
    const internals = (window as unknown as { __TAURI_INTERNALS__: { invoke: Invoke } })
      .__TAURI_INTERNALS__;
    const invoke = internals.invoke;
    internals.invoke = async (command, ...rest) => {
      if (command === 'export_write' && control.held)
        await new Promise<void>((resolve) => (control.release = resolve));
      if (command === 'export_write' && control.fail)
        throw 'There is not enough space on the disk. (os error 112)';
      return invoke(command, ...rest);
    };
    Object.assign(window, { files: control });
  });
}

const hold = (page: Page) => page.evaluate(() => (window.files.held = true));
const release = (page: Page) =>
  page.evaluate(() => {
    window.files.held = false;
    window.files.release();
  });
const exportButton = (page: Page) => page.getByRole('button', { name: 'Xuất Excel', exact: true });
const jobRows = (page: Page) =>
  panel(page).getByRole('list', { name: 'Việc chạy nền' }).getByRole('listitem');
/** The pill on the next appointment, no job on it. */
const ON_APPOINTMENTS = /^Lưu ý: (\d\d:\d\d |Hết lịch hôm nay|Không có lịch hẹn sắp tới)/;
const SEPTEMBER = 'bao-cao_2026-09_toan-bo_2026-09-15.xlsx';
const holdClock = async (page: Page) =>
  page.clock.pauseAt(new Date((await page.evaluate(() => Date.now())) + 1_000));

test('Xuất Excel runs on the pill, Báo cáo still in use; done, it says so about 3 s, then the next appointment', async ({
  page,
}) => {
  await asExeWithFiles(page);
  await page.goto('/#/reports');
  await expect(pill(page)).toHaveAccessibleName(ON_APPOINTMENTS);
  await hold(page);
  await exportButton(page).click();
  await expect(pill(page)).toHaveAccessibleName('Lưu ý: Đang xuất Excel Báo cáo');
  await expect(pill(page)).toContainText('Đang xuất Excel Báo cáo');
  // Its time is not measured: a bar with no percent.
  await expect(pill(page).getByRole('progressbar', { name: 'Tiến độ' })).toBeVisible();
  await expect(pill(page)).not.toContainText('%');
  // The screen is in use meanwhile.
  await pickPeriodKind(page, 'Năm');
  await expect(screenSub(page)).toContainText('Năm 2026');

  // The clock held from before the file is written: "Đã xuất" stays until 3 s have run.
  await holdClock(page);
  await release(page);
  await expect(pill(page)).toHaveAccessibleName(`Lưu ý: Đã xuất ${SEPTEMBER}`);
  await page.clock.runFor(2_900);
  await expect(pill(page)).toHaveAccessibleName(`Lưu ý: Đã xuất ${SEPTEMBER}`);
  await page.clock.runFor(100);
  await expect(pill(page)).toHaveAccessibleName(ON_APPOINTMENTS);
  // It stays in "Việc chạy nền" of the panel of today.
  await pill(page).click();
  await expect(jobRows(page)).toHaveText([new RegExp(`^Đã xuất ${SEPTEMBER}\\d\\d:\\d\\d$`)]);
});

test('a failed export stays on the pill, red, whatever the period, scope or screen, until a press runs it again (L146)', async ({
  page,
}) => {
  await asExeWithFiles(page);
  await page.goto('/#/reports');
  await page.evaluate(() => (window.files.fail = true));
  await exportButton(page).click();
  const failed = 'Lưu ý: Xuất Excel Báo cáo không xong · bấm để thử lại';
  await expect(pill(page)).toHaveAccessibleName(failed);
  await expect(pill(page)).not.toHaveAttribute('aria-haspopup');
  const [edge, danger] = await pill(page).evaluate((button) => {
    const probe = document.createElement('i');
    probe.style.color = 'var(--danger)';
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return [getComputedStyle(button).outlineColor, color];
  });
  expect(edge).toBe(danger);
  const alert = page.getByRole('alert').filter({ hasText: 'Không xuất được báo cáo' });
  await expect(alert).toBeVisible();

  // Another period, another scope: the failure stays, on the pill and on Báo cáo.
  await pickPeriodKind(page, 'Năm');
  await pickScope(page, { team: 'Sao Mai' });
  await expect(pill(page)).toHaveAccessibleName(failed);
  await expect(alert).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Tổng quan' })
    .click();
  await expect(pill(page)).toHaveAccessibleName(failed);

  // The press runs the same export again: the month of Toàn bộ, as asked.
  await page.evaluate(() => (window.files.fail = false));
  await pressButton(pill(page));
  await expect(pill(page)).toHaveAccessibleName(`Lưu ý: Đã xuất ${SEPTEMBER}`);
  await expect(pill(page)).toBeFocused();
});

test('"Xuất Excel Báo cáo tháng …" while an export runs says so, Báo cáo kept on its period (L234)', async ({
  page,
  browserName,
}) => {
  await asExeWithFiles(page);
  await page.goto('/#/reports');
  await pickPeriodKind(page, 'Năm');
  await hold(page);
  await exportButton(page).click();
  await expect(pill(page)).toHaveAccessibleName('Lưu ý: Đang xuất Excel Báo cáo');

  await page.keyboard.press(browserName === 'webkit' ? 'Meta+k' : 'Control+k');
  const bar = page.getByRole('dialog', { name: 'Ô lệnh' });
  await bar.getByRole('combobox', { name: 'Ô lệnh' }).fill('xuat file');
  await bar.getByRole('option', { name: /^Xuất Excel Báo cáo tháng 09\/2026/ }).click();
  await expect(
    page.getByText('Một lần xuất Excel Báo cáo đang chạy: chạy lại lệnh khi lần đó xong.'),
  ).toBeVisible();
  await expect(screenSub(page)).toContainText('Năm 2026');

  // The export of the year, the one running, goes on.
  await release(page);
  await expect(pill(page)).toHaveAccessibleName(
    'Lưu ý: Đã xuất bao-cao_2026_toan-bo_2026-09-15.xlsx',
  );
  await expect(screenSub(page)).toContainText('Năm 2026');
});

test('an AI analysis and a backup show on the pill and in "Việc chạy nền", the name masked, a narrow window too', async ({
  page,
}) => {
  await asExeWithFiles(page);
  const name = 'Tú Việc Nền';
  await createKycCustomer(page, name);
  await addKycNote(page, name, discoveryFacts);
  await useOpenCode(page);
  await page.evaluate((good) => {
    window.exe.aiContent = good;
    window.exe.holdAi();
  }, discoveryOutput());
  await panelOf(page).getByRole('button', { name: 'Phân tích', exact: true }).click();
  await expect(pill(page)).toHaveAccessibleName(`Lưu ý: Đang phân tích AI ${name}`);

  // Masked, the job names the customer masked; a narrow window keeps the icon and the bar.
  const masked = maskName(name);
  await toolbar(page).getByRole('button', { name: 'Che tên khách hàng' }).click();
  await expect(pill(page)).toHaveAccessibleName(`Lưu ý: Đang phân tích AI ${masked}`);
  await expect(pill(page)).toContainText(masked);
  await page.setViewportSize({ width: 1100, height: 700 });
  await expect(pill(page)).toHaveText('');
  await expect(pill(page).getByRole('progressbar')).toBeVisible();
  const buttons = toolbar(page).getByRole('button');
  const last = (await buttons.last().boundingBox())!;
  expect(last.x + last.width).toBeLessThanOrEqual(1100);
  const heads = (await pill(page).boundingBox())!;
  const eye = (await toolbar(page)
    .getByRole('button', { name: /tên khách hàng$/ })
    .boundingBox())!;
  expect(heads.x + heads.width).toBeLessThanOrEqual(eye.x);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => window.exe.releaseAi());
  await expect(pill(page)).toHaveAccessibleName(`Lưu ý: Đã phân tích AI ${masked}`);

  // A backup of Cài đặt → Dữ liệu, held: on the pill, the analysis under it in the panel.
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Cài đặt' })
    .click();
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'Dữ liệu' })
    .click();
  await hold(page);
  await page
    .getByRole('region', { name: 'Xuất / nhập backup' })
    .getByRole('button', { name: 'Xuất backup' })
    .click();
  await expect(pill(page)).toHaveAccessibleName('Lưu ý: Đang sao lưu');
  await pill(page).click();
  await expect(jobRows(page)).toHaveText([
    'Đang sao lưu',
    new RegExp(`^Đã phân tích AI ${masked.replaceAll('.', '\\.')}\\d\\d:\\d\\d$`),
  ]);
  await release(page);
  await expect(pill(page)).toHaveAccessibleName(/^Lưu ý: Đã sao lưu lúc \d\d:\d\d$/);
  await expect(jobRows(page).first()).toHaveText(/^Đã sao lưu lúc (\d\d:\d\d)\1$/);
});
