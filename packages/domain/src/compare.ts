import type { Vnd } from './money';
import {
  addDays,
  calendarDate,
  canShift,
  compareDates,
  customPeriod,
  daysBetween,
  shift,
  type CalendarDate,
  type Period,
} from './period';
import type { CloseRate, PeriodMetrics } from './stats';

const percent = ({ numerator, denominator }: CloseRate) => (numerator / denominator) * 100;

const earlier = (a: CalendarDate, b: CalendarDate) => (compareDates(a, b) <= 0 ? a : b);

/** The same day and month a year earlier; 29/02 becomes 28/02. */
function sameDayYearBefore({ year, month, day }: CalendarDate): CalendarDate {
  const leapDay = month === 2 && day === 29;
  return calendarDate(year - 1, month, leapDay ? 28 : day);
}

/** The days a KPI is counted over and the days it is compared with (spec Phase 4 §4.2). */
export interface ComparisonWindows {
  readonly current: Period;
  readonly previous: Period;
}

/**
 * The windows of "so với kỳ trước" for `period` viewed on `today` (spec Phase 4 §4.2):
 * - ended (today after its last day) → the whole period and the whole period before it;
 * - in progress (day, week, month), its last day included → first day → today, against as many
 *   first days of the period before, cut at its last day (C10, C11);
 * - a year in progress → 01/01 → today, against 01/01 → the same day and month a year before;
 * - null — not compared — for a custom range, a period not started yet, or one whose period
 *   before is not in 1900–2100.
 */
export function comparisonWindows(period: Period, today: CalendarDate): ComparisonWindows | null {
  const notCompared =
    period.kind === 'custom' || compareDates(today, period.start) < 0 || !canShift(period, -1);
  if (notCompared) return null;
  const before = shift(period, -1);
  if (compareDates(today, period.end) > 0) return { current: period, previous: before };
  const previousEnd =
    period.kind === 'year'
      ? sameDayYearBefore(today)
      : earlier(addDays(before.start, daysBetween(period.start, today)), before.end);
  return {
    current: customPeriod(period.start, today),
    previous: customPeriod(before.start, previousEnd),
  };
}

/**
 * Change of each compared KPI from the previous window to the current one (spec Phase 4 §4.2):
 * signed counts and VND (positive = ▲, negative = ▼, 0 = "="); the close rate in percentage
 * points, null — shown "—" — when either window has no close rate (0 RF).
 */
export interface MetricDeltas {
  readonly rfCount: number;
  readonly submittedCount: number;
  readonly caseSize: Vnd;
  readonly issuedCount: number;
  readonly revenue: Vnd;
  readonly closeRatePoints: number | null;
}

export function metricDeltas(current: PeriodMetrics, previous: PeriodMetrics): MetricDeltas {
  return {
    rfCount: current.rfCount - previous.rfCount,
    submittedCount: current.submittedCount - previous.submittedCount,
    caseSize: current.caseSize - previous.caseSize,
    issuedCount: current.issuedCount - previous.issuedCount,
    revenue: current.revenue - previous.revenue,
    closeRatePoints:
      current.closeRate && previous.closeRate
        ? percent(current.closeRate) - percent(previous.closeRate)
        : null,
  };
}
