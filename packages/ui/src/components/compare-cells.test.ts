import { describe, expect, it } from 'vitest';
import { calendarDate } from '@p2c/domain';
import { compareCells, compareCellsThen } from './compare-cells';

describe('compareCells', () => {
  it('orders text with Vietnamese collation, ignoring case', () => {
    const names = ['Đào Minh', 'an Khang', 'Bình', 'Ân Thị'];
    expect([...names].sort((a, b) => compareCells('text', a, b))).toEqual([
      'an Khang',
      'Ân Thị',
      'Bình',
      'Đào Minh',
    ]);
  });

  it('orders numbers by value, not as text', () => {
    expect([10, 9, 100].sort((a, b) => compareCells('number', a, b))).toEqual([9, 10, 100]);
  });

  it('orders dates by time: 01/10 after 30/09', () => {
    expect(
      compareCells('date', calendarDate(2026, 10, 1), calendarDate(2026, 9, 30)),
    ).toBeGreaterThan(0);
  });
});

describe('compareCellsThen', () => {
  const day = calendarDate(2026, 9, 30);
  const sorted = (times: string[]) =>
    [...times].sort((a, b) => compareCellsThen('date', day, day, a, b));

  it('orders two cells of the same day by their tie-break, empty first', () => {
    expect(sorted(['15:00', '', '08:00'])).toEqual(['', '08:00', '15:00']);
  });

  it('lets the cell decide before the tie-break', () => {
    expect(compareCellsThen('date', calendarDate(2026, 9, 29), day, '23:00', '01:00')).toBeLessThan(
      0,
    );
  });
});
