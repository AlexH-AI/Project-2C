/**
 * Checks of an imported backup (spec §6): SQLite only checks integer/text, CHECK and foreign keys,
 * so a date like `2026-02-30`, a broken KYC JSON or a stage no transition reached would load and
 * then break the screens or the metrics that read it. Rows are read as they are; nothing is
 * replayed through the commands, which would change ids, `seq` and hashes.
 */
import {
  assertValidTransition,
  calendarDate,
  fromIsoDate,
  isIsoDate,
  KYC_FIELDS,
  kycHash,
  normalizeKycValue,
  PIPELINE_STAGES,
  REVIEWER_ROLES,
  type CustomerStage,
  type KycFact,
  type KycField,
  type KycValue,
} from '@p2c/domain';
import type { Database as SqlJsDatabase, SqlValue } from 'sql.js';
import * as z from 'zod/mini';
import { analysisContentFits, analysisLabelsFit, type AnalysisFields } from './ai-analyses';
import { cleanNote, isFee, optionalText, requireName, sqlTexts, storedDate, today } from './common';
import { stagesOfDay } from './customers';
import type { Database } from './database';
import { DbError } from './errors';
import { profileFactValue, type ProfileFields } from './kyc';
import {
  PERSON_REFERENCE_KINDS,
  PERSON_REFERENCES,
  POINTS_TO,
  quotedKinds,
  type PersonReferenceKind,
} from './person-references';

const YEAR = /^\d{4}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const TIMESTAMPS = new Set(['created_at', 'updated_at', 'deleted_at']);
/**
 * A stamp as `toISOString()` writes it, milliseconds and `Z`: one instant is then one text, which
 * the app compares as such — a deletion and the transition it withdrew, the order of Thùng rác
 * (DR6-105).
 */
const timestamp = z.iso.datetime({ precision: 3 });
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
      if (table === 'kyc_notes' && !storedAs(requireNote, row.text)) {
        throw new DbError('BACKUP_INVALID');
      }
      if (NAMED.has(table) && !storedAs(requireName, row.name)) throw new DbError('BACKUP_INVALID');
      if (table === 'appointments' && !appointmentTextStored(row)) {
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
  // A safe integer, as `nextSeq` writes it (DR-34).
  if (column === 'seq') return Number.isSafeInteger(value) && (value as number) >= 1;
  // A fee, as `requireAmount` takes it (DR-23).
  if (FEES.has(column)) return isFee(value);
  return true;
}

const FEES = new Set(['expected_case_size', 'submitted_fyp', 'issued_fyp']);
const NAMED = new Set(['teams', 'people', 'customers']);

/** A KYC note's text as `addKycNote` stores it: `cleanNote`, not empty (DR-05). */
function requireNote(text: string): string {
  const clean = cleanNote(text);
  if (clean === '') throw new DbError('BACKUP_INVALID');
  return clean;
}

/** Text `optionalText` stores as it is: trimmed, with something to see (DR6-72). */
function requireOptionalText(text: string): string {
  const stored = optionalText(text);
  if (stored === null) throw new DbError('BACKUP_INVALID');
  return stored;
}

/**
 * The optional text of an appointment, deleted or not, as the commands store it: none (null, or an
 * empty note) or text `optionalText` keeps (DR6-72, Owner 23/10/2026); a meeting held has its next
 * step, as `recordMeetingOutcome` stores it (DR-05).
 */
function appointmentTextStored(row: Row): boolean {
  const kept = (text: SqlValue | undefined) => storedAs(requireOptionalText, text);
  return (
    (row.trigger_note === null || kept(row.trigger_note)) &&
    ((row.status !== 'MET' && row.next_step === null) || kept(row.next_step)) &&
    (row.note === '' || kept(row.note))
  );
}

/** Text that `clean` keeps as it is, as the commands store it (DR-49). */
function storedAs(clean: (text: string) => string, value: SqlValue | undefined): boolean {
  try {
    return typeof value === 'string' && clean(value) === value;
  } catch {
    return false;
  }
}

