import { describe, expect, it } from 'vitest';
import { assertValidTransition, isRfTransition, stageOn } from './customer-lifecycle';
import type { CustomerStage, StageTransition } from './model';
import { calendarDate } from './period';

type Move = [from: CustomerStage | null, to: CustomerStage];

describe('stage transitions', () => {
  it('allows moving up, skipping stages and moving down between open stages', () => {
    const moves: Move[] = [
      ['N4', 'N3'],
      ['N4', 'N2'],
      ['N3', 'N1'],
      ['N2', 'N3'],
      ['N1', 'N4'],
    ];
    for (const [from, to] of moves) expect(() => assertValidTransition(from, to)).not.toThrow();
  });

  it('refuses a move to the same stage', () => {
    expect(() => assertValidTransition('N2', 'N2')).toThrow(/N2/);
    expect(() => assertValidTransition('LOST', 'LOST')).toThrow(/LOST/);
  });

  it('closes any open stage as ON_HOLD or LOST, and moves between the two', () => {
    const moves: Move[] = [
      ['N4', 'ON_HOLD'],
      ['N1', 'LOST'],
      ['ON_HOLD', 'LOST'],
      ['LOST', 'ON_HOLD'],
    ];
    for (const [from, to] of moves) expect(() => assertValidTransition(from, to)).not.toThrow();
  });

  it('reopens a closed customer only to N3', () => {
    expect(() => assertValidTransition('ON_HOLD', 'N3')).not.toThrow();
    expect(() => assertValidTransition('LOST', 'N3')).not.toThrow();
    for (const to of ['N4', 'N2', 'N1'] as const) {
      expect(() => assertValidTransition('ON_HOLD', to)).toThrow(/N3/);
      expect(() => assertValidTransition('LOST', to)).toThrow(/N3/);
    }
  });

  it('creates a customer in an open stage only', () => {
    expect(() => assertValidTransition(null, 'N4')).not.toThrow();
    expect(() => assertValidTransition(null, 'N1')).not.toThrow();
    expect(() => assertValidTransition(null, 'LOST')).toThrow(/LOST/);
  });
});

describe('RF transitions', () => {
  it('counts only a move from N4/N3 up to N2/N1', () => {
    const rf: Move[] = [
      ['N4', 'N2'],
      ['N4', 'N1'],
      ['N3', 'N2'],
      ['N3', 'N1'],
    ];
    const notRf: Move[] = [
      ['N4', 'N3'],
      ['N2', 'N1'],
      ['N2', 'N3'],
      ['N1', 'N4'],
      ['N2', 'LOST'],
      [null, 'N2'],
    ];
    for (const [from, to] of rf) expect(isRfTransition(from, to), `${from}→${to}`).toBe(true);
    for (const [from, to] of notRf) expect(isRfTransition(from, to), `${from}→${to}`).toBe(false);
  });

  it('counts moving up again after moving down', () => {
    const path: Move[] = [
      ['N3', 'N2'],
      ['N2', 'N3'],
      ['N3', 'N2'],
    ];
    expect(path.map(([from, to]) => isRfTransition(from, to))).toEqual([true, false, true]);
  });

  it('does not count reopening to N3, but counts the move up that follows', () => {
    expect(isRfTransition('ON_HOLD', 'N3')).toBe(false);
    expect(isRfTransition('LOST', 'N3')).toBe(false);
    expect(isRfTransition('N3', 'N2')).toBe(true);
    expect(isRfTransition('N3', 'N1')).toBe(true);
  });
});

describe('stage on a day', () => {
  const move = (
    id: string,
    customerId: string,
    from: CustomerStage | null,
    to: CustomerStage,
    day: number,
  ): StageTransition => ({
    id,
    customerId,
    from,
    to,
    date: calendarDate(2025, 12, day),
    appointmentId: null,
  });

  const history = [
    move('t1', 'c1', null, 'N4', 3),
    move('t2', 'c2', null, 'N1', 4),
    move('t3', 'c1', 'N4', 'N3', 10),
    move('t4', 'c1', 'N3', 'N2', 10),
    move('t5', 'c1', 'N2', 'LOST', 20),
  ];

  it('has no stage before the first transition', () => {
    expect(stageOn(history, 'c1', calendarDate(2025, 12, 2))).toBeNull();
    expect(stageOn(history, 'unknown', calendarDate(2025, 12, 31))).toBeNull();
  });

  it('takes the latest transition up to and including the day', () => {
    expect(stageOn(history, 'c1', calendarDate(2025, 12, 3))).toBe('N4');
    expect(stageOn(history, 'c1', calendarDate(2025, 12, 9))).toBe('N4');
    expect(stageOn(history, 'c1', calendarDate(2025, 12, 25))).toBe('LOST');
    expect(stageOn(history, 'c2', calendarDate(2025, 12, 25))).toBe('N1');
  });

  it('takes the last recorded of several transitions on the same day', () => {
    expect(stageOn(history, 'c1', calendarDate(2025, 12, 10))).toBe('N2');
  });

  it('does not depend on the order of transitions on different days', () => {
    expect(stageOn([...history].reverse(), 'c1', calendarDate(2025, 12, 25))).toBe('LOST');
  });
});
