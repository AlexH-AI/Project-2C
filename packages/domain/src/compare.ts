import type { Money } from './money';
import {
  addDays,
  canShift,
  compareDates,
  customPeriod,
  daysBetween,
  sameDayYearBefore,
  shift,
  type CalendarDate,
  type Period,
} from './period';
import type { PeriodMetrics, Rate } from './stats';

const earlier = (a: CalendarDate, b: CalendarDate) => (compareDates(a, b) <= 0 ? a : b);

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
 * signed counts and money (positive = ▲, negative = ▼, 0 = "="); each rate in percentage points,
 * null — shown "—" — when either window has none: no RF for the close rate, no policy issued for
 * the cancel rate (golden B).
 */
export interface MetricDeltas {
  readonly rfCount: number;
  readonly submittedCount: number;
  readonly caseSize: Money;
  readonly issuedCount: number;
  readonly cancelledCount: number;
  readonly netCount: number;
  readonly issuedFyp: Money;
  readonly cancelledFyp: Money;
  readonly revenue: Money;
  readonly closeRatePoints: number | null;
  readonly cancelRatePoints: number | null;
}

/**
 * `current − previous` in percentage points, in one division of whole numbers, so a change at half
 * a tenth is exact and rounds up: 1/3 against 31/48 is −31.25, where two `closeRatePercent` taken
 * apart give −31.249999999999993.
 */
function pointsBetween(current: Rate | null, previous: Rate | null): number | null {
  if (!current || !previous) return null;
  const numerator =
    current.numerator * previous.denominator - previous.numerator * current.denominator;
  return (numerator * 100) / (current.denominator * previous.denominator);
}

export function metricDeltas(current: PeriodMetrics, previous: PeriodMetrics): MetricDeltas {
  return {
    rfCount: current.rfCount - previous.rfCount,
    submittedCount: current.submittedCount - previous.submittedCount,
    caseSize: current.caseSize - previous.caseSize,
    issuedCount: current.issuedCount - previous.issuedCount,
    cancelledCount: current.cancelledCount - previous.cancelledCount,
    netCount: current.netCount - previous.netCount,
    issuedFyp: current.issuedFyp - previous.issuedFyp,
    cancelledFyp: current.cancelledFyp - previous.cancelledFyp,
    revenue: current.revenue - previous.revenue,
    closeRatePoints: pointsBetween(current.closeRate, previous.closeRate),
    cancelRatePoints: pointsBetween(current.cancelRate, previous.cancelRate),
  };
}
