import { expect, test, type Page } from '@playwright/test';
import { trackConsoleErrors } from './support';

// The e2e build pins today to Tuesday 15/09/2026 (playwright.config.ts): September is in progress.
async function openOverview(page: Page) {
  await page.goto('/#/overview');
  return {
    kinds: page.getByRole('radiogroup', { name: 'Loại kỳ' }),
    filter: page.getByRole('button', { name: 'Lọc', exact: true }),
    pending: page.getByText('Đã đổi kỳ / góc nhìn — bấm Lọc để cập nhật'),
    viewing: page.locator('p', { hasText: 'Đang xem:' }),
    kpis: page.getByRole('region', { name: 'Chỉ số của kỳ' }),
    scope: page.getByRole('radiogroup', { name: 'Góc nhìn' }),
  };
}

test('opens on the current month to date with the appointments tile and six KPI', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  const { kinds, viewing, kpis, pending } = await openOverview(page);

  await expect(kinds.getByRole('radio', { checked: true })).toHaveText('Tháng');
  await expect(viewing).toHaveText('Đang xem: Tháng 09/2026MTD 01/09 – 15/09/2026 · Toàn bộ');
  await expect(pending).toHaveCount(0);
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

test('a new period waits for Lọc, then "Đang xem" changes', async ({ page }) => {
  const { kinds, filter, pending, viewing } = await openOverview(page);

  await kinds.getByRole('radio', { name: 'Năm' }).click();
  await expect(pending).toBeVisible();
  await expect(viewing).toContainText('Tháng 09/2026');
  await expect(page.getByRole('region', { name: 'Lịch hẹn · cả tháng' })).toBeVisible();

  await filter.click();
  await expect(pending).toHaveCount(0);
  await expect(viewing).toHaveText('Đang xem: Năm 2026 01/01 – 15/09/2026 · Toàn bộ');
  await expect(page.getByRole('region', { name: 'Lịch hẹn · cả năm' })).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Chỉ số của kỳ' }).getByRole('region', { name: 'Chuyển RF' }),
  ).toContainText('so với 01/01 – 15/09/2025');
});

test('choosing the shown period again leaves nothing to apply', async ({ page }) => {
  const { kinds, pending } = await openOverview(page);

  await kinds.getByRole('radio', { name: 'Tuần' }).click();
  await expect(pending).toBeVisible();
  await kinds.getByRole('radio', { name: 'Tháng' }).click();
  await expect(pending).toHaveCount(0);
});

test('the Team scope has no team to pick and counts every team', async ({ page }) => {
  const { scope, filter, pending, viewing } = await openOverview(page);
  const all = await appointmentsTile(page);

  await scope.getByRole('radio', { name: 'Team' }).click();
  await expect(page.getByRole('combobox', { name: 'Team của góc nhìn' })).toHaveCount(0);
  await expect(pending).toBeVisible();

  await filter.click();
  await expect(viewing).toContainText('· Team (3 team)');
  expect(await appointmentsTile(page)).toEqual(all);

  await scope.getByRole('radio', { name: 'RE' }).click();
  await expect(page.getByRole('combobox', { name: 'RE của góc nhìn' })).toBeVisible();
  await filter.click();
  await expect(viewing).toContainText('· RE ');
});

test('a period without appointments shows "0 / 0" and "chưa có lịch" in the bar', async ({
  page,
}) => {
  const { kinds, filter } = await openOverview(page);

  await kinds.getByRole('radio', { name: 'Tùy chọn' }).click();
  const picker = page.getByRole('group', { name: 'Kỳ thống kê' });
  await picker.getByRole('textbox', { name: 'Từ ngày' }).fill('01/01/2000');
  const end = picker.getByRole('textbox', { name: 'Đến ngày' });
  await end.fill('10/01/2000');
  await end.press('Enter');
  await filter.click();

  const tile = page.getByRole('region', { name: 'Lịch hẹn · cả khoảng' });
  await expect(tile).toContainText('0 / 0');
  await expect(tile).toContainText('chưa có lịch');
});

test('customers by stage: four tiles over the chart, a stage hidden and shown again', async ({
  page,
}) => {
  const { scope, filter } = await openOverview(page);
  const block = page.getByRole('region', { name: 'Khách hàng theo nhóm' });
  const n4 = block.getByRole('button', { name: /^N4/ });

  await expect(block).toContainText('ảnh chụp cuối ngày 15/09/2026 (hôm nay)');
  await expect(block.getByRole('button')).toHaveCount(4);
  await expect(block.getByRole('img', { name: /^Diễn biến khách hàng theo nhóm/ })).toHaveCount(1);

  await scope.getByRole('radio', { name: 'Team' }).click();
  await filter.click();
  await expect(block).toContainText('cộng 3 team');
  const charts = block.getByRole('img', { name: /^Diễn biến khách hàng theo nhóm · Team / });
  await expect(charts).toHaveCount(3);
  await expect(charts.locator('svg')).toHaveCount(3);
  // Each team's chart is headed by its last column of the stages shown (mockup 1b).
  const headings = block.getByRole('heading', { name: /^Team / });
  await expect(headings).toHaveText(
    Array(3).fill(/^Team [^·]+N4 [\d.]+ · N3 [\d.]+ · N2 [\d.]+ · N1 [\d.]+$/),
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
  await expect(headings).toHaveText(Array(3).fill(/^Team [^·]+N3 [\d.]+ · N2 [\d.]+ · N1 [\d.]+$/));

  await n4.click();
  await expect(n4).toHaveAttribute('aria-pressed', 'true');
  await expect(block.getByText('đang ẩn')).toHaveCount(0);
});

test('a period not started yet has "—" in the tiles and says so over the chart', async ({
  page,
}) => {
  const { filter } = await openOverview(page);

  await page.getByRole('button', { name: 'Kỳ sau' }).click();
  await filter.click();

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

test('So sánh team: a team opens its RE by name, closes again, and the RE scope has no table', async ({
  page,
}) => {
  const { scope, filter } = await openOverview(page);
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
  const res = (await table.getByRole('rowheader').allInnerTexts()).slice(1, 11);
  expect(res).toEqual([...res].sort(new Intl.Collator('vi').compare));

  await team.click();
  await expect(team).toHaveAttribute('aria-expanded', 'false');
  await expect(rows).toHaveCount(5);

  await scope.getByRole('radio', { name: 'Team' }).click();
  await filter.click();
  await expect(table).toBeVisible();

  await scope.getByRole('radio', { name: 'RE' }).click();
  await filter.click();
  await expect(page.getByRole('region', { name: 'Khách hàng theo nhóm' })).toBeVisible();
  await expect(table).toHaveCount(0);
});
