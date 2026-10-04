import { calendarDate, periodOf, type Scope } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { applyFilter, chooseFilter, isPending, startFilter } from './applied-filter';

const today = calendarDate(2026, 10, 15);
const month = periodOf('month', today);
const year = periodOf('year', today);
const all: Scope = { kind: 'all' };
const re: Scope = { kind: 're', reId: 're-1' };

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
      scope: re,
    });

    expect(isPending(filter)).toBe(true);
    expect(filter.applied.scope).toEqual(all);
  });

  it('Lọc applies the choice and nothing is waiting any more', () => {
    const chosen = { period: year, scope: re };
    const filter = applyFilter(chooseFilter(startFilter({ period: month, scope: all }), chosen));

    expect(filter.applied).toEqual(chosen);
    expect(isPending(filter)).toBe(false);
  });

  it('choosing the applied selection again leaves nothing waiting', () => {
    const start = startFilter({ period: month, scope: re });
    const away = chooseFilter(start, { period: year, scope: re });
    const back = chooseFilter(away, { period: periodOf('month', today), scope: { ...re } });

    expect(isPending(back)).toBe(false);
  });
});
