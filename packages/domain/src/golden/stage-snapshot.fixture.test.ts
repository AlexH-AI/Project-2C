import { describe, expect, it } from 'vitest';
import { assertValidTransition } from '../customer-lifecycle';
import { compareDates, daysBetween, isInPeriod } from '../period';
import { PEOPLE } from './metrics.fixture';
import {
  CHART_GOLDEN_CASES,
  REPORT_MARKS_GOLDEN_CASES,
  SNAPSHOT_CUSTOMERS,
  SNAPSHOT_GOLDEN_CASES,
} from './stage-snapshot.fixture';

// These tests keep the golden data internally consistent. They do not count anything: the counts
// are tested against the expected results in `stage-snapshot.test.ts` and `period.test.ts`.

const reIds = new Set(PEOPLE.filter((person) => person.role === 'RE').map((person) => person.id));
const byId = (id: string) => SNAPSHOT_GOLDEN_CASES.find((golden) => golden.id === id)!.expected;

describe('golden stage snapshot fixture', () => {
  it('gives every customer, transition and case a unique id', () => {
    const ids = (list: readonly { readonly id: string }[]) => new Set(list.map((x) => x.id)).size;
    const transitions = SNAPSHOT_CUSTOMERS.flatMap((row) => row.transitions);
    expect(ids(SNAPSHOT_CUSTOMERS.map((row) => row.customer))).toBe(SNAPSHOT_CUSTOMERS.length);
    expect(ids(transitions)).toBe(transitions.length);
    const cases = [...SNAPSHOT_GOLDEN_CASES, ...CHART_GOLDEN_CASES, ...REPORT_MARKS_GOLDEN_CASES];
    expect(ids(cases)).toBe(cases.length);
  });

  it('gives every customer an RE and allowed transitions in date order, ending at their stage', () => {
    for (const { customer, transitions } of SNAPSHOT_CUSTOMERS) {
      expect(reIds.has(customer.reId)).toBe(true);
      expect(transitions.at(-1)!.to).toBe(customer.stage);
      transitions.forEach((transition, index) => {
        expect(() => assertValidTransition(transition.from, transition.to)).not.toThrow();
        if (index > 0) {
          expect(compareDates(transitions[index - 1]!.date, transition.date)).toBeLessThan(0);
        }
      });
    }
  });

  it('takes each mốc inside its period', () => {
    for (const golden of SNAPSHOT_GOLDEN_CASES) {
      expect(isInPeriod(golden.date, golden.period)).toBe(true);
    }
  });

  it('splits Toàn bộ into Team A + Team B (S08 + S09 = S03)', () => {
    const [all, a, b] = [byId('S03'), byId('S08'), byId('S09')];
    for (const stage of ['N4', 'N3', 'N2', 'N1', 'ON_HOLD', 'LOST'] as const) {
      expect(a[stage] + b[stage]).toBe(all[stage]);
    }
  });

  it('ends the chart on the four boxes of the period (S12 = S03)', () => {
    const { N4, N3, N2, N1 } = byId('S03');
    expect(CHART_GOLDEN_CASES.find((golden) => golden.id === 'S12')!.expected).toEqual({
      N4,
      N3,
      N2,
      N1,
    });
  });

  it('lays each report split end to end over its whole period', () => {
    for (const { period, marks } of REPORT_MARKS_GOLDEN_CASES) {
      expect(marks[0]![0]).toEqual(period.start);
      expect(marks.at(-1)![1]).toEqual(period.end);
      marks.forEach(([start, end], index) => {
        expect(compareDates(start, end)).toBeLessThanOrEqual(0);
        if (index > 0) expect(daysBetween(marks[index - 1]![1], start)).toBe(1);
      });
    }
  });
});
