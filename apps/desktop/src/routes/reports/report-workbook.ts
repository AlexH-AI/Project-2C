import type ExcelJS from 'exceljs';
import { formatDate, formatIsoDate, type CalendarDate, type Period } from '@p2c/domain';
import { t } from '../../i18n';
import type { ViewingText } from '../overview/overview-view';
import { REPORT_STAGES, type ReportFigures, type ReportRow, type ReportRows } from './reports-view';

/** What the first row of every sheet says besides the table's name. */
export interface ReportWorkbookMeta {
  /** The period viewed, with the days counted when it is in progress. */
  readonly period: string;
  readonly scope: string;
  /** The day of the export, formatted. */
  readonly exported: string;
}

type TableKey = 'summary' | 'byTeam' | 'byRe' | 'byMark';

interface Sheet {
  readonly key: TableKey;
  readonly rows: readonly ReportRow[];
  readonly total?: ReportRow;
}

interface Column {
  readonly label: string;
  /** Null leaves the cell empty, where the screen shows "—". */
  readonly value: (figures: ReportFigures) => number | null;
  readonly numFmt?: string;
}

const MONEY = '#,##0';
const PERCENT = '0.0%';

const appointment = (key: keyof ReportFigures['appointments']) => (figures: ReportFigures) =>
  figures.appointments[key];
const result =
  (key: 'rfCount' | 'submittedCount' | 'caseSize' | 'issuedCount' | 'revenue') =>
  (figures: ReportFigures) =>
    figures.metrics?.[key] ?? null;
const money = (label: string) => t('reports.excel.money', { label });

/** The 17 figure columns of the screen (`reportCells`), as numbers Excel can add up. */
const COLUMNS: readonly Column[] = [
  { label: t('reports.col.met'), value: appointment('met') },
  { label: t('reports.col.missed'), value: appointment('missed') },
  { label: t('reports.col.unrecorded'), value: appointment('unrecorded') },
  { label: t('reports.col.planned'), value: appointment('planned') },
  { label: t('reports.col.total'), value: appointment('total') },
  { label: t('overview.kpi.rf'), value: result('rfCount') },
  { label: t('overview.kpi.submitted'), value: result('submittedCount') },
  { label: money(t('overview.kpi.caseSize')), value: result('caseSize'), numFmt: MONEY },
  { label: t('overview.kpi.issued'), value: result('issuedCount') },
  { label: money(t('overview.kpi.revenue')), value: result('revenue'), numFmt: MONEY },
  {
    label: t('overview.kpi.closeRate'),
    value: ({ metrics }) =>
      metrics?.closeRate ? metrics.closeRate.numerator / metrics.closeRate.denominator : null,
    numFmt: PERCENT,
  },
  ...REPORT_STAGES.map((stage) => ({
    label: t(`stage.${stage}`),
    value: ({ stages }: ReportFigures) => stages?.[stage] ?? null,
  })),
];
const GROUPS = [
  { label: t('reports.group.appointments'), span: 5 },
  { label: t('reports.group.results'), span: 6 },
  { label: t('reports.group.stages'), span: 6 },
];

const LEAD_HEADERS: Record<TableKey, readonly string[]> = {
  summary: [t('reports.col.scope')],
  byTeam: [t('reports.col.team')],
  byRe: [t('reports.col.team'), t('reports.col.re')],
  byMark: [t('reports.col.mark')],
};

/** The tables the scope shows, in the order of the screen; a table left out has no sheet. */
function sheetsOf(rows: ReportRows): Sheet[] {
  const sheets: (Sheet | null)[] = [
    { key: 'summary', rows: [rows.summary] },
    rows.byTeam && { key: 'byTeam', ...rows.byTeam },
    rows.byRe && { key: 'byRe', ...rows.byRe },
    { key: 'byMark', rows: rows.byMark },
  ];
  return sheets.filter((sheet) => sheet !== null);
}

/** How many sheets the file of these rows has: 4 for Toàn bộ, 3 for a team, 2 for an RE. */
export const reportSheetCount = (rows: ReportRows): number => sheetsOf(rows).length;

