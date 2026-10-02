import { describe, expect, it } from 'vitest';
import { GOLDEN_CASES, PEOPLE, POLICIES } from './golden/metrics.fixture';
import type { Person, Policy } from './model';
import { calendarDate, customPeriod, periodOf } from './period';
import { inScope, policyMetrics } from './stats';

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

  it('leaves an RE outside any team, or not in the list, out of every team', () => {
    const people: readonly Person[] = [{ id: 're-1', name: 'RE 1', role: 'RE', teamId: null }];
    expect(inScope(people, 're-1', team)).toBe(false);
    expect(inScope(people, 're-9', team)).toBe(false);
    expect(inScope(people, 're-9', { kind: 'all' })).toBe(true);
  });
});
