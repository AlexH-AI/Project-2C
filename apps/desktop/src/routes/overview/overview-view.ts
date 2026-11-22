import {
  MAX_YEAR,
  MIN_YEAR,
  appointmentCounts,
  closeRatePercent,
  compareDates,
  comparisonWindows,
  customPeriod,
  formatNumber,
  formatDate,
  formatDayMonth,
  formatPercentage,
  formatPeriodValue,
  metricDeltas,
  periodMetrics,
  type CalendarDate,
  type MetricDeltas,
  type MetricsData,
  type Period,
  type PeriodMetrics,
  type Person,
  type Rate,
  type Scope,
  type Team,
  type CountStep,
} from '@p2c/domain';
import { joinParts, t } from '../../i18n';
import { scopeName } from '../../shell/scope';
import type { FilterSelection } from '../applied-filter';
import { formatAmountCompact } from '../money-view';

/** Doanh số (until D8 makes it the lead number), then the six tiles of tong-quan.html `#tiles`. */
export type KpiKey =
  'revenue' | 'net' | 'cancelRate' | 'closeRate' | 'rf' | 'submitted' | 'caseSize';

export interface KpiDelta {
  /** For the better (ok colour), the worse (danger) or no change: a rise of Tỷ lệ hủy is worse. */
  readonly tone: 'good' | 'bad' | 'same';
  readonly text: string;
}

/** How a KPI is written: a count, an amount in the compact form, a percentage. */
export type KpiKind = 'count' | 'money' | 'percent';

/** How the number of a tile runs in "Đếm" (VA7b): as it is written at rest. */
export const KPI_STEP = {
  count: 'whole',
  money: 'sig3',
  percent: 'tenth',
} as const satisfies Record<KpiKind, CountStep>;

/** A number as a tile writes it: `—` when there is none; its unit (`tr`, `K`, `VNĐ`, `%`) apart. */
export interface KpiText {
  readonly value: string;
  readonly unit: string;
  /** A space between the number and its unit: `400 tr`, but `500K`, `66.7%`. */
  readonly unitSpaced: boolean;
}

/** A tile of Tổng quan (mockup tong-quan.html `#tiles`, `#states`): its number, written. */
export interface KpiTile extends KpiText {
  readonly key: KpiKey;
  readonly label: string;
  readonly kind: KpiKind;
  /** The number itself, which "Đếm" runs from one value to the next; null for `—`. */
  readonly amount: number | null;
  /** Below 0, more cancelled than issued (Tổng số HĐ, Doanh số): written in red (ADR-0018). */
  readonly negative: boolean;
  /** Change against the previous window; null when not compared. */
  readonly delta: KpiDelta | null;
  /** "so với …" after the change, or the reason it is not compared. */
  readonly note: string;
  /**
   * Under the number, how it is worked out ("4 phát hành − 2 hủy", "2 hủy ÷ 4 phát hành"), even
   * for a rate of "—", or what it counts ("HĐ có ngày nộp trong kỳ"); null before the period starts.
   */
  readonly formula: string | null;
}

/** A count that may be below 0 (Tổng số HĐ): "-" first, as for money (ADR-0018 §4). */
export const formatCount = (count: number): string =>
  count < 0 ? `-${formatNumber(-count)}` : formatNumber(count);

/** A rate in a table cell: `66.7%`, or "—" with nothing to divide by (§4.1, golden B). */
export const rateText = (rate: Rate | null): string =>
  rate
    ? `${formatPercentage(closeRatePercent(rate))}${t('overview.percentUnit')}`
    : t('overview.none');

/**
 * `400 tr` → `400` + `tr`, `500K` → `500` + `K`, `0 VNĐ` → `0` + `VNĐ`: the unit is what follows
 * the last digit, set smaller beside the number.
 */
function splitUnit(text: string): KpiText {
  const end = text.search(/\d\D*$/) + 1;
  const after = text.slice(end);
  return { value: text.slice(0, end), unit: after.trimStart(), unitSpaced: after.startsWith(' ') };
}

/** A number of a tile, at rest or a frame of "Đếm": the unit is always the unit of that number. */
export function kpiText(kind: KpiKind, amount: number | null): KpiText {
  if (amount === null) return { value: t('overview.none'), unit: '', unitSpaced: false };
  if (kind === 'money') return splitUnit(formatAmountCompact(amount));
  if (kind === 'count') return { value: formatCount(amount), unit: '', unitSpaced: false };
  return { value: formatPercentage(amount), unit: t('overview.percentUnit'), unitSpaced: false };
}

