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
  REVIEWER_ROLES,
  type CustomerStage,
  type KycField,
  type KycValue,
} from '@p2c/domain';
import type { Database as SqlJsDatabase, SqlValue } from 'sql.js';
import { z } from 'zod';
import { cleanText, isFee, requireName, today, toIsoDate } from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { normalizeKycValue, profileFactValue, type ProfileFields } from './kyc';

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
      if (table === 'kyc_notes' && !storedAs(cleanText, row.text))
        throw new DbError('BACKUP_INVALID');
      if (NAMED.has(table) && !storedAs(requireName, row.name)) throw new DbError('BACKUP_INVALID');
    }
  }
}

function validValue(column: string, value: SqlValue): boolean {
  if (column === 'birth_date') return validYear(value) || validDate(value);
  if (column === 'date' || column.endsWith('_date')) return validDate(value);
  if (column === 'time') return typeof value === 'string' && TIME.test(value);
  if (TIMESTAMPS.has(column)) return timestamp.safeParse(value).success;
  // A safe integer, as `nextSeq` writes it (DR-34).
  if (column === 'seq') return Number.isSafeInteger(value) && (value as number) >= 1;
  // A fee, as `requireAmount` takes it (DR-23).
  if (FEES.has(column)) return isFee(value);
  return true;
}

const FEES = new Set(['expected_case_size', 'submitted_fyp', 'issued_fyp']);
const NAMED = new Set(['teams', 'people', 'customers']);

