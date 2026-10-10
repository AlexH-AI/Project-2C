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
  normalizeKycValue as normalizeDomainKycValue,
  resolveConflict,
  type CalendarDate,
  type KycFact,
  type KycFactInput,
  type KycField,
  type KycNote,
  type KycProfile,
  type KycValue,
  type KycVersion,
  fromIsoDate,
} from '@p2c/domain';
import { asc, desc, eq, max, sql } from 'drizzle-orm';
import { cleanText, liveCustomer, nextSeq, prepared, rowInsert, storedPastDate } from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { ulid } from './ids';
import { GENDERS, KYC_NOTE_SOURCES, kycFacts, kycNotes, kycVersions } from './schema';

export type KycSource = (typeof KYC_NOTE_SOURCES)[number];

export interface KycNoteRecord extends KycNote {
  readonly source: KycSource;
}

/** A stored fact with its `seq` by customer, which names it `F{seq}` for the AI (spec Phase 5 §6.1). */
export interface KycFactRecord extends KycFact {
  readonly seq: number;
}

export interface KycProfileRecord extends KycProfile {
  readonly notes: readonly KycNoteRecord[];
  readonly facts: readonly KycFactRecord[];
}

export interface KycVersionRecord extends KycVersion {
  readonly id: string;
  /** Its number by customer, "kyc v<seq>" on screen (spec Phase 5 §9.1); a backup may leave gaps. */
  readonly seq: number;
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

/** Set from the customer profile only (D2). */
const PROFILE_FIELDS: ReadonlySet<KycField> = new Set(
  (Object.keys(KYC_FIELDS) as KycField[]).filter((field) => KYC_FIELDS[field].fromProfile),
);
const GENDER_LABELS = { MALE: 'Nam', FEMALE: 'Nữ' } as const satisfies Record<
  (typeof GENDERS)[number],
  string
>;

// ---- reads ----------------------------------------------------------------

export function getKycProfile(db: Database, customerId: string): KycProfileRecord {
  liveCustomer(db, customerId);
  return readProfile(db, customerId, (row) => ({ ...toFact(row), seq: row.seq }));
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
    const text = cleanText(note.text);
    if (text === '') throw new DbError('KYC_NOTE_EMPTY');
    return insertNote(db, customerId, text, note.date, 'RE');
  });
}

/** A fact confirmed from the note being recorded; `conflict` marks it as disagreeing. */
export interface KycNoteFact {
  readonly field: KycField;
  readonly value: KycValue;
  readonly conflict?: boolean;
}

/**
 * Mockup 7a: a new note from the RE and the facts confirmed from it, saved at once as a single
 * version (none when the facts in effect did not change). Any refused fact rejects the whole note.
 */
export function recordKycNote(
  db: Database,
  customerId: string,
  command: {
    readonly text: string;
    readonly date: CalendarDate;
    readonly facts: readonly KycNoteFact[];
    readonly material?: boolean;
  },
): { readonly note: KycNoteRecord; readonly version: KycVersionRecord | null } {
  return db.transaction(() => {
    const note = addKycNote(db, customerId, command);
    // Like `addKycNote`: a note alone never records a version, not even the first one.
    if (command.facts.length === 0) return { note, version: null };
    const before = loadProfile(db, customerId);
    const after = command.facts.reduce<KycProfile>(
      (profile, fact) =>
        applyFact(profile, toInput(db, fact, note.id, command.date), fact.conflict ?? false),
      before,
    );
    const version = save(db, customerId, before, after, command.date, command.material ?? false);
    return { note, version };
  });
}

/** The value becomes the latest of its trường; what was current there is superseded. */
export function confirmKycFact(
  db: Database,
  customerId: string,
  command: KycFactCommand,
): KycChange {
  return factCommand(db, customerId, command, false);
}

/** A value that disagrees with the current one: both stay in conflict until resolved. */
export function markKycConflict(
  db: Database,
  customerId: string,
  command: KycFactCommand,
): KycChange {
  return factCommand(db, customerId, command, true);
}

