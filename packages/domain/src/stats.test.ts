import { describe, expect, it } from 'vitest';
import {
  APPOINTMENTS,
  APPOINTMENTS_B,
  EXPECTED_RF_APPOINTMENT_IDS_B,
  GOLDEN_B_CASES,
  GOLDEN_CASES,
  PEOPLE,
  POLICIES,
  POLICY_ROWS_B,
  STAGE_TRANSITIONS,
  STAGE_TRANSITIONS_B,
  type ExpectedMetrics,
  type PolicyCancellation,
} from './golden/metrics.fixture';
import type { Person, Policy, Scope } from './model';
import { calendarDate, chartMarks, customPeriod, periodOf, reportMarks } from './period';
import type { Period } from './period';
import { formatMoneyCompact, maxFee } from './money';
import {
  cancelRate,
  inScope,
  isRfAppointment,
  periodMetrics,
  periodMetricsByMark,
  periodMetricsByScope,
  policyMetrics,
  sumMetrics,
  type PeriodMetrics,
} from './stats';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);

/** The fields of `policyMetrics`: everything but RF and the two rates. */
const policyFields = (metrics: ExpectedMetrics | PeriodMetrics) => ({
  submittedCount: metrics.submittedCount,
  caseSize: metrics.caseSize,
  issuedCount: metrics.issuedCount,
  cancelledCount: metrics.cancelledCount,
  netCount: metrics.netCount,
  issuedFyp: metrics.issuedFyp,
  cancelledFyp: metrics.cancelledFyp,
  revenue: metrics.revenue,
});

/** No policy, no RF: every count and sum 0, both rates "—". */
const NOTHING: PeriodMetrics = {
  submittedCount: 0,
  caseSize: 0,
  issuedCount: 0,
  cancelledCount: 0,
  netCount: 0,
  issuedFyp: 0,
  cancelledFyp: 0,
  revenue: 0,
  rfCount: 0,
  closeRate: null,
  cancelRate: null,
};

describe('policyMetrics — golden examples (T-028)', () => {
  it.each(GOLDEN_CASES)('$id', ({ period, scope, expected }) => {
    expect(policyMetrics({ people: PEOPLE, policies: POLICIES }, period, scope)).toEqual(
      policyFields(expected),
    );
  });
});

/*
 * Golden B (`docs/golden/chi-so.md` mục 4): the repository never returns a deleted policy, so the
 * deleted rows are dropped here (`hd-19`, G38); G36 counts `hd-18` with its undone cancellation.
 */
const LIVE_B = POLICY_ROWS_B.filter((row) => !row.deleted).map((row) => row.policy);

const policiesB = (variant: PolicyCancellation | null): readonly Policy[] =>
  variant === null
    ? LIVE_B
    : LIVE_B.map((policy) =>
        policy.id === variant.policyId
          ? { ...policy, cancelledDate: variant.cancelledDate }
          : policy,
      );

const dataB = (variant: PolicyCancellation | null) => ({
  people: PEOPLE,
  policies: policiesB(variant),
  appointments: APPOINTMENTS_B,
  transitions: STAGE_TRANSITIONS_B,
});

const caseB = (id: string) => {
  const found = GOLDEN_B_CASES.find((golden) => golden.id === id);
  if (!found) throw new Error(`No golden row ${id}`);
  return found;
};

const metricsB = (id: string) => {
  const { period, scope, variant } = caseB(id);
  return periodMetrics(dataB(variant), period, scope);
};

describe('golden B — cancelled policies (G23–G41, mục 4.2)', () => {
  it.each(GOLDEN_B_CASES)('$id', ({ period, scope, expected, variant }) => {
    expect(periodMetrics(dataB(variant), period, scope)).toEqual(expected);
  });

  it.each(GOLDEN_B_CASES)('$id: by scope and by mark', ({ period, scope, expected, variant }) => {
    const data = dataB(variant);
    expect(periodMetricsByScope(data, period)(scope)).toEqual(expected);
    expect(periodMetricsByMark(data, [period], scope)).toEqual([expected]);
  });

  it('finds exactly the golden RF appointments of scenario B', () => {
    const ids = APPOINTMENTS_B.filter((a) => isRfAppointment(a, STAGE_TRANSITIONS_B)).map(
      (a) => a.id,
    );
    expect(ids).toEqual(EXPECTED_RF_APPOINTMENT_IDS_B);
  });
});

