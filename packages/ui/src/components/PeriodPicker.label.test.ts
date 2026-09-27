import { describe, expect, it } from 'vitest';
import { calendarDate, customPeriod, periodOf } from '@p2c/domain';
import { periodLabel } from './PeriodPicker.label';

const today = calendarDate(2026, 9, 28);
const labels = { monthLabel: 'Tháng {value}', yearLabel: 'Năm {value}' };

describe('periodLabel', () => {
  it('wraps month and year in their label templates', () => {
    expect(periodLabel(periodOf('month', today), labels)).toBe('Tháng 09/2026');
    expect(periodLabel(periodOf('year', today), labels)).toBe('Năm 2026');
  });

  it('follows the templates it is given', () => {
    const english = { monthLabel: 'Month {value}', yearLabel: 'Year {value}' };
    expect(periodLabel(periodOf('month', today), english)).toBe('Month 09/2026');
    expect(periodLabel(periodOf('year', today), english)).toBe('Year 2026');
  });

  it('shows day, week and custom periods as bare dates', () => {
    expect(periodLabel(periodOf('day', today), labels)).toBe('28/09/2026');
    expect(periodLabel(periodOf('week', today), labels)).toBe('28/09 – 04/10/2026');
    const range = customPeriod(calendarDate(2026, 9, 1), calendarDate(2026, 9, 10));
    expect(periodLabel(range, labels)).toBe('01/09 – 10/09/2026');
  });
});
