import { describe, expect, it } from 'vitest';
import {
  APPOINTMENTS,
  GOLDEN_CASES,
  PEOPLE,
  POLICIES,
  STAGE_TRANSITIONS,
} from './golden/metrics.fixture';
import type { Person, Policy, Scope } from './model';
import { calendarDate, chartMarks, customPeriod, periodOf, reportMarks } from './period';
import type { Period } from './period';
import { formatVndCompact, MAX_FEE_VND } from './money';
import { inScope, periodMetrics, periodMetricsByMark, policyMetrics } from './stats';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);

describe('policyMetrics — golden examples (T-028)', () => {
  it.each(GOLDEN_CASES)('$id', ({ period, scope, expected }) => {
    expect(policyMetrics({ people: PEOPLE, policies: POLICIES }, period, scope)).toEqual({
      submittedCount: expected.submittedCount,
      caseSize: expected.caseSize,
      issuedCount: expected.issuedCount,
      revenue: expected.revenue,
    });
  });
});

describe('policyMetrics', () => {
  const people: readonly Person[] = [
    { id: 're-1', name: 'RE 1', role: 'RE', teamId: 'team-1' },
    { id: 're-2', name: 'RE 2', role: 'RE', teamId: null },
  ];
  const policy = (
    id: string,
    reId: string,
    submittedDate: Policy['submittedDate'],
    issuedDate: Policy['issuedDate'],
  ): Policy => ({
    id,
    customerId: 'kh',
    reId,
    submittedDate,
    submittedFyp: 100,
    issuedDate,
    issuedFyp: issuedDate ? 90 : null,
  });

  it('returns zeros for a period without policies', () => {
    expect(
      policyMetrics({ people, policies: [] }, periodOf('year', d(1, 1, 2027)), { kind: 'all' }),
    ).toEqual({ submittedCount: 0, caseSize: 0, issuedCount: 0, revenue: 0 });
  });

  it('keeps unissued policies out of issued count and revenue', () => {
    const policies = [policy('p1', 're-1', d(3, 1, 2027), null)];
    expect(
      policyMetrics({ people, policies }, periodOf('month', d(1, 1, 2027)), { kind: 'all' }),
    ).toEqual({ submittedCount: 1, caseSize: 100, issuedCount: 0, revenue: 0 });
  });

  it('counts the first and the last day of the period in full', () => {
    const policies = [
      policy('p1', 're-1', d(9, 1, 2027), d(15, 1, 2027)),
      policy('p2', 're-1', d(8, 1, 2027), d(16, 1, 2027)),
      policy('p3', 're-1', d(10, 1, 2027), d(14, 1, 2027)),
    ];
    const period = customPeriod(d(9, 1, 2027), d(15, 1, 2027));
    expect(policyMetrics({ people, policies }, period, { kind: 'all' })).toEqual({
      submittedCount: 2,
      caseSize: 200,
      issuedCount: 2,
      revenue: 180,
    });
  });

  it('falls back to the submitted FYP when an issued policy has no issued FYP yet', () => {
    const policies = [{ ...policy('p1', 're-1', d(3, 1, 2027), d(5, 1, 2027)), issuedFyp: null }];
    expect(
      policyMetrics({ people, policies }, periodOf('month', d(1, 1, 2027)), { kind: 'all' })
        .revenue,
    ).toBe(100);
  });

  it('counts a policy for its RE’s team only, and not for an RE outside any team', () => {
    const policies = [
      policy('p1', 're-1', d(3, 1, 2027), null),
      policy('p2', 're-2', d(3, 1, 2027), null),
    ];
    const month = periodOf('month', d(1, 1, 2027));
    expect(
      policyMetrics({ people, policies }, month, { kind: 'team', teamId: 'team-1' }).submittedCount,
    ).toBe(1);
    expect(
      policyMetrics({ people, policies }, month, { kind: 're', reId: 're-2' }).submittedCount,
    ).toBe(1);
    expect(policyMetrics({ people, policies }, month, { kind: 'all' }).submittedCount).toBe(2);
  });
});

