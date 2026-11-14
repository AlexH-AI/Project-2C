/**
 * Test helpers: a fresh in-memory database with a pinned clock, DbError catchers, and reads of what
 * the commands wrote.
 */
import {
  calendarDate,
  stageSnapshot,
  type CalendarDate,
  type Customer,
  type CustomerStage,
  type StageTransition,
} from '@p2c/domain';
import { vi } from 'vitest';
import { createCustomer } from './customers';
import { openDatabase } from './database';
import { DbError } from './errors';
import { createPerson, createTeam } from './team';

/** `today` is the clock's day, 26/09/2026 unless given. */
export async function setup(today: CalendarDate = d(26, 9)) {
  // DR-15: 11:00 UTC is that day local from UTC−11 to UTC+12 only: already the next day in
  // Auckland on its summer time (UTC+13, from 27/09/2026) and in Kiritimati (UTC+14).
  let clock = Date.UTC(today.year, today.month - 1, today.day, 11, 0, 0);
  const persist = vi.fn();
  const db = await openDatabase({ persist, now: () => new Date(clock++) });
  const team = createTeam(db, { name: 'Sao Mai' });
  const rm = createPerson(db, { name: 'An', role: 'RM', teamId: team.id });
  const otherRm = createPerson(db, { name: 'Bình', role: 'RM', teamId: team.id });
  const tl = createPerson(db, { name: 'Hà', role: 'TL', teamId: team.id });
  persist.mockClear();
  return { db, persist, team, rm, otherRm, tl };
}

/**
 * The machine clock set back across midnight while the app is open (T-398): a database on a clock
 * at 08/11/2026 00:05 local, with a team, the RM An and the customer Lan (N3 from 01/10);
 * `setBack()` turns that clock to 07/11 23:55. `now` is the clock, to open another database on.
 */
export async function clockSetBack() {
  let machine = new Date(2026, 10, 8, 0, 5).getTime();
  const now = () => new Date(machine);
  const db = await openDatabase({ now });
  const team = createTeam(db, { name: 'Sao Mai' });
  const rm = createPerson(db, { name: 'An', role: 'RM', teamId: team.id });
  const lan = createCustomer(db, { name: 'Lan', rmId: rm.id, stage: 'N3', date: d(1, 10) });
  const setBack = () => {
    machine = new Date(2026, 10, 7, 23, 55).getTime();
  };
  return { db, now, rm, lan, setBack };
}

/** The DbError `fn` rejects with, or undefined when it does not throw. */
export function errorOf(fn: () => unknown): DbError | undefined {
  try {
    fn();
  } catch (error) {
    if (error instanceof DbError) return error;
    throw error;
  }
  return undefined;
}

export function codeOf(fn: () => unknown): string | undefined {
  return errorOf(fn)?.code;
}

/** A day; the default year is the test clock's (26/09/2026), by which past records are dated. */
export const d = (day: number, month: number, year = 2026): CalendarDate =>
  calendarDate(year, month, day);

/** The record `id` among `rows`: a test reads a record back through the `list*` read of its kind. */
export const byId = <T extends { readonly id: string }>(rows: readonly T[], id: string) =>
  rows.find((row) => row.id === id);

/**
 * The stage the customer ends `date` in as the screens count it: `stageSnapshot` of domain, which
 * reads the transitions by day, not by `seq`. Null before its first transition.
 */
export function stageAtEndOfDay(
  customer: Customer,
  transitions: readonly StageTransition[],
  date: CalendarDate,
): CustomerStage | null {
  const counts = stageSnapshot([customer], transitions, date, { kind: 'all' }, []);
  return (Object.keys(counts) as CustomerStage[]).find((stage) => counts[stage] > 0) ?? null;
}
