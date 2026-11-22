import { expect, test, type Page } from './fixtures';
import {
  periodPill,
  pickFirstRm,
  pickPeriodKind,
  pickScope,
  readWorkbook,
  screenSub,
  trackConsoleErrors,
} from './support';

// The e2e build pins today to Tuesday 15/09/2026 (playwright.config.ts): September is in progress.
async function openReports(page: Page) {
  await page.goto('/#/reports');
  return {
    // The line under the name of the screen: the period, the days counted, the scope.
    viewing: screenSub(page),
    summary: page.getByRole('table', { name: 'Tổng hợp' }),
    tables: page.getByRole('radiogroup', { name: 'Bảng báo cáo' }),
  };
}

test('Toàn bộ: Tổng hợp over Theo team, and Theo RM can be chosen', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  const { viewing, summary, tables } = await openReports(page);

  await expect(viewing).toHaveText('Tháng 09/2026 · 01/09 – 15/09/2026 (MTD) · Toàn bộ');
  // A period or scope picked applies at once: no "Lọc" (ADR-0013 appendix 11/11/2026 §5).
  await expect(page.getByRole('button', { name: 'Lọc', exact: true })).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Tổng hợp' })).toContainText('Toàn bộ · 30 RM');
  // The second table has a heading of its own in the list of headings (DR6-187).
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(['Tổng hợp', 'Theo team']);
  await expect(summary.getByRole('rowheader')).toHaveText(['Toàn bộ']);
  await expect(summary.getByRole('columnheader', { name: 'Kết quả · tới hôm nay' })).toBeVisible();
  await expect(summary.getByRole('columnheader', { name: 'Mất cơ hội' })).toBeVisible();
  // Part B after HĐ phát hành; Doanh số is FYP phát hành − FYP hủy (spec Phase 6 §4.4).
  const columns = await summary.getByRole('row').nth(1).getByRole('columnheader').allTextContents();
  expect(columns.slice(columns.indexOf('HĐ phát hành'), columns.indexOf('Tỷ lệ chốt') + 1)).toEqual(
    [
      'HĐ phát hành',
      'HĐ hủy',
      'Tổng số HĐ',
      'FYP phát hành',
      'FYP hủy',
      'Doanh số',
      'Tỷ lệ hủy',
      'Tỷ lệ chốt',
    ],
  );
  const cells = await summary.getByRole('row').nth(2).getByRole('cell').allTextContents();
  const cell = (name: string) => cells[columns.indexOf(name)]!;
  const count = (name: string) => Number(cell(name).replace(/,/g, ''));
  expect(cell('Tỷ lệ hủy')).toMatch(/^[\d.,]+%$/);
  expect(count('Tổng số HĐ')).toBe(count('HĐ phát hành') - count('HĐ hủy'));

  await expect(tables.getByRole('radio')).toHaveText(['Theo team', 'Theo RM', 'Theo mốc']);
  await expect(tables.getByRole('radio', { checked: true })).toHaveText('Theo team');
  const byTeam = page.getByRole('table', { name: 'Theo team' });
  await expect(byTeam.getByRole('rowheader')).toHaveCount(4);
  await expect(byTeam.getByRole('rowheader').last()).toHaveText('Tổng');

  await tables.getByRole('radio', { name: 'Theo RM' }).click();
  const byRm = page.getByRole('table', { name: 'Theo RM' });
  await expect(byRm.getByRole('rowheader')).toHaveCount(31);
  await expect(page.getByRole('region', { name: 'Theo RM' })).toContainText(
    '30 RM · thứ tự theo team rồi tên',
  );
  expect(errors).toEqual([]);
});

