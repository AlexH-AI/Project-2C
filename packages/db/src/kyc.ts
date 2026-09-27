/**
 * KYC notes, facts and versions (spec §3.8–3.10, ADR-0008). The commands run the `domain`
 * operations on the stored profile and save the difference: new facts, changed statuses, and a new
 * version when the hash changes. "Latest" is by recording order (`seq`), never by date (review #36).
 * Birth year and gender come only from the customer profile, through `SYSTEM` notes (D2); the RE
 * may flag a disagreeing value as a conflict, but only the profile value can settle it (Owner, #62).
 */
import {
  addNote,
  confirmFact,
  formatDate,
  KYC_FIELDS,
  markConflict,
  nextKycVersion,
  resolveConflict,
  type CalendarDate,
  type KycFact,
  type KycFactInput,
  type KycField,
  type KycNote,
  type KycProfile,
  type KycValue,
  type KycVersion,
} from '@p2c/domain';
import { asc, desc, eq, max } from 'drizzle-orm';
import { fromIsoDate, liveCustomer, toIsoDate } from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { ulid } from './ids';
import { GENDERS, KYC_NOTE_SOURCES, kycFacts, kycNotes, kycVersions } from './schema';

export type KycSource = (typeof KYC_NOTE_SOURCES)[number];

export interface KycNoteRecord extends KycNote {
  readonly source: KycSource;
}

export interface KycProfileRecord extends KycProfile {
  readonly notes: readonly KycNoteRecord[];
}

export interface KycVersionRecord extends KycVersion {
  readonly id: string;
}

export interface KycFactCommand {
  readonly field: KycField;
  /** Normalised to the type of the trường; `"2"` for a number trường is stored as `2`. */
  readonly value: KycValue;
  readonly noteId: string;
  readonly date: CalendarDate;
  /** Switch the resulting version to material (ADR-0008 7); it can never switch it off. */
  readonly material?: boolean;
}

export interface KycChange {
  readonly fact: KycFact;
  /** The version recorded, or null when the facts in effect did not change. */
  readonly version: KycVersionRecord | null;
}

/** Trường holding a whole number or a yes/no answer; every other trường holds text. */
const NUMBER_FIELDS: ReadonlySet<KycField> = new Set(['birthYear', 'childrenCount']);
const BOOLEAN_FIELDS: ReadonlySet<KycField> = new Set(['hasProtection']);
/** Set from the customer profile only (D2). */
const PROFILE_FIELDS: ReadonlySet<KycField> = new Set(['birthYear', 'gender']);
const GENDER_LABELS = { MALE: 'Nam', FEMALE: 'Nữ' } as const satisfies Record<
  (typeof GENDERS)[number],
  string
>;

// ---- reads ----------------------------------------------------------------

export function getKycProfile(db: Database, customerId: string): KycProfileRecord {
  liveCustomer(db, customerId);
  return loadProfile(db, customerId);
}

export function listKycVersions(db: Database, customerId: string): KycVersionRecord[] {
  liveCustomer(db, customerId);
  return db.orm
    .select()
    .from(kycVersions)
    .where(eq(kycVersions.customerId, customerId))
    .orderBy(asc(kycVersions.seq))
    .all()
    .map(toVersion);
}

// ---- commands -------------------------------------------------------------

export function addKycNote(
  db: Database,
  customerId: string,
  note: { readonly text: string; readonly date: CalendarDate },
): KycNoteRecord {
  return db.transaction(() => {
    liveCustomer(db, customerId);
    const text = note.text.trim();
    if (text === '') throw new DbError('KYC_NOTE_EMPTY');
    return insertNote(db, customerId, text, note.date, 'RE');
  });
}

/** The value becomes the latest of its trường; what was current there is superseded. */
export function confirmKycFact(
  db: Database,
  customerId: string,
  command: KycFactCommand,
): KycChange {
  return factCommand(db, customerId, command, (profile, input) => {
    if (PROFILE_FIELDS.has(input.field)) throw new DbError('KYC_FIELD_FROM_PROFILE');
    return confirmFact(profile, input);
  });
}

/** A value that disagrees with the current one: both stay in conflict until resolved. */
export function markKycConflict(
  db: Database,
  customerId: string,
  command: KycFactCommand,
): KycChange {
  return factCommand(db, customerId, command, (profile, input) => {
    try {
      return markConflict(profile, input);
    } catch {
      throw new DbError('KYC_NO_CONFLICT');
    }
  });
}