describe('inScope', () => {
  const team = { kind: 'team', teamId: 'team-1' } as const;

  it('reads the team of the RE from the people list it is given', () => {
    const before: readonly Person[] = [{ id: 're-1', name: 'RE 1', role: 'RE', teamId: 'team-1' }];
    const after: readonly Person[] = [{ id: 're-1', name: 'RE 1', role: 'RE', teamId: 'team-2' }];
    expect(inScope(before, 're-1', team)).toBe(true);
    expect(inScope(after, 're-1', team)).toBe(false);
    expect(inScope(before, 're-1', team)).toBe(true);
  });

  it('leaves the people list untouched, so a later change is read', () => {
    const people: Person[] = [{ id: 're-1', name: 'RE 1', role: 'RE', teamId: 'team-1' }];
    expect(inScope(people, 're-2', team)).toBe(false);
    people.push({ id: 're-2', name: 'RE 2', role: 'RE', teamId: 'team-1' });
    expect(Object.isFrozen(people)).toBe(false);
    expect(inScope(people, 're-2', team)).toBe(true);
  });

  it('counts an RE for the team when any entry with that id is in the team', () => {
    const people: readonly Person[] = [
      { id: 're-1', name: 'RE 1', role: 'RE', teamId: 'team-1' },
      { id: 're-1', name: 'RE 1', role: 'RE', teamId: 'team-2' },
    ];
    expect(inScope(people, 're-1', team)).toBe(true);
    expect(inScope(people, 're-1', { kind: 'team', teamId: 'team-2' })).toBe(true);
  });

  it('leaves an RE outside any team, or not in the list, out of every team', () => {
    const people: readonly Person[] = [{ id: 're-1', name: 'RE 1', role: 'RE', teamId: null }];
    expect(inScope(people, 're-1', team)).toBe(false);
    expect(inScope(people, 're-9', team)).toBe(false);
    expect(inScope(people, 're-9', { kind: 'all' })).toBe(true);
  });
});