test('scrolled sideways, Theo RM keeps the RM name and every figure of Tổng readable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  const { tables } = await openReports(page);
  await tables.getByRole('radio', { name: 'Theo RM' }).click();
  const table = page.getByRole('table', { name: 'Theo RM' });
  await expect(table.getByRole('rowheader')).toHaveCount(31);

  // Scrolled to the far right: the RM name stays at the left edge, and every cell of the first RM
  // row and of Tổng whose middle is right of the RM column is the element seen there, not covered.
  const seen = await table.evaluate((element) => {
    const box = element.parentElement!;
    const rows = [
      element.querySelector('tbody tr')!,
      element.querySelector('tbody tr:last-child')!,
    ];
    const covered: string[] = [];
    for (const row of rows) {
      row.scrollIntoView({ block: 'center' });
      box.scrollLeft = box.scrollWidth;
      const view = box.getBoundingClientRect();
      const rmColumn = rows[0]!.querySelector('th')!.getBoundingClientRect();
      if (rmColumn.left !== view.left) covered.push('RM name moved');
      for (const cell of row.querySelectorAll('td')) {
        const rect = cell.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (x <= rmColumn.right || x >= view.right) continue;
        if (document.elementFromPoint(x, y) !== cell) covered.push(cell.textContent ?? '');
      }
    }
    return { scrolled: box.scrollLeft > 0, covered };
  });
  expect(seen).toEqual({ scrolled: true, covered: [] });
});

test('Team Bình Minh has no Theo team, and Theo RM lists its 10 RM', async ({ page }) => {
  const { viewing, summary, tables } = await openReports(page);

  await pickScope(page, { team: 'Bình Minh' });

  await expect(viewing).toContainText('· Team Bình Minh');
  await expect(summary.getByRole('rowheader')).toHaveText(['Team Bình Minh']);
  await expect(tables.getByRole('radio')).toHaveText(['Theo RM', 'Theo mốc']);
  const byRm = page.getByRole('table', { name: 'Theo RM' });
  await expect(byRm.getByRole('rowheader')).toHaveCount(11);
  await expect(byRm.getByRole('row').filter({ hasText: 'Bình Minh' })).toHaveCount(10);
});

test('RM · Năm: Tổng hợp and Theo mốc of 12 months, the months after today "—"', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  const { viewing, summary, tables } = await openReports(page);

  await pickFirstRm(page);
  await pickPeriodKind(page, 'Năm');

  // NT-TQ-22, NT-BC-09: the year in progress, then its days set off by a dot (mockup 2e).
  await expect(viewing).toHaveText(/^Năm 2026 · 01\/01 – 15\/09\/2026 · RM \S/);
  await expect(summary).toBeVisible();
  await expect(tables.getByRole('radio')).toHaveText(['Theo mốc']);
  await expect(page.getByRole('table')).toHaveCount(2);
  const byMark = page.getByRole('table', { name: 'Theo mốc' });
  await expect(page.getByRole('region', { name: 'Theo mốc' })).toContainText('12 mốc');
  await expect(byMark.getByRole('rowheader')).toHaveText([
    ...Array.from({ length: 8 }, (_, index) => `Tháng ${index + 1}`),
    'Tháng 9 (tới 15/09)',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ]);
  // A month after today: its appointments counted (Dự kiến), the results and KH "—".
  const december = byMark.getByRole('row', { name: /^Tháng 12/ }).getByRole('cell');
  await expect(december.nth(4)).not.toHaveText('—');
  for (let index = 5; index < 22; index += 1) await expect(december.nth(index)).toHaveText('—');
  const august = byMark.getByRole('row', { name: /^Tháng 8/ }).getByRole('cell');
  await expect(august.nth(5)).not.toHaveText('—');
  expect(errors).toEqual([]);
});

test('a new period or scope applies at once: the tables change with no Lọc', async ({ page }) => {
  const { viewing, summary } = await openReports(page);
  const month = await summary.textContent();

  await pickPeriodKind(page, 'Năm');
  await expect(viewing).toContainText('Năm 2026');
  await expect(summary).not.toHaveText(month ?? '');
  const year = await summary.textContent();

  // ‹ on the pill: one period back.
  await periodPill(page).getByRole('button', { name: 'Kỳ trước' }).click();
  await expect(viewing).toHaveText('Năm 2025 · Toàn bộ');
  await expect(summary).not.toHaveText(year ?? '');
  const lastYear = await summary.textContent();

  await pickScope(page, { team: 'Sao Mai' });
  await expect(viewing).toHaveText('Năm 2025 · Team Sao Mai');
  await expect(summary).not.toHaveText(lastYear ?? '');
});

