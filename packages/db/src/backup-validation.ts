/**
 * Value checks of an imported backup (spec §6): SQLite only checks integer/text, CHECK and foreign
 * keys, so a date like `2026-02-30` or a broken KYC JSON would load and then break the screens
 * that read it. Every row is read, soft-deleted ones included; nothing is replayed through the
 * commands, which would change ids, `seq` and hashes.
 */
import { calendarDate, type KycField, type KycValue } from '@p2c/domain';
import type { Database as SqlJsDatabase, SqlValue } from 'sql.js';
import { z } from 'zod';
import type { Database } from './database';
import { DbError } from './errors';
import { normalizeKycValue } from './kyc';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const YEAR = /^\d{4}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const TIMESTAMPS = new Set(['created_at', 'updated_at', 'deleted_at']);
const timestamp = z.iso.datetime();

/** Throws `BACKUP_INVALID` at the first value the app could not read back. */
export function validateBackupValues(db: Database): void {
  for (const table of dataTables(db.sqlite)) {
    const result = db.sqlite.exec(`SELECT * FROM "${table.replaceAll('"', '""')}"`)[0];
    if (!result) continue;
    for (const values of result.values) {
      const row = Object.fromEntries(result.columns.map((name, i) => [name, values[i]!]));
      for (const [column, value] of Object.entries(row)) {
        if (value !== null && !validValue(column, value)) throw new DbError('BACKUP_INVALID');
      }
      if (table === 'kyc_facts' && !validKycValue(String(row.field), String(row.value_json))) {
        throw new DbError('BACKUP_INVALID');
      }
    }
  }
}

function validValue(column: string, value: SqlValue): boolean {
  if (column === 'birth_date') return validYear(value) || validDate(value);
  if (column === 'date' || column.endsWith('_date')) return validDate(value);
  if (column === 'time') return typeof value === 'string' && TIME.test(value);
  if (TIMESTAMPS.has(column)) return timestamp.safeParse(value).success;
  if (column === 'seq') return typeof value === 'number' && value >= 1;
  return true;
}

/** `YYYY-MM-DD` of a day that exists, as `calendarDate` reads it. */
function validDate(value: SqlValue): boolean {
  const match = typeof value === 'string' ? ISO_DATE.exec(value) : null;
  return match !== null && isCalendarDate(Number(match[1]), Number(match[2]), Number(match[3]));
}

/** A birth year alone, from the year `calendarDate` accepts. */
function validYear(value: SqlValue): boolean {
  return typeof value === 'string' && YEAR.test(value) && isCalendarDate(Number(value), 1, 1);
}

function isCalendarDate(year: number, month: number, day: number): boolean {
  try {
    calendarDate(year, month, day);
    return true;
  } catch {
    return false;
  }
}

/**
 * JSON of a value already normalised to the type of its field, as the KYC commands store it; the
 * field itself is one of `KYC_FIELDS` by the table's CHECK.
 */
function validKycValue(field: string, json: string): boolean {
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    return false;
  }
  if (!['string', 'number', 'boolean'].includes(typeof value)) return false;
  try {
    return normalizeKycValue(field as KycField, value as KycValue) === value;
  } catch {
    return false;
  }
}

/** Every table that holds data: all but SQLite's own and the migration log. */
export function dataTables(sqlite: SqlJsDatabase): string[] {
  const result = sqlite.exec(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name <> 'schema_migrations' ORDER BY name",
  );
  return result[0]!.values.map(([name]) => String(name));
}
