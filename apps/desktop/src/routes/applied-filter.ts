import { compareDates, type Period, type Scope } from '@p2c/domain';

/**
 * The period and scope the numbers of Tổng quan and Báo cáo are counted for. One picked on the
 * toolbar applies at once: there is no "Lọc" (ADR-0013 appendix 11/11/2026 §5).
 */
export interface FilterSelection {
  readonly period: Period;
  readonly scope: Scope;
}

const samePeriod = (a: Period, b: Period) =>
  a.kind === b.kind && compareDates(a.start, b.start) === 0 && compareDates(a.end, b.end) === 0;

function sameScope(a: Scope, b: Scope): boolean {
  switch (a.kind) {
    case 'all':
      return b.kind === 'all';
    case 'team':
      return b.kind === 'team' && a.teamId === b.teamId;
    case 'rm':
      return b.kind === 'rm' && a.rmId === b.rmId;
  }
}

/** The same period and scope, whether or not the same objects. */
export const sameSelection = (a: FilterSelection, b: FilterSelection): boolean =>
  samePeriod(a.period, b.period) && sameScope(a.scope, b.scope);
