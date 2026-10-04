import {
  appointmentCounts,
  closeRate,
  formatCount,
  formatVndCompact,
  periodMetrics,
  snapshotDate,
  stageSnapshotter,
  type AppointmentCounts,
  type CalendarDate,
  type Customer,
  type CustomerStage,
  type MetricsData,
  type Period,
  type PeriodMetrics,
  type Person,
  type Scope,
  type StageCounts,
  type Team,
} from '@p2c/domain';
import { joinParts, t } from '../../i18n';
import { reOptions } from '../../shell/scope';
import { closeRateText, countedWindow } from '../overview/overview-view';

export interface ReportData extends MetricsData {
  readonly customers: readonly Customer[];
  readonly teams: readonly Team[];
}

/** The numbers of one report row, as counted; the screen and the Excel file format them. */
export interface ReportFigures {
  /** The four groups and Tổng over the whole period (§1). */
  readonly appointments: AppointmentCounts;
  /** The results up to today (§4.1); null before the period starts. */
  readonly metrics: PeriodMetrics | null;
  /** Customers by stage at the snapshot day (§2); null before the period starts. */
  readonly stages: StageCounts | null;
}

/** One row of a report table: the scope viewed, a team, an RE, or Tổng. */
export interface ReportRow extends ReportFigures {
  readonly key: string;
  readonly name: string;
  /** The team of a Theo RE row; null on the other tables. */
  readonly team: string | null;
}

export interface ReportTable {
  readonly rows: readonly ReportRow[];
  readonly total: ReportRow;
}

/**
 * The tables of Báo cáo part 1 (spec Phase 4 §4.4, mockup reports.html 2a, 2b, 2d), shared by the
 * screen and the Excel export. A table that would repeat Tổng hợp is null: Theo team in the Team
 * scope, Theo team and Theo RE in the RE scope.
 */
export interface ReportRows {
  readonly summary: ReportRow;
  readonly byTeam: ReportTable | null;
  readonly byRe: ReportTable | null;
}

/** The six stages of KH cuối kỳ, in the order of the columns. */
export const REPORT_STAGES = [
  'N4',
  'N3',
  'N2',
  'N1',
  'ON_HOLD',
  'LOST',
] as const satisfies readonly CustomerStage[];

const byName = new Intl.Collator('vi').compare;

const METRIC_SUMS = ['rfCount', 'submittedCount', 'caseSize', 'issuedCount', 'revenue'] as const;
const APPOINTMENT_SUMS = ['met', 'missed', 'unrecorded', 'planned', 'total'] as const;

const total = <K extends string>(
  keys: readonly K[],
  parts: readonly Readonly<Record<K, number>>[],
): Record<K, number> =>
  Object.fromEntries(
    keys.map((key) => [key, parts.reduce((sum, part) => sum + part[key], 0)]),
  ) as Record<K, number>;

/**
 * Counts and money add up; the close rate of a sum is Σ issued ÷ Σ RF (§4.1, G09–G11). Whether
 * there are results and stages yet comes from the period, not the rows, so a table without rows
 * still matches Tổng hợp: 0 once the period has started, "—" before.
 */
function sumFigures(
  rows: readonly ReportFigures[],
  has: { readonly results: boolean; readonly stages: boolean },
): ReportFigures {
  const summed = total(
    METRIC_SUMS,
    rows.flatMap((row) => (row.metrics ? [row.metrics] : [])),
  );
  return {
    appointments: total(
      APPOINTMENT_SUMS,
      rows.map((row) => row.appointments),
    ),
    metrics: has.results
      ? { ...summed, closeRate: closeRate(summed.issuedCount, summed.rfCount) }
      : null,
    stages: has.stages
      ? total(
          REPORT_STAGES,
          rows.flatMap((row) => (row.stages ? [row.stages] : [])),
        )
      : null,
  };
}

/** The scope as the report names it: `Toàn bộ`, `Team Bình Minh`, `RE Bùi Ngọc Trâm`. */
export function reportScopeName(
  scope: Scope,
  people: readonly Person[],
  teams: readonly Team[],
): string {
  switch (scope.kind) {
    case 'all':
      return t('scope.all');
    case 'team':
      return t('reports.scopeTeam', {
        name: teams.find((team) => team.id === scope.teamId)?.name ?? '',
      });
    case 're':
      return t('overview.scopeRe', {
        name: people.find((person) => person.id === scope.reId)?.name ?? '',
      });
  }
}

