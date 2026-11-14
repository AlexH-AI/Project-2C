import { calendarDate, customPeriod, periodOf, type Scope } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  applyFilter,
  chooseFilter,
  isPending,
  sameSelection,
  startFilter,
  type FilterSelection,
} from './applied-filter';

const today = calendarDate(2026, 10, 15);
const month = periodOf('month', today);
const year = periodOf('year', today);
const all: Scope = { kind: 'all' };
const rm: Scope = { kind: 'rm', rmId: 're-1' };

describe('applied filter (Lọc)', () => {
  it('opens with the selection already applied', () => {
    const filter = startFilter({ period: month, scope: all });

    expect(filter.applied).toEqual({ period: month, scope: all });
    expect(isPending(filter)).toBe(false);
  });

  it('a new period is waiting until Lọc: the numbers keep the applied selection', () => {
    const filter = chooseFilter(startFilter({ period: month, scope: all }), {
      period: year,
      scope: all,
    });

    expect(isPending(filter)).toBe(true);
    expect(filter.applied.period).toEqual(month);
  });

  it('a new scope is waiting too', () => {
    const filter = chooseFilter(startFilter({ period: month, scope: all }), {
      period: month,
      scope: rm,
    });

    expect(isPending(filter)).toBe(true);
    expect(filter.applied.scope).toEqual(all);
  });

  it('a new last day of the Tùy chọn period alone is waiting too', () => {
    const applied = customPeriod(calendarDate(2026, 10, 1), calendarDate(2026, 10, 15));
    const later = customPeriod(calendarDate(2026, 10, 1), calendarDate(2026, 10, 20));
    const filter = chooseFilter(startFilter({ period: applied, scope: all }), {
      period: later,
      scope: all,
    });

    expect(isPending(filter)).toBe(true);
  });

  it('Lọc applies the choice and nothing is waiting any more', () => {
    const chosen = { period: year, scope: rm };
    const filter = applyFilter(chooseFilter(startFilter({ period: month, scope: all }), chosen));

    expect(filter.applied).toEqual(chosen);
    expect(isPending(filter)).toBe(false);
  });

  it('choosing the applied selection again leaves nothing waiting', () => {
    const start = startFilter({ period: month, scope: rm });
    const away = chooseFilter(start, { period: year, scope: rm });
    const back = chooseFilter(away, { period: periodOf('month', today), scope: { ...rm } });

    expect(isPending(back)).toBe(false);
  });
});

describe('sameSelection', () => {
  const team: Scope = { kind: 'team', teamId: 'team-1' };

  it('holds for the same period and scope made anew', () => {
    expect(
      sameSelection(
        { period: month, scope: rm },
        { period: periodOf('month', today), scope: { ...rm } },
      ),
    ).toBe(true);
    expect(
      sameSelection({ period: year, scope: all }, { period: year, scope: { kind: 'all' } }),
    ).toBe(true);
  });

  const otherRm: Scope = { kind: 'rm', rmId: 're-2' };
  const otherTeam: Scope = { kind: 'team', teamId: 'team-2' };
  it.each<[string, FilterSelection, FilterSelection]>([
    [
      'another month',
      { period: month, scope: all },
      { period: periodOf('month', calendarDate(2026, 9, 1)), scope: all },
    ],
    [
      'a custom period of the same days',
      { period: month, scope: all },
      { period: customPeriod(month.start, month.end), scope: all },
    ],
    ['a team instead of all', { period: month, scope: all }, { period: month, scope: team }],
    ['another team', { period: month, scope: team }, { period: month, scope: otherTeam }],
    ['an RM instead of a team', { period: month, scope: team }, { period: month, scope: rm }],
    ['another RM', { period: month, scope: rm }, { period: month, scope: otherRm }],
  ])('fails for %s', (_, a, b) => {
    expect(sameSelection(a, b)).toBe(false);
  });
});
