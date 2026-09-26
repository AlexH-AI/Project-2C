/** Helpers shared by the commands: names, soft-delete stamps, stored dates and money. */
import { calendarDate, type CalendarDate, type Vnd } from '@p2c/domain';
import { and, eq, isNull } from 'drizzle-orm';
import type { Database } from './database';
import { DbError } from './errors';
import { customers, people } from './schema';

export function requireName(name: string): string {
  const trimmed = name.trim();
  if (trimmed === '') throw new DbError('NAME_REQUIRED');
  return trimmed;
}

/** Trimmed text, or null when empty. */
export function optionalText(text: string | null | undefined): string | null {
  const trimmed = text?.trim() ?? '';
  return trimmed === '' ? null : trimmed;
}

/** One instant for both columns, so a deleted row is never updated after its deletion. */
export function stampDeleted(db: Database): { deletedAt: string; updatedAt: string } {
  const at = db.now().toISOString();
  return { deletedAt: at, updatedAt: at };
}

const pad = (value: number, width = 2) => String(value).padStart(width, '0');

/** `YYYY-MM-DD` (spec §2); rejects a day that does not exist. */
export function toIsoDate(date: CalendarDate): string {
  let valid: CalendarDate;
  try {
    valid = calendarDate(date.year, date.month, date.day);
  } catch {
    throw new DbError('INVALID_DATE');
  }
  return `${pad(valid.year, 4)}-${pad(valid.month)}-${pad(valid.day)}`;
}

export function fromIsoDate(text: string): CalendarDate {
  const [year, month, day] = text.split('-').map(Number);
  return calendarDate(year!, month!, day!);
}

/** A whole, positive number of đồng. */
export function requireAmount(amount: Vnd): Vnd {
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new DbError('INVALID_AMOUNT');
  return amount;
}

/** The id of a live person with the RE role — the only role that owns records (G2 G). */
export function requireRe(db: Database, id: string): string {
  const row = db.orm
    .select({ role: people.role })
    .from(people)
    .where(and(eq(people.id, id), isNull(people.deletedAt)))
    .get();
  if (!row) throw new DbError('PERSON_NOT_FOUND');
  if (row.role !== 'RE') throw new DbError('RE_REQUIRED');
  return id;
}

/** The customer row, when it exists and is not deleted. */
export function liveCustomer(db: Database, id: string): typeof customers.$inferSelect {
  const row = db.orm.select().from(customers).where(eq(customers.id, id)).get();
  if (!row || row.deletedAt) throw new DbError('CUSTOMER_NOT_FOUND');
  return row;
}
