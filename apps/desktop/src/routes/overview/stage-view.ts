import {
  chartMarks,
  compareDates,
  formatDate,
  formatDayMonth,
  formatDayOfMonth,
  formatPeriodValue,
  isInPeriod,
  periodOf,
  snapshotDate,
  stageSnapshotter,
  weekdayOf,
  type CalendarDate,
  type Customer,
  type Period,
  type Person,
  type Scope,
  type StageTransition,
  type Team,
} from '@p2c/domain';
import { t } from '../../i18n';
import { metricsScope } from './overview-view';

/** The four open stages Tổng quan shows, top of the stack first (spec Phase 4 §2.7). */
export const CHART_STAGES = ['N4', 'N3', 'N2', 'N1'] as const;
export type ChartStage = (typeof CHART_STAGES)[number];
export type StageValues = Readonly<Record<ChartStage, number>>;

export interface StageData {
  readonly customers: readonly Customer[];
  readonly transitions: readonly StageTransition[];
  readonly people: readonly Person[];
  readonly teams: readonly Team[];
}

/** One column of the chart: the snapshot at the end of its mark (§2.8). */
export interface StageColumn {
  /** Under the column: `05`, `T2 12`, `T1`… */
  readonly label: string;
  /** Tooltip heading: the day the snapshot is taken. */
  readonly title: string;
  /** Null for a mark after today, left empty. */
  readonly values: StageValues | null;
  /** The mark holds today. */
  readonly today: boolean;
}

export interface StageChart {
  readonly key: string;
  /** The team of a Team scope chart; null for the single chart of Toàn bộ / RE. */
  readonly team: string | null;
  readonly columns: readonly StageColumn[];
}

/** Khách hàng theo nhóm of Tổng quan (mockup overview.html 1a–1c, 1e). */
export interface StageBlock {
  /** The four tiles, the snapshot of the whole period; null before the period starts ("—"). */
  readonly tiles: StageValues | null;
  /** "ảnh chụp cuối ngày …" beside the heading; null before the period starts. */
  readonly note: string | null;
  readonly charts: readonly StageChart[];
}

const fourOf = (counts: StageValues): StageValues => ({
  N4: counts.N4,
  N3: counts.N3,
  N2: counts.N2,
  N1: counts.N1,
});

function markLabel(mark: Period, period: Period): string {
  switch (period.kind) {
    case 'day':
      return formatDayMonth(mark.start);
    case 'week':
      return t('overview.stages.weekMark', {
        weekday: t(`weekday.${weekdayOf(mark.start)}`),
        date: formatDayOfMonth(mark.start),
      });
    case 'month':
      return formatDayOfMonth(mark.start);
    case 'year':
      return t('overview.stages.yearMark', { month: mark.start.month });
    case 'custom':
      // A day mark is always a whole day; a month mark cut to the range (even to one day) is custom.
      return mark.kind === 'day'
        ? formatDayMonth(mark.start)
        : formatPeriodValue(periodOf('month', mark.start));
  }
}

/**
 * Customers by stage for `period` viewed on `today` (spec Phase 4 §2, §4.3): the four tiles and the
 * stacked chart of how they moved. The Team scope of Tổng quan adds every team up in the tiles and
 * draws one chart per team.
 */
export function stageBlock(
  data: StageData,
  period: Period,
  scope: Scope,
  today: CalendarDate,
): StageBlock {
  const snapshot = stageSnapshotter(data.customers, data.transitions, data.people);
  const marks = chartMarks(period).map((mark) => ({ mark, date: snapshotDate(mark, today) }));
  const chart = (key: string, team: string | null, chartScope: Scope): StageChart => ({
    key,
    team,
    columns: marks.map(({ mark, date }) => ({
      label: markLabel(mark, period),
      title: t('overview.stages.endOfDay', { date: formatDate(date ?? mark.end) }),
      values: date && fourOf(snapshot(date, chartScope)),
      today: isInPeriod(today, mark),
    })),
  });

  const date = snapshotDate(period, today);
  const teams = scope.kind === 'team';
  const counted = metricsScope(scope);
  return {
    tiles: date && fourOf(snapshot(date, counted)),
    note: date && stageNote(date, today, teams ? data.teams.length : null),
    charts: teams
      ? data.teams.map((team) => chart(team.id, team.name, { kind: 'team', teamId: team.id }))
      : [chart('all', null, counted)],
  };
}

function stageNote(date: CalendarDate, today: CalendarDate, teams: number | null): string {
  const taken =
    compareDates(date, today) === 0
      ? t('overview.stages.takenToday', { date: formatDate(date) })
      : t('overview.stages.taken', { date: formatDate(date) });
  return teams === null
    ? taken
    : `${taken} ${t('sep.dot')} ${t('overview.stages.teams', { teams })}`;
}
