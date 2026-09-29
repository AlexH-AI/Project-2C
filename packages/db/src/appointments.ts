/**
 * Appointments and meeting outcomes (spec §3.5–3.6, §4; D3, D6, D7, D9). A met appointment whose
 * stage after differs from the customer's stage moves the customer through a transition that points
 * back to it — the only transitions that can count as an RF (#44). That transition carries the
 * meeting day, so an outcome recorded or restored after a later stage change is refused (D10).
 * Once a later transition exists, only the status, the stage after and the day are locked (D7).
 * A meeting held or missed is dated today at the latest; only a cancellation may come ahead.
 */
import {
  compareDates,
  fromLocalDate,
  type Appointment,
  type CalendarDate,
  type CustomerStage,
  type Vnd,
} from '@p2c/domain';
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
  /** Who decided the stage after the meeting (D9); only on a met appointment. */
  readonly outcomeReviewerId: string | null;
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
  readonly outcomeReviewerId?: string | null;
}

/** The day and time of the appointment booked with an outcome (mockups 6c, 6i). */
export interface NextAppointment {
  readonly date: CalendarDate;
  readonly time?: string | null;
}

/** What the edit dialog changes besides the outcome (mockup 6f); omitted fields stay. */
export interface AppointmentDetails {
  readonly date?: CalendarDate;
  readonly time?: string | null;
  readonly triggerType?: AppointmentTrigger;
  readonly triggerNote?: string | null;
  readonly coordinatorIds?: readonly string[];
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
  const coordinators = coordinatorsByAppointment(db, customerId);
  return rows.map(({ a }) => toAppointment(db, a, coordinators.get(a.id) ?? []));
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
    const reviewerId = outcome.outcomeReviewerId ?? null;
    if (reviewerId !== null) {
      if (outcome.status !== 'MET') throw new DbError('REVIEWER_NOT_ALLOWED');
      requirePerson(db, reviewerId);
    }
    requireOutcomeDay(db, outcome.status, row.date);
    const size = outcome.expectedCaseSize ?? null;
    // Still met with the same stage after: the transition stays as it is, even once a later one
    // exists (D7). Otherwise only a met appointment can have moved the customer.
    const keepsStage =
      row.status === 'MET' && outcome.status === 'MET' && row.stageAfter === stageAfter;
    if (row.status === 'MET' && !keepsStage) withdrawAppointmentTransition(db, id);
    const updated: AppointmentRow = {
      ...row,
      ...updateAppointmentRow(db, id, {
        status: outcome.status,
        stageAfter,
        nextStep,
        expectedCaseSize: size === null ? null : requireAmount(size),
        note: outcome.note?.trim() ?? row.note,
        outcomeReviewerId: reviewerId,
      }),
    };
    if (!keepsStage) applyOutcome(db, updated);
    return toAppointment(db, updated);
  });
}

/**
 * Records the first outcome of a scheduled appointment and books the next one in one go (mockups
 * 6c, 6i): same customer, RE, coordinators and trigger, today or later, and not linked to this one.
 * Editing an outcome (6f) books nothing.
 */
export function recordOutcomeWithNext(
  db: Database,
  id: string,
  outcome: MeetingOutcome,
  next: NextAppointment,
): { readonly recorded: AppointmentRecord; readonly next: AppointmentRecord } {
  return db.transaction(() => {
    if (liveAppointment(db, id).status !== 'SCHEDULED') throw new DbError('INVALID_STATUS');
    if (compareDates(next.date, fromLocalDate(db.now())) < 0) {
      throw new DbError('NEXT_APPOINTMENT_PAST');
    }
    const recorded = recordMeetingOutcome(db, id, outcome);
    const booked = insertScheduled(db, { ...recorded, date: next.date, time: next.time }, null);
    return { recorded, next: booked };
  });
}

/**
 * Edits the day, time, trigger and coordinators of an appointment with an outcome (mockup 6f); a
 * scheduled one changes day by rescheduling (D3). A met appointment's transition moves to the new
 * day, so its day is locked like its outcome once a later transition exists (D7, D10).
 */
export function updateAppointmentDetails(
  db: Database,
  id: string,
  changes: AppointmentDetails,
): AppointmentRecord {
  return db.transaction(() => {
    const row = liveAppointment(db, id);
    if (!OUTCOME_STATUSES.includes(row.status)) throw new DbError('INVALID_STATUS');
    const date = changes.date === undefined ? row.date : toIsoDate(changes.date);
    if (changes.date !== undefined) requireOutcomeDay(db, row.status, date);
    const triggerType =
      changes.triggerType === undefined ? row.triggerType : requireTrigger(changes.triggerType);
    const moved = date !== row.date && withdrawAppointmentTransition(db, id);
    const updated: AppointmentRow = {
      ...row,
      ...updateAppointmentRow(db, id, {
        date,
        time: changes.time === undefined ? row.time : requireTime(changes.time),
        triggerType,
        triggerNote:
          changes.triggerNote === undefined ? row.triggerNote : optionalText(changes.triggerNote),
      }),
    };
    if (changes.coordinatorIds !== undefined) {
      const coordinatorIds = [...new Set(changes.coordinatorIds)];
      requirePeople(db, row.reId, coordinatorIds);
      db.orm
        .delete(appointmentCoordinators)
        .where(eq(appointmentCoordinators.appointmentId, id))
        .run();
      insertCoordinators(db, id, coordinatorIds);
    }
    // Only a withdrawn transition comes back, on the new day: a met appointment that moved no one
    // stays so, whatever the customer's stage is now.
    if (moved) applyOutcome(db, updated);
    return toAppointment(db, updated);
  });
}

