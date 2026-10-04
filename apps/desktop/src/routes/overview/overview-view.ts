import {
  MAX_YEAR,
  MIN_YEAR,
  compareDates,
  comparisonWindows,
  customPeriod,
  formatCount,
  formatDate,
  formatDayMonth,
  formatPercent,
  formatPeriodValue,
  formatVndCompact,
  metricDeltas,
  periodMetrics,
  type CalendarDate,
  type CloseRate,
  type MetricDeltas,
  type MetricsData,
  type Period,
  type PeriodMetrics,
  type Person,
  type Scope,
  type Team,
} from '@p2c/domain';
import { t } from '../../i18n';
import type { FilterSelection } from '../applied-filter';

export type KpiKey = 'rf' | 'submitted' | 'caseSize' | 'issued' | 'revenue' | 'closeRate';

export interface KpiDelta {
  readonly tone: 'up' | 'down' | 'same';
  readonly text: string;
}

/** One of the six KPI tiles of Tổng quan (mockup overview.html 1a, 1e). */
export interface KpiTile {
  readonly key: KpiKey;
  readonly label: string;
  /** The number, `—` when there is none; its unit (`tr`, `₫`, `%`) apart, or empty. */
  readonly value: string;
  readonly unit: string;
  /** Change against the previous window; null when not compared. */
  readonly delta: KpiDelta | null;
  /** "so với …" after the change, or the reason it is not compared. */
  readonly note: string;
  /** The close rate's "x HĐ phát hành ÷ y RF"; null for the other tiles or without a rate. */
  readonly formula: string | null;
}

const COUNTS = ['rf', 'submitted', 'issued'] as const;
const AMOUNTS = ['caseSize', 'revenue'] as const;

const METRIC = {
  rf: 'rfCount',
  submitted: 'submittedCount',
  issued: 'issuedCount',
  caseSize: 'caseSize',
  revenue: 'revenue',
} as const satisfies Record<Exclude<KpiKey, 'closeRate'>, keyof PeriodMetrics & keyof MetricDeltas>;

const percentOf = ({ numerator, denominator }: CloseRate) => (numerator / denominator) * 100;

/** `400 tr` → `400` + `tr`, so the unit can be set smaller beside the number. */
function splitUnit(text: string): { value: string; unit: string } {
  const space = text.lastIndexOf(' ');
  return { value: text.slice(0, space), unit: text.slice(space + 1) };
}

function delta(change: number, text: (magnitude: number) => string): KpiDelta {
  if (change === 0) return { tone: 'same', text: t('overview.same') };
  const value = text(Math.abs(change));
  return change > 0
    ? { tone: 'up', text: t('overview.up', { value }) }
    : { tone: 'down', text: t('overview.down', { value }) };
}

/** The previous window as the tiles name it; its year only when it differs from the period's. */
function windowText(window: Period, period: Period): string {
  const sameYear = window.start.year === period.start.year && window.end.year === period.start.year;
  if (compareDates(window.start, window.end) === 0) {
    return sameYear ? formatDayMonth(window.start) : formatDate(window.start);
  }
  if (!sameYear) return formatPeriodValue(customPeriod(window.start, window.end));
  return `${formatDayMonth(window.start)} – ${formatDayMonth(window.end)}`;
}

/** Days the KPI are counted over (§4.1: up to today); null when the period has not started. */
function countedWindow(period: Period, today: CalendarDate): Period | null {
  if (compareDates(today, period.start) < 0) return null;
  return compareDates(today, period.end) < 0 ? customPeriod(period.start, today) : period;
}

function notComparedReason(period: Period, today: CalendarDate): string {
  if (period.kind === 'custom') return t('overview.notCompared.custom');
  if (compareDates(today, period.start) < 0) return t('overview.notCompared.notStarted');
  return t('overview.notCompared.outOfRange', { from: MIN_YEAR, to: MAX_YEAR });
}

/**
 * The six KPI tiles for `period` and `scope` viewed on `today` (spec Phase 4 §4.1, §4.2): counted
 * up to today, each against the previous window when there is one.
 */
