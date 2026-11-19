import { expect, test, type Page } from './fixtures';
import {
  periodLayer,
  periodName,
  periodPill,
  pickCustomPeriod,
  pickFirstRm,
  pickScope,
  scopeMenu,
  scopePill,
  screenSub,
  trackConsoleErrors,
} from './support';

// The e2e build pins today to Tuesday 15/09/2026 (playwright.config.ts): September is in progress.
async function openOverview(page: Page) {
  await page.goto('/#/overview');
  return {
    // The line under the name of the screen: the period, the days counted, the scope.
    viewing: screenSub(page),
    kpis: page.getByRole('region', { name: 'Chỉ số của kỳ' }),
  };
}

test('opens on the current month to date with the appointments tile and six KPI', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  const { viewing, kpis } = await openOverview(page);

  await expect(periodName(page)).toHaveText('Tháng 09/2026');
  await expect(viewing).toHaveText('Tháng 09/2026 · 01/09 – 15/09/2026 (MTD) · Toàn bộ');
  await expect(scopePill(page)).toHaveText('Toàn bộ');
  // A period or scope picked applies at once: no "Lọc" (ADR-0013 appendix 11/11/2026 §5).
  await expect(page.getByRole('button', { name: 'Lọc', exact: true })).toHaveCount(0);
  // The six KPI have a heading of their own, beside the tile "Lịch hẹn" and not under it, as on
  // the screen (DR6-187): each is a level 3 under "Chỉ số của kỳ".
  await expect(kpis.getByRole('heading', { level: 3 })).toHaveCount(6);
  expect(
    await page
      .locator('main')
      .getByRole('heading')
      .evaluateAll((headings) =>
        headings.slice(0, 3).map((heading) => `${heading.tagName} ${heading.textContent}`),
      ),
  ).toEqual(['H2 Lịch hẹn · cả tháng', 'H2 Chỉ số của kỳ', 'H3 Chuyển RF']);
  await expect(page.getByRole('region', { name: 'Lịch hẹn · cả tháng' })).toContainText(
    'đã gặp / tổng lịch',
  );
  await expect(kpis.getByRole('region')).toHaveCount(6);
  await expect(kpis.getByRole('region', { name: 'Chuyển RF' })).toContainText(
    'so với 01/08 – 15/08',
  );
  await expect(kpis.getByRole('region', { name: 'Tỉ lệ chốt' })).toContainText(
    /\d+ HĐ phát hành ÷ \d+ RF/,
  );
  // ▲ reads in the ok colour and ▼ in the danger colour (mockup 1a).
  const tones = await kpis.evaluate((section) => {
    const colour = (token: string) => {
      const probe = document.createElement('i');
      probe.style.color = `var(${token})`;
      section.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    const tone = { '▲': colour('--ok'), '▼': colour('--danger') };
    return [...section.querySelectorAll('span')]
      .filter((span) => /^[▲▼]/.test(span.textContent ?? ''))
      .map((span) => getComputedStyle(span).color === tone[span.textContent![0] as '▲' | '▼']);
  });
  expect(tones.length).toBeGreaterThan(0);
  expect(tones).not.toContain(false);
  // Each group line has its own count: the four add up to the total, met first.
  const tile = await appointmentsTile(page);
  expect(tile.lines.reduce((sum, line) => sum + line, 0)).toBe(tile.total);
  expect(tile.lines[0]).toBe(tile.met);
  expect(errors).toEqual([]);
});

/** The appointments tile of the month: "met / total" and the count of each of its four lines. */
async function appointmentsTile(page: Page) {
  const tile = page.getByRole('region', { name: 'Lịch hẹn · cả tháng' });
  await expect(tile.getByRole('listitem')).toHaveCount(4);
  const count = (text: string) => Number(text.replace(/\./g, ''));
  const [met, total] = ((await tile.getByRole('paragraph').first().textContent()) ?? '')
    .split('/')
    .map(count);
  const lines = (await tile.getByRole('listitem').locator('b').allTextContents()).map(count);
  return { met: met!, total: total!, lines };
}

