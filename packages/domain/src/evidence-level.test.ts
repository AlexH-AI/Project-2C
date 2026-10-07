import { describe, expect, it } from 'vitest';
import { evidenceLevel, type EvidenceFact } from './evidence-level';
import { calendarDate, type CalendarDate } from './period';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);
const facts = (codes: readonly string[], date: CalendarDate): EvidenceFact[] =>
  codes.map((code) => ({ code, confirmedDate: date }));
const level = (analysisDate: CalendarDate, list: readonly EvidenceFact[]) =>
  evidenceLevel({ analysisDate, facts: list as [EvidenceFact, ...EvidenceFact[]] });

// Golden B01–B11, spec Phase 5 §6.3 (Owner, G2 07/10/2026).
describe('evidenceLevel (golden B01–B11)', () => {
  const day = d(7, 10, 2026);
  const recent = d(1, 9, 2026);
  const old = d(1, 6, 2025);

  it('B01: one fact is low', () => {
    expect(level(day, facts(['F1'], recent))).toEqual({
      level: 'LOW',
      factCount: 1,
      latestConfirmedDate: recent,
    });
  });

  it('B02: two facts are medium', () => {
    expect(level(day, facts(['F1', 'F2'], recent))).toEqual({
      level: 'MEDIUM',
      factCount: 2,
      latestConfirmedDate: recent,
    });
  });

  it('B03: three facts are high', () => {
    expect(level(day, facts(['F1', 'F2', 'F3'], recent))).toEqual({
      level: 'HIGH',
      factCount: 3,
      latestConfirmedDate: recent,
    });
  });

  it('B04: three facts with none recent drop to medium', () => {
    expect(level(day, facts(['F1', 'F2', 'F3'], old))).toEqual({
      level: 'MEDIUM',
      factCount: 3,
      latestConfirmedDate: old,
    });
  });

  it('B05: one recent fact is enough to keep the level', () => {
    expect(
      level(day, [
        { code: 'F1', confirmedDate: old },
        { code: 'F2', confirmedDate: recent },
      ]),
    ).toEqual({ level: 'MEDIUM', factCount: 2, latestConfirmedDate: recent });
  });

  it('B06: the same fact twice counts once', () => {
    expect(level(day, facts(['F1', 'F1'], recent))).toEqual({
      level: 'LOW',
      factCount: 1,
      latestConfirmedDate: recent,
    });
  });

  it('B07: five facts are high', () => {
    expect(level(day, facts(['F1', 'F2', 'F3', 'F4', 'F5'], recent))).toEqual({
      level: 'HIGH',
      factCount: 5,
      latestConfirmedDate: recent,
    });
  });

  it('B08: two facts with none recent drop to low', () => {
    expect(level(day, facts(['F1', 'F2'], old))).toEqual({
      level: 'LOW',
      factCount: 2,
      latestConfirmedDate: old,
    });
  });

  it('B09: a fact confirmed on the same day a year before is recent', () => {
    expect(level(day, facts(['F1'], d(7, 10, 2025)))).toEqual({
      level: 'LOW',
      factCount: 1,
      latestConfirmedDate: d(7, 10, 2025),
    });
  });

  it('B10: one day before that mark is not recent', () => {
    expect(level(day, facts(['F1', 'F2'], d(6, 10, 2025)))).toEqual({
      level: 'LOW',
      factCount: 2,
      latestConfirmedDate: d(6, 10, 2025),
    });
  });

  it('B11: from 29/02 the mark is 28/02 of the year before', () => {
    expect(level(d(29, 2, 2028), facts(['F1', 'F2'], d(28, 2, 2027)))).toEqual({
      level: 'MEDIUM',
      factCount: 2,
      latestConfirmedDate: d(28, 2, 2027),
    });
    expect(level(d(29, 2, 2028), facts(['F1', 'F2'], d(27, 2, 2027))).level).toBe('LOW');
  });
});

describe('evidenceLevel', () => {
  it('takes the latest date whatever the order of the facts', () => {
    const list = [
      { code: 'F2', confirmedDate: d(3, 9, 2026) },
      { code: 'F1', confirmedDate: d(5, 9, 2026) },
      { code: 'F3', confirmedDate: d(4, 9, 2026) },
    ];
    expect(level(d(7, 10, 2026), list).latestConfirmedDate).toEqual(d(5, 9, 2026));
  });

  it('refuses an empty list: a missing hạng mục has no level', () => {
    expect(() => level(d(7, 10, 2026), [])).toThrow(RangeError);
  });
});
