/**
 * Customers and their stage transitions (spec §3.3–3.4, §4). `customers.stage` always equals the
 * `to` of the customer's latest live transition — "latest" by recording order (`seq`), whose dates
 * never go back (D10).
 * Birth date and gender are the source of the KYC birth year and gender (D2).
 */
import {
  assertValidTransition,
  compareDates,
  formatDate,
  type CalendarDate,
  type Customer,
  type CustomerStage,
  type StageTransition,
  fromIsoDate,
} from '@p2c/domain';
import { and, asc, count, desc, eq, gte, isNull, ne } from 'drizzle-orm';
import {
  findRow,
  lastSeq,
  liveCustomer,
  nextSeq,
  prepared,
  requireChoice,
  requireName,
  requireRe,
  requireRow,
  rowInsert,
  selectRows,
  stampDeleted,
  today,
  storedDate,
  storedPastDate,
  updateRow,
} from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { encodeBase32, ulid } from './ids';
import { previewProfileFacts, recordProfileFacts, type ProfileKycPreview } from './kyc';
import { appointments, CUSTOMER_STAGES, customers, GENDERS, stageTransitions } from './schema';

type CustomerRow = typeof customers.$inferSelect;
type TransitionRow = typeof stageTransitions.$inferSelect;

export type Gender = (typeof GENDERS)[number];
/** A full birth date, or only the year when the customer gave no more. */
export type BirthDate = CalendarDate | { readonly year: number };

export interface CustomerRecord extends Customer {
  /** The "ID ẩn" shown in the UI, `K-` + 4 Crockford base32 characters. */
  readonly code: string;
  readonly birthDate: BirthDate | null;
  readonly gender: Gender | null;
}

export interface CustomerProfile {
  readonly name: string;
  readonly reId: string;
  readonly birthDate?: BirthDate | null;
  readonly gender?: Gender | null;
}

export interface NewCustomer extends CustomerProfile {
  /** The open stage the customer starts in (ADR-0007). */
  readonly stage: CustomerStage;
  /** Day of the first transition, which is also the customer's creation day. */
  readonly date: CalendarDate;
}

// ---- reads ----------------------------------------------------------------

/** By id, as `listTeams`: the screens order names with `byName` of domain (DR-48). */
export function listCustomers(db: Database): CustomerRecord[] {
  return db.orm
    .select()
    .from(customers)
    .where(isNull(customers.deletedAt))
    .orderBy(asc(customers.id))
    .all()
    .map(toCustomer);
}

export function getCustomer(db: Database, id: string): CustomerRecord | undefined {
  const row = findRow(db, customers, id);
  return row && !row.deletedAt ? toCustomer(row) : undefined;
}

/** Live transitions of live customers (of one customer when given), in recording order. */
export function listStageTransitions(db: Database, customerId?: string): StageTransition[] {
  const one = customerId === undefined ? '' : 'AND t.customer_id = ?';
  const rows = selectRows(
    db,
    `SELECT t.id, t.customer_id, t.from_stage, t.to_stage, t.date, t.appointment_id
     FROM stage_transitions t JOIN customers c ON c.id = t.customer_id
     WHERE t.deleted_at IS NULL AND c.deleted_at IS NULL ${one}
     ORDER BY t.customer_id, t.seq`,
    customerId === undefined ? [] : [customerId],
  );
  return rows.map((row) => ({
    id: row[0] as string,
    customerId: row[1] as string,
    from: row[2] as CustomerStage | null,
    to: row[3] as CustomerStage,
    date: fromIsoDate(row[4] as string),
    appointmentId: row[5] as string | null,
  }));
}

// ---- commands -------------------------------------------------------------

export function createCustomer(db: Database, input: NewCustomer): CustomerRecord {
  return db.transaction(() => {
    const profile = validateProfile(db, input);
    const isoDate = storedPastDate(db, input.date);
    const at = db.now().toISOString();
    const id = ulid(db.now(), db.random);
    // The first transition, checked once before the customer row is written: a stage outside the
    // list is refused with a code, not the CHECK error of the table (DR6-51).
    const from = checkTransition(db, id, input.stage, input.date);
    db.orm
      .insert(customers)
      .values({
        id,
        code: freeCode(db),
        ...profile,
        stage: input.stage,
        createdAt: at,
        updatedAt: at,
        deletedAt: null,
      })
      .run();
    writeTransition(db, id, from, input.stage, isoDate, null);
    recordProfileFacts(db, id, { birthDate: null, gender: null }, profile, input.date);
    return toCustomer(liveCustomer(db, id));
  });
}

