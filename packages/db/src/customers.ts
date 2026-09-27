/**
 * Customers and their stage transitions (spec §3.3–3.4, §4). `customers.stage` always equals the
 * `to` of the customer's latest live transition — "latest" by recording order (`seq`), never by date.
 * Birth date and gender are the source of the KYC birth year and gender (D2).
 */
import {
  assertValidTransition,
  fromLocalDate,
  type CalendarDate,
  type Customer,
  type CustomerStage,
  type StageTransition,
} from '@p2c/domain';
import { and, asc, desc, eq, isNull } from 'drizzle-orm';
import {
  fromIsoDate,
  liveCustomer,
  prepared,
  requireName,
  requireRe,
  rowInsert,
  stampDeleted,
  toIsoDate,
} from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { encodeBase32, ulid } from './ids';
import { recordProfileFacts } from './kyc';
import { customers, GENDERS, stageTransitions } from './schema';

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

export function listCustomers(db: Database): CustomerRecord[] {
  return db.orm
    .select()
    .from(customers)
    .where(isNull(customers.deletedAt))
    .orderBy(asc(customers.name))
    .all()
    .map(toCustomer);
}

export function getCustomer(db: Database, id: string): CustomerRecord | undefined {
  const row = findCustomer(db, id);
  return row && !row.deletedAt ? toCustomer(row) : undefined;
}

/** Live transitions of live customers (of one customer when given), in recording order. */
export function listStageTransitions(db: Database, customerId?: string): StageTransition[] {
  return db.orm
    .select({ t: stageTransitions })
    .from(stageTransitions)
    .innerJoin(customers, eq(customers.id, stageTransitions.customerId))
    .where(
      and(
        isNull(stageTransitions.deletedAt),
        isNull(customers.deletedAt),
        customerId === undefined ? undefined : eq(stageTransitions.customerId, customerId),
      ),
    )
    .orderBy(asc(stageTransitions.customerId), asc(stageTransitions.seq))
    .all()
    .map(({ t }) => toTransition(t));
}

// ---- commands -------------------------------------------------------------

export function createCustomer(db: Database, input: NewCustomer): CustomerRecord {
  return db.transaction(() => {
    const profile = validateProfile(db, input);
    const at = db.now().toISOString();
    const id = ulid(db.now(), db.random);
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
    recordProfileFacts(db, id, row, profile, fromLocalDate(db.now()));
    return toCustomer(liveCustomer(db, id));
  });
}

/** A manual change points to no appointment, so it never counts as an RF (#44). */
export function changeStageManually(
  db: Database,
  customerId: string,
  change: { readonly to: CustomerStage; readonly date: CalendarDate },
): StageTransition {
  return db.transaction(() => {
    liveCustomer(db, customerId);
    return appendTransition(db, customerId, change.to, change.date, null);
  });
}

export function softDeleteCustomer(db: Database, id: string): void {
  db.transaction(() => {
    liveCustomer(db, id);
    updateCustomerRow(db, id, stampDeleted(db));
  });
}

export function restoreCustomer(db: Database, id: string): void {
  db.transaction(() => {
    const row = findCustomer(db, id);
    if (!row) throw new DbError('CUSTOMER_NOT_FOUND');
    requireRe(db, row.reId);
    updateCustomerRow(db, id, { deletedAt: null });
  });
}

// ---- transitions, shared with the appointment commands --------------------

export { liveCustomer };

const insertTransition = rowInsert(stageTransitions);

/** Records `current stage → to` and moves the customer, in the caller's transaction. */
export function appendTransition(
  db: Database,
  customerId: string,
  to: CustomerStage,
  date: CalendarDate,
  appointmentId: string | null,
): StageTransition {
  const latest = latestTransition(db, customerId);
  const from = latest ? latest.toStage : null;
  try {
    assertValidTransition(from, to);
  } catch {
    throw new DbError('INVALID_TRANSITION');
  }
  const lastSeq = db.orm
    .select({ seq: stageTransitions.seq })
    .from(stageTransitions)
    .where(eq(stageTransitions.customerId, customerId))
    .orderBy(desc(stageTransitions.seq))
    .get();
  const row: TransitionRow = {
    id: ulid(db.now(), db.random),
    customerId,
    seq: (lastSeq?.seq ?? 0) + 1,
    fromStage: from,
    toStage: to,
    date: toIsoDate(date),
    appointmentId,
    createdAt: db.now().toISOString(),
    deletedAt: null,
  };
  prepared(db, insertTransition).run(row);
  updateCustomerRow(db, customerId, { stage: to });
  return toTransition(row);
}

/**
 * Withdraws the live transition caused by the appointment, if any (D7): allowed only while it is
 * the customer's latest, and the customer goes back to its `from` stage.
 */
export function withdrawAppointmentTransition(db: Database, appointmentId: string): void {
  const caused = db.orm
    .select()
    .from(stageTransitions)
    .where(
      and(eq(stageTransitions.appointmentId, appointmentId), isNull(stageTransitions.deletedAt)),
    )
    .get();
  if (!caused) return;
  if (latestTransition(db, caused.customerId)?.id !== caused.id) {
    throw new DbError('TRANSITION_NOT_LATEST');
  }
  db.orm
    .update(stageTransitions)
    .set({ deletedAt: db.now().toISOString() })
    .where(eq(stageTransitions.id, caused.id))
    .run();
  // An appointment's transition is never a customer's first, so `from` is set.
  updateCustomerRow(db, caused.customerId, { stage: caused.fromStage! });
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

function findCustomer(db: Database, id: string): CustomerRow | undefined {
  return db.orm.select().from(customers).where(eq(customers.id, id)).get();
}

function validateProfile(db: Database, input: CustomerProfile) {
  return {
    name: requireName(input.name),
    reId: requireRe(db, input.reId),
    birthDate: input.birthDate ? birthDateText(input.birthDate) : null,
    gender: input.gender ?? null,
  };
}

function birthDateText(birthDate: BirthDate): string {
  if ('month' in birthDate) return toIsoDate(birthDate);
  // A year alone is checked as 1 January of that year.
  return toIsoDate({ year: birthDate.year, month: 1, day: 1 }).slice(0, 4);
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
