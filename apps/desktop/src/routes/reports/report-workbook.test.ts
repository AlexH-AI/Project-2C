import ExcelJS from 'exceljs';
import { calendarDate, customPeriod, periodOf } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import {
  buildReportWorkbook,
  exportFailedHelp,
  exportReport,
  reportFileName,
  reportSheetCount,
  reportWorkbookMeta,
  type ReportWorkbookMeta,
} from './report-workbook';
import type { ReportFigures, ReportMarkRow, ReportRow, ReportRows } from './reports-view';

const META: ReportWorkbookMeta = {
  period: 'Tháng 10/2026 (MTD 01/10 – 15/10/2026)',
  scope: 'Toàn bộ',
  exported: '15/10/2026',
};

const FIGURES: ReportFigures = {
  appointments: { met: 22, missed: 3, unrecorded: 1, planned: 4, total: 30 },
  metrics: {
    rfCount: 5,
    submittedCount: 4,
    caseSize: 150_000_000,
    issuedCount: 3,
    revenue: 165_000_000,
    closeRate: { numerator: 3, denominator: 5 },
  },
  stages: { N4: 6, N3: 5, N2: 4, N1: 3, ON_HOLD: 2, LOST: 1 },
};

const row = (name: string, team: string | null = null, figures = FIGURES): ReportRow => ({
  key: name,
  name,
  team,
  ...figures,
});
const table = (rows: readonly ReportRow[]) => ({ rows, total: row('Tổng') });
const mark = (name: string): ReportMarkRow => ({ ...row(name), today: false });

const ALL: ReportRows = {
  summary: row('Toàn bộ'),
  byTeam: table([row('Bình Minh'), row('Sao Mai')]),
  byRe: table([row('Bùi Ngọc Trâm', 'Bình Minh')]),
  byMark: [mark('01–04/10 (T5–CN)'), mark('05–11/10')],
};

async function read(rows: ReportRows, meta = META): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load((await buildReportWorkbook(rows, meta)).buffer);
  return workbook;
}

const sheetNames = (workbook: ExcelJS.Workbook) => workbook.worksheets.map((sheet) => sheet.name);