export function updateCustomerProfile(
  db: Database,
  id: string,
  changes: Partial<CustomerProfile>,
): CustomerRecord {
  return db.transaction(() => {
    const row = liveCustomer(db, id);
    const current = toCustomer(row);
    const profile = validateProfile(db, {
      name: changes.name ?? current.name,
      reId: changes.reId ?? current.reId,
      birthDate: changes.birthDate === undefined ? current.birthDate : changes.birthDate,
      gender: changes.gender === undefined ? current.gender : changes.gender,
    });
    updateRow(db, customers, id, profile);
    // The new RE takes over what is still planned (Owner 15/10/2026, T-233); what has an outcome or
    // is past, and the policies, count for the RE recorded on them (ADR-0007).
    if (profile.reId !== row.reId) {
      db.orm
        .update(appointments)
        .set({ reId: profile.reId, updatedAt: db.now().toISOString() })
        .where(plannedOff(db, id, profile.reId))
        .run();
    }
    recordProfileFacts(db, id, row, profile, today(db));
    return toCustomer(liveCustomer(db, id));
  });
}

/**
 * Mockup 5c: how many planned appointments `updateCustomerProfile` hands over to the RE `reId`;
 * none when the customer is theirs already.
 */
export function previewHandover(db: Database, id: string, reId: string): number {
  if (liveCustomer(db, id).reId === reId) return 0;
  return db.orm
    .select({ n: count() })
    .from(appointments)
    .where(plannedOff(db, id, reId))
    .get()!.n;
}

/**
 * Mockup 5c: what `updateCustomerProfile` would record in KYC for these birth date / gender
 * changes (omitted = unchanged), without writing; null when it records nothing.
 */
export function previewCustomerProfile(
  db: Database,
  id: string,
  changes: Pick<Partial<CustomerProfile>, 'birthDate' | 'gender'>,
): ProfileKycPreview | null {
  const current = toCustomer(liveCustomer(db, id));
  const birthDate = changes.birthDate === undefined ? current.birthDate : changes.birthDate;
  const gender = changes.gender === undefined ? current.gender : changes.gender;
  const next = {
    birthDate: birthDate ? birthDateText(db, birthDate) : null,
    gender: gender ?? null,
  };
  return previewProfileFacts(db, id, next, today(db));
}

/** A manual change points to no appointment, so it never counts as an RF (#44). */
export function changeStageManually(
  db: Database,
  customerId: string,
  change: { readonly to: CustomerStage; readonly date: CalendarDate },
): StageTransition {
  return db.transaction(() => {
    liveCustomer(db, customerId);
    storedPastDate(db, change.date);
    return appendTransition(db, customerId, change.to, change.date, null);
  });
}

export function softDeleteCustomer(db: Database, id: string): void {
  db.transaction(() => {
    liveCustomer(db, id);
    updateRow(db, customers, id, stampDeleted(db));
  });
}

/** Brings the customer back with every record not deleted on its own (spec Phase 6 TR-4). */
export function restoreCustomer(db: Database, id: string): void {
  db.transaction(() => {
    const row = requireRow(db, customers, id, 'CUSTOMER_NOT_FOUND');
    checkRestoreCustomer(db, row);
    updateRow(db, customers, id, { deletedAt: null });
  });
}

/** Why the customer cannot be restored, thrown as `restoreCustomer` throws it (TR-2). */
export function checkRestoreCustomer(db: Database, row: CustomerRow): void {
  requireRe(db, row.reId);
}

// ---- transitions, shared with the appointment commands --------------------

const insertTransition = rowInsert(stageTransitions);

/**
 * Records `current stage → to` and moves the customer, in the caller's transaction. The date may
 * not be before the latest transition's (D10), so dates follow `seq` and the stage snapshot of
 * domain, which reads them by day, agrees with `customers.stage`; the first transition carries the
 * creation day, so nothing goes before it.
 */