/** Text that `clean` keeps as it is, as the commands store it (DR-49). */
function storedAs(clean: (text: string) => string, value: SqlValue | undefined): boolean {
  try {
    return typeof value === 'string' && clean(value) === value;
  } catch {
    return false;
  }
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

/** A rule across tables, by its number in spec §6. */
type Rule = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Throws `BACKUP_INVALID`, params `rule` (the first rule of spec §6 broken), when the tables
 * disagree in a way no command could leave them: run after `validateBackupValues`, on rows whose
 * every value is readable. A rule about live data only reads live rows, so records soft-deleted
 * by the commands still load. `seq` is unique per customer by the tables' own UNIQUE indexes,
 * checked while loading.
 */
export function validateBackupInvariants(db: Database): void {
  const read = (sql: string) => rowsOf(db.sqlite, sql);
  const customers = read('SELECT * FROM customers');
  const transitions = read('SELECT * FROM stage_transitions ORDER BY customer_id, seq');
  const appointments = new Map(read('SELECT * FROM appointments').map((a) => [a.id, a]));
  const broken =
    transitionRule(customers, transitions) ??
    meetingRule(appointments, transitions) ??
    ownerRule(read, appointments) ??
    kycRule(read, customers) ??
    staffRule(read) ??
    futureRule(read, toIsoDate(today(db)));
  if (broken !== null) throw new DbError('BACKUP_INVALID', { rule: broken });
}

/** Rules 1–3: each customer's transitions chain from creation to its stage (ADR-0007, D10). */
function transitionRule(customers: Row[], transitions: Row[]): Rule | null {
  const byCustomer = groupBy(transitions, 'customer_id');
  for (const customer of customers) {
    const [first, ...later] = byCustomer.get(customer.id) ?? [];
    // Created in an open stage by hand; only an appointment's transition is ever withdrawn, never
    // the first.
    if (
      !first ||
      first.from_stage !== null ||
      first.appointment_id !== null ||
      first.deleted_at !== null ||
      !OPEN_STAGES.includes(first.to_stage) ||
      later.some((t) => t.from_stage === null)
    ) {
      return 1;
    }
    const live = [first, ...later].filter((t) => t.deleted_at === null);
    if (!live.slice(1).every((t, i) => follows(live[i]!, t))) return 3;
    if (live.at(-1)!.to_stage !== customer.stage) return 2;
  }
  return null;
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

/**
 * Rule 4: a live transition caused by a meeting carries its customer, day and stage after, and the
 * meeting is live too: deleting an appointment withdraws its transition (D7).
 */
function meetingRule(appointments: Map<unknown, Row>, transitions: Row[]): Rule | null {
  const caused = transitions.filter((t) => t.deleted_at === null && t.appointment_id !== null);
  const once = new Set(caused.map((t) => t.appointment_id)).size === caused.length;
  const matching = caused.every((t) => {
    const a = appointments.get(t.appointment_id)!;
    return (
      a.deleted_at === null &&
      a.customer_id === t.customer_id &&
      a.status === 'MET' &&
      a.stage_after === t.to_stage &&
      a.date === t.date
    );
  });
  return once && matching ? null : 4;
}

/**
 * Rule 5: a live customer, appointment or policy belongs to a live RE (who may stop being one, or
 * be deleted, only once their records are deleted); the RE never coordinates their own
 * appointment, and only a supporting role (`REVIEWER_ROLES`) coordinates a live appointment
 * (ADR-0007) or reviews a live meeting (D9); an appointment is rescheduled from one of the same
 * customer (D3).
 */
function ownerRule(read: (sql: string) => Row[], appointments: Map<unknown, Row>): Rule | null {
  const notRe = read(
    ['customers', 'appointments', 'policies']
      .map(
        (table) =>
          `SELECT 1 FROM ${table} r JOIN people p ON p.id = r.re_id WHERE r.deleted_at IS NULL AND (p.role <> 'RE' OR p.deleted_at IS NOT NULL)`,
      )
      .join(' UNION ALL '),
  );
  // A coordinator or reviewer may have become an RE once their appointment was deleted.
  const supporting = `(${REVIEWER_ROLES.map((role) => `'${role}'`).join(', ')})`;
  const misplaced = read(
    [
      'SELECT 1 FROM appointment_coordinators c JOIN appointments a ON a.id = c.appointment_id WHERE c.person_id = a.re_id',
      `SELECT 1 FROM appointment_coordinators c JOIN appointments a ON a.id = c.appointment_id JOIN people p ON p.id = c.person_id WHERE a.deleted_at IS NULL AND p.role NOT IN ${supporting}`,
      `SELECT 1 FROM appointments a JOIN people p ON p.id = a.outcome_reviewer_id WHERE a.deleted_at IS NULL AND p.role NOT IN ${supporting}`,
    ].join(' UNION ALL '),
  );
  const rescheduled = [...appointments.values()].every((a) => {
    if (a.rescheduled_from_id === null) return true;
    const from = appointments.get(a.rescheduled_from_id)!;
    return from.customer_id === a.customer_id && from.status === 'RESCHEDULED';
  });
  return notRe.length === 0 && misplaced.length === 0 && rescheduled ? null : 5;
}

/**
 * Rules 6–8 (ADR-0008, D2): a fact comes from a note of its own customer; each field has either one
 * active fact or at least two in conflict; the birth year and gender in effect are the profile's,
 * from a `SYSTEM` note, and one in conflict from a `SYSTEM` note is the profile's too, which
 * resolving the conflict would confirm; a `SYSTEM` note holds nothing else.
 */
function kycRule(read: (sql: string) => Row[], customers: Row[]): Rule | null {
  const facts = read(
    'SELECT f.*, n.customer_id AS note_customer_id, n.source FROM kyc_facts f JOIN kyc_notes n ON n.id = f.note_id',
  );
  const byCustomer = new Map(customers.map((c) => [c.id, c]));
  const counts = new Map<string, { active: number; conflict: number }>();
  for (const fact of facts) {
    if (fact.note_customer_id !== fact.customer_id) return 6;
    const key = `${String(fact.customer_id)}\n${String(fact.field)}`;
    const count = counts.get(key) ?? { active: 0, conflict: 0 };
    counts.set(key, count);
    const fromProfile = fact.source === 'SYSTEM';
    const profileField = fact.field === 'birthYear' || fact.field === 'gender';
    // A `SYSTEM` note holds only the profile's birth year and gender, whatever their status.
    if (fromProfile && !profileField) return 8;
    if (fact.status === 'superseded') continue;
    count[fact.status as 'active' | 'conflict']++;
    if (profileField && (fact.status === 'active' || fromProfile)) {
      const customer = byCustomer.get(fact.customer_id)!;
      const profile = { birthDate: customer.birth_date, gender: customer.gender } as ProfileFields;
      const field = fact.field as 'birthYear' | 'gender';
      const expected = JSON.stringify(profileFactValue(field, profile));
      if (!fromProfile || fact.value_json !== expected) return 8;
    }
  }
  const settled = [...counts.values()].every(
    ({ active, conflict }) => (active === 1 && conflict === 0) || (active === 0 && conflict >= 2),
  );
  return settled ? null : 7;
}

/**
 * Rule 9 (staff): only RE and TL belong to a team, deleted or not; a live person's team is live;
 * a team has at most one live TL (#223). A live TL of a deleted team breaks the second part, so
 * the third is counted over every team.
 */
function staffRule(read: (sql: string) => Row[]): Rule | null {
  const broken = read(
    [
      "SELECT 1 FROM people WHERE role NOT IN ('RE', 'TL') AND team_id IS NOT NULL",
      'SELECT 1 FROM people p JOIN teams t ON t.id = p.team_id WHERE p.deleted_at IS NULL AND t.deleted_at IS NOT NULL',
      "SELECT 1 FROM people WHERE role = 'TL' AND deleted_at IS NULL GROUP BY team_id HAVING COUNT(*) > 1",
    ].join(' UNION ALL '),
  );
  return broken.length === 0 ? null : 9;
}

/**
 * Rule 10 (F-11): what already happened is dated today at the latest, by the clock of the import —
 * a live transition (a customer's creation too), a policy's submission and issue, a meeting held
 * or missed, a KYC note, fact or version, a birth date (DR-42). Only a booked or cancelled
 * appointment may lie ahead. A birth year alone (`YYYY`) sorts before every day of its year, so the
 * same comparison of text holds for it.
 */
function futureRule(read: (sql: string) => Row[], today: string): Rule | null {
  const after = `'${today}'`;
  const broken = read(
    [
      `SELECT 1 FROM stage_transitions WHERE deleted_at IS NULL AND date > ${after}`,
      `SELECT 1 FROM policies WHERE deleted_at IS NULL AND (submitted_date > ${after} OR issued_date > ${after})`,
      `SELECT 1 FROM appointments WHERE deleted_at IS NULL AND status IN ('MET', 'NO_SHOW') AND date > ${after}`,
      `SELECT 1 FROM kyc_notes WHERE created_date > ${after}`,
      `SELECT 1 FROM kyc_facts WHERE confirmed_date > ${after}`,
      `SELECT 1 FROM kyc_versions WHERE date > ${after}`,
      `SELECT 1 FROM customers WHERE birth_date > ${after}`,
    ].join(' UNION ALL '),
  );
  return broken.length === 0 ? null : 10;
}

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
