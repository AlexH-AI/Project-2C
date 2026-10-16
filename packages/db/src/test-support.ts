/** Test helpers: a fresh in-memory database with a pinned clock, and DbError catchers. */
import { calendarDate, type CalendarDate } from '@p2c/domain';
import { vi } from 'vitest';
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
  const re = createPerson(db, { name: 'An', role: 'RE', teamId: team.id });
  const otherRe = createPerson(db, { name: 'Bình', role: 'RE', teamId: team.id });
  const tl = createPerson(db, { name: 'Hà', role: 'TL', teamId: team.id });
  persist.mockClear();
  return { db, persist, team, re, otherRe, tl };
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