test('a new period applies at once: the line under the name and the numbers change', async ({
  page,
}) => {
  const { viewing } = await openOverview(page);
  await expect(page.getByRole('region', { name: 'Lịch hẹn · cả tháng' })).toBeVisible();

  // The name of the period opens the kinds; one picked applies while the layer is still open.
  const layer = await periodLayer(page);
  await expect(layer.getByRole('radio', { checked: true })).toHaveText('Tháng');
  await layer.getByRole('radio', { name: 'Năm' }).click();
  await expect(layer).toBeVisible();
  await expect(periodName(page)).toHaveText('Năm 2026');
  await expect(viewing).toHaveText('Năm 2026 · 01/01 – 15/09/2026 · Toàn bộ');
  await expect(page.getByRole('region', { name: 'Lịch hẹn · cả năm' })).toBeVisible();
  // Esc closes the layer, the focus back on the name of the period.
  await page.keyboard.press('Escape');
  await expect(layer).toBeHidden();
  await expect(periodName(page)).toBeFocused();
  await expect(
    page.getByRole('region', { name: 'Chỉ số của kỳ' }).getByRole('region', { name: 'Chuyển RF' }),
  ).toContainText('so với 01/01 – 15/09/2025');
});

test('‹ › on the pill step one period, and "Hôm nay" comes back to the one of today', async ({
  page,
}) => {
  const { viewing } = await openOverview(page);
  const tile = page.getByRole('region', { name: 'Lịch hẹn · cả tháng' });
  const september = await tile.textContent();

  await periodPill(page).getByRole('button', { name: 'Kỳ trước' }).click();
  await expect(periodName(page)).toHaveText('Tháng 08/2026');
  // A month that ended has no days counted to say.
  await expect(viewing).toHaveText('Tháng 08/2026 · Toàn bộ');
  await expect(tile).not.toHaveText(september ?? '');

  await periodPill(page).getByRole('button', { name: 'Kỳ sau' }).click();
  await periodPill(page).getByRole('button', { name: 'Kỳ sau' }).click();
  await expect(periodName(page)).toHaveText('Tháng 10/2026');

  // "Hôm nay" goes to the month of today and closes the layer.
  const layer = await periodLayer(page);
  await expect(layer).toContainText('Chọn là số cập nhật ngay');
  await layer.getByRole('button', { name: 'Hôm nay' }).click();
  await expect(layer).toBeHidden();
  await expect(viewing).toHaveText('Tháng 09/2026 · 01/09 – 15/09/2026 (MTD) · Toàn bộ');
  await expect(tile).toHaveText(september ?? '');
});

test('a press outside closes the period layer and keeps what was picked', async ({ page }) => {
  const { viewing } = await openOverview(page);

  const layer = await periodLayer(page);
  await layer.getByRole('radio', { name: 'Tuần' }).click();
  // An empty place of the screen, which takes no focus: the focus goes back to the name of the
  // period, not to the page.
  await page.getByRole('main').click({ position: { x: 3, y: 3 } });
  await expect(layer).toBeHidden();
  await expect(viewing).toHaveText('14/09 – 20/09/2026 · Toàn bộ');
  await expect(periodName(page)).toBeFocused();

  // The name of the period closes its own layer too, and has the focus after.
  await periodName(page).click();
  await expect(layer).toBeVisible();
  await periodName(page).click();
  await expect(layer).toBeHidden();
  await expect(periodName(page)).toBeFocused();
});

test('the Team scope has no team to pick and counts every team', async ({ page }) => {
  const { viewing } = await openOverview(page);
  const all = await appointmentsTile(page);

  // "Mọi team" stands for the Team scope; a team opens into its RM alone, with no "Cả team".
  await scopePill(page).click();
  const menu = scopeMenu(page);
  await menu.getByRole('menuitem').first().click();
  await expect(menu.getByRole('menuitemradio', { name: 'Cả team' })).toHaveCount(0);
  await menu.getByRole('menuitemradio', { name: 'Mọi team' }).click();
  await expect(menu).toBeHidden();

  await expect(scopePill(page)).toHaveText('Mọi team');
  await expect(viewing).toContainText('· Mọi team (3 team)');
  expect(await appointmentsTile(page)).toEqual(all);

  await pickFirstRm(page);
  await expect(viewing).toContainText('· RM ');
  expect(await appointmentsTile(page)).not.toEqual(all);
});

test('a period without appointments shows "0 / 0" and "chưa có lịch" in the bar', async ({
  page,
}) => {
  await openOverview(page);

  await pickCustomPeriod(page, '01/01/2000', '10/01/2000');

  const tile = page.getByRole('region', { name: 'Lịch hẹn · cả khoảng' });
  await expect(tile).toContainText('0 / 0');
  await expect(tile).toContainText('chưa có lịch');
});

