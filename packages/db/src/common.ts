/** Helpers shared by the commands: names, soft-delete stamps, stored dates and money. */
import { calendarDate, type CalendarDate, type Vnd } from '@p2c/domain';
import { and, eq, getTableColumns, isNull, sql } from 'drizzle-orm';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';
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

const queries = new WeakMap<Database, Map<(db: Database) => unknown, unknown>>();

/**
 * The query `build` makes, built once per database. Drizzle builds the SQL text again on every
 * call, which costs more than running it; a prepared query keeps the text and takes its values as
 * placeholders, and sql.js statements stay in the cache of `database.ts`.
 */
export function prepared<T>(db: Database, build: (db: Database) => T): T {
  let built = queries.get(db);
  if (!built) queries.set(db, (built = new Map()));
  if (!built.has(build)) built.set(build, build(db));
  return built.get(build) as T;
}

/** A prepared insert of one whole row of `table`: run it with the row, every column set. */
export function rowInsert<T extends SQLiteTable>(table: T) {
  const values = Object.fromEntries(
    Object.keys(getTableColumns(table)).map((column) => [column, sql.placeholder(column)]),
  );
  return (db: Database) =>
    db.orm
      .insert(table)
      .values(values as unknown as T['$inferInsert'])
      .prepare();
}

const customerById = (db: Database) =>
  db.orm
    .select()
    .from(customers)
    .where(eq(customers.id, sql.placeholder('id')))
    .prepare();

/** The customer row, when it exists and is not deleted. */
export function liveCustomer(db: Database, id: string): typeof customers.$inferSelect {
  const row = prepared(db, customerById).get({ id });
  if (!row || row.deletedAt) throw new DbError('CUSTOMER_NOT_FOUND');
  return row;
}
