/**
 * Appointments and meeting outcomes (spec §3.5–3.6, §4; D3, D6, D7). A met appointment whose stage
 * after differs from the customer's stage moves the customer through a transition that points back
 * to it — the only transitions that can count as an RF (#44).
 */
import type { Appointment, CalendarDate, CustomerStage, Vnd } from '@p2c/domain';
import { and, asc, eq, isNull } from 'drizzle-orm';
import {
  fromIsoDate,
  optionalText,
  requireAmount,
  requireRe,
  stampDeleted,
  toIsoDate,
} from './common';
import { appendTransition, liveCustomer, withdrawAppointmentTransition } from './customers';
import type { Database } from './database';
import { DbError } from './errors';
import { ulid } from './ids';
import {
  APPOINTMENT_TRIGGERS,
  appointmentCoordinators,
  appointments,
  customers,
  people,
} from './schema';

type AppointmentRow = typeof appointments.$inferSelect;

export type AppointmentTrigger = (typeof APPOINTMENT_TRIGGERS)[number];

export interface AppointmentRecord extends Appointment {
  /** `HH:MM`, or null when no time was set. */
  readonly time: string | null;
  readonly triggerType: AppointmentTrigger;
  readonly triggerNote: string | null;
  /** The appointment this one replaced (D3). */
  readonly rescheduledFromId: string | null;
}

export interface NewAppointment {
  readonly customerId: string;
  readonly reId: string;
  readonly date: CalendarDate;
  readonly time?: string | null;
  readonly triggerType: AppointmentTrigger;
  readonly triggerNote?: string | null;
  readonly coordinatorIds?: readonly string[];
}

export interface MeetingOutcome {
  readonly status: 'MET' | 'CANCELLED' | 'NO_SHOW';
  readonly stageAfter?: CustomerStage | null;
  readonly nextStep?: string | null;
  readonly expectedCaseSize?: Vnd | null;
  readonly note?: string;
}

const OUTCOME_STATUSES: readonly string[] = ['MET', 'CANCELLED', 'NO_SHOW'];

// ---- reads ----------------------------------------------------------------

/** Live appointments of live customers (of one customer when given), by date and time. */
export function listAppointments(db: Database, customerId?: string): AppointmentRecord[] {
  const rows = db.orm
    .select({ a: appointments })
    .from(appointments)
    .innerJoin(customers, eq(customers.id, appointments.customerId))
    .where(
      and(
        isNull(appointments.deletedAt),
        isNull(customers.deletedAt),
        customerId === undefined ? undefined : eq(appointments.customerId, customerId),
      ),
    )
    .orderBy(asc(appointments.date), asc(appointments.time), asc(appointments.id))
    .all();
  return rows.map(({ a }) => toAppointment(db, a));
}

export function getAppointment(db: Database, id: string): AppointmentRecord | undefined {
  const row = findAppointment(db, id);
  if (!row || row.deletedAt || !isCustomerLive(db, row.customerId)) return undefined;
  return toAppointment(db, row);
}

// ---- commands -------------------------------------------------------------

export function scheduleAppointment(db: Database, input: NewAppointment): AppointmentRecord {
  return db.transaction(() => insertScheduled(db, input, null));
}

export function recordMeetingOutcome(
  db: Database,
  id: string,
  outcome: MeetingOutcome,
): AppointmentRecord {
  return db.transaction(() => {
    const row = liveAppointment(db, id);
    if (!OUTCOME_STATUSES.includes(outcome.status) || row.status === 'RESCHEDULED') {
      throw new DbError('INVALID_STATUS');
    }
    const stageAfter = outcome.stageAfter ?? null;
    const nextStep = optionalText(outcome.nextStep);
    if (outcome.status === 'MET' && (stageAfter === null || nextStep === null)) {
      throw new DbError('OUTCOME_REQUIRED');
    }
    if (outcome.status !== 'MET' && stageAfter !== null) {
      throw new DbError('STAGE_AFTER_NOT_ALLOWED');
    }
    const size = outcome.expectedCaseSize ?? null;
    // Only a met appointment can have moved the customer.
    if (row.status === 'MET') withdrawAppointmentTransition(db, id);
    const updated: AppointmentRow = {
      ...row,
      ...updateAppointmentRow(db, id, {
        status: outcome.status,
        stageAfter,
        nextStep,
        expectedCaseSize: size === null ? null : requireAmount(size),
        note: outcome.note?.trim() ?? row.note,
      }),
    };
    applyOutcome(db, updated);
    return toAppointment(db, updated);
  });
}

/** The old appointment becomes rescheduled; a new one takes its place on the new day (D3). */
export function rescheduleAppointment(
  db: Database,
  id: string,
  when: { readonly date: CalendarDate; readonly time?: string | null },
): AppointmentRecord {
  return db.transaction(() => {
    const old = toAppointment(db, liveAppointment(db, id));
    if (old.status !== 'SCHEDULED') throw new DbError('APPOINTMENT_NOT_SCHEDULED');
    updateAppointmentRow(db, id, { status: 'RESCHEDULED' });
    return insertScheduled(db, { ...old, date: when.date, time: when.time ?? null }, id);
  });
}