describe('sumMetrics — a total row (mục 4.3)', () => {
  it.each([
    [['G26', 'G27', 'G28'], 'G29'],
    [['G32', 'G33'], 'G30'],
    [['G25', 'G34'], 'G31'],
    [['G30', 'G31'], 'G29'],
    [['G29', 'G40'], 'G41'],
  ])('%j add up to %s', (parts, whole) => {
    expect(sumMetrics(parts.map(metricsB))).toEqual(caseB(whole).expected);
  });

  it('takes the cancel rate of a team from its totals, not the mean of its RM (G30, G31)', () => {
    // Team A: An 1/2 and Bình 1/1 would average 75%; Team B: Dũng 1/1 and Chi 1/3 ≈ 66.7%.
    expect(sumMetrics(['G32', 'G33'].map(metricsB)).cancelRate).toEqual({
      numerator: 2,
      denominator: 3,
    });
    expect(sumMetrics(['G25', 'G34'].map(metricsB)).cancelRate).toEqual({
      numerator: 2,
      denominator: 4,
    });
  });

  it('adds up to nothing for no rows', () => {
    expect(sumMetrics([])).toEqual(NOTHING);
  });

  it('refuses a total past the largest safe integer rather than round it', () => {
    const big = { ...NOTHING, issuedCount: 1, issuedFyp: Number.MAX_SAFE_INTEGER - 1 };
    expect(sumMetrics([big]).revenue).toBe(Number.MAX_SAFE_INTEGER - 1);
    expect(() => sumMetrics([big, big])).toThrow(RangeError);
  });
});

describe('cancelRate', () => {
  it('is cancelled ÷ issued, above 100% when more are cancelled than issued (G28: 2/1)', () => {
    expect(cancelRate(2, 1)).toEqual({ numerator: 2, denominator: 1 });
  });

  it('is 0%, not "—", when policies were issued and none cancelled (G23: 0/1)', () => {
    expect(cancelRate(0, 1)).toEqual({ numerator: 0, denominator: 1 });
  });

  it('is none when no policy was issued, cancelled ones or not (G24, G38)', () => {
    expect(cancelRate(1, 0)).toBeNull();
    expect(cancelRate(0, 0)).toBeNull();
  });
});

describe('policyMetrics', () => {
  const people: readonly Person[] = [
    { id: 're-1', name: 'RM 1', role: 'RM', teamId: 'team-1' },
    { id: 're-2', name: 'RM 2', role: 'RM', teamId: null },
  ];
  const policy = (
    id: string,
    rmId: string,
    submittedDate: Policy['submittedDate'],
    issuedDate: Policy['issuedDate'],
  ): Policy => ({
    id,
    customerId: 'kh',
    rmId,
    submittedDate,
    submittedFyp: 100,
    issuedDate,
    issuedFyp: issuedDate ? 90 : null,
    cancelledDate: null,
  });

  it('returns zeros for a period without policies', () => {
    expect(
      policyMetrics({ people, policies: [] }, periodOf('year', d(1, 1, 2027)), { kind: 'all' }),
    ).toEqual(policyFields(NOTHING));
  });

  it('keeps unissued policies out of issued count and revenue', () => {
    const policies = [policy('p1', 're-1', d(3, 1, 2027), null)];
    expect(
      policyMetrics({ people, policies }, periodOf('month', d(1, 1, 2027)), { kind: 'all' }),
    ).toEqual({ ...policyFields(NOTHING), submittedCount: 1, caseSize: 100 });
  });

  it('counts the first and the last day of the period in full', () => {
    const policies = [
      policy('p1', 're-1', d(9, 1, 2027), d(15, 1, 2027)),
      policy('p2', 're-1', d(8, 1, 2027), d(16, 1, 2027)),
      policy('p3', 're-1', d(10, 1, 2027), d(14, 1, 2027)),
      { ...policy('p4', 're-1', d(1, 1, 2027), d(2, 1, 2027)), cancelledDate: d(9, 1, 2027) },
      { ...policy('p5', 're-1', d(1, 1, 2027), d(2, 1, 2027)), cancelledDate: d(15, 1, 2027) },
      { ...policy('p6', 're-1', d(1, 1, 2027), d(2, 1, 2027)), cancelledDate: d(16, 1, 2027) },
    ];
    const period = customPeriod(d(9, 1, 2027), d(15, 1, 2027));
    expect(policyMetrics({ people, policies }, period, { kind: 'all' })).toEqual({
      submittedCount: 2,
      caseSize: 200,
      issuedCount: 2,
      cancelledCount: 2,
      netCount: 0,
      issuedFyp: 180,
      cancelledFyp: 180,
      revenue: 0,
    });
  });

  it('falls back to the submitted FYP when an issued policy has no issued FYP yet', () => {
    const policies = [{ ...policy('p1', 're-1', d(3, 1, 2027), d(5, 1, 2027)), issuedFyp: null }];
    expect(
      policyMetrics({ people, policies }, periodOf('month', d(1, 1, 2027)), { kind: 'all' })
        .revenue,
    ).toBe(100);
  });

  it('cancels the FYP it issued, the submitted one when it has none of its own', () => {
    const policies = [
      {
        ...policy('p1', 're-1', d(3, 12, 2026), d(5, 12, 2026)),
        issuedFyp: null,
        cancelledDate: d(4, 1, 2027),
      },
    ];
    expect(
      policyMetrics({ people, policies }, periodOf('month', d(1, 1, 2027)), { kind: 'all' }),
    ).toMatchObject({ issuedCount: 0, cancelledCount: 1, cancelledFyp: 100, revenue: -100 });
  });

  it('counts a policy for its RM’s team only, and not for an RM outside any team', () => {
    const policies = [
      policy('p1', 're-1', d(3, 1, 2027), null),
      policy('p2', 're-2', d(3, 1, 2027), null),
    ];
    const month = periodOf('month', d(1, 1, 2027));
    expect(
      policyMetrics({ people, policies }, month, { kind: 'team', teamId: 'team-1' }).submittedCount,
    ).toBe(1);
    expect(
      policyMetrics({ people, policies }, month, { kind: 'rm', rmId: 're-2' }).submittedCount,
    ).toBe(1);
    expect(policyMetrics({ people, policies }, month, { kind: 'all' }).submittedCount).toBe(2);
  });
});