export function kpiTiles(
  data: MetricsData,
  period: Period,
  scope: Scope,
  today: CalendarDate,
): KpiTile[] {
  const counted = countedWindow(period, today);
  const windows = comparisonWindows(period, today);
  const current = counted && periodMetrics(data, counted, scope);
  const previous = windows && periodMetrics(data, windows.previous, scope);
  const deltas = current && previous && metricDeltas(current, previous);
  const note = windows
    ? t('overview.comparedWith', { value: windowText(windows.previous, period) })
    : notComparedReason(period, today);
  const none = { value: t('overview.none'), unit: '' };

  const tile = (
    key: KpiKey,
    shown: { value: string; unit: string },
    change: KpiDelta | null,
  ): KpiTile => ({
    key,
    label: t(`overview.kpi.${key}`),
    ...shown,
    delta: change,
    note,
    formula: null,
  });

  const counts = COUNTS.map((key) =>
    tile(
      key,
      current ? { value: formatCount(current[METRIC[key]]), unit: '' } : none,
      deltas && delta(deltas[METRIC[key]], formatCount),
    ),
  );
  const amounts = AMOUNTS.map((key) =>
    tile(
      key,
      current ? splitUnit(formatVndCompact(current[METRIC[key]])) : none,
      deltas && delta(deltas[METRIC[key]], formatVndCompact),
    ),
  );
  const [rf, submitted, issued] = counts as [KpiTile, KpiTile, KpiTile];
  const [caseSize, revenue] = amounts as [KpiTile, KpiTile];
  return [rf, submitted, caseSize, issued, revenue, closeRateTile(current, previous, deltas, note)];
}

function closeRateTile(
  current: PeriodMetrics | null,
  previous: PeriodMetrics | null,
  deltas: MetricDeltas | null,
  comparedNote: string,
): KpiTile {
  const rate = current?.closeRate ?? null;
  const base = { key: 'closeRate', label: t('overview.kpi.closeRate') } as const;
  if (!current || !rate) {
    const note = current && previous ? t('overview.noRf') : comparedNote;
    return { ...base, value: t('overview.none'), unit: '', delta: null, note, formula: null };
  }
  const points = deltas?.closeRatePoints ?? null;
  const roundsToZero = points !== null && formatPercent(points) === '0';
  return {
    ...base,
    value: formatPercent(percentOf(rate)),
    unit: t('overview.percentUnit'),
    delta:
      points === null
        ? null
        : delta(roundsToZero ? 0 : points, (magnitude) =>
            t('overview.points', { value: formatPercent(magnitude) }),
          ),
    note: previous && !previous.closeRate ? t('overview.previousNoRf') : comparedNote,
    formula: t('overview.formula', {
      issued: formatCount(rate.numerator),
      count: rate.denominator,
    }),
  };
}

/** The scope the numbers are counted for: the Team scope of Tổng quan adds up every team (§4.3). */
export const metricsScope = (scope: Scope): Scope =>
  scope.kind === 'team' ? { kind: 'all' } : scope;

/** The "Đang xem" line: the period and scope the numbers on screen are for (mockup 1a–1c). */
export interface ViewingText {
  readonly period: string;
  /** A month in progress is counted month to date. */
  readonly mtd: boolean;
  /** The days counted when the month or year is in progress; null otherwise. */
  readonly range: string | null;
  readonly scope: string;
}

export function viewingText(
  { period, scope }: FilterSelection,
  today: CalendarDate,
  people: readonly Person[],
  teams: readonly Team[],
): ViewingText {
  const inProgress =
    (period.kind === 'month' || period.kind === 'year') &&
    compareDates(period.start, today) <= 0 &&
    compareDates(today, period.end) < 0;
  return {
    period: periodName(period),
    mtd: inProgress && period.kind === 'month',
    range: inProgress ? formatPeriodValue(customPeriod(period.start, today)) : null,
    scope: scopeText(scope, people, teams),
  };
}

/** As the period picker names it: `Tháng 01/2027`, `Năm 2026`, other kinds by their dates. */
function periodName(period: Period): string {
  const value = formatPeriodValue(period);
  if (period.kind === 'month') return t('period.monthLabel', { value });
  if (period.kind === 'year') return t('period.yearLabel', { value });
  return value;
}

function scopeText(scope: Scope, people: readonly Person[], teams: readonly Team[]): string {
  switch (scope.kind) {
    case 'all':
      return t('scope.all');
    case 'team':
      return t('overview.scopeTeams', { teams: teams.length });
    case 're':
      return t('overview.scopeRe', {
        name: people.find((person) => person.id === scope.reId)?.name ?? '',
      });
  }
}