describe('buildReportWorkbook', () => {
  it('has one sheet per table the scope shows: 4 for Toàn bộ, 3 for a team, 2 for an RE', async () => {
    expect(sheetNames(await read(ALL))).toEqual(['Tổng hợp', 'Theo team', 'Theo RE', 'Theo mốc']);
    expect(sheetNames(await read({ ...ALL, byTeam: null }))).toEqual([
      'Tổng hợp',
      'Theo RE',
      'Theo mốc',
    ]);
    expect(sheetNames(await read({ ...ALL, byTeam: null, byRe: null }))).toEqual([
      'Tổng hợp',
      'Theo mốc',
    ]);
    expect(reportSheetCount(ALL)).toBe(4);
    expect(reportSheetCount({ ...ALL, byTeam: null, byRe: null })).toBe(2);
  });

  it('opens every sheet with the table, the period, the scope and the export day', async () => {
    const workbook = await read(ALL);

    expect(workbook.getWorksheet('Theo team')?.getCell('A1').text).toBe(
      'Báo cáo Theo team · Tháng 10/2026 (MTD 01/10 – 15/10/2026) · Toàn bộ · xuất 15/10/2026',
    );
    expect(workbook.getWorksheet('Tổng hợp')?.getCell('A1').text).toBe(
      'Báo cáo Tổng hợp · Tháng 10/2026 (MTD 01/10 – 15/10/2026) · Toàn bộ · xuất 15/10/2026',
    );
  });

  it('heads the columns as the screen does, money in đồng', async () => {
    const sheet = (await read(ALL)).getWorksheet('Theo team')!;

    expect(['B2', 'G2', 'M2'].map((address) => sheet.getCell(address).text)).toEqual([
      'Lịch hẹn · cả kỳ',
      'Kết quả · tới hôm nay',
      'KH cuối kỳ',
    ]);
    expect(sheet.getCell('L2').master.address).toBe('G2');
    // `values` starts at index 1, as the columns do.
    expect((sheet.getRow(3).values as unknown[]).slice(1)).toEqual([
      'Team',
      'Đã gặp',
      'Dời – hủy – không đến',
      'Chưa ghi kết quả',
      'Dự kiến',
      'Tổng',
      'Chuyển RF',
      'HĐ nộp',
      'Case size (₫)',
      'HĐ phát hành',
      'Doanh số (₫)',
      'Tỉ lệ chốt',
      'N4',
      'N3',
      'N2',
      'N1',
      'Tạm hoãn',
      'Mất cơ hội',
    ]);
    expect(sheet.getRow(4).getCell(1).value).toBe('Bình Minh');
    expect(sheet.getRow(6).getCell(1).value).toBe('Tổng');
    expect(sheet.getRow(6).font?.bold).toBe(true);
    expect(sheet.rowCount).toBe(6);
  });

  it('keeps real numbers: money in đồng, the close rate as a percentage', async () => {
    const sheet = (await read(ALL)).getWorksheet('Theo team')!;
    const cell = (address: string) => sheet.getCell(address);

    expect(cell('B4').value).toBe(22);
    expect(cell('I4').value).toBe(150_000_000);
    expect(cell('I4').numFmt).toBe('#,##0');
    expect(cell('K4').value).toBe(165_000_000);
    expect(cell('K4').numFmt).toBe('#,##0');
    expect(cell('L4').value).toBe(0.6);
    expect(cell('L4').numFmt).toBe('0.0%');
    expect(cell('M4').value).toBe(6);
    expect(cell('R4').value).toBe(1);
  });

  it('leaves the cells of "—" empty: no results or stages yet, no RF for a close rate', async () => {
    const before = { ...FIGURES, metrics: null, stages: null };
    const noRf = { ...FIGURES, metrics: { ...FIGURES.metrics!, rfCount: 0, closeRate: null } };
    const sheet = (
      await read({ ...ALL, byTeam: table([row('A', null, before), row('B', null, noRf)]) })
    ).getWorksheet('Theo team')!;
    const values = (index: number) => sheet.getRow(index).values as unknown[];

    expect(values(4).slice(2, 7)).toEqual([22, 3, 1, 4, 30]);
    expect(values(4).slice(7)).toEqual([]);
    expect(values(5).slice(7, 13)).toEqual([0, 4, 150_000_000, 3, 165_000_000, undefined]);
  });

  it('writes team and RE names as they are: text, never a formula or a number', async () => {
    const names = ['=SUM(B4:B9)', '+84 Đông', '007', '  Hừng  Đông '];
    const rows = {
      ...ALL,
      byTeam: table(names.map((name) => row(name))),
      byRe: table([row('=HYPERLINK("x")', '@Sao Mai')]),
    };
    const workbook = await read(rows);
    const byTeam = workbook.getWorksheet('Theo team')!;
    const byRe = workbook.getWorksheet('Theo RE')!;
    const cells = [
      ...names.map((_, index) => byTeam.getCell(4 + index, 1)),
      byRe.getCell('A4'),
      byRe.getCell('B4'),
    ];

    expect(cells.map((cell) => cell.value)).toEqual([...names, '@Sao Mai', '=HYPERLINK("x")']);
    expect(cells.map((cell) => cell.type)).toEqual(Array(6).fill(ExcelJS.ValueType.String));
  });

  it('puts Team before RE on Theo RE', async () => {
    const sheet = (await read(ALL)).getWorksheet('Theo RE')!;

    expect((sheet.getRow(3).values as unknown[]).slice(1, 4)).toEqual(['Team', 'RE', 'Đã gặp']);
    expect((sheet.getRow(4).values as unknown[]).slice(1, 4)).toEqual([
      'Bình Minh',
      'Bùi Ngọc Trâm',
      22,
    ]);
    expect(sheet.getCell('B5').value).toBe('Tổng');
  });
});

describe('reportWorkbookMeta', () => {
  const today = calendarDate(2026, 10, 15);
  const viewing = {
    period: 'Tháng 10/2026',
    mtd: true,
    range: '01/10 – 15/10/2026',
    scope: 'Team Bình Minh',
  };

  it('gives the period and scope as "Đang xem" does, with the days counted so far', () => {
    expect(reportWorkbookMeta(viewing, today)).toEqual({
      period: 'Tháng 10/2026 (MTD 01/10 – 15/10/2026)',
      scope: 'Team Bình Minh',
      exported: '15/10/2026',
    });
    expect(reportWorkbookMeta({ ...viewing, period: 'Năm 2026', mtd: false }, today).period).toBe(
      'Năm 2026 (01/10 – 15/10/2026)',
    );
    const ended = { ...viewing, period: 'Tháng 09/2026', mtd: false, range: null };
    expect(reportWorkbookMeta(ended, today).period).toBe('Tháng 09/2026');
  });
});

