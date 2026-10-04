import { compareDates, type Period, type Scope } from '@p2c/domain';

/** The period and scope a screen's numbers are counted for. */
export interface FilterSelection {
  readonly period: Period;
  readonly scope: Scope;
}

/**
 * The "Lọc" bar of Tổng quan and Báo cáo (spec Phase 4 §4.3, mockup overview.html 1d): a period or
 * scope chosen is applied only on Lọc; until then the numbers keep the applied selection.
 */
export interface FilterState {
  readonly chosen: FilterSelection;
  readonly applied: FilterSelection;
}

const samePeriod = (a: Period, b: Period) =>
  a.kind === b.kind && compareDates(a.start, b.start) === 0 && compareDates(a.end, b.end) === 0;

function sameScope(a: Scope, b: Scope): boolean {
  switch (a.kind) {
    case 'all':
      return b.kind === 'all';
    case 'team':
      return b.kind === 'team' && a.teamId === b.teamId;
    case 're':
      return b.kind === 're' && a.reId === b.reId;
  }
}

/** The same period and scope, whether or not the same objects. */
export const sameSelection = (a: FilterSelection, b: FilterSelection): boolean =>
  samePeriod(a.period, b.period) && sameScope(a.scope, b.scope);

/** A screen opens with its selection applied already. */
export const startFilter = (selection: FilterSelection): FilterState => ({
  chosen: selection,
  applied: selection,
});

export const chooseFilter = (state: FilterState, chosen: FilterSelection): FilterState => ({
  ...state,
  chosen,
});

export const applyFilter = (state: FilterState): FilterState => startFilter(state.chosen);

/** The choice differs from the numbers shown: Lọc is highlighted with a reminder beside it. */
export const isPending = ({ chosen, applied }: FilterState): boolean =>
  !sameSelection(chosen, applied);