export function appendTransition(
  db: Database,
  customerId: string,
  to: CustomerStage,
  date: CalendarDate,
  appointmentId: string | null,
): StageTransition {
  const isoDate = storedDate(date);
  const from = checkTransition(db, customerId, to, date);
  return writeTransition(db, customerId, from, to, isoDate, appointmentId);
}

/**
 * Writes the transition from `from` that `checkTransition` allowed, on the stored day `isoDate`,
 * and moves the customer to `to`.
 */
function writeTransition(
  db: Database,
  customerId: string,
  from: CustomerStage | null,
  to: CustomerStage,
  isoDate: string,
  appointmentId: string | null,
): StageTransition {
  const row: TransitionRow = {
    id: ulid(db.now(), db.random),
    customerId,
    seq: nextSeq(lastSeq(db, stageTransitions, customerId)),
    fromStage: from,
    toStage: to,
    date: isoDate,
    appointmentId,
    createdAt: db.now().toISOString(),
    deletedAt: null,
  };
  prepared(db, insertTransition).run(row);
  updateRow(db, customers, customerId, { stage: to });
  return toTransition(row);
}

/**
 * Checks `appendTransition` without writing: the date not before the latest transition's (D10)
 * and the change allowed (ADR-0007). Returns the stage the customer moves from. A transition
 * recorded after the one numbered `afterSeq` counts as later even on the same day: a restored
 * meeting goes before what was recorded since its deletion (spec Phase 6 E20). The order of
 * recording tells it, not a clock, which may differ between the machines of an export and an import
 * (DR6-69).
 */
export function checkTransition(
  db: Database,
  customerId: string,
  to: CustomerStage,
  date: CalendarDate,
  afterSeq?: number,
): CustomerStage | null {
  requireStage(to);
  const latest = latestTransition(db, customerId);
  if (latest) {
    const order = compareDates(date, fromIsoDate(latest.date));
    const sameDayLater = afterSeq !== undefined && latest.seq > afterSeq;
    if (order < 0 || (order === 0 && sameDayLater)) {
      throw new DbError('TRANSITION_BEFORE_LATEST', { date: formatDate(fromIsoDate(latest.date)) });
    }
  }
  // A met appointment recorded the stage of its own day, which no change may come before (T-232);
  // it is dated today at the latest, so only a change dated back has one after it.
  if (compareDates(date, today(db)) < 0) {
    const [[meeting]] = selectRows(
      db,
      `SELECT MAX(date) FROM appointments
       WHERE customer_id = ? AND status = 'MET' AND deleted_at IS NULL AND date > ?`,
      [customerId, storedDate(date)],
    ) as [[string | null]];
    if (meeting) {
      throw new DbError('TRANSITION_BEFORE_MEETING', { date: formatDate(fromIsoDate(meeting)) });
    }
  }
  const from = latest ? latest.toStage : null;
  try {
    assertValidTransition(from, to);
  } catch {
    throw new DbError('INVALID_TRANSITION', from === null ? { to } : { from, to });
  }
  return from;
}

/** `stage` when it is a stage; else `INVALID_TRANSITION`, not the raw CHECK error (DR6-51). */
export function requireStage(stage: CustomerStage): CustomerStage {
  if (!CUSTOMER_STAGES.includes(stage)) throw new DbError('INVALID_TRANSITION', { to: stage });
  return stage;
}

/**
 * The stages the customer is in on `date`, in order: the one it starts the day in, then the one
 * each change that day moves it to; the last is its stage at the end of the day, as the domain
 * snapshot reads it. Up to the day of its creation, it starts in the stage it was created in: a
 * meeting held before the customer was entered is a backfill (DR-43, Owner 17/10/2026). A met
 * appointment that moved no stage records one of these as its stage after (spec §6 rule 4, T-232).
 * The one rule the commands, the import and the outcome dialogs read (DR6-134). `transitions` are
 * one customer's live ones, in recording order, which their days follow (D10).
 */
