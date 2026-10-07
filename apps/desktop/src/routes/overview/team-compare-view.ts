import {
  byName,
  appointmentCountsByScope,
  closeRate,
  customPeriod,
  formatCount,
  formatPeriodValue,
  formatVndCompact,
  periodMetricsByScope,
  type CalendarDate,
  type MetricsData,
  type Period,
  type PeriodMetrics,
  type Scope,
  type Team,
} from '@p2c/domain';
import { t } from '../../i18n';
import { teamRes } from '../../shell/scope';
import { closeRateText, countedWindow } from './overview-view';

export interface TeamCompareData extends MetricsData {
  readonly teams: readonly Team[];
}

/** One row of So sánh team: a team, one of its RE, or Tổng. */
export interface CompareRow {
  readonly key: string;
  readonly name: string;
  /** Đã gặp over the whole period, as the appointments tile counts it. */
  readonly met: number;
  /** The results up to today (§4.1); null before the period starts. */
  readonly metrics: PeriodMetrics | null;
  /** Đã gặp, Chuyển RF, HĐ nộp, Case size, HĐ phát hành, Doanh số, Tỉ lệ chốt, as shown. */
  readonly cells: readonly string[];
}

export interface CompareTeam extends CompareRow {
  /** The team's RE by name, shown under it when the team is opened. */
  readonly res: readonly CompareRow[];
}

/** So sánh team of Tổng quan (spec Phase 4 §4.3, mockup overview.html 1a). */
export interface TeamCompareView {
  /** The days the results are counted over; null before the period starts. */
  readonly range: string | null;
  readonly teams: readonly CompareTeam[];
  readonly total: CompareRow;
}

function cells(met: number, metrics: PeriodMetrics | null): string[] {
  if (!metrics) return [formatCount(met), ...Array<string>(6).fill(t('overview.none'))];
  return [
    formatCount(met),
    formatCount(metrics.rfCount),
    formatCount(metrics.submittedCount),
    formatVndCompact(metrics.caseSize),
    formatCount(metrics.issuedCount),
    formatVndCompact(metrics.revenue),
    closeRateText(metrics.closeRate),
  ];
}

const row = (key: string, name: string, met: number, metrics: PeriodMetrics | null) => ({
  key,
  name,
  met,
  metrics,
  cells: cells(met, metrics),
});

/**
 * Counts and money add up; the close rate of a sum is Σ issued ÷ Σ RF (§4.1, G09–G11). Whether
 * there are results comes from the period, so no teams still sum to 0 once it has started.
 */
function sum(rows: readonly CompareRow[], counted: boolean): Pick<CompareRow, 'met' | 'metrics'> {
  const met = rows.reduce((total, { met }) => total + met, 0);
  if (!counted) return { met, metrics: null };
  const add = (key: 'rfCount' | 'submittedCount' | 'caseSize' | 'issuedCount' | 'revenue') =>
    rows.reduce((total, { metrics }) => total + (metrics?.[key] ?? 0), 0);
  const rfCount = add('rfCount');
  const issuedCount = add('issuedCount');
  return {
    met,
    metrics: {
      rfCount,
      submittedCount: add('submittedCount'),
      caseSize: add('caseSize'),
      issuedCount,
      revenue: add('revenue'),
      closeRate: closeRate(issuedCount, rfCount),
    },
  };
}

/**
 * Every team by name with its RE by name, and Tổng, for `period` viewed on `today` (spec Phase 4
 * §4.1, §4.3). Results count up to today; Đã gặp counts the whole period, like the tile.
 */
export function teamCompare(
  data: TeamCompareData,
  period: Period,
  today: CalendarDate,
): TeamCompareView {
  const counted = countedWindow(period, today);
  // Each record is grouped by RE once; every team and RE row then adds up its RE (DR-20).
  const counts = appointmentCountsByScope(data.appointments, period, data.people, today);
  const metrics = counted && periodMetricsByScope(data, counted);
  const figures = (scope: Scope) => ({
    met: counts(scope).met,
    metrics: metrics && metrics(scope),
  });

  const teams = [...data.teams]
    .sort((a, b) => byName(a.name, b.name))
    .map((team): CompareTeam => {
      const { met, metrics } = figures({ kind: 'team', teamId: team.id });
      const res = teamRes(data.people, team.id).map((re) => {
        const shown = figures({ kind: 're', reId: re.id });
        return row(re.id, re.name, shown.met, shown.metrics);
      });
      return { ...row(team.id, team.name, met, metrics), res };
    });
  const total = sum(teams, counted !== null);
  return {
    range: counted && formatPeriodValue(customPeriod(counted.start, counted.end)),
    teams,
    total: row('total', t('overview.compare.total'), total.met, total.metrics),
  };
}