/** ▲ ▼ = and the size of the change; a rise is for the better, but for Tỷ lệ hủy (`rise` bad). */
function delta(
  change: number,
  text: (magnitude: number) => string,
  rise: 'good' | 'bad' = 'good',
): KpiDelta {
  if (change === 0) return { tone: 'same', text: t('overview.same') };
  const value = text(Math.abs(change));
  return change > 0
    ? { tone: rise, text: t('overview.up', { value }) }
    : { tone: rise === 'good' ? 'bad' : 'good', text: t('overview.down', { value }) };
}

/** The previous window as the tiles name it; its year only when it differs from the period's. */
function windowText(window: Period, period: Period): string {
  const sameYear = window.start.year === period.start.year && window.end.year === period.start.year;
  if (compareDates(window.start, window.end) === 0) {
    return sameYear ? formatDayMonth(window.start) : formatDate(window.start);
  }
  if (!sameYear) return formatPeriodValue(customPeriod(window.start, window.end));
  return t('sep.range', { from: formatDayMonth(window.start), to: formatDayMonth(window.end) });
}

/** Days the KPI are counted over (§4.1: up to today); null when the period has not started. */
export function countedWindow(period: Period, today: CalendarDate): Period | null {
  if (compareDates(today, period.start) < 0) return null;
  return compareDates(today, period.end) < 0 ? customPeriod(period.start, today) : period;
}

function notComparedReason(period: Period, today: CalendarDate): string {
  if (compareDates(today, period.start) < 0) return t('overview.notCompared.notStarted');
  if (period.kind === 'custom') return t('overview.notCompared.custom');
  return t('overview.notCompared.outOfRange', { from: MIN_YEAR, to: MAX_YEAR });
}

/**
 * Doanh số and the six tiles of `#tiles` for `period` and `scope` viewed on `today` (spec Phase 4
 * §4.1, §4.2; Phase 6 §4.4): counted up to today, each against the previous window when there is
 * one, each with how it is worked out or what it counts.
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
  const met =
    counted && appointmentCounts(data.appointments, counted, scope, data.people, today).met;
  /** What the metrics of the period give; null before it starts. */
  const of = <T>(read: (metrics: PeriodMetrics) => T): T | null => (current ? read(current) : null);
  const tile = (
    key: Exclude<KpiKey, RateKey>,
    kind: 'count' | 'money',
    metric: keyof PeriodMetrics & keyof MetricDeltas,
    formula: string | null,
  ): KpiTile => {
    const amount = of((metrics) => metrics[metric]);
    const write = kind === 'money' ? formatAmountCompact : formatNumber;
    return {
      key,
      label: t(`overview.kpi.${key}`),
      kind,
      amount,
      ...kpiText(kind, amount),
      negative: amount !== null && amount < 0,
      delta: deltas && delta(deltas[metric], write),
      note,
      formula,
    };
  };
  const rate = (key: RateKey) => rateTile(RATES[key], current, previous, deltas, note);

  return [
    tile(
      'revenue',
      'money',
      'revenue',
      of(({ issuedFyp, cancelledFyp }) =>
        t('overview.formula.revenue', {
          issued: formatAmountCompact(issuedFyp),
          cancelled: formatAmountCompact(cancelledFyp),
        }),
      ),
    ),
    tile(
      'net',
      'count',
      'netCount',
      of(({ issuedCount, cancelledCount }) =>
        t('overview.formula.net', {
          issued: formatNumber(issuedCount),
          cancelled: formatNumber(cancelledCount),
        }),
      ),
    ),
    rate('cancelRate'),
    rate('closeRate'),
    tile('rf', 'count', 'rfCount', met === null ? null : t('overview.formula.rf', { met })),
    tile(
      'submitted',
      'count',
      'submittedCount',
      of(() => t('overview.formula.submitted')),
    ),
    tile(
      'caseSize',
      'money',
      'caseSize',
      of(({ submittedCount }) => t('overview.formula.caseSize', { policies: submittedCount })),
    ),
  ];
}

type RateKey = 'cancelRate' | 'closeRate';

