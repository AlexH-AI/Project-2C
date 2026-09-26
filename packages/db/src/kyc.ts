/**
 * KYC notes, facts and versions (spec §3.8–3.10, ADR-0008). Notes are only ever appended. Rows are
 * read in recording order (`seq`), never by date: "latest" is the highest `seq` (review #36).
 */
import {
  formatDate,
  KYC_FIELDS,
  type CalendarDate,
  type KycFact,
  type KycNote,
  type KycProfile,
  type KycValue,
  type KycVersion,
} from '@p2c/domain';
import { asc, eq, max } from 'drizzle-orm';
import { fromIsoDate, liveCustomer, toIsoDate } from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { ulid } from './ids';
import { KYC_NOTE_SOURCES, kycFacts, kycNotes, kycVersions } from './schema';

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

// ---- helpers --------------------------------------------------------------

function insertNote(
  db: Database,
  customerId: string,
  text: string,
  date: CalendarDate,
  source: KycSource,
): KycNoteRecord {
  const row = {
    id: ulid(db.now()),
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
