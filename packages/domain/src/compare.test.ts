import { describe, expect, it } from 'vitest';
import { comparisonWindows, metricDeltas } from './compare';
import {
  APPOINTMENTS,
  MTD_VIEWING_DATE,
  PEOPLE,
  POLICIES,
  STAGE_TRANSITIONS,
} from './golden/metrics.fixture';
import {
  calendarDate,
  customPeriod,
  formatDate,
  periodOf,
  type CalendarDate,
  type Period,
} from './period';
import { closeRate, periodMetrics, type PeriodMetrics } from './stats';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);

/** `dd/mm/yyyy – dd/mm/yyyy`, so a failing case reads like the spec table. */
const span = (period: Period) => `${formatDate(period.start)} – ${formatDate(period.end)}`;

const windows = (period: Period, today: CalendarDate) => {
  const result = comparisonWindows(period, today);
  return result && { current: span(result.current), previous: span(result.previous) };
};

describe('comparisonWindows (spec Phase 4 §4.2)', () => {
  it('C01: a month in progress compares its first days with the same days of the month before', () => {
    expect(windows(periodOf('month', d(1, 1, 2027)), d(13, 1, 2027))).toEqual({
      current: '01/01/2027 – 13/01/2027',
      previous: '01/12/2026 – 13/12/2026',
    });
  });

  it('C02: the days compared stop at the end of a shorter month before', () => {
    expect(windows(periodOf('month', d(1, 3, 2027)), d(31, 3, 2027))).toEqual({
      current: '01/03/2027 – 31/03/2027',
      previous: '01/02/2027 – 28/02/2027',
    });
  });

  it('a month in progress longer than the month before compares with the whole month before', () => {
    expect(windows(periodOf('month', d(1, 3, 2027)), d(30, 3, 2027))).toEqual({
      current: '01/03/2027 – 30/03/2027',
      previous: '01/02/2027 – 28/02/2027',
    });
  });

  it('C03: a period that has ended compares in full with the whole period before', () => {
    expect(windows(periodOf('month', d(1, 12, 2026)), d(13, 1, 2027))).toEqual({
      current: '01/12/2026 – 31/12/2026',
      previous: '01/11/2026 – 30/11/2026',
    });
  });

  it('C04: a week in progress compares Monday → today with Monday → the same weekday before', () => {
    expect(windows(periodOf('week', d(13, 1, 2027)), d(13, 1, 2027))).toEqual({
      current: '11/01/2027 – 13/01/2027',
      previous: '04/01/2027 – 06/01/2027',
    });
  });

  it('C05: today compares with yesterday', () => {
    expect(windows(periodOf('day', d(13, 1, 2027)), d(13, 1, 2027))).toEqual({
      current: '13/01/2027 – 13/01/2027',
      previous: '12/01/2027 – 12/01/2027',
    });
  });

  it('C06: a year in progress compares 01/01 → today with 01/01 → the same day a year before', () => {
    expect(windows(periodOf('year', d(13, 1, 2027)), d(13, 1, 2027))).toEqual({
      current: '01/01/2027 – 13/01/2027',
      previous: '01/01/2026 – 13/01/2026',
    });
  });

  it('C07: on 29/02 a year in progress compares with 01/01 → 28/02, not by the number of days', () => {
    expect(windows(periodOf('year', d(29, 2, 2028)), d(29, 2, 2028))).toEqual({
      current: '01/01/2028 – 29/02/2028',
      previous: '01/01/2027 – 28/02/2027',
    });
  });

  it('a year in progress on 28/02 of a leap year compares with 01/01 → 28/02 a year before', () => {
    expect(windows(periodOf('year', d(28, 2, 2028)), d(28, 2, 2028))).toEqual({
      current: '01/01/2028 – 28/02/2028',
      previous: '01/01/2027 – 28/02/2027',
    });
  });

  it('C10: the last day of a month is still in progress and compares the same number of days', () => {
    expect(windows(periodOf('month', d(1, 4, 2027)), d(30, 4, 2027))).toEqual({
      current: '01/04/2027 – 30/04/2027',
      previous: '01/03/2027 – 30/03/2027',
    });
  });

  it('C11: on 28/02 February compares with 01/01 → 28/01', () => {
    expect(windows(periodOf('month', d(1, 2, 2027)), d(28, 2, 2027))).toEqual({
      current: '01/02/2027 – 28/02/2027',
      previous: '01/01/2027 – 28/01/2027',
    });
  });

  it('on 29/02 of a leap year February compares with 01/01 → 29/01', () => {
    expect(windows(periodOf('month', d(1, 2, 2028)), d(29, 2, 2028))).toEqual({
      current: '01/02/2028 – 29/02/2028',
      previous: '01/01/2028 – 29/01/2028',
    });
  });

  it.each([
    ['a day', 'day', d(13, 1, 2027), '13/01/2027 – 13/01/2027', '12/01/2027 – 12/01/2027'],
    [
      'a week on Sunday',
      'week',
      d(17, 1, 2027),
      '11/01/2027 – 17/01/2027',
      '04/01/2027 – 10/01/2027',
    ],
    [
      'a year on 31/12',
      'year',
      d(31, 12, 2027),
      '01/01/2027 – 31/12/2027',
      '01/01/2026 – 31/12/2026',
    ],
  ] as const)(
    'on the last day of %s the windows are the whole periods',
    (_, kind, today, current, previous) => {
      expect(windows(periodOf(kind, today), today)).toEqual({ current, previous });
    },
  );

  it('C08: a period that has not started is not compared', () => {
    expect(comparisonWindows(periodOf('month', d(1, 2, 2027)), d(13, 1, 2027))).toBeNull();
  });

  it('C09: a custom range is not compared, even in progress', () => {
    expect(
      comparisonWindows(customPeriod(d(5, 1, 2027), d(20, 1, 2027)), d(13, 1, 2027)),
    ).toBeNull();
  });

  it.each([
    ['day 01/01/1900', periodOf('day', d(1, 1, 1900)), d(1, 1, 1900)],
    ['week 01/01 – 07/01/1900', periodOf('week', d(1, 1, 1900)), d(3, 1, 1900)],
    ['month 01/1900, ended', periodOf('month', d(1, 1, 1900)), d(13, 2, 1900)],
    ['year 1900, in progress', periodOf('year', d(1, 1, 1900)), d(13, 1, 1900)],
    ['year 1900, ended', periodOf('year', d(1, 1, 1900)), d(13, 1, 1901)],
  ])('%s is not compared: the period before is not in 1900–2100 (§3)', (_, period, today) => {
    expect(comparisonWindows(period, today)).toBeNull();
  });

  it('compares the last periods of 2100, the week cut at 31/12 included', () => {
    const lastDay = d(31, 12, 2100);
    expect(windows(periodOf('year', lastDay), lastDay)).toEqual({
      current: '01/01/2100 – 31/12/2100',
      previous: '01/01/2099 – 31/12/2099',
    });
    // The week cut at 31/12 (Monday → Friday) is still in progress on its last day: 5 days against 5.
    expect(windows(periodOf('week', lastDay), lastDay)).toEqual({
      current: '27/12/2100 – 31/12/2100',
      previous: '20/12/2100 – 24/12/2100',
    });
  });
});