describe('exportReport', () => {
  const today = calendarDate(2026, 10, 15);
  const report = {
    rows: ALL,
    period: periodOf('month', today),
    viewing: { period: 'Tháng 10/2026', mtd: true, range: '01/10 – 15/10/2026', scope: 'Toàn bộ' },
    today,
  };
  const NAME = 'bao-cao_2026-10_toan-bo_2026-10-15.xlsx';

  it('writes the workbook under its file name and gives back where it went', async () => {
    const write = vi.fn<(name: string, bytes: Uint8Array<ArrayBuffer>) => Promise<string>>(
      async (name) => `C:\\data\\exports\\${name}`,
    );

    expect(await exportReport(report, write)).toEqual({
      kind: 'exported',
      name: NAME,
      path: `C:\\data\\exports\\${NAME}`,
    });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(write.mock.calls[0]![1].buffer);
    expect(sheetNames(workbook)).toEqual(['Tổng hợp', 'Theo team', 'Theo RE', 'Theo mốc']);
  });

  it('fails at writing when the file cannot be written', async () => {
    const write = vi.fn(() => Promise.reject(new Error('os error 123')));

    expect(await exportReport(report, write)).toEqual({ kind: 'failed', step: 'write' });
  });

  it('fails at building when ExcelJS does not load, and writes nothing', async () => {
    vi.resetModules();
    vi.doMock('exceljs', () => {
      throw new Error('Failed to fetch dynamically imported module');
    });
    try {
      const { exportReport: exportWithoutExcel } = await import('./report-workbook');
      const write = vi.fn(() => Promise.resolve(undefined));

      expect(await exportWithoutExcel(report, write)).toEqual({ kind: 'failed', step: 'build' });
      expect(write).not.toHaveBeenCalled();
    } finally {
      vi.doUnmock('exceljs');
      vi.resetModules();
    }
  });
});

describe('exportFailedHelp', () => {
  it('says the file could not be made when building failed, in the exe and in web mode', () => {
    const made = 'Không tạo được file Excel. Thử lại; nếu vẫn lỗi, mở lại app.';
    expect(exportFailedHelp('build', true)).toBe(`${made} Dữ liệu trong app không bị ảnh hưởng.`);
    expect(exportFailedHelp('build', false)).toBe(exportFailedHelp('build', true));
  });

  it('names the exports folder when writing failed in the exe', () => {
    expect(exportFailedHelp('write', true)).toBe(
      'Không ghi được vào thư mục exports\\ (đầy ổ đĩa hoặc không có quyền). Dữ liệu trong app không bị ảnh hưởng.',
    );
    expect(exportFailedHelp('write', false)).toBe(
      'Không tạo được file. Dữ liệu trong app không bị ảnh hưởng.',
    );
  });
});

describe('reportFileName', () => {
  const d = calendarDate;
  const today = d(2026, 10, 15);

  it('names the period, the scope without accents and the export day', () => {
    expect(reportFileName(periodOf('month', today), 'Toàn bộ', today)).toBe(
      'bao-cao_2026-10_toan-bo_2026-10-15.xlsx',
    );
    expect(reportFileName(periodOf('year', today), 'Team Đông Á', today)).toBe(
      'bao-cao_2026_team-dong-a_2026-10-15.xlsx',
    );
    expect(reportFileName(periodOf('day', d(2026, 10, 9)), 'RE Bùi Ngọc Trâm', today)).toBe(
      'bao-cao_2026-10-09_re-bui-ngoc-tram_2026-10-15.xlsx',
    );
  });

  it('names a week or a custom range by its first and last day', () => {
    expect(reportFileName(periodOf('week', today), 'Toàn bộ', today)).toBe(
      'bao-cao_2026-10-12-den-2026-10-18_toan-bo_2026-10-15.xlsx',
    );
    expect(reportFileName(customPeriod(d(2026, 9, 20), d(2026, 10, 5)), 'Toàn bộ', today)).toBe(
      'bao-cao_2026-09-20-den-2026-10-05_toan-bo_2026-10-15.xlsx',
    );
  });

  it('keeps only letters and digits of a name, so the file name is always safe', () => {
    expect(reportFileName(periodOf('month', today), 'Team ..\\A/B: "C"*', today)).toBe(
      'bao-cao_2026-10_team-a-b-c_2026-10-15.xlsx',
    );
  });

  it('cuts a long scope to 60 characters, so the exe can always write the file', () => {
    // An RE name as long as the db takes; its 60th character is a `-`, which is dropped too.
    const name = `RE ${'Lê '.repeat(85)}Lê`;
    const file = reportFileName(customPeriod(d(2026, 9, 20), d(2026, 10, 5)), name, today);

    expect(name).toHaveLength(260);
    expect(file).toBe(`bao-cao_2026-09-20-den-2026-10-05_re-${'le-'.repeat(18)}le_2026-10-15.xlsx`);
    expect(file.length).toBeLessThanOrEqual(120);
    expect(file).toMatch(/^[a-z0-9_-]+\.xlsx$/);
  });
});