test('Xuất Excel downloads the report of the period and scope viewed, a sheet per table', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);
  await openReports(page);

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất Excel' }).click();
  const file = await download;

  expect(file.suggestedFilename()).toBe('bao-cao_2026-09_toan-bo_2026-09-15.xlsx');
  await expect(page.getByRole('status').filter({ hasText: 'Đã xuất báo cáo' })).toHaveText(
    'Đã xuất báo cáo · 4 sheet: bao-cao_2026-09_toan-bo_2026-09-15.xlsx',
  );

  // The file itself opens, and Theo team holds the rows and counts of the table on screen.
  const workbook = await readWorkbook(file);
  expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual([
    'Tổng hợp',
    'Theo team',
    'Theo RM',
    'Theo mốc',
  ]);
  const sheet = workbook.getWorksheet('Theo team')!;
  expect(sheet.getCell('A1').text).toBe(
    'Báo cáo Theo team · Tháng 09/2026 (MTD 01/09 – 15/09/2026) · Toàn bộ · xuất 15/09/2026',
  );
  const onScreen = page.getByRole('table', { name: 'Theo team' }).getByRole('row');
  const rows = await onScreen.evaluateAll((trs) =>
    trs.slice(2).map((tr) => [...tr.children].map((cell) => cell.textContent ?? '')),
  );
  expect(rows).toHaveLength(4);
  rows.forEach((cells, index) => {
    const row = sheet.getRow(4 + index);
    expect(row.getCell(1).value).toBe(cells[0]);
    // Đã gặp … Chuyển RF, HĐ nộp: counts, written on screen with a thousands dot.
    for (const column of [2, 3, 4, 5, 6, 7, 8]) {
      expect(row.getCell(column).value, `${cells[0]} column ${column}`).toBe(
        Number(cells[column - 1]!.replace(/\./g, '')),
      );
    }
  });
  expect(errors).toEqual([]);
});

test('Xuất Excel exports the period and scope just picked, with no Lọc', async ({ page }) => {
  await openReports(page);
  await pickPeriodKind(page, 'Năm');
  await pickScope(page, { team: 'Bình Minh' });

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất Excel' }).click();
  const file = await download;

  expect(file.suggestedFilename()).toBe('bao-cao_2026_team-binh-minh_2026-09-15.xlsx');
  const workbook = await readWorkbook(file);
  expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual([
    'Tổng hợp',
    'Theo RM',
    'Theo mốc',
  ]);
  const title = workbook.getWorksheet('Tổng hợp')!.getCell('A1').text;
  expect(title).toContain('Năm 2026');
  expect(title).toContain('Team Bình Minh');
});

test('the export line goes once another period or scope is picked', async ({ page }) => {
  await openReports(page);
  const exported = page.getByRole('status').filter({ hasText: 'Đã xuất báo cáo' });

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất Excel' }).click();
  await download;
  await expect(exported).toBeVisible();

  // The numbers on screen are no longer those of the file the line names.
  await pickPeriodKind(page, 'Năm');
  await expect(exported).toHaveCount(0);
  await pickPeriodKind(page, 'Tháng');
  await expect(exported).toBeVisible();

  await pickScope(page, { team: 'Sao Mai' });
  await expect(exported).toHaveCount(0);
});

test('the export line is back with the period and scope it was exported for', async ({ page }) => {
  const { viewing } = await openReports(page);
  const exported = page.getByRole('status').filter({ hasText: 'Đã xuất báo cáo' });

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất Excel' }).click();
  await download;
  await expect(exported).toBeVisible();

  // Year, then back to the month: the same period as the one exported, though made anew.
  await pickPeriodKind(page, 'Năm');
  await expect(exported).toHaveCount(0);
  await pickPeriodKind(page, 'Tháng');
  await expect(viewing).toContainText('Tháng 09/2026');
  await expect(exported).toBeVisible();
});