/** How a tile of a rate reads its rate, its change and its division, and why it may have none. */
interface RateSpec {
  readonly key: RateKey;
  readonly rate: (metrics: PeriodMetrics) => Rate | null;
  readonly points: (deltas: MetricDeltas) => number | null;
  /** Whether a rise is for the better: not for Tỷ lệ hủy (mockup `#tiles`). */
  readonly rise: 'good' | 'bad';
  readonly formula: (metrics: PeriodMetrics) => string;
  /** No denominator in the period, or in the window before: "không so". */
  readonly none: 'overview.noIssued' | 'overview.noRf';
  readonly noneBefore: 'overview.previousNoIssued' | 'overview.previousNoRf';
}

const RATES: Readonly<Record<RateKey, RateSpec>> = {
  cancelRate: {
    key: 'cancelRate',
    rate: (metrics) => metrics.cancelRate,
    points: (deltas) => deltas.cancelRatePoints,
    rise: 'bad',
    formula: ({ cancelledCount, issuedCount }) =>
      t('overview.formula.cancelRate', {
        cancelled: formatNumber(cancelledCount),
        issued: formatNumber(issuedCount),
      }),
    none: 'overview.noIssued',
    noneBefore: 'overview.previousNoIssued',
  },
  closeRate: {
    key: 'closeRate',
    rate: (metrics) => metrics.closeRate,
    points: (deltas) => deltas.closeRatePoints,
    rise: 'good',
    formula: ({ issuedCount, rfCount }) =>
      t('overview.formula', { issued: formatNumber(issuedCount), count: rfCount }),
    none: 'overview.noRf',
    noneBefore: 'overview.previousNoRf',
  },
};

/**
 * Tỷ lệ hủy or Tỷ lệ chốt, in percent, its change in points; "—" with nothing to divide by, the
 * division still written (mockup `#tiles`: "1 hủy ÷ 0 phát hành") and the reason it is not compared.
 */
function rateTile(
  spec: RateSpec,
  current: PeriodMetrics | null,
  previous: PeriodMetrics | null,
  deltas: MetricDeltas | null,
  comparedNote: string,
): KpiTile {
  const rate = current && spec.rate(current);
  const base = {
    key: spec.key,
    label: t(`overview.kpi.${spec.key}`),
    kind: 'percent',
    negative: false,
    formula: current && spec.formula(current),
  } as const;
  if (!rate) {
    const note = current && previous ? t(spec.none) : comparedNote;
    return { ...base, amount: null, ...kpiText('percent', null), delta: null, note };
  }
  const points = deltas && spec.points(deltas);
  const roundsToZero = points !== null && formatPercentage(points) === '0';
  const amount = closeRatePercent(rate);
  return {
    ...base,
    amount,
    ...kpiText('percent', amount),
    delta:
      points === null
        ? null
        : delta(
            roundsToZero ? 0 : points,
            (magnitude) => t('overview.points', { value: formatPercentage(magnitude) }),
            spec.rise,
          ),
    note: previous && !spec.rate(previous) ? t(spec.noneBefore) : comparedNote,
  };
}

/** The scope the numbers are counted for: the Team scope of Tổng quan adds up every team (§4.3). */
export const metricsScope = (scope: Scope): Scope =>
  scope.kind === 'team' ? { kind: 'all' } : scope;

/** The period and scope the numbers on screen are for (mockup 1a–1c), as the screen names them. */
export interface ViewingText {
  readonly period: string;
  /** A month in progress, its last day included, is counted month to date (§4.2 C02). */
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
    compareDates(today, period.end) <= 0;
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

/** The Team scope of Tổng quan is every team (§4.3); the others are named as everywhere. */
const scopeText = (scope: Scope, people: readonly Person[], teams: readonly Team[]): string =>
  scope.kind === 'team'
    ? t('overview.scopeTeams', { teams: teams.length })
    : scopeName(scope, teams, people);

/**
 * The line under the name of Tổng quan and Báo cáo, on the toolbar (mockup app-shell.html
 * `#toolbar`): the period, the days counted while it is in progress, the scope.
 */
export const viewingLine = ({ period, mtd, range, scope }: ViewingText): string =>
  joinParts([period, ...(range ? [mtd ? t('overview.mtdRange', { range }) : range] : []), scope]);