/** Keeps the chosen fact of a conflict; for birth year and gender it must be the profile's. */
export function resolveKycConflict(
  db: Database,
  customerId: string,
  command: { readonly factId: string; readonly date: CalendarDate; readonly material?: boolean },
): KycChange {
  return db.transaction(() => {
    const customer = liveCustomer(db, customerId);
    storedPastDate(db, command.date);
    const before = loadProfile(db, customerId);
    const chosen = before.facts.find((fact) => fact.id === command.factId);
    if (!chosen) throw new DbError('KYC_FACT_NOT_FOUND');
    if (chosen.status !== 'conflict') throw new DbError('KYC_NOT_IN_CONFLICT');
    const source = before.notes.find((note) => note.id === chosen.noteId)?.source;
    // Only the profile's own value settles a birth year or gender (D2).
    if (
      PROFILE_FIELDS.has(chosen.field) &&
      (source !== 'SYSTEM' ||
        chosen.value !== profileFactValue(chosen.field as 'birthYear' | 'gender', customer))
    ) {
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
  const change = profileChange(previous, next);
  if (!change) return;
  const before = loadProfile(db, customerId);
  const note = insertNote(db, customerId, change.note, date, 'SYSTEM');
  const after = withProfileFacts(before, note, change, date, () => ulid(db.now(), db.random));
  save(db, customerId, before, after, date, false);
}

/** What `recordProfileFacts` records in KYC for a profile change (mockup 5c). */
export interface ProfileKycPreview {
  /** The text of the `SYSTEM` note. */
  readonly note: string;
  /** The facts confirmed from that note. */
  readonly facts: readonly { readonly field: KycField; readonly value: KycValue }[];
  /** Whether the facts in effect change, so a new KYC version is recorded. */
  readonly newVersion: boolean;
}

/**
 * The same work as `recordProfileFacts` on the profile as stored, without writing; null when
 * saving `next` records nothing in KYC. Throws like it for a birth date or gender being cleared.
 */
export function previewProfileFacts(
  db: Database,
  customerId: string,
  next: ProfileFields,
  date: CalendarDate,
): ProfileKycPreview | null {
  const change = profileChange(liveCustomer(db, customerId), next);
  if (!change) return null;
  const before = loadProfile(db, customerId);
  const note = { id: 'preview', text: change.note, createdDate: date };
  let count = 0;
  const after = withProfileFacts(before, note, change, date, () => `preview-${count++}`);
  const latest = prepared(db, latestVersion).get({ customerId });
  const previous = latest ? toVersion(latest) : null;
  const version = nextKycVersion(previous, previous && before, after, date, false);
  return { ...change, newVersion: version !== null };
}

/**
 * The value of the birth year or gender fact that the profile writes (D2), null when the profile
 * has none; the backup import checks the facts in effect against it (spec §6).
 */
export function profileFactValue(
  field: 'birthYear' | 'gender',
  profile: ProfileFields,
): KycValue | null {
  if (field === 'birthYear') {
    return profile.birthDate === null ? null : Number(profile.birthDate.slice(0, 4));
  }
  return profile.gender === null ? null : GENDER_LABELS[profile.gender];
}

// ---- helpers --------------------------------------------------------------

function profileChange(
  previous: ProfileFields,
  next: ProfileFields,
): Omit<ProfileKycPreview, 'newVersion'> | null {
  const changes: { field: KycField; value: KycValue; text: string }[] = [];
  if (next.birthDate !== previous.birthDate) {
    if (next.birthDate === null) throw new DbError('KYC_PROFILE_FIELD_REQUIRED');
    const year = profileFactValue('birthYear', next) as number;
    const text =
      next.birthDate.length === 4
        ? `năm sinh ${year}`
        : `ngày sinh ${formatDate(fromIsoDate(next.birthDate))}`;
    changes.push({ field: 'birthYear', value: year, text });
  }
  if (next.gender !== previous.gender) {
    if (next.gender === null) throw new DbError('KYC_PROFILE_FIELD_REQUIRED');
    const label = profileFactValue('gender', next) as string;
    changes.push({ field: 'gender', value: label, text: `giới tính ${label}` });
  }
  if (changes.length === 0) return null;
  return {
    note: `Hồ sơ KH: ${changes.map((change) => change.text).join('; ')}`,
    facts: changes.map(({ field, value }) => ({ field, value })),
  };
}

function withProfileFacts(
  before: KycProfile,
  note: KycNote,
  change: Omit<ProfileKycPreview, 'newVersion'>,
  date: CalendarDate,
  newId: () => string,
): KycProfile {
  return change.facts.reduce(
    (profile, { field, value }) =>
      confirmFact(profile, { id: newId(), field, value, noteId: note.id, confirmedDate: date }),
    addNote(before, note),
  );
}

function factCommand(
  db: Database,
  customerId: string,
  command: KycFactCommand,
  conflict: boolean,
): KycChange {
  return db.transaction(() => {
    liveCustomer(db, customerId);
    const before = loadProfile(db, customerId);
    const note = before.notes.find((n) => n.id === command.noteId);
    if (!note) throw new DbError('KYC_NOTE_NOT_FOUND');
    // A `SYSTEM` note holds only what the profile wrote there (D2).
    if (note.source === 'SYSTEM') throw new DbError('KYC_NOTE_FROM_PROFILE');
    const input = toInput(db, command, command.noteId, command.date);
    const after = applyFact(before, input, conflict);
    const version = save(db, customerId, before, after, command.date, command.material ?? false);
    return { fact: after.facts.find((fact) => fact.id === input.id)!, version };
  });
}

function toInput(
  db: Database,
  fact: { readonly field: string; readonly value: KycValue },
  noteId: string,
  date: CalendarDate,
): KycFactInput {
  const field = requireField(fact.field);
  storedPastDate(db, date);
  return {
    id: ulid(db.now(), db.random),
    field,
    value: normalizeKycValue(field, fact.value),
    noteId,
    confirmedDate: date,
  };
}

/** The RE may flag a birth year or gender as a conflict, but never confirm one (D2). */
function applyFact(profile: KycProfile, input: KycFactInput, conflict: boolean): KycProfile {
  if (!conflict) {
    if (PROFILE_FIELDS.has(input.field)) throw new DbError('KYC_FIELD_FROM_PROFILE');
    return confirmFact(profile, input);
  }
  try {
    return markConflict(profile, input);
  } catch {
    throw new DbError('KYC_NO_CONFLICT');
  }
}

function requireField(field: string): KycField {
  if (!Object.hasOwn(KYC_FIELDS, field)) throw new DbError('INVALID_KYC_FIELD');
  return field as KycField;
}

/**
 * The `domain` rules (spec Phase 5 §6.4), refusing as a `DbError` the UI can show: `INVALID_TEXT`
 * for a NUL, as for any stored text, and `INVALID_KYC_VALUE` for a value the trường cannot hold.
 */
export function normalizeKycValue(field: KycField, value: KycValue): KycValue {
  if (typeof value === 'string') cleanText(value);
  try {
    return normalizeDomainKycValue(field, value);
  } catch {
    throw new DbError('INVALID_KYC_VALUE');
  }
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
  let last = prepared(db, lastFactSeq).get({ customerId })?.seq;
  for (const fact of after.facts) {
    const status = statusBefore.get(fact.id);
    if (status === undefined) {
      prepared(db, insertFact).run({
        id: fact.id,
        customerId,
        seq: (last = nextSeq(last)),
        field: fact.field,
        valueJson: JSON.stringify(fact.value),
        noteId: fact.noteId,
        confirmedDate: storedPastDate(db, fact.confirmedDate),
        status: fact.status,
        createdAt: at,
        updatedAt: at,
      });
    } else if (status !== fact.status) {
      db.orm
        .update(kycFacts)
        .set({ status: fact.status, updatedAt: at })
        .where(eq(kycFacts.id, fact.id))
        .run();
    }
  }

  const latest = prepared(db, latestVersion).get({ customerId });
  const previous = latest ? toVersion(latest) : null;
  const version = nextKycVersion(previous, previous && before, after, date, manualMaterial);
  if (!version) return null;
  const row = {
    id: ulid(db.now(), db.random),
    customerId,
    seq: nextSeq(latest?.seq),
    hash: version.hash,
    date: storedPastDate(db, version.date),
    material: version.material,
    createdAt: at,
  };
  prepared(db, insertVersion).run(row);
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
    seq: nextSeq(prepared(db, lastNoteSeq).get({ customerId })?.seq),
    text,
    createdDate: storedPastDate(db, date),
    source,
    createdAt: db.now().toISOString(),
  };
  prepared(db, insertNoteRow).run(row);
  return toNote(row);
}

const insertNoteRow = rowInsert(kycNotes);
const insertFact = rowInsert(kycFacts);
const insertVersion = rowInsert(kycVersions);
const byCustomer = sql.placeholder('customerId');
const latestVersion = (db: Database) =>
  db.orm
    .select()
    .from(kycVersions)
    .where(eq(kycVersions.customerId, byCustomer))
    .orderBy(desc(kycVersions.seq))
    .limit(1)
    .prepare();
const lastSeq = (table: typeof kycNotes | typeof kycFacts) => (db: Database) =>
  db.orm
    .select({ seq: max(table.seq) })
    .from(table)
    .where(eq(table.customerId, byCustomer))
    .prepare();
const lastNoteSeq = lastSeq(kycNotes);
const lastFactSeq = lastSeq(kycFacts);
const notesOf = (db: Database) =>
  db.orm
    .select()
    .from(kycNotes)
    .where(eq(kycNotes.customerId, byCustomer))
    .orderBy(asc(kycNotes.seq))
    .prepare();
const factsOf = (db: Database) =>
  db.orm
    .select()
    .from(kycFacts)
    .where(eq(kycFacts.customerId, byCustomer))
    .orderBy(asc(kycFacts.seq))
    .prepare();

/** The stored notes and facts, each fact read by `fact`: the one read of a profile. */
function readProfile<F>(
  db: Database,
  customerId: string,
  fact: (row: typeof kycFacts.$inferSelect) => F,
) {
  const notes = prepared(db, notesOf).all({ customerId }).map(toNote);
  const facts = prepared(db, factsOf)
    .all({ customerId })
    .map((row) => fact(row));
  return { notes, facts };
}

/**
 * The stored profile as the commands work on it: without `seq`, so a fact a command returns equals
 * the same fact read back; `getKycProfile` reads it with `seq`.
 */
function loadProfile(db: Database, customerId: string) {
  return readProfile(db, customerId, toFact);
}

function toFact(row: typeof kycFacts.$inferSelect): KycFact {
  return {
    id: row.id,
    category: KYC_FIELDS[row.field].category,
    field: row.field,
    value: JSON.parse(row.valueJson) as KycValue,
    noteId: row.noteId,
    confirmedDate: fromIsoDate(row.confirmedDate),
    status: row.status,
  };
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
    seq: row.seq,
  };
}