/** A deleted appointment takes its transition with it, under the D7 rule. */
export function softDeleteAppointment(db: Database, id: string): void {
  db.transaction(() => {
    liveAppointment(db, id);
    withdrawAppointmentTransition(db, id);
    updateAppointmentRow(db, id, stampDeleted(db));
  });
}

/** Restoring a met appointment applies its stage after again. */
export function restoreAppointment(db: Database, id: string): void {
  db.transaction(() => {
    const row = findAppointment(db, id);
    if (!row) throw new DbError('APPOINTMENT_NOT_FOUND');
    if (!row.deletedAt) return;
    liveCustomer(db, row.customerId);
    // The people were free to leave while the appointment was deleted.
    requirePeople(db, row.reId, toAppointment(db, row).coordinatorIds);
    updateAppointmentRow(db, id, { deletedAt: null });
    applyOutcome(db, row);
  });
}

// ---- helpers --------------------------------------------------------------

function applyOutcome(db: Database, row: AppointmentRow): void {
  const current = liveCustomer(db, row.customerId).stage;
  if (row.status === 'MET' && row.stageAfter !== null && row.stageAfter !== current) {
    appendTransition(db, row.customerId, row.stageAfter, fromIsoDate(row.date), row.id);
  }
}

function insertScheduled(
  db: Database,
  input: NewAppointment,
  rescheduledFromId: string | null,
): AppointmentRecord {
  liveCustomer(db, input.customerId);
  const reId = input.reId;
  const coordinatorIds = [...new Set(input.coordinatorIds ?? [])];
  requirePeople(db, reId, coordinatorIds);
  const at = db.now().toISOString();
  const row: AppointmentRow = {
    id: ulid(db.now(), db.random),
    customerId: input.customerId,
    reId,
    date: toIsoDate(input.date),
    time: requireTime(input.time ?? null),
    status: 'SCHEDULED',
    triggerType: input.triggerType,
    triggerNote: optionalText(input.triggerNote),
    stageAfter: null,
    nextStep: null,
    expectedCaseSize: null,
    note: '',
    rescheduledFromId,
    createdAt: at,
    updatedAt: at,
    deletedAt: null,
  };
  db.orm.insert(appointments).values(row).run();
  for (const personId of coordinatorIds) {
    db.orm.insert(appointmentCoordinators).values({ appointmentId: row.id, personId }).run();
  }
  // Same order as `coordinatorsOf`: SQLite compares text byte by byte, as does the default sort.
  return toAppointment(db, row, coordinatorIds.sort());
}

/** A live RE and live coordinators other than the RE — checked again on restore (spec §4). */
function requirePeople(db: Database, reId: string, coordinatorIds: readonly string[]): void {
  requireRe(db, reId);
  for (const personId of coordinatorIds) {
    if (personId === reId) throw new DbError('INVALID_COORDINATOR');
    const person = db.orm
      .select({ id: people.id })
      .from(people)
      .where(and(eq(people.id, personId), isNull(people.deletedAt)))
      .get();
    if (!person) throw new DbError('PERSON_NOT_FOUND');
  }
}

function requireTime(time: string | null): string | null {
  if (time !== null && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new DbError('INVALID_TIME');
  return time;
}

function findAppointment(db: Database, id: string): AppointmentRow | undefined {
  return db.orm.select().from(appointments).where(eq(appointments.id, id)).get();
}

function isCustomerLive(db: Database, customerId: string): boolean {
  const row = db.orm
    .select({ id: customers.id })
    .from(customers)
    .where(and(eq(customers.id, customerId), isNull(customers.deletedAt)))
    .get();
  return row !== undefined;
}

function liveAppointment(db: Database, id: string): AppointmentRow {
  const row = findAppointment(db, id);
  if (!row || row.deletedAt) throw new DbError('APPOINTMENT_NOT_FOUND');
  liveCustomer(db, row.customerId);
  return row;
}

/** Writes the changes and returns them with the new `updatedAt`. */
function updateAppointmentRow(
  db: Database,
  id: string,
  changes: Partial<AppointmentRow>,
): Partial<AppointmentRow> {
  const stamped = { updatedAt: db.now().toISOString(), ...changes };
  db.orm.update(appointments).set(stamped).where(eq(appointments.id, id)).run();
  return stamped;
}

function coordinatorsOf(db: Database, appointmentId: string): string[] {
  return db.orm
    .select({ personId: appointmentCoordinators.personId })
    .from(appointmentCoordinators)
    .where(eq(appointmentCoordinators.appointmentId, appointmentId))
    .orderBy(asc(appointmentCoordinators.personId))
    .all()
    .map((c) => c.personId);
}

function toAppointment(
  db: Database,
  row: AppointmentRow,
  coordinatorIds: readonly string[] = coordinatorsOf(db, row.id),
): AppointmentRecord {
  return {
    id: row.id,
    customerId: row.customerId,
    reId: row.reId,
    coordinatorIds,
    date: fromIsoDate(row.date),
    time: row.time,
    status: row.status,
    triggerType: row.triggerType,
    triggerNote: row.triggerNote,
    stageAfter: row.stageAfter,
    expectedCaseSize: row.expectedCaseSize,
    nextStep: row.nextStep,
    note: row.note,
    rescheduledFromId: row.rescheduledFromId,
  };
}