describe('inScope', () => {
  const team = { kind: 'team', teamId: 'team-1' } as const;

  it('reads the team of the RM from the people list it is given', () => {
    const before: readonly Person[] = [{ id: 're-1', name: 'RM 1', role: 'RM', teamId: 'team-1' }];
    const after: readonly Person[] = [{ id: 're-1', name: 'RM 1', role: 'RM', teamId: 'team-2' }];
    expect(inScope(before, 're-1', team)).toBe(true);
    expect(inScope(after, 're-1', team)).toBe(false);
    expect(inScope(before, 're-1', team)).toBe(true);
  });

  it('leaves the people list untouched, so a later change is read', () => {
    const people: Person[] = [{ id: 're-1', name: 'RM 1', role: 'RM', teamId: 'team-1' }];
    expect(inScope(people, 're-2', team)).toBe(false);
    people.push({ id: 're-2', name: 'RM 2', role: 'RM', teamId: 'team-1' });
    expect(Object.isFrozen(people)).toBe(false);
    expect(inScope(people, 're-2', team)).toBe(true);
  });

  it('counts an RM for the team when any entry with that id is in the team', () => {
    const people: readonly Person[] = [
      { id: 're-1', name: 'RM 1', role: 'RM', teamId: 'team-1' },
      { id: 're-1', name: 'RM 1', role: 'RM', teamId: 'team-2' },
    ];
    expect(inScope(people, 're-1', team)).toBe(true);
    expect(inScope(people, 're-1', { kind: 'team', teamId: 'team-2' })).toBe(true);
  });

  it('leaves an RM outside any team, or not in the list, out of every team', () => {
    const people: readonly Person[] = [{ id: 're-1', name: 'RM 1', role: 'RM', teamId: null }];
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
    { kind: 'rm', rmId: 're-an' },
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

  // Golden B: a policy cancelled in a later week or month than its issue goes to the mark of its
  // cancellation day.
  const MARKS_B: Readonly<Record<string, readonly Period[]>> = {
    'days of 01/2028 – 02/2028': [d(1, 1, 2028), d(1, 2, 2028)]
      .map((day) => periodOf('month', day))
      .flatMap(chartMarks),
    'weeks of 01/2028 cut at the month': reportMarks(periodOf('month', d(1, 1, 2028))),
    'months of 2028': reportMarks(periodOf('year', d(1, 1, 2028))),
  };

  for (const [name, marks] of Object.entries(MARKS_B)) {
    it.each(SCOPES)(`equals periodMetrics of each mark, scenario B: ${name}, $kind`, (scope) => {
      const cancelled = dataB(null);
      expect(periodMetricsByMark(cancelled, marks, scope)).toEqual(
        marks.map((mark) => periodMetrics(cancelled, mark, scope)),
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
      rmId: 're-an',
      submittedDate: d(4, 1, 2027),
      submittedFyp: 100,
      issuedDate: d(12, 1, 2027),
      issuedFyp: null,
      cancelledDate: null,
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

// DR-20: So sánh team and Báo cáo read every team and RM of one period; grouped once by RM.
describe('periodMetricsByScope', () => {
  const extra = (id: string, rmId: string): Policy => ({
    ...POLICIES[0]!,
    id,
    rmId,
  });
  const people: readonly Person[] = [
    ...PEOPLE,
    { id: 're-solo', name: 'Solo', role: 'RM', teamId: null },
  ];
  // Records of a TL (once an RM), of an RM outside any team and of someone not listed, with golden
  // B's cancelled policies.
  const data = {
    people,
    policies: [
      ...POLICIES,
      ...LIVE_B,
      extra('p-tl', 'tl-ha'),
      extra('p-solo', 're-solo'),
      extra('p-x', 'x'),
      { ...extra('p-x-cancelled', 'x'), cancelledDate: d(20, 1, 2027) },
      // Issued without its own FYP: the FYP submitted counts as revenue, and as the FYP cancelled.
      { ...extra('p-fyp', 're-an'), issuedDate: d(12, 1, 2027), issuedFyp: null },
      {
        ...extra('p-fyp-cancelled', 're-solo'),
        issuedFyp: null,
        cancelledDate: d(3, 2, 2027),
      },
    ],
    appointments: [...APPOINTMENTS, ...APPOINTMENTS_B],
    transitions: [...STAGE_TRANSITIONS, ...STAGE_TRANSITIONS_B],
  };
  const SCOPES: readonly Scope[] = [
    { kind: 'all' },
    { kind: 'team', teamId: 'team-a' },
    { kind: 'team', teamId: 'team-b' },
    { kind: 'team', teamId: 'team-none' },
    ...[...people.map(({ id }) => id), 'x', 'nobody'].map((rmId): Scope => ({ kind: 'rm', rmId })),
  ];
  const PERIODS: readonly Period[] = [
    periodOf('month', d(1, 1, 2027)),
    periodOf('year', d(1, 1, 2027)),
    customPeriod(d(20, 12, 2026), d(10, 2, 2027)),
    periodOf('day', d(1, 6, 2030)),
    periodOf('month', d(1, 1, 2028)),
    periodOf('week', d(17, 1, 2028)),
    periodOf('year', d(1, 1, 2028)),
  ];

  for (const period of PERIODS) {
    it.each(SCOPES)(`equals periodMetrics: ${period.kind} ${period.start.year}, %o`, (scope) => {
      expect(periodMetricsByScope(data, period)(scope)).toEqual(periodMetrics(data, period, scope));
    });
  }

  it('golden examples (T-028)', () => {
    for (const { period, scope, expected } of GOLDEN_CASES) {
      const metrics = periodMetricsByScope(
        {
          people: PEOPLE,
          policies: POLICIES,
          appointments: APPOINTMENTS,
          transitions: STAGE_TRANSITIONS,
        },
        period,
      )(scope);
      expect(metrics).toEqual(expected);
    }
  });

  it('refuses a total past the largest safe integer rather than round it', () => {
    const big = (id: string, rmId: string): Policy => ({
      ...extra(id, rmId),
      submittedDate: d(5, 1, 2027),
      submittedFyp: Number.MAX_SAFE_INTEGER - 1,
      issuedDate: null,
    });
    const past = { ...data, policies: [big('p1', 're-an'), big('p2', 're-binh')] };
    const byScope = periodMetricsByScope(past, periodOf('month', d(1, 1, 2027)));
    expect(byScope({ kind: 'rm', rmId: 're-an' }).caseSize).toBe(Number.MAX_SAFE_INTEGER - 1);
    expect(() => byScope({ kind: 'team', teamId: 'team-a' })).toThrow(RangeError);
    expect(() => byScope({ kind: 'all' })).toThrow(RangeError);
  });
});

// DR-23: each fee is at most `maxFee`, so a real total stays exact; a total past a safe
// integer is refused, never rounded into a number the formatters reject later.
describe('totals of large fees', () => {
  const people: readonly Person[] = [{ id: 're-1', name: 'RM 1', role: 'RM', teamId: null }];
  const policy = (id: string, fyp: number): Policy => ({
    id,
    customerId: 'kh',
    rmId: 're-1',
    submittedDate: d(5, 10, 2026),
    submittedFyp: fyp,
    issuedDate: d(5, 10, 2026),
    issuedFyp: fyp,
    cancelledDate: null,
  });
  const data = (policies: readonly Policy[]) => ({
    people,
    policies,
    appointments: [],
    transitions: [],
  });
  const month = periodOf('month', d(1, 10, 2026));

  it('adds fees at the cap exactly, in a total the overview can show', () => {
    const atCap = data([policy('p1', maxFee('VND')), policy('p2', maxFee('VND'))]);
    const metrics = periodMetrics(atCap, month, { kind: 'all' });
    expect(metrics.caseSize).toBe(200_000_000_000);
    expect(metrics.revenue).toBe(200_000_000_000);
    expect(formatMoneyCompact(metrics.caseSize, 'VND', 'vi')).toBe('200 tỷ');
    expect(periodMetricsByMark(atCap, [month], { kind: 'all' })[0]?.caseSize).toBe(200_000_000_000);
  });

  it('refuses a total past the largest safe integer rather than round it', () => {
    const past = data([policy('p1', Number.MAX_SAFE_INTEGER), policy('p2', 2)]);
    expect(() => periodMetrics(past, month, { kind: 'all' })).toThrow(RangeError);
    expect(() => periodMetricsByMark(past, [month], { kind: 'all' })).toThrow(RangeError);
  });
});