/** Beside the Tổng hợp heading: the scope with its RE count, or an RE with its team. */
export function summaryMeta(
  scope: Scope,
  people: readonly Person[],
  teams: readonly Team[],
): string {
  const name = reportScopeName(scope, people, teams);
  if (scope.kind === 're') {
    const teamId = people.find((person) => person.id === scope.reId)?.teamId;
    return joinParts([name, teams.find((team) => team.id === teamId)?.name ?? '']);
  }
  const res = people.filter(
    (person) => person.role === 'RE' && (scope.kind === 'all' || person.teamId === scope.teamId),
  );
  return t('reports.summaryMeta', { name, re: res.length });
}

/**
 * The report rows for `period` and `scope` viewed on `today` (spec Phase 4 §4.4): appointments over
 * the whole period, results up to today, customers by stage at the snapshot day. Teams by name; RE
 * by team, then name, as `reOptions` lists them, an RE without numbers still with its row.
 */
export function reportRows(
  data: ReportData,
  period: Period,
  scope: Scope,
  today: CalendarDate,
): ReportRows {
  const counted = countedWindow(period, today);
  const snapshot = stageSnapshotter(data.customers, data.transitions, data.people);
  const date = snapshotDate(period, today);
  const figures = (of: Scope): ReportFigures => ({
    appointments: appointmentCounts(data.appointments, period, of, data.people, today),
    metrics: counted && periodMetrics(data, counted, of),
    stages: date && snapshot(date, of),
  });
  const totalRow = (rows: readonly ReportRow[]): ReportRow => ({
    key: 'total',
    name: t('reports.total'),
    team: null,
    ...sumFigures(rows, { results: counted !== null, stages: date !== null }),
  });
  const table = (rows: readonly ReportRow[]): ReportTable => ({ rows, total: totalRow(rows) });

  const summary: ReportRow = {
    key: 'summary',
    name: reportScopeName(scope, data.people, data.teams),
    team: null,
    ...figures(scope),
  };
  if (scope.kind === 're') return { summary, byTeam: null, byRe: null };

  const teamName = new Map(data.teams.map((team) => [team.id, team.name]));
  const people = new Map(data.people.map((person) => [person.id, person]));
  const res = reOptions(data.people, data.teams)
    .map(({ value }) => people.get(value))
    .filter((re): re is Person => re !== undefined)
    .filter((re) => scope.kind === 'all' || re.teamId === scope.teamId)
    .map((re): ReportRow => ({
      key: re.id,
      name: re.name,
      team: (re.teamId && teamName.get(re.teamId)) ?? '',
      ...figures({ kind: 're', reId: re.id }),
    }));
  if (scope.kind === 'team') return { summary, byTeam: null, byRe: table(res) };

  const teams = [...data.teams]
    .sort((a, b) => byName(a.name, b.name))
    .map((team): ReportRow => ({
      key: team.id,
      name: team.name,
      team: null,
      ...figures({ kind: 'team', teamId: team.id }),
    }));
  return { summary, byTeam: table(teams), byRe: table(res) };
}

/**
 * A row as the screen shows it, 17 cells: Lịch hẹn (Đã gặp, Dời – hủy – không đến, Chưa ghi kết
 * quả, Dự kiến, Tổng) · Kết quả (Chuyển RF, HĐ nộp, Case size, HĐ phát hành, Doanh số, Tỉ lệ chốt)
 * · KH cuối kỳ (N4, N3, N2, N1, Tạm hoãn, Mất cơ hội). No number yet → "—"; 0 RF → "—" rate.
 */
export function reportCells({ appointments, metrics, stages }: ReportFigures): string[] {
  const none = t('overview.none');
  const appointmentCells = APPOINTMENT_SUMS.map((key) => formatCount(appointments[key]));
  const resultCells = metrics
    ? [
        formatCount(metrics.rfCount),
        formatCount(metrics.submittedCount),
        formatVndCompact(metrics.caseSize),
        formatCount(metrics.issuedCount),
        formatVndCompact(metrics.revenue),
        closeRateText(metrics.closeRate),
      ]
    : Array<string>(6).fill(none);
  const stageCells = REPORT_STAGES.map((stage) => (stages ? formatCount(stages[stage]) : none));
  return [...appointmentCells, ...resultCells, ...stageCells];
}
