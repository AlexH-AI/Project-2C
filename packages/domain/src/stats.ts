/**
 * Stats engine (ADR-0007, golden examples approved at G2 in T-028). Every metric is computed for
 * one period and one scope from the raw records; nothing is accumulated across periods.
 * FYP amounts are integer đồng (see `model.ts`), so sums stay exact.
 */
import type { Person, Policy, Scope } from './model';
import { isInPeriod } from './period';
import type { Period } from './period';

export interface PolicyMetrics {
  /** HĐ đã nộp: policies with `submittedDate` in the period. */
  readonly submittedCount: number;
  /** Case size: Σ `submittedFyp` of the submitted policies. */
  readonly caseSize: number;
  /** HĐ phát hành: policies with `issuedDate` in the period. */
  readonly issuedCount: number;
  /** Doanh số: Σ `issuedFyp` of the issued policies. */
  readonly revenue: number;
}

/**
 * Whether a record owned by `reId` counts in the scope. A record counts for its RE and for that
 * RE's current team (G2 E).
 */
export function inScope(people: readonly Person[], reId: string, scope: Scope): boolean {
  switch (scope.kind) {
    case 'all':
      return true;
    case 're':
      return reId === scope.reId;
    case 'team':
      return people.some((person) => person.id === reId && person.teamId === scope.teamId);
  }
}

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

export function policyMetrics(
  data: { readonly people: readonly Person[]; readonly policies: readonly Policy[] },
  period: Period,
  scope: Scope,
): PolicyMetrics {
  const policies = data.policies.filter((policy) => inScope(data.people, policy.reId, scope));
  const submitted = policies.filter((policy) => isInPeriod(policy.submittedDate, period));
  const issued = policies.filter(
    (policy) => policy.issuedDate !== null && isInPeriod(policy.issuedDate, period),
  );
  return {
    submittedCount: submitted.length,
    caseSize: sum(submitted.map((policy) => policy.submittedFyp)),
    issuedCount: issued.length,
    revenue: sum(issued.map((policy) => policy.issuedFyp ?? policy.submittedFyp)),
  };
}