/** Keeps the chosen fact of a conflict; for birth year and gender it must be the profile's. */
export function resolveKycConflict(
  db: Database,
  customerId: string,
  command: { readonly factId: string; readonly date: CalendarDate; readonly material?: boolean },
): KycChange {
  return db.transaction(() => {
    liveCustomer(db, customerId);
    const before = loadProfile(db, customerId);
    const chosen = before.facts.find((fact) => fact.id === command.factId);
    if (!chosen) throw new DbError('KYC_FACT_NOT_FOUND');
    if (chosen.status !== 'conflict') throw new DbError('KYC_NOT_IN_CONFLICT');
    const source = before.notes.find((note) => note.id === chosen.noteId)?.source;
    if (PROFILE_FIELDS.has(chosen.field) && source !== 'SYSTEM') {
      throw new DbError('KYC_FIELD_FROM_PROFILE');
    }
    const after = resolveConflict(before, chosen.id);
    const version = save(db, customerId, before, after, command.date, command.material ?? false);
    return { fact: after.facts.find((fact) => fact.id === chosen.id)!, version };
  });
}

/** The RE switches a version to material; there is no way to switch it off (ADR-0008 7). */
export function markKycVersionMaterial(db: Database, versionId: string): KycVersionRecord {
  return db.transaction(() => {
    const row = db.orm.select().from(kycVersions).where(eq(kycVersions.id, versionId)).get();
    if (!row) throw new DbError('KYC_VERSION_NOT_FOUND');
    liveCustomer(db, row.customerId);
    db.orm.update(kycVersions).set({ material: true }).where(eq(kycVersions.id, versionId)).run();
    return toVersion({ ...row, material: true });
  });
}

/** Birth date (`YYYY` or `YYYY-MM-DD`) and gender as stored on the customer. */
export interface ProfileFields {
  readonly birthDate: string | null;
  readonly gender: (typeof GENDERS)[number] | null;
}

/**
 * D2, in the caller's transaction: when the birth date or gender changed, records one `SYSTEM` note
 * and confirms the birth year / gender from it. Once set, neither can be cleared.
 */
export function recordProfileFacts(
  db: Database,
  customerId: string,
  previous: ProfileFields,
  next: ProfileFields,
  date: CalendarDate,
): void {
  const changes: [KycField, KycValue, string][] = [];
  if (next.birthDate !== previous.birthDate) {
    if (next.birthDate === null) throw new DbError('KYC_PROFILE_FIELD_REQUIRED');
    const year = Number(next.birthDate.slice(0, 4));
    const text =
      next.birthDate.length === 4
        ? `năm sinh ${year}`
        : `ngày sinh ${formatDate(fromIsoDate(next.birthDate))}`;
    changes.push(['birthYear', year, text]);
  }
  if (next.gender !== previous.gender) {
    if (next.gender === null) throw new DbError('KYC_PROFILE_FIELD_REQUIRED');
    const label = GENDER_LABELS[next.gender];
    changes.push(['gender', label, `giới tính ${label}`]);
  }
  if (changes.length === 0) return;

  const before = loadProfile(db, customerId);
  const text = `Hồ sơ KH: ${changes.map(([, , part]) => part).join('; ')}`;
  const note = insertNote(db, customerId, text, date, 'SYSTEM');
  const after = changes.reduce(
    (profile, [field, value]) =>
      confirmFact(profile, {
        id: ulid(db.now(), db.random),
        field,
        value,
        noteId: note.id,
        confirmedDate: date,
      }),
    addNote(before, note),
  );
  save(db, customerId, before, after, date, false);
}

// ---- helpers --------------------------------------------------------------

function factCommand(
  db: Database,
  customerId: string,
  command: KycFactCommand,
  apply: (profile: KycProfile, input: KycFactInput) => KycProfile,
): KycChange {
  return db.transaction(() => {
    liveCustomer(db, customerId);
    const before = loadProfile(db, customerId);
    const field = requireField(command.field);
    if (!before.notes.some((note) => note.id === command.noteId)) {
      throw new DbError('KYC_NOTE_NOT_FOUND');
    }
    const input: KycFactInput = {
      id: ulid(db.now(), db.random),
      field,
      value: normalizeValue(field, command.value),
      noteId: command.noteId,
      confirmedDate: command.date,
    };
    const after = apply(before, input);
    const version = save(db, customerId, before, after, command.date, command.material ?? false);
    return { fact: after.facts.find((fact) => fact.id === input.id)!, version };
  });
}

function requireField(field: string): KycField {
  if (!Object.hasOwn(KYC_FIELDS, field)) throw new DbError('INVALID_KYC_FIELD');
  return field as KycField;
}

