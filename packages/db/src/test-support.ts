/** Test helpers: a fresh in-memory database with a pinned clock, and a DbError code catcher. */
import { calendarDate, type CalendarDate } from '@p2c/domain';
import { vi } from 'vitest';
import { openDatabase } from './database';
import { DbError } from './errors';
import { createPerson, createTeam } from './team';

export async function setup() {
  let clock = Date.UTC(2026, 8, 26, 8, 0, 0);
  const persist = vi.fn();
  const db = await openDatabase({ persist, now: () => new Date(clock++) });
  const team = createTeam(db, { name: 'Sao Mai' });
  const re = createPerson(db, { name: 'An', role: 'RE', teamId: team.id });
  const otherRe = createPerson(db, { name: 'Bình', role: 'RE', teamId: team.id });
  const tl = createPerson(db, { name: 'Hà', role: 'TL', teamId: team.id });
  persist.mockClear();
  return { db, persist, team, re, otherRe, tl };
}

export function codeOf(fn: () => unknown): string | undefined {
  try {
    fn();
  } catch (error) {
    if (error instanceof DbError) return error.code;
    throw error;
  }
  return undefined;
}

export const d = (day: number, month: number, year = 2027): CalendarDate =>
  calendarDate(year, month, day);
