import type { CustomerRecord } from '@p2c/db';
import type { CalendarDate, Person, Policy, StageTransition } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { ageOn, birthLabel, customerBoard, parseBirthDate } from './customers-view';

const day = (month: number, dayOfMonth: number): CalendarDate => ({
  year: 2026,
  month,
  day: dayOfMonth,
});

const people: Person[] = [
  { id: 're1', name: 'Hoàng Nam', role: 'RE', teamId: 't1' },
  { id: 're2', name: 'Mai Phương', role: 'RE', teamId: 't2' },
];

const customer = (id: string, stage: CustomerRecord['stage'], reId = 're1'): CustomerRecord => ({
  id,
  code: `K-${id}`,
  name: id,
  reId,
  stage,
  birthDate: null,
  gender: null,
});

let seq = 0;
const move = (
  customerId: string,
  from: StageTransition['from'],
  to: StageTransition['to'],
  date: CalendarDate,
): StageTransition => ({ id: `tr${++seq}`, customerId, from, to, date, appointmentId: null });

const policy = (customerId: string): Policy => ({
  id: `p-${customerId}`,
  customerId,
  reId: 're1',
  submittedDate: day(9, 1),
  submittedFyp: 10_000_000 as Policy['submittedFyp'],
  issuedDate: null,
  issuedFyp: null,
});

describe('customerBoard', () => {
  const data = {
    customers: [
      customer('an', 'N4'),
      customer('binh', 'N4'),
      customer('chi', 'N2'),
      customer('dung', 'ON_HOLD'),
      customer('em', 'N4', 're2'),
    ],
    people,
    transitions: [
      move('an', null, 'N4', day(9, 1)),
      move('binh', null, 'N3', day(8, 1)),
      move('binh', 'N3', 'N4', day(9, 10)),
      move('chi', null, 'N2', day(7, 5)),
      move('dung', null, 'N3', day(6, 1)),
      move('dung', 'N3', 'ON_HOLD', day(6, 20)),
      move('em', null, 'N4', day(9, 12)),
    ],
    policies: [policy('chi'), policy('chi')],
  };

  it('puts each customer in the column of its stage, latest change first', () => {
    const board = customerBoard(data, { kind: 'all' });

    expect(board.open.N4.map((card) => card.customer.id)).toEqual(['em', 'binh', 'an']);
    expect(board.open.N3).toEqual([]);
    expect(board.open.N2.map((card) => card.customer.id)).toEqual(['chi']);
    expect(board.closed.ON_HOLD.map((card) => card.customer.id)).toEqual(['dung']);
    expect(board.closed.LOST).toEqual([]);
    expect(board).toMatchObject({ openCount: 4, closedCount: 1 });
  });

  it('gives each card its RE, the day it entered the stage and its policy count', () => {
    const board = customerBoard(data, { kind: 'all' });

    expect(board.open.N4[1]).toMatchObject({ re: people[0], since: day(9, 10), policies: 0 });
    expect(board.open.N2[0]).toMatchObject({ since: day(7, 5), policies: 2 });
  });

  it('keeps only the customers of the RE in scope, through their team or directly', () => {
    const team = customerBoard(data, { kind: 'team', teamId: 't2' });
    expect(team.open.N4.map((card) => card.customer.id)).toEqual(['em']);
    expect(team).toMatchObject({ openCount: 1, closedCount: 0 });

    const re = customerBoard(data, { kind: 're', reId: 're1' });
    expect(re.open.N4.map((card) => card.customer.id)).toEqual(['binh', 'an']);
  });
});

describe('birthLabel', () => {
  it('shows the year alone, or the full date', () => {
    expect(birthLabel({ year: 1984 })).toBe('1984');
    expect(birthLabel({ year: 1984, month: 3, day: 12 })).toBe('12/03/1984');
  });
});

describe('ageOn', () => {
  it('counts full years from a full birth date', () => {
    const birth = { year: 1984, month: 3, day: 12 };
    expect(ageOn(birth, day(3, 11))).toBe(41);
    expect(ageOn(birth, day(3, 12))).toBe(42);
  });

  it('counts the age reached this year from a year alone', () => {
    expect(ageOn({ year: 1984 }, day(1, 1))).toBe(42);
  });
});

describe('parseBirthDate', () => {
  const today = day(9, 26);

  it('reads a year alone or a full date, and nothing as no birth date', () => {
    expect(parseBirthDate('1984', today)).toEqual({ ok: true, birth: { year: 1984 } });
    expect(parseBirthDate(' 12/3/1984 ', today)).toEqual({
      ok: true,
      birth: { year: 1984, month: 3, day: 12 },
    });
    expect(parseBirthDate('  ', today)).toEqual({ ok: true, birth: null });
  });

  it('refuses a day that does not exist, a short year or a birth after today', () => {
    expect(parseBirthDate('31/02/1984', today)).toEqual({ ok: false, error: 'invalid-date' });
    expect(parseBirthDate('12/3/84', today)).toEqual({ ok: false, error: 'format' });
    expect(parseBirthDate('12/3', today)).toEqual({ ok: false, error: 'format' });
    expect(parseBirthDate('1899', today)).toEqual({ ok: false, error: 'year-out-of-range' });
    expect(parseBirthDate('2027', today)).toEqual({ ok: false, error: 'future' });
    expect(parseBirthDate('27/09/2026', today)).toEqual({ ok: false, error: 'future' });
  });
});