describe('metricDeltas (spec Phase 4 §4.2)', () => {
  const MILLION = 1_000_000;

  it('golden chi-so.md, MTD 01/2027 on 15/01/2027: ▲ on every count and sum, no close-rate delta', () => {
    const data = {
      people: PEOPLE,
      policies: POLICIES,
      appointments: APPOINTMENTS,
      transitions: STAGE_TRANSITIONS,
    };
    const all = { kind: 'all' } as const;
    const found = comparisonWindows(periodOf('month', MTD_VIEWING_DATE), MTD_VIEWING_DATE);
    if (!found) throw new Error('MTD 01/2027 must be compared');
    expect(span(found.previous)).toBe('01/12/2026 – 15/12/2026');

    const current = periodMetrics(data, found.current, all);
    const previous = periodMetrics(data, found.previous, all);
    expect(metricDeltas(current, previous)).toEqual({
      rfCount: 3,
      submittedCount: 2,
      caseSize: 400 * MILLION,
      issuedCount: 2,
      revenue: 900 * MILLION,
      closeRatePoints: null,
    });
  });

  const metrics = (rfCount: number, issuedCount: number, revenue = 0): PeriodMetrics => ({
    submittedCount: 0,
    caseSize: 0,
    issuedCount,
    revenue,
    rfCount,
    closeRate: closeRate(issuedCount, rfCount),
  });

  it('gives the close-rate change in percentage points: 3/4 = 75% after 1/2 = 50% is ▲ 25', () => {
    expect(metricDeltas(metrics(4, 3), metrics(2, 1)).closeRatePoints).toBe(25);
  });

  it('signs a fall as negative: 0/2 = 0% after 2/4 = 50% is ▼ 50 points', () => {
    expect(metricDeltas(metrics(2, 0, 100), metrics(4, 2, 300))).toMatchObject({
      rfCount: -2,
      issuedCount: -2,
      revenue: -200,
      closeRatePoints: -50,
    });
  });

  it('gives no close-rate change when the current window has no RF', () => {
    expect(metricDeltas(metrics(0, 1), metrics(2, 1)).closeRatePoints).toBeNull();
  });
});