test('customers by stage: four tiles over the chart, a stage hidden and shown again', async ({
  page,
}) => {
  await openOverview(page);
  const block = page.getByRole('region', { name: 'Khách hàng theo nhóm' });
  const n4 = block.getByRole('button', { name: /^N4/ });

  await expect(block).toContainText('ảnh chụp cuối ngày 15/09/2026 (hôm nay)');
  await expect(block.getByRole('button')).toHaveCount(4);
  await expect(block.getByRole('img', { name: /^Diễn biến khách hàng theo nhóm/ })).toHaveCount(1);

  await pickScope(page, 'teams');
  await expect(block).toContainText('cộng 3 team');
  const charts = block.getByRole('img', { name: /^Diễn biến khách hàng theo nhóm · Team / });
  await expect(charts).toHaveCount(3);
  await expect(charts.locator('svg')).toHaveCount(3);
  // Each team's chart is headed by its last column of the stages shown (mockup 1b).
  const headings = block.getByRole('heading', { name: /^Team / });
  await expect(headings).toHaveText(
    Array(3).fill(/^Team [^·]+N4 [\d,]+ · N3 [\d,]+ · N2 [\d,]+ · N1 [\d,]+$/),
  );
  // Hiding N4 drops its series, not only its colour: fewer parts are drawn.
  const n4Colour = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--n4').trim(),
  );
  const n4Drawn = charts.locator(`svg path[fill="${n4Colour}"]`);
  await expect(n4Drawn).not.toHaveCount(0);
  const drawn = charts.locator('svg path');
  const allDrawn = await drawn.count();

  await n4.click();
  await expect(n4).toHaveAttribute('aria-pressed', 'false');
  await expect(n4).toContainText('đang ẩn');
  await expect(charts.locator('svg')).toHaveCount(3);
  await expect(n4Drawn).toHaveCount(0);
  expect(await drawn.count()).toBeLessThan(allDrawn);
  await expect(headings).toHaveText(Array(3).fill(/^Team [^·]+N3 [\d,]+ · N2 [\d,]+ · N1 [\d,]+$/));

  await n4.click();
  await expect(n4).toHaveAttribute('aria-pressed', 'true');
  await expect(block.getByText('đang ẩn')).toHaveCount(0);
});

test('a period not started yet has "—" in the tiles and says so over the chart', async ({
  page,
}) => {
  await openOverview(page);

  await page.getByRole('button', { name: 'Kỳ sau' }).click();

  const block = page.getByRole('region', { name: 'Khách hàng theo nhóm' });
  const n4 = block.getByRole('button', { name: /^N4/ });
  await expect(n4).toContainText('—');
  await expect(block).toContainText('Kỳ chưa bắt đầu');
  // A stage hidden stays hidden on the next period, so its tile must still turn it back on.
  await n4.click();
  await expect(n4).toHaveAttribute('aria-pressed', 'false');
  await n4.click();
  await expect(n4).toHaveAttribute('aria-pressed', 'true');
});

test('So sánh team: a team opens its RM by name, closes again, and the RM scope has no table', async ({
  page,
}) => {
  await openOverview(page);
  const table = page.getByRole('table', { name: 'So sánh team' });
  const rows = table.getByRole('row');
  const team = table.getByRole('button', { name: 'Bình Minh' });

  await expect(page.getByRole('region', { name: 'So sánh team' })).toContainText(
    '01/09 – 15/09/2026 (MTD)',
  );
  await expect(table.getByRole('button')).toHaveText([/Bình Minh$/, /Hừng Đông$/, /Sao Mai$/]);
  await expect(rows.last()).toContainText('Tổng');
  await expect(rows).toHaveCount(5);
  await expect(team).toHaveAttribute('aria-expanded', 'false');

  await team.click();
  await expect(team).toHaveAttribute('aria-expanded', 'true');
  await expect(rows).toHaveCount(15);
  const rms = (await table.getByRole('rowheader').allInnerTexts()).slice(1, 11);
  expect(rms).toEqual([...rms].sort(new Intl.Collator('vi').compare));

  await team.click();
  await expect(team).toHaveAttribute('aria-expanded', 'false');
  await expect(rows).toHaveCount(5);

  await pickScope(page, 'teams');
  await expect(table).toBeVisible();

  await pickFirstRm(page);
  await expect(page.getByRole('region', { name: 'Khách hàng theo nhóm' })).toBeVisible();
  await expect(table).toHaveCount(0);
});
