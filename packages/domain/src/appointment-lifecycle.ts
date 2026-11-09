/**
 * Appointment lifecycle (D2 of `docs/design/state-machines.md`, T-403): what can be done to an
 * appointment in each status. The db commands and the buttons and choices of the screens read this
 * one rule, as they read `assertValidTransition` for the customer's stage. The day rule (held or
 * missed only from its day on) and the D7 lock of a met appointment stay with them.
 */
import type { AppointmentStatus } from './model';

/**
 * Record its first outcome (mockup 6c), move it to a new day (6e), edit its outcome (6f), delete it
 * (6g).
 */
export const APPOINTMENT_ACTIONS = ['record', 'reschedule', 'edit', 'delete'] as const;
export type AppointmentAction = (typeof APPOINTMENT_ACTIONS)[number];

/** Held, cancelled, missed: the statuses an outcome sets, recorded (6c) or edited (6f). */
export const OUTCOME_STATUSES = ['MET', 'CANCELLED', 'NO_SHOW'] as const;
export type OutcomeStatus = (typeof OUTCOME_STATUSES)[number];

export const isOutcomeStatus = (status: string): status is OutcomeStatus =>
  (OUTCOME_STATUSES as readonly string[]).includes(status);

const outcome: readonly AppointmentAction[] = ['edit', 'delete'];

/** Every status has its row: a new one does not build until it says what it allows. */
const ACTIONS: { readonly [S in AppointmentStatus]: readonly AppointmentAction[] } = {
  SCHEDULED: ['record', 'reschedule', 'delete'],
  MET: outcome,
  // Closed: a new appointment took its place on the new day (D3); the app never deletes it (#171).
  RESCHEDULED: [],
  CANCELLED: outcome,
  NO_SHOW: outcome,
};

/** What the app offers on an appointment of this status, in the order of `APPOINTMENT_ACTIONS`. */
export function appointmentActions(status: AppointmentStatus): readonly AppointmentAction[] {
  return ACTIONS[status];
}

export function canAppointment(status: AppointmentStatus, action: AppointmentAction): boolean {
  return ACTIONS[status].includes(action);
}