export function stagesOfDay(
  transitions: readonly Pick<StageTransition, 'date' | 'to'>[],
  date: CalendarDate,
): CustomerStage[] {
  const [created, ...changes] = transitions;
  if (!created) return [];
  let start = created.to;
  const during: CustomerStage[] = [];
  for (const t of changes) {
    const order = compareDates(t.date, date);
    if (order < 0) start = t.to;
    else if (order === 0) during.push(t.to);
  }
  return [start, ...during];
}

/**
 * Withdraws the live transition caused by the appointment, if any (D7): allowed only while it is
 * the customer's latest, and the customer goes back to its `from` stage. Tells whether there was one.
 * A deletion stamps the transition with its own instant `at`, which tells later what it withdrew.
 */
export function withdrawAppointmentTransition(
  db: Database,
  appointmentId: string,
  at = db.now().toISOString(),
): boolean {
  const caused = db.orm
    .select()
    .from(stageTransitions)
    .where(
      and(eq(stageTransitions.appointmentId, appointmentId), isNull(stageTransitions.deletedAt)),
    )
    .get();
  if (!caused) return false;
  // A customer's creation is never caused by an appointment; only a hand-edited file says so.
  if (caused.fromStage === null) throw new DbError('INVALID_TRANSITION');
  if (latestTransition(db, caused.customerId)?.id !== caused.id) {
    throw new DbError('TRANSITION_NOT_LATEST');
  }
  db.orm
    .update(stageTransitions)
    .set({ deletedAt: at })
    .where(eq(stageTransitions.id, caused.id))
    .run();
  updateRow(db, customers, caused.customerId, { stage: caused.fromStage });
  // D7 holds the move too while a later meeting kept the stage it moved to (T-232); the caller's
  // transaction rolls the withdrawal back.
  const left = meetingKeepingMove(
    listStageTransitions(db, caused.customerId),
    unmovedMeetingsFrom(db, caused.customerId, caused.date, appointmentId),
    toTransition(caused),
  );
  if (left) throw new DbError('STAGE_KEPT_BY_MEETING', { date: formatDate(left.date) });
  return true;
}

/**
 * D7 also holds a stage change while a meeting of its customer, met from its day on, moved no stage
 * and kept one the customer is not in on that day without the change (T-232): withdrawing it would
 * leave that meeting a stage the customer never had then. The first such meeting, the one rule the
 * command, the seed and the screen read (DR6-103). `transitions` are live ones in recording order,
 * `appointments` live ones by day; either may hold other customers'.
 */
export function meetingKeepingMove<
  A extends {
    readonly id: string;
    readonly customerId: string;
    readonly date: CalendarDate;
    readonly status: string;
    readonly stageAfter: CustomerStage | null;
  },
>(
  transitions: readonly StageTransition[],
  appointments: readonly A[],
  move: Pick<StageTransition, 'id' | 'customerId' | 'date' | 'appointmentId'>,
): A | undefined {
  const own = transitions.filter((t) => t.customerId === move.customerId);
  const rest = own.filter((t) => t.id !== move.id);
  return appointments.find(
    (m) =>
      m.customerId === move.customerId &&
      m.id !== move.appointmentId &&
      m.status === 'MET' &&
      compareDates(m.date, move.date) >= 0 &&
      !own.some((t) => t.appointmentId === m.id) &&
      !stagesOfDay(rest, m.date).includes(m.stageAfter!),
  );
}

/**
 * The customer's live meetings that moved no stage, from the stored day `isoDate` on, by day, all
 * but the appointment `exceptId`: those `meetingKeepingMove` may find, read as it reads them (#667).
 */
function unmovedMeetingsFrom(db: Database, customerId: string, isoDate: string, exceptId: string) {
  const rows = selectRows(
    db,
    `SELECT id, date, status, stage_after FROM appointments a
     WHERE customer_id = ? AND deleted_at IS NULL AND status = 'MET' AND date >= ? AND id <> ?
       AND NOT EXISTS (
         SELECT 1 FROM stage_transitions t WHERE t.appointment_id = a.id AND t.deleted_at IS NULL)
     ORDER BY date`,
    [customerId, isoDate, exceptId],
  ) as [string, string, string, CustomerStage | null][];
  return rows.map(([id, date, status, stageAfter]) => ({
    id,
    customerId,
    date: fromIsoDate(date),
    status,
    stageAfter,
  }));
}

