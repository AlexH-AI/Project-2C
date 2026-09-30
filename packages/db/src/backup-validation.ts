/**
 * Checks of an imported backup (spec §6): SQLite only checks integer/text, CHECK and foreign keys,
 * so a date like `2026-02-30`, a broken KYC JSON or a stage no transition reached would load and
 * then break the screens or the metrics that read it. Rows are read as they are; nothing is
 * replayed through the commands, which would change ids, `seq` and hashes.
 */
import {
  assertValidTransition,
  calendarDate,
  PIPELINE_STAGES,
  type CustomerStage,
  type KycField,
  type KycValue,
} from '@p2c/domain';
import type { Database as SqlJsDatabase, SqlValue } from 'sql.js';
import { z } from 'zod';
import type { Database } from './database';
import { DbError } from './errors';
import { normalizeKycValue } from './kyc';
import { GENDERS } from './schema';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const YEAR = /^\d{4}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const TIMESTAMPS = new Set(['created_at', 'updated_at', 'deleted_at']);
const timestamp = z.iso.datetime();
const OPEN_STAGES: readonly unknown[] = PIPELINE_STAGES;

/** Throws `BACKUP_INVALID` at the first value the app could not read back. */
export function validateBackupValues(db: Database): void {
  for (const table of dataTables(db.sqlite)) {
    for (const row of rowsOf(db.sqlite, `SELECT * FROM "${table.replaceAll('"', '""')}"`)) {
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

type Row = Record<string, SqlValue>;

/**
 * Throws `BACKUP_INVALID` when the tables disagree in a way no command could leave them (spec §6):
 * run after `validateBackupValues`, on rows whose every value is readable. A rule about live data
 * only reads live rows, so records soft-deleted by the commands still load. `seq` is unique per
 * customer by the tables' own UNIQUE indexes, checked while loading.
 */
export function validateBackupInvariants(db: Database): void {
  const read = (sql: string) => rowsOf(db.sqlite, sql);
  const customers = read('SELECT * FROM customers');
  const transitions = read('SELECT * FROM stage_transitions ORDER BY customer_id, seq');
  const appointments = read('SELECT * FROM appointments');
  const valid =
    transitionsHold(customers, transitions) &&
    meetingsHold(appointments, transitions) &&
    ownersHold(read, appointments) &&
    kycHolds(read, customers);
  if (!valid) throw new DbError('BACKUP_INVALID');
}

/** Rules 1–3: each customer's transitions chain from creation to its stage (ADR-0007, D10). */
function transitionsHold(customers: Row[], transitions: Row[]): boolean {
  const byCustomer = groupBy(transitions, 'customer_id');
  return customers.every((customer) => {
    const [first, ...later] = byCustomer.get(customer.id) ?? [];
    // Created in an open stage; only an appointment's transition is ever withdrawn, never the first.
    if (!first || first.from_stage !== null || first.deleted_at !== null) return false;
    if (!OPEN_STAGES.includes(first.to_stage) || later.some((t) => t.from_stage === null)) {
      return false;
    }
    const live = [first, ...later].filter((t) => t.deleted_at === null);
    const chained = live.slice(1).every((t, i) => follows(live[i]!, t));
    return chained && live.at(-1)!.to_stage === customer.stage;
  });
}

/** `next` goes on from `previous`: same stage, not an earlier day, an allowed move. */
function follows(previous: Row, next: Row): boolean {
  if (next.from_stage !== previous.to_stage || (next.date as string) < (previous.date as string)) {
    return false;
  }
  try {
    assertValidTransition(next.from_stage as CustomerStage, next.to_stage as CustomerStage);
    return true;
  } catch {
    return false;
  }
}

/** Rule 4: a live transition caused by a meeting carries its customer, day and stage after. */
function meetingsHold(appointments: Row[], transitions: Row[]): boolean {
  const byId = new Map(appointments.map((a) => [a.id, a]));
  const caused = transitions.filter((t) => t.deleted_at === null && t.appointment_id !== null);
  const once = new Set(caused.map((t) => t.appointment_id)).size === caused.length;
  return (
    once &&
    caused.every((t) => {
      const a = byId.get(t.appointment_id)!;
      return (
        a.customer_id === t.customer_id &&
        a.status === 'MET' &&
        a.stage_after === t.to_stage &&
        a.date === t.date
      );
    })
  );
}

/**
 * Rule 5: a live customer, appointment or policy belongs to an RE (who may stop being one only
 * once their records are deleted); the RE never coordinates their own appointment; an appointment
 * is rescheduled from one of the same customer (D3).
 */
function ownersHold(read: (sql: string) => Row[], appointments: Row[]): boolean {
  const notRe = read(
    ['customers', 'appointments', 'policies']
      .map(
        (table) =>
          `SELECT 1 FROM ${table} r JOIN people p ON p.id = r.re_id WHERE r.deleted_at IS NULL AND p.role <> 'RE'`,
      )
      .join(' UNION ALL '),
  );
  const selfCoordinating = read(
    'SELECT 1 FROM appointment_coordinators c JOIN appointments a ON a.id = c.appointment_id WHERE c.person_id = a.re_id',
  );
  const byId = new Map(appointments.map((a) => [a.id, a]));
  const rescheduled = appointments.every((a) => {
    if (a.rescheduled_from_id === null) return true;
    const from = byId.get(a.rescheduled_from_id)!;
    return from.customer_id === a.customer_id && from.status === 'RESCHEDULED';
  });
  return notRe.length === 0 && selfCoordinating.length === 0 && rescheduled;
}

/**
 * Rules 6–8 (ADR-0008, D2): a fact comes from a note of its own customer; each field has either one
 * active fact or at least two in conflict; the birth year and gender in effect are the profile's,
 * from a `SYSTEM` note.
 */
function kycHolds(read: (sql: string) => Row[], customers: Row[]): boolean {
  const facts = read(
    'SELECT f.*, n.customer_id AS note_customer_id, n.source FROM kyc_facts f JOIN kyc_notes n ON n.id = f.note_id',
  );
  const byCustomer = new Map(customers.map((c) => [c.id, c]));
  const counts = new Map<string, { active: number; conflict: number }>();
  for (const fact of facts) {
    if (fact.note_customer_id !== fact.customer_id) return false;
    const key = `${String(fact.customer_id)}\n${String(fact.field)}`;
    const count = counts.get(key) ?? { active: 0, conflict: 0 };
    counts.set(key, count);
    if (fact.status === 'superseded') continue;
    count[fact.status as 'active' | 'conflict']++;
    if (fact.status === 'active' && String(fact.field) in PROFILE_VALUES) {
      const profile = PROFILE_VALUES[fact.field as keyof typeof PROFILE_VALUES];
      const expected = profile(byCustomer.get(fact.customer_id)!);
      if (fact.source !== 'SYSTEM' || fact.value_json !== expected) return false;
    }
  }
  return [...counts.values()].every(
    ({ active, conflict }) => (active === 1 && conflict === 0) || (active === 0 && conflict >= 2),
  );
}

/** JSON of the birth year and gender facts the profile writes (`recordProfileFacts`, D2). */
const PROFILE_VALUES = {
  birthYear: (customer: Row) =>
    customer.birth_date === null
      ? null
      : JSON.stringify(Number(String(customer.birth_date).slice(0, 4))),
  gender: (customer: Row) =>
    customer.gender === null ? null : JSON.stringify(GENDER_LABELS[customer.gender as Gender]),
};
/** Same labels as `kyc.ts` writes. */
const GENDER_LABELS: Readonly<Record<Gender, string>> = { MALE: 'Nam', FEMALE: 'Nữ' };
type Gender = (typeof GENDERS)[number];

function groupBy(rows: Row[], column: string): Map<unknown, Row[]> {
  const groups = new Map<unknown, Row[]>();
  for (const row of rows) {
    const group = groups.get(row[column]);
    if (group) group.push(row);
    else groups.set(row[column], [row]);
  }
  return groups;
}

function rowsOf(sqlite: SqlJsDatabase, sql: string): Row[] {
  const result = sqlite.exec(sql)[0];
  if (!result) return [];
  return result.values.map((values) =>
    Object.fromEntries(result.columns.map((name, i) => [name, values[i]!])),
  );
}

/** Every table that holds data: all but SQLite's own and the migration log. */
export function dataTables(sqlite: SqlJsDatabase): string[] {
  const result = sqlite.exec(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name <> 'schema_migrations' ORDER BY name",
  );
  return result[0]!.values.map(([name]) => String(name));
}