/** A stored day, as `fromIsoDate` reads it back. */
function validDate(value: SqlValue): boolean {
  return typeof value === 'string' && isIsoDate(value);
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

/** A rule across tables, by its number in spec §6; 11–14 are rules 1–4 of spec Phase 5 §7.3. */
type Rule = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

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
    futureRule(read, storedDate(today(db))) ??
    aiRule(read, storedDate(today(db)));
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
 * Rule 4: a transition caused by a meeting carries its customer, even withdrawn, since restoring
 * the meeting gives it back (DR6-71); a live one carries its day and stage after too, and the
 * meeting is live: deleting an appointment withdraws its transition (D7). A live meeting that moved
 * no stage kept one the customer was in that day (`stagesOfDay`, T-232).
 */
function meetingRule(appointments: Map<unknown, Row>, transitions: Row[]): Rule | null {
  const elsewhere = transitions.some(
    (t) =>
      t.appointment_id !== null &&
      appointments.get(t.appointment_id)?.customer_id !== t.customer_id,
  );
  if (elsewhere) return 4;
  const live = transitions.filter((t) => t.deleted_at === null);
  const caused = live.filter((t) => t.appointment_id !== null);
  const moved = new Set(caused.map((t) => t.appointment_id));
  const days = new Map(
    [...groupBy(live, 'customer_id')].map(([id, rows]) => [
      id,
      rows.map((t) => ({ date: fromIsoDate(t.date as string), to: t.to_stage as CustomerStage })),
    ]),
  );
  for (const a of appointments.values()) {
    if (a.deleted_at !== null || a.status !== 'MET' || moved.has(a.id)) continue;
    const stages = stagesOfDay(days.get(a.customer_id) ?? [], fromIsoDate(a.date as string));
    if (!stages.includes(a.stage_after as CustomerStage)) return 4;
  }
  const once = moved.size === caused.length;
  const matching = caused.every((t) => {
    const a = appointments.get(t.appointment_id)!;
    return (
      a.deleted_at === null &&
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
 * (ADR-0007) or reviews a live meeting (D9), and is not deleted while it does (DR-04); an
 * appointment is rescheduled from one of the same customer (D3), which has no other new one and is
 * not rescheduled, at any remove, from it: deleted appointments too, as the chain keeps them (DR-06).
 * What points to a person is read from `PERSON_REFERENCES`, the one list of those columns, and whom
 * it points to from `POINTS_TO`, which `ownsRecords` reads too.
 */
function ownerRule(read: (sql: string) => Row[], appointments: Map<unknown, Row>): Rule | null {
  const references = `(${PERSON_REFERENCES})`;
  // The people some live reference of those kinds points to, to be one of those that fail.
  const pointedTo = (kinds: readonly PersonReferenceKind[]) =>
    `p.id IN (SELECT person_id FROM ${references} WHERE live AND kind IN (${quotedKinds(kinds)}))`;
  const reKinds = PERSON_REFERENCE_KINDS.filter((kind) => POINTS_TO[kind] === 're');
  // A kind POINTS_TO says nothing of is checked as one supporting the record, never left out.
  const supportingKinds = PERSON_REFERENCE_KINDS.filter((kind) => POINTS_TO[kind] !== 're');
  const notRe = read(
    `SELECT 1 FROM people p WHERE (p.role <> 'RE' OR p.deleted_at IS NOT NULL) AND ${pointedTo(reKinds)}`,
  );
  // A coordinator or reviewer may have become an RE once their appointment was deleted.
  const supportingRoles = `(${sqlTexts(REVIEWER_ROLES)})`;
  const misplaced = read(
    [
      // An appointment's RE among its coordinators: one person, both kinds, on one appointment.
      `SELECT 1 FROM ${references} WHERE kind IN (${quotedKinds(['coordinator', 'appointment'])}) GROUP BY appointment_id, person_id HAVING COUNT(DISTINCT kind) = 2`,
      `SELECT 1 FROM people p WHERE (p.role NOT IN ${supportingRoles} OR p.deleted_at IS NOT NULL) AND ${pointedTo(supportingKinds)}`,
    ].join(' UNION ALL '),
  );
  const rescheduled = [...appointments.values()].every((a) => {
    if (a.rescheduled_from_id === null) return true;
    const from = appointments.get(a.rescheduled_from_id)!;
    return from.customer_id === a.customer_id && from.status === 'RESCHEDULED';
  });
  return notRe.length === 0 && misplaced.length === 0 && rescheduled && chained(appointments)
    ? null
    : 5;
}

/** Each appointment has at most one new one, and following them never comes back to it. */
function chained(appointments: Map<unknown, Row>): boolean {
  const from = [...appointments.values()].map((a) => a.rescheduled_from_id).filter((id) => id);
  if (new Set(from).size !== from.length) return false;
  // With one new appointment each, a chain that comes back has no start: walk from each start.
  const starts = [...appointments.values()].filter((a) => a.rescheduled_from_id === null);
  const next = new Map(
    [...appointments.values()]
      .filter((a) => a.rescheduled_from_id)
      .map((a) => [a.rescheduled_from_id, a]),
  );
  let reached = 0;
  for (const start of starts) {
    for (let a: Row | undefined = start; a; a = next.get(a.id)) reached++;
  }
  return reached === appointments.size;
}

/**
 * Rules 6–8 (ADR-0008, D2): a fact comes from a note of its own customer; each field has either one
 * active fact or at least two in conflict, of different values; the birth year and gender in effect
 * are the profile's, from a `SYSTEM` note, and one in conflict from a `SYSTEM` note is the profile's
 * too, which resolving the conflict would confirm; a `SYSTEM` note holds nothing else. A birth date
 * or gender in the profile has such a fact, active or in conflict, as saving it records one (DR-07).
 * The versions fit the facts too (rule 7, `versionsFit`).
 */
function kycRule(read: (sql: string) => Row[], customers: Row[]): Rule | null {
  const facts = read(
    'SELECT f.*, n.customer_id AS note_customer_id, n.source FROM kyc_facts f JOIN kyc_notes n ON n.id = f.note_id',
  );
  const byCustomer = new Map(customers.map((c) => [c.id, c]));
  const counts = new Map<string, { active: number; conflict: unknown[] }>();
  const fromProfile = new Set<string>();
  for (const fact of facts) {
    if (fact.note_customer_id !== fact.customer_id) return 6;
    const key = `${String(fact.customer_id)}\n${String(fact.field)}`;
    const count = counts.get(key) ?? { active: 0, conflict: [] };
    counts.set(key, count);
    const system = fact.source === 'SYSTEM';
    const profileField = fact.field === 'birthYear' || fact.field === 'gender';
    // A `SYSTEM` note holds only the profile's birth year and gender, whatever their status.
    if (system && !profileField) return 8;
    if (fact.status === 'superseded') continue;
    if (fact.status === 'active') count.active++;
    // The value read, not its JSON text: `2.0` is 2 (the value checks found it normalised).
    else count.conflict.push(JSON.parse(String(fact.value_json)));
    if (profileField && (fact.status === 'active' || system)) {
      const customer = byCustomer.get(fact.customer_id)!;
      const field = fact.field as 'birthYear' | 'gender';
      const expected = JSON.stringify(profileFactValue(field, profileOf(customer)));
      if (!system || fact.value_json !== expected) return 8;
      fromProfile.add(key);
    }
  }
  const missing = customers.some((customer) =>
    (['birthYear', 'gender'] as const).some(
      (field) =>
        profileFactValue(field, profileOf(customer)) !== null &&
        !fromProfile.has(`${String(customer.id)}\n${field}`),
    ),
  );
  if (missing) return 8;
  // In conflict, each value differs from the others, as `markConflict` takes it (DR6-50).
  const settled = [...counts.values()].every(
    ({ active, conflict }) =>
      (active === 1 && conflict.length === 0) ||
      (active === 0 && conflict.length >= 2 && new Set(conflict).size === conflict.length),
  );
  return settled && versionsFit(read, facts) ? null : 7;
}

/** A hash as `kycHash` writes it: 14 lower-case hex digits (Owner 25/10/2026, review #824). */
const KYC_HASH = /^[0-9a-f]{14}$/;

/**
 * Rule 7, the versions (S-1; Owner 23/10/2026, T-291): a customer has versions when it has facts in
 * effect, and only then; the latest version's hash is `kycHash` of those facts, as the KYC commands
 * record a version each time it changes and compare the next one with it; two versions in a row
 * differ; every hash is in the form `kycHash` writes. The facts behind an older version are not
 * kept, so only the form of its hash is checked.
 */
function versionsFit(read: (sql: string) => Row[], facts: Row[]): boolean {
  const versions = groupBy(
    read('SELECT customer_id, hash FROM kyc_versions ORDER BY customer_id, seq'),
    'customer_id',
  );
  const inEffect = groupBy(
    facts.filter((fact) => fact.status !== 'superseded'),
    'customer_id',
  );
  const fit = [...versions].every(([customer, list]) => {
    const hashes = list.map((version) => String(version.hash));
    const current = inEffect.get(customer);
    return (
      hashes.every((hash, i) => KYC_HASH.test(hash) && hash !== hashes[i - 1]) &&
      current !== undefined &&
      hashes.at(-1) === storedKycHash(current)
    );
  });
  return fit && [...inEffect.keys()].every((customer) => versions.has(customer));
}

/**
 * `kycHash` of a customer's facts, rows as the table stores them: what rule 7 expects the latest
 * version's hash to be. A superseded fact changes nothing, as in `kycHash`. Exported for the tests,
 * which work the hash out again after editing a backup's facts.
 */
export function storedKycHash(rows: readonly Record<string, unknown>[]): string {
  return kycHash({ notes: [], facts: rows.map(toFact) });
}

/** A stored fact as `domain` reads it, for `kycHash`. */
function toFact(row: Record<string, unknown>): KycFact {
  const field = row.field as KycField;
  return {
    id: String(row.id),
    category: KYC_FIELDS[field].category,
    field,
    value: JSON.parse(String(row.value_json)) as KycValue,
    noteId: String(row.note_id),
    confirmedDate: fromIsoDate(String(row.confirmed_date)),
    status: row.status as KycFact['status'],
  };
}

function profileOf(customer: Row): ProfileFields {
  return { birthDate: customer.birth_date, gender: customer.gender } as ProfileFields;
}

/**
 * Rule 9 (staff): a live person's team is live; a team has at most one live TL (#223). A live TL
 * of a deleted team breaks the first part, so the second is counted over every team. That only RE
 * and TL belong to a team, deleted or not, is a CHECK of the schema (DR6-52).
 */
function staffRule(read: (sql: string) => Row[]): Rule | null {
  const broken = read(
    [
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

/**
 * Rules 11–14 (spec Phase 5 §7.3), on what the table's CHECK and UNIQUE leave to the app: the KYC
 * version analysed is the customer's own (11); the columns fit together as `recordAiAnalysis`
 * takes them (12, 13: `analysisLabelsFit`, `analysisContentFits`, the output as the app stores it),
 * and the JSON reads back (13); the analysis is not dated after today (14).
 */
function aiRule(read: (sql: string) => Row[], today: string): Rule | null {
  const foreign = read(
    'SELECT 1 FROM ai_analyses a JOIN kyc_versions v ON v.id = a.kyc_version_id WHERE v.customer_id <> a.customer_id',
  );
  if (foreign.length > 0) return 11;
  const analyses = read('SELECT * FROM ai_analyses').map(fieldsOf);
  if (!analyses.every(analysisLabelsFit)) return 12;
  const readable = analyses.every((a) => a.input !== undefined && a.validator !== undefined);
  if (!readable || !analyses.every(analysisContentFits)) return 13;
  return analyses.some((a) => a.date > today) ? 14 : null;
}

/**
 * An analysis row for rules 12–14: its input and report parsed (`undefined` when they do not
 * parse), its output as stored, which `analysisContentFits` reads as the command does.
 */
function fieldsOf(row: Row): AnalysisFields & { readonly date: string } {
  return {
    mode: row.mode,
    status: row.status,
    provider: row.provider,
    model: row.model,
    promptVersion: row.prompt_version,
    attempts: row.attempts,
    input: parsed(row.input_json),
    outputJson: row.output_json,
    validator: parsed(row.validator_json),
    date: row.date as string,
  };
}

/** The JSON value of a stored text; `undefined` when it does not parse, `null` for SQL NULL. */
function parsed(text: SqlValue | undefined): unknown {
  if (text === null || text === undefined) return null;
  try {
    return JSON.parse(String(text)) as unknown;
  } catch {
    return undefined;
  }
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