/** Review #36: values are compared only after taking the type of their trường. */
function normalizeValue(field: KycField, value: KycValue): KycValue {
  const text = typeof value === 'string' ? value.trim() : null;
  if (NUMBER_FIELDS.has(field)) {
    const number = text !== null && /^\d+$/.test(text) ? Number(text) : value;
    if (typeof number === 'number' && Number.isSafeInteger(number) && number >= 0) return number;
  } else if (BOOLEAN_FIELDS.has(field)) {
    if (typeof value === 'boolean') return value;
    if (text === 'true' || text === 'false') return text === 'true';
  } else if (typeof value !== 'boolean') {
    const normalized = text ?? String(value);
    if (normalized !== '') return normalized;
  }
  throw new DbError('INVALID_KYC_VALUE');
}

/**
 * Stores what `after` added or changed against `before`, then the version. A version is recorded
 * after every command that changes the hash, so `before` is the profile at the latest version.
 */
function save(
  db: Database,
  customerId: string,
  before: KycProfile,
  after: KycProfile,
  date: CalendarDate,
  manualMaterial: boolean,
): KycVersionRecord | null {
  const at = db.now().toISOString();
  const statusBefore = new Map(before.facts.map((fact) => [fact.id, fact.status]));
  let seq = nextSeq(db, kycFacts, customerId);
  for (const fact of after.facts) {
    const status = statusBefore.get(fact.id);
    if (status === undefined) {
      db.orm
        .insert(kycFacts)
        .values({
          id: fact.id,
          customerId,
          seq: seq++,
          field: fact.field,
          valueJson: JSON.stringify(fact.value),
          noteId: fact.noteId,
          confirmedDate: toIsoDate(fact.confirmedDate),
          status: fact.status,
          createdAt: at,
          updatedAt: at,
        })
        .run();
    } else if (status !== fact.status) {
      db.orm
        .update(kycFacts)
        .set({ status: fact.status, updatedAt: at })
        .where(eq(kycFacts.id, fact.id))
        .run();
    }
  }

  const latest = db.orm
    .select()
    .from(kycVersions)
    .where(eq(kycVersions.customerId, customerId))
    .orderBy(desc(kycVersions.seq))
    .get();
  const previous = latest ? toVersion(latest) : null;
  const version = nextKycVersion(previous, previous && before, after, date, manualMaterial);
  if (!version) return null;
  const row = {
    id: ulid(db.now(), db.random),
    customerId,
    seq: nextSeq(db, kycVersions, customerId),
    hash: version.hash,
    date: toIsoDate(version.date),
    material: version.material,
    createdAt: at,
  };
  db.orm.insert(kycVersions).values(row).run();
  return toVersion(row);
}

function insertNote(
  db: Database,
  customerId: string,
  text: string,
  date: CalendarDate,
  source: KycSource,
): KycNoteRecord {
  const row = {
    id: ulid(db.now(), db.random),
    customerId,
    seq: nextSeq(db, kycNotes, customerId),
    text,
    createdDate: toIsoDate(date),
    source,
    createdAt: db.now().toISOString(),
  };
  db.orm.insert(kycNotes).values(row).run();
  return toNote(row);
}

function nextSeq(
  db: Database,
  table: typeof kycNotes | typeof kycFacts | typeof kycVersions,
  customerId: string,
): number {
  const row = db.orm
    .select({ seq: max(table.seq) })
    .from(table)
    .where(eq(table.customerId, customerId))
    .get();
  return (row?.seq ?? 0) + 1;
}

function loadProfile(db: Database, customerId: string): KycProfileRecord {
  const notes = db.orm
    .select()
    .from(kycNotes)
    .where(eq(kycNotes.customerId, customerId))
    .orderBy(asc(kycNotes.seq))
    .all()
    .map(toNote);
  const facts = db.orm
    .select()
    .from(kycFacts)
    .where(eq(kycFacts.customerId, customerId))
    .orderBy(asc(kycFacts.seq))
    .all()
    .map((row): KycFact => ({
      id: row.id,
      category: KYC_FIELDS[row.field].category,
      field: row.field,
      value: JSON.parse(row.valueJson) as KycValue,
      noteId: row.noteId,
      confirmedDate: fromIsoDate(row.confirmedDate),
      status: row.status,
    }));
  return { notes, facts };
}

function toNote(row: typeof kycNotes.$inferSelect): KycNoteRecord {
  return {
    id: row.id,
    text: row.text,
    createdDate: fromIsoDate(row.createdDate),
    source: row.source,
  };
}

function toVersion(row: typeof kycVersions.$inferSelect): KycVersionRecord {
  const date = fromIsoDate(row.date);
  return {
    id: row.id,
    hash: row.hash,
    summary: `Cập nhật KYC ${formatDate(date)}`,
    date,
    material: row.material,
  };
}