/**
 * The transition of the appointment withdrawn at the instant `at`, that of its deletion: one of its
 * own customer's, so restoring never moves another customer (DR6-71). One instant is one text: the
 * app stamps with `toISOString()`, and the import takes no other form (spec §6, DR6-105).
 */
export function transitionWithdrawnAt(
  db: Database,
  appointment: { readonly id: string; readonly customerId: string },
  at: string,
): TransitionRow | undefined {
  return db.orm
    .select()
    .from(stageTransitions)
    .where(
      and(
        eq(stageTransitions.appointmentId, appointment.id),
        eq(stageTransitions.customerId, appointment.customerId),
        eq(stageTransitions.deletedAt, at),
      ),
    )
    .get();
}

/**
 * Records the stage change of a restored appointment again, on its day (spec Phase 6 TR-3): the very
 * transition its deletion withdrew while it still follows the latest one, so restoring undoes the
 * deletion; a new one when the stage moved since. The caller checked the change (`checkTransition`).
 */
export function reinstateTransition(
  db: Database,
  withdrawn: TransitionRow,
  to: CustomerStage,
  date: CalendarDate,
): void {
  const latest = latestTransition(db, withdrawn.customerId);
  const follows =
    latest !== undefined &&
    latest.seq < withdrawn.seq &&
    latest.toStage === withdrawn.fromStage &&
    withdrawn.toStage === to &&
    withdrawn.date === storedDate(date);
  if (!follows) {
    appendTransition(db, withdrawn.customerId, to, date, withdrawn.appointmentId);
    return;
  }
  db.orm
    .update(stageTransitions)
    .set({ deletedAt: null })
    .where(eq(stageTransitions.id, withdrawn.id))
    .run();
  updateRow(db, customers, withdrawn.customerId, { stage: to });
}

// ---- helpers --------------------------------------------------------------

function latestTransition(db: Database, customerId: string): TransitionRow | undefined {
  return db.orm
    .select()
    .from(stageTransitions)
    .where(and(eq(stageTransitions.customerId, customerId), isNull(stageTransitions.deletedAt)))
    .orderBy(desc(stageTransitions.seq))
    .get();
}

/** The customer's planned appointments (scheduled, today or later: spec Phase 4 §1) not on `reId`. */
function plannedOff(db: Database, customerId: string, reId: string) {
  return and(
    eq(appointments.customerId, customerId),
    eq(appointments.status, 'SCHEDULED'),
    isNull(appointments.deletedAt),
    gte(appointments.date, storedDate(today(db))),
    ne(appointments.reId, reId),
  );
}

function validateProfile(db: Database, input: CustomerProfile) {
  return {
    name: requireName(input.name),
    reId: requireRe(db, input.reId),
    birthDate: input.birthDate ? birthDateText(db, input.birthDate) : null,
    gender: input.gender == null ? null : requireChoice(GENDERS, input.gender),
  };
}

/** A birth has already happened (DR-42): a year alone is after today only from next year on. */
function birthDateText(db: Database, birthDate: BirthDate): string {
  if ('month' in birthDate) return storedPastDate(db, birthDate);
  // A year alone is checked as 1 January of that year.
  return storedPastDate(db, { year: birthDate.year, month: 1, day: 1 }).slice(0, 4);
}

function freeCode(db: Database): string {
  for (;;) {
    const code = `K-${encodeBase32(db.random(new Uint8Array(3)))}`;
    const taken = db.orm
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.code, code))
      .get();
    if (!taken) return code;
  }
}

function toCustomer(row: CustomerRow): CustomerRecord {
  const birth = row.birthDate;
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    reId: row.reId,
    stage: row.stage,
    birthDate:
      birth === null ? null : birth.length === 4 ? { year: Number(birth) } : fromIsoDate(birth),
    gender: row.gender,
  };
}

function toTransition(row: TransitionRow): StageTransition {
  return {
    id: row.id,
    customerId: row.customerId,
    from: row.fromStage,
    to: row.toStage,
    date: fromIsoDate(row.date),
    appointmentId: row.appointmentId,
  };
}
