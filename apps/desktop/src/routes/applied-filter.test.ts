import { calendarDate, customPeriod, periodOf, type Scope } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { sameSelection, type FilterSelection } from './applied-filter';

const today = calendarDate(2026, 10, 15);
const month = periodOf('month', today);
const year = periodOf('year', today);
const all: Scope = { kind: 'all' };
const rm: Scope = { kind: 'rm', rmId: 're-1' };

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
    [
      'a later last day of the Tùy chọn period alone',
      { period: customPeriod(month.start, calendarDate(2026, 10, 15)), scope: all },
      { period: customPeriod(month.start, calendarDate(2026, 10, 20)), scope: all },
    ],
    ['a team instead of all', { period: month, scope: all }, { period: month, scope: team }],
    ['another team', { period: month, scope: team }, { period: month, scope: otherTeam }],
    ['an RM instead of a team', { period: month, scope: team }, { period: month, scope: rm }],
    ['another RM', { period: month, scope: rm }, { period: month, scope: otherRm }],
  ])('fails for %s', (_, a, b) => {
    expect(sameSelection(a, b)).toBe(false);
  });
});