/** The first-row facts: the period and the scope as "Đang xem" gives them, and today. */
export function reportWorkbookMeta(
  { period, mtd, range: counted, scope }: ViewingText,
  today: CalendarDate,
): ReportWorkbookMeta {
  const range = counted && (mtd ? t('reports.excel.mtd', { range: counted }) : counted);
  return {
    period: range ? t('reports.excel.period', { period, range }) : period,
    scope,
    exported: formatDate(today),
  };
}

/** Names and columns wide enough to read; the header rows and the names stay put on scrolling. */
const NAME_WIDTH = 24;
const FIGURE_WIDTH = 13;

function addSheet(workbook: ExcelJS.Workbook, sheet: Sheet, meta: ReportWorkbookMeta) {
  const name = t(`reports.${sheet.key}`);
  const leads = LEAD_HEADERS[sheet.key];
  const worksheet = workbook.addWorksheet(name, {
    views: [{ state: 'frozen', xSplit: leads.length, ySplit: 3 }],
  });
  worksheet.columns = [
    ...leads.map(() => ({ width: NAME_WIDTH })),
    ...COLUMNS.map(() => ({ width: FIGURE_WIDTH })),
  ];
  worksheet.getCell(1, 1).value = t('reports.excel.title', { table: name, ...meta });

  let column = leads.length + 1;
  for (const group of GROUPS) {
    worksheet.getCell(2, column).value = group.label;
    worksheet.mergeCells(2, column, 2, column + group.span - 1);
    column += group.span;
  }
  worksheet.getRow(2).font = { bold: true };
  const header = worksheet.addRow([...leads, ...COLUMNS.map((each) => each.label)]);
  header.font = { bold: true };

  const addFigures = (row: ReportRow, names: readonly string[]) => {
    const added = worksheet.addRow([...names, ...COLUMNS.map((each) => each.value(row))]);
    COLUMNS.forEach((each, index) => {
      if (each.numFmt) added.getCell(leads.length + index + 1).numFmt = each.numFmt;
    });
    return added;
  };
  for (const row of sheet.rows) {
    addFigures(row, sheet.key === 'byRe' ? [row.team ?? '', row.name] : [row.name]);
  }
  if (sheet.total) {
    const names = sheet.key === 'byRe' ? ['', sheet.total.name] : [sheet.total.name];
    addFigures(sheet.total, names).font = { bold: true };
  }
}

/**
 * The report as an `.xlsx` file (ADR-0011, mockup reports.html 2f): one sheet per table shown, its
 * first row naming the table, the period, the scope and the export day, then the column groups and
 * the columns of the screen. The figures stay numbers (money in đồng, the close rate a fraction
 * shown as %) so Excel can go on counting; a "—" of the screen is an empty cell.
 */
export async function buildReportWorkbook(
  rows: ReportRows,
  meta: ReportWorkbookMeta,
): Promise<Uint8Array<ArrayBuffer>> {
  // Loaded on the first export only: the library is most of the size of the app's code.
  const { default: Excel } = await import('exceljs');
  const workbook = new Excel.Workbook();
  for (const sheet of sheetsOf(rows)) addSheet(workbook, sheet, meta);
  return new Uint8Array(await workbook.xlsx.writeBuffer());
}

/** Lower-case ASCII letters and digits joined by `-`: `Team Đông Á` → `team-dong-a`. */
const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** The period as the file name gives it: `2026-10`, `2026`, a day, or its first and last day. */
function periodStamp({ kind, start, end }: Period): string {
  switch (kind) {
    case 'day':
      return formatIsoDate(start);
    case 'month':
      return formatIsoDate(start).slice(0, 7);
    case 'year':
      return String(start.year);
    case 'week':
    case 'custom':
      return t('reports.excel.fileRange', { from: formatIsoDate(start), to: formatIsoDate(end) });
  }
}

/**
 * `bao-cao_<period>_<scope>_<day>.xlsx` (mockup reports.html 2f), e.g.
 * `bao-cao_2026-10_toan-bo_2026-10-15.xlsx`: only ASCII letters, digits, `-` and `_`, as the exe's
 * export command takes them. An export of the same name gets a `-2` suffix there.
 */
export function reportFileName(period: Period, scope: string, today: CalendarDate): string {
  const parts = [t('reports.excel.file'), periodStamp(period), slug(scope), formatIsoDate(today)];
  return `${parts.join('_')}.xlsx`;
}