describe('periodMetricsByMark', () => {
  const data = {
    people: PEOPLE,
    policies: POLICIES,
    appointments: APPOINTMENTS,
    transitions: STAGE_TRANSITIONS,
  };
  const SCOPES: readonly Scope[] = [
    { kind: 'all' },
    { kind: 'team', teamId: 'team-b' },
    { kind: 're', reId: 're-an' },
  ];
  const months = [d(1, 12, 2026), d(1, 1, 2027), d(1, 2, 2027)].map((day) =>
    periodOf('month', day),
  );
  const MARKS: Readonly<Record<string, readonly Period[]>> = {
    'days of 01/12/2026 – 28/02/2027': months.flatMap(chartMarks),
    'weeks of 01/2027 cut at the month': reportMarks(periodOf('month', d(1, 1, 2027))),
    'months of 2027': reportMarks(periodOf('year', d(1, 1, 2027))),
    'months of a custom range': reportMarks(customPeriod(d(20, 12, 2026), d(10, 2, 2027))),
  };

  for (const [name, marks] of Object.entries(MARKS)) {
    it.each(SCOPES)(`equals periodMetrics of each mark: ${name}, $kind`, (scope) => {
      expect(periodMetricsByMark(data, marks, scope)).toEqual(
        marks.map((mark) => periodMetrics(data, mark, scope)),
      );
    });
  }

  it('counts a record between two marks in neither', () => {
    const marks = [customPeriod(d(1, 1, 2027), d(10, 1, 2027)), periodOf('day', d(20, 1, 2027))];
    const gap = customPeriod(d(11, 1, 2027), d(19, 1, 2027));
    expect(periodMetrics(data, gap, { kind: 'all' }).submittedCount).toBeGreaterThan(0);
    expect(periodMetricsByMark(data, marks, { kind: 'all' })).toEqual(
      marks.map((mark) => periodMetrics(data, mark, { kind: 'all' })),
    );
  });

  it('counts the FYP submitted as revenue when the policy was issued without its own', () => {
    const issued: Policy = {
      id: 'p-issued',
      customerId: 'kh',
      reId: 're-an',
      submittedDate: d(4, 1, 2027),
      submittedFyp: 100,
      issuedDate: d(12, 1, 2027),
      issuedFyp: null,
    };
    const marks = reportMarks(periodOf('month', d(1, 1, 2027)));
    const policies = { ...data, policies: [issued] };
    expect(periodMetricsByMark(policies, marks, { kind: 'all' })[2]?.revenue).toBe(100);
    expect(periodMetricsByMark(policies, marks, { kind: 'all' })).toEqual(
      marks.map((mark) => periodMetrics(policies, mark, { kind: 'all' })),
    );
  });

  it('has no rows for no marks', () => {
    expect(periodMetricsByMark(data, [], { kind: 'all' })).toEqual([]);
  });

  it('refuses marks out of order or overlapping, rather than count a record twice', () => {
    const jan = periodOf('month', d(1, 1, 2027));
    const feb = periodOf('month', d(1, 2, 2027));
    expect(() => periodMetricsByMark(data, [feb, jan], { kind: 'all' })).toThrow(RangeError);
    expect(() =>
      periodMetricsByMark(data, [jan, periodOf('day', d(31, 1, 2027))], { kind: 'all' }),
    ).toThrow(RangeError);
  });

  it('refuses marks out of order even when none overlaps and all sit inside the range', () => {
    const [jan, feb, mar, apr] = [1, 2, 3, 4].map((month) => periodOf('month', d(1, month, 2027)));
    expect(() => periodMetricsByMark(data, [jan!, mar!, feb!, apr!], { kind: 'all' })).toThrow(
      RangeError,
    );
  });

  // DR-41: `customPeriod` refuses a range ending before it starts, so the mark is built by hand.
  it('refuses a mark that ends before it starts', () => {
    const jan = periodOf('month', d(1, 1, 2027));
    const backwards: Period = {
      ...customPeriod(d(10, 2, 2027), d(20, 2, 2027)),
      end: d(5, 2, 2027),
    };
    expect(() => periodMetricsByMark(data, [jan, backwards], { kind: 'all' })).toThrow(
      /out of order or overlaps/,
    );
  });
});

// DR-23: each fee is at most `MAX_FEE_VND`, so a real total stays exact; a total past a safe
// integer is refused, never rounded into a number the formatters reject later.
describe('totals of large fees', () => {
  const people: readonly Person[] = [{ id: 're-1', name: 'RE 1', role: 'RE', teamId: null }];
  const policy = (id: string, fyp: number): Policy => ({
    id,
    customerId: 'kh',
    reId: 're-1',
    submittedDate: d(5, 10, 2026),
    submittedFyp: fyp,
    issuedDate: d(5, 10, 2026),
    issuedFyp: fyp,
  });
  const data = (policies: readonly Policy[]) => ({
    people,
    policies,
    appointments: [],
    transitions: [],
  });
  const month = periodOf('month', d(1, 10, 2026));

  it('adds fees at the cap exactly, in a total the overview can show', () => {
    const atCap = data([policy('p1', MAX_FEE_VND), policy('p2', MAX_FEE_VND)]);
    const metrics = periodMetrics(atCap, month, { kind: 'all' });
    expect(metrics.caseSize).toBe(200_000_000_000);
    expect(metrics.revenue).toBe(200_000_000_000);
    expect(formatVndCompact(metrics.caseSize)).toBe('200 tỷ');
    expect(periodMetricsByMark(atCap, [month], { kind: 'all' })[0]?.caseSize).toBe(200_000_000_000);
  });

  it('refuses a total past the largest safe integer rather than round it', () => {
    const past = data([policy('p1', Number.MAX_SAFE_INTEGER), policy('p2', 2)]);
    expect(() => periodMetrics(past, month, { kind: 'all' })).toThrow(RangeError);
    expect(() => periodMetricsByMark(past, [month], { kind: 'all' })).toThrow(RangeError);
  });
});