/**
 * Saves the edit dialog (mockup 6f) in one go: the outcome and the details. The day moves first,
 * so that a new transition lands on the new day and not before a later one on the old day (D10).
 * Only a cancellation moved ahead of today starts with its outcome, so that no step holds a
 * meeting met or missed ahead of today.
 */
export function editMeetingOutcome(
  db: Database,
  id: string,
  outcome: MeetingOutcome,
  details: AppointmentDetails,
): AppointmentRecord {
  return db.transaction(() => {
    const status = liveAppointment(db, id).status;
    if (!OUTCOME_STATUSES.includes(status)) throw new DbError('INVALID_STATUS');
    const cancelledAhead =
      outcome.status === 'CANCELLED' &&
      details.date !== undefined &&
      compareDates(details.date, fromLocalDate(db.now())) > 0;
    if (cancelledAhead) {
      recordMeetingOutcome(db, id, outcome);
      return updateAppointmentDetails(db, id, details);
    }
    updateAppointmentDetails(db, id, details);
    return recordMeetingOutcome(db, id, outcome);
  });
}

/**
 * The old appointment becomes rescheduled, with the reason in its note (mockup 6e); a new one
 * takes its place on the new day (D3).
 */
export function rescheduleAppointment(
  db: Database,
  id: string,
  when: { readonly date: CalendarDate; readonly time?: string | null },
  note?: string,
): AppointmentRecord {
  return db.transaction(() => {
    const old = toAppointment(db, liveAppointment(db, id));
    if (old.status !== 'SCHEDULED') throw new DbError('APPOINTMENT_NOT_SCHEDULED');
    // A note already there stays, the reason goes under it.
    const reason = optionalText(note);
    updateAppointmentRow(db, id, {
      status: 'RESCHEDULED',
      note: [old.note, reason].filter(Boolean).join('\n'),
    });
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
    if (row.outcomeReviewerId !== null) requirePerson(db, row.outcomeReviewerId);
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
    triggerType: requireTrigger(input.triggerType),
    triggerNote: optionalText(input.triggerNote),
    stageAfter: null,
    nextStep: null,
    expectedCaseSize: null,
    note: '',
    rescheduledFromId,
    createdAt: at,
    updatedAt: at,
    deletedAt: null,
    outcomeReviewerId: null,
  };
  db.orm.insert(appointments).values(row).run();
  insertCoordinators(db, row.id, coordinatorIds);
  // Same order as `coordinatorsOf`: SQLite compares text byte by byte, as does the default sort.
  return toAppointment(db, row, coordinatorIds.sort());
}

function insertCoordinators(db: Database, appointmentId: string, ids: readonly string[]): void {
  for (const personId of ids) {
    db.orm.insert(appointmentCoordinators).values({ appointmentId, personId }).run();
  }
}

/** A live RE and live coordinators other than the RE — checked again on restore (spec §4). */
function requirePeople(db: Database, reId: string, coordinatorIds: readonly string[]): void {
  requireRe(db, reId);
  for (const personId of coordinatorIds) {
    if (personId === reId) throw new DbError('INVALID_COORDINATOR');
    requirePerson(db, personId);
  }
}

/** A live person of any role: a coordinator or the outcome reviewer (D9). */
function requirePerson(db: Database, personId: string): void {
  const person = db.orm
    .select({ id: people.id })
    .from(people)
    .where(and(eq(people.id, personId), isNull(people.deletedAt)))
    .get();
  if (!person) throw new DbError('PERSON_NOT_FOUND');
}

function requireTime(time: string | null): string | null {
  if (time !== null && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new DbError('INVALID_TIME');
  return time;
}

function requireTrigger(trigger: AppointmentTrigger): AppointmentTrigger {
  if (!(APPOINTMENT_TRIGGERS as readonly string[]).includes(trigger)) {
    throw new DbError('INVALID_TRIGGER');
  }
  return trigger;
}

/** A meeting is held or missed by today at the latest; a cancellation may come ahead of it. */
function requireOutcomeDay(db: Database, status: string, isoDate: string): void {
  const held = status === 'MET' || status === 'NO_SHOW';
  if (held && compareDates(fromIsoDate(isoDate), fromLocalDate(db.now())) > 0) {
    throw new DbError('OUTCOME_IN_FUTURE');
  }
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

/** `coordinatorsOf` for every appointment (of one customer when given), in a single query. */
function coordinatorsByAppointment(db: Database, customerId?: string): Map<string, string[]> {
  const rows = db.orm
    .select({
      appointmentId: appointmentCoordinators.appointmentId,
      personId: appointmentCoordinators.personId,
    })
    .from(appointmentCoordinators)
    .innerJoin(appointments, eq(appointments.id, appointmentCoordinators.appointmentId))
    .where(customerId === undefined ? undefined : eq(appointments.customerId, customerId))
    .orderBy(asc(appointmentCoordinators.personId))
    .all();
  const byAppointment = new Map<string, string[]>();
  for (const { appointmentId, personId } of rows) {
    const ids = byAppointment.get(appointmentId);
    if (ids) ids.push(personId);
    else byAppointment.set(appointmentId, [personId]);
  }
  return byAppointment;
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
    outcomeReviewerId: row.outcomeReviewerId,
  };
}
