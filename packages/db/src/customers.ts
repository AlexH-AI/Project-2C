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
  liveCustomer,
  nextSeq,
  prepared,
  requireChoice,
  requireName,
  requireRe,
  rowInsert,
  selectRows,
  stampDeleted,
  today,
  storedDate,
  storedPastDate,
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
  const row = findCustomer(db, id);
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
    storedPastDate(db, input.date);
    const at = db.now().toISOString();
    const id = ulid(db.now(), db.random);
    db.orm
      .insert(customers)
      .values({
        id,
        code: freeCode(db),
        ...profile,
        stage: requireStage(input.stage),
        createdAt: at,
        updatedAt: at,
        deletedAt: null,
      })
      .run();
    appendTransition(db, id, input.stage, input.date, null);
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
    updateCustomerRow(db, id, profile);
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
    updateCustomerRow(db, id, stampDeleted(db));
  });
}

/** Brings the customer back with every record not deleted on its own (spec Phase 6 TR-4). */
export function restoreCustomer(db: Database, id: string): void {
  db.transaction(() => {
    const row = findCustomer(db, id);
    if (!row) throw new DbError('CUSTOMER_NOT_FOUND');
    checkRestoreCustomer(db, row);
    updateCustomerRow(db, id, { deletedAt: null });
  });
}

/** Why the customer cannot be restored, thrown as `restoreCustomer` throws it (TR-2). */
export function checkRestoreCustomer(db: Database, row: CustomerRow): void {
  requireRe(db, row.reId);
}

// ---- transitions, shared with the appointment commands --------------------

export { liveCustomer };

const insertTransition = rowInsert(stageTransitions);

/**
 * Records `current stage → to` and moves the customer, in the caller's transaction. The date may
 * not be before the latest transition's (D10), so dates follow `seq` and `stageOn` agrees with
 * `customers.stage`; the first transition carries the creation day, so nothing goes before it.
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
  const lastSeq = db.orm
    .select({ seq: stageTransitions.seq })
    .from(stageTransitions)
    .where(eq(stageTransitions.customerId, customerId))
    .orderBy(desc(stageTransitions.seq))
    .get();
  const row: TransitionRow = {
    id: ulid(db.now(), db.random),
    customerId,
    seq: nextSeq(lastSeq?.seq),
    fromStage: from,
    toStage: to,
    date: isoDate,
    appointmentId,
    createdAt: db.now().toISOString(),
    deletedAt: null,
  };
  prepared(db, insertTransition).run(row);
  updateCustomerRow(db, customerId, { stage: to });
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
 * The customer's stage at the end of `date`, as `stageOn` of domain reads it — the latest live
 * transition by `seq` dated that day or before, since dates follow `seq` (D10). Before the
 * customer's creation, the stage it was created in: a meeting held before the customer was entered
 * is a backfill (DR-43, Owner 17/10/2026).
 */
export function stageOnDay(
  db: Database,
  customerId: string,
  date: CalendarDate,
): CustomerStage | null {
  const [row] = selectRows(
    db,
    `SELECT COALESCE(
       (SELECT to_stage FROM stage_transitions
        WHERE customer_id = ? AND deleted_at IS NULL AND date <= ? ORDER BY seq DESC LIMIT 1),
       (SELECT to_stage FROM stage_transitions
        WHERE customer_id = ? AND deleted_at IS NULL ORDER BY seq LIMIT 1))`,
    [customerId, storedDate(date), customerId],
  );
  return (row?.[0] as CustomerStage | null | undefined) ?? null;
}

/**
 * Whether the customer is in `stage` at some point of `date`: at its start, or after a change that
 * day; before the creation, in the stage it was created in (`stageOnDay`). A met appointment that
 * moved no stage records such a stage as its stage after (spec §6 rule 4, T-232). `transitions` are
 * one customer's live ones, in recording order.
 */
export function isStageOfDay(
  transitions: readonly Pick<StageTransition, 'date' | 'to'>[],
  date: CalendarDate,
  stage: CustomerStage,
): boolean {
  let start = transitions[0]?.to;
  for (const t of transitions) {
    const order = compareDates(t.date, date);
    if (order < 0) start = t.to;
    else if (order === 0 && t.to === stage) return true;
  }
  return start === stage;
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
  updateCustomerRow(db, caused.customerId, { stage: caused.fromStage });
  // D7 holds the move too while a later meeting kept the stage it moved to (T-232); the caller's
  // transaction rolls the withdrawal back.
  const transitions = listStageTransitions(db, caused.customerId);
  const left = keptMeetings(db, caused.customerId, appointmentId, caused.date).find(
    (m) => !isStageOfDay(transitions, m.date, m.stage),
  );
  if (left) throw new DbError('STAGE_KEPT_BY_MEETING', { date: formatDate(left.date) });
  return true;
}

/** The customer's live met appointments from `isoDate` on that moved no stage, `except` one. */
function keptMeetings(db: Database, customerId: string, except: string, isoDate: string) {
  const rows = selectRows(
    db,
    `SELECT a.date, a.stage_after FROM appointments a
     WHERE a.customer_id = ? AND a.id <> ? AND a.status = 'MET' AND a.deleted_at IS NULL
       AND a.date >= ? AND NOT EXISTS (SELECT 1 FROM stage_transitions t
         WHERE t.appointment_id = a.id AND t.deleted_at IS NULL)
     ORDER BY a.date`,
    [customerId, except, isoDate],
  ) as [string, CustomerStage][];
  return rows.map(([date, stage]) => ({ date: fromIsoDate(date), stage }));
}

/**
 * The transition of the appointment withdrawn at the instant `at`, that of its deletion: one of its
 * own customer's, so restoring never moves another customer (DR6-71).
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
  updateCustomerRow(db, withdrawn.customerId, { stage: to });
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

function findCustomer(db: Database, id: string): CustomerRow | undefined {
  return db.orm.select().from(customers).where(eq(customers.id, id)).get();
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

function updateCustomerRow(db: Database, id: string, changes: Partial<CustomerRow>): void {
  db.orm
    .update(customers)
    .set({ updatedAt: db.now().toISOString(), ...changes })
    .where(eq(customers.id, id))
    .run();
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
