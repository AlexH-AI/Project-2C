import {
  meetingKeepingMove,
  type AppointmentRecord,
  type MeetingOutcome,
  type NextAppointment,
} from '@p2c/db';
import {
  CLOSED_STAGES,
  compareDates,
  PIPELINE_STAGES,
  parseVnd,
  stageOn,
  type CalendarDate,
  type CustomerStage,
  type StageTransition,
  type VndParseError,
} from '@p2c/domain';
import { allowedStages } from '../customers/customers-view';
import { isPastOrToday, type parseTime, type ScheduleDate } from './appointment-form';

/** The statuses the outcome dialog offers (mockups 6c–6e, 6i), in their order. */
export const OUTCOME_CHOICES = ['MET', 'RESCHEDULED', 'CANCELLED', 'NO_SHOW'] as const;
export type OutcomeChoice = (typeof OUTCOME_CHOICES)[number];

/** The case size typed: none when empty; the db only stores a positive one (requireAmount). */
export type CaseSizeRead =
  | null
  | { readonly ok: true; readonly amount: number }
  | { readonly ok: false; readonly error: VndParseError | 'notPositive' };

export function readCaseSize(text: string): CaseSizeRead {
  if (text.trim() === '') return null;
  const size = parseVnd(text);
  if (!size.ok) return size;
  return size.amount > 0 ? size : { ok: false, error: 'notPositive' };
}

/**
 * The statuses the appointment can take now: met and no-show only once its day has come (Owner
 * 29/09/2026), a new day only while it is scheduled (D3). Cancelling is always there.
 */
export function outcomeChoices(
  appointment: Pick<AppointmentRecord, 'status' | 'date'>,
  today: CalendarDate,
): { readonly value: OutcomeChoice; readonly disabled: boolean }[] {
  const arrived = isPastOrToday(appointment.date, today);
  // A moved appointment is closed: the db refuses any new status for it (INVALID_STATUS).
  const moved = appointment.status === 'RESCHEDULED';
  return OUTCOME_CHOICES.map((value) => ({
    value,
    disabled:
      moved ||
      (value === 'RESCHEDULED'
        ? appointment.status !== 'SCHEDULED'
        : value !== 'CANCELLED' && !arrived),
  }));
}

type MetRecord = Pick<AppointmentRecord, 'id' | 'customerId' | 'date' | 'status' | 'stageAfter'>;

/**
 * D7: the stage move the appointment made, and what now locks its status, day and stage after (and
 * its deletion): the customer's later move, or a later meeting that kept the stage it moved to
 * (T-232), by the very rule the db refuses them with. `transitions` come in the order they were
 * made; `appointments` by day.
 */
export function outcomeLock(
  transitions: readonly StageTransition[],
  appointments: readonly MetRecord[],
  appointment: Pick<AppointmentRecord, 'id' | 'customerId'>,
): {
  readonly caused?: StageTransition;
  readonly later?: StageTransition;
  readonly keptBy?: MetRecord;
} {
  const caused = transitions.find((tr) => tr.appointmentId === appointment.id);
  if (!caused) return {};
  const own = transitions.filter((tr) => tr.customerId === appointment.customerId);
  if (own.at(-1) !== caused) return { caused, later: own.at(-1) };
  const keptBy = meetingKeepingMove(transitions, appointments, caused);
  return keptBy ? { caused, keptBy } : { caused };
}

/**
 * "Nhóm sau cuộc gặp" of a meeting on `day` (T-232): the stage it starts `from`, that of the
 * customer at the end of the day (before the creation, the stage it was created in, as the db reads
 * it: DR-43), and what holds its stage after there, since no stage change may go before them (D10):
 * the latest `change` after the day — the creation itself before it —, or else the latest met
 * `meeting` after it, which recorded the stage of its own day. A meeting met on that day keeping the
 * stage `kept` starts from it, and is held by a change later that day too (E19). The appointment
 * and its own move do not count.
 */
export function meetingDay(
  transitions: readonly StageTransition[],
  appointments: readonly MetRecord[],
  appointment: Pick<AppointmentRecord, 'id' | 'customerId'>,
  day: CalendarDate,
  kept?: CustomerStage | null,
): {
  readonly from: CustomerStage | null;
  readonly change?: StageTransition;
  readonly meeting?: MetRecord;
} {
  const { id, customerId } = appointment;
  const own = transitions.filter((tr) => tr.customerId === customerId && tr.appointmentId !== id);
  const ended = stageOn(own, customerId, day) ?? own[0]?.to ?? null;
  const change = own.findLast((tr) => {
    const order = compareDates(tr.date, day);
    return order > 0 || (order === 0 && kept != null && kept !== ended);
  });
  const from = kept ?? ended;
  if (change) return { from, change };
  const meeting = appointments.findLast(
    (m) =>
      m.customerId === customerId &&
      m.id !== id &&
      m.status === 'MET' &&
      compareDates(m.date, day) > 0,
  );
  return meeting ? { from, meeting } : { from };
}

/** The stage `meetingDay` holds the stage after at, when something holds it. */
export function heldStage(day: ReturnType<typeof meetingDay>): CustomerStage | undefined {
  return day.change || day.meeting ? (day.from ?? undefined) : undefined;
}

/**
 * `meetingDay` of the edit dialog (6f) on `day`: a meeting that kept its stage, edited on its own
 * day, starts from the stage it kept (E19) rather than the stage a change later that day ended in;
 * one that moved the stage, or moved to another day, starts from the stage of that day.
 */
export function editedDay(
  transitions: readonly StageTransition[],
  appointments: readonly MetRecord[],
  appointment: MetRecord,
  day: CalendarDate,
): ReturnType<typeof meetingDay> {
  const moved = transitions.some((tr) => tr.appointmentId === appointment.id);
  const kept =
    !moved && appointment.status === 'MET' && compareDates(day, appointment.date) === 0
      ? appointment.stageAfter
      : null;
  return meetingDay(transitions, appointments, appointment, day, kept);
}

/**
 * The stage move of the meeting that saving 6f withdraws with nothing in its place, for the dialog to
 * say so first as 6g does (DR6-70): the outcome no longer moves the customer — another status, or a
 * stage after that is the stage its day starts `from`, picked or held there by a new day. A locked
 * move stays (D7).
 */
export function undoneMove(
  lock: ReturnType<typeof outcomeLock>,
  status: OutcomeDraft['status'],
  stageAfter: CustomerStage | null,
  from: CustomerStage,
): StageTransition | undefined {
  const { caused, later, keptBy } = lock;
  if (!caused || later || keptBy) return undefined;
  return status !== 'MET' || stageAfter === from ? caused : undefined;
}

/** "Nhóm sau cuộc gặp": the current stage (kept) and the ones a transition reaches (ADR-0007). */
export function stageAfterChoices(current: CustomerStage) {
  const reachable = allowedStages(current);
  return [...PIPELINE_STAGES, ...CLOSED_STAGES].map((stage) => ({
    stage,
    current: stage === current,
    allowed: stage === current || reachable.includes(stage),
  }));
}

/** What the dialog holds for an outcome other than a new day. */
export interface OutcomeDraft {
  readonly status: MeetingOutcome['status'];
  readonly stageAfter: CustomerStage | null;
  /** Empty when no one reviewed it. */
  readonly reviewerId: string;
  readonly nextStep: string;
  readonly caseSize: string;
  readonly note: string;
  /** "Hẹn lần tiếp theo" when ticked, read from today on. */
  readonly next: {
    readonly date: ScheduleDate;
    readonly time: ReturnType<typeof parseTime>;
  } | null;
}

export type OutcomeError = 'stageAfter' | 'nextStep' | 'caseSize' | 'nextDate' | 'nextTime';

/** The errors left once the field the user just changed is no longer in error. */
export const withoutError = (errors: readonly OutcomeError[], field: string) =>
  errors.filter((error) => error !== field);

export type OutcomeRead =
  | { readonly ok: true; readonly outcome: MeetingOutcome; readonly next: NextAppointment | null }
  | { readonly ok: false; readonly errors: readonly OutcomeError[] };

/**
 * The outcome to record, or what is missing (D6): met needs a stage after and a next step; the case
 * size and reviewer may stay empty. Any other status keeps only its note (mockup 6i).
 */
export function readOutcome(draft: OutcomeDraft): OutcomeRead {
  const errors: OutcomeError[] = [];
  let outcome: MeetingOutcome = { status: draft.status, note: draft.note };
  if (draft.status === 'MET') {
    const nextStep = draft.nextStep.trim();
    const size = readCaseSize(draft.caseSize);
    if (draft.stageAfter === null) errors.push('stageAfter');
    if (nextStep === '') errors.push('nextStep');
    if (size && !size.ok) errors.push('caseSize');
    outcome = {
      ...outcome,
      stageAfter: draft.stageAfter,
      nextStep,
      expectedCaseSize: size?.ok ? size.amount : null,
      outcomeReviewerId: draft.reviewerId || null,
    };
  }
  const next = draft.next;
  if (next && !next.date.ok) errors.push('nextDate');
  if (next && !next.time.ok) errors.push('nextTime');
  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    outcome,
    next: next?.date.ok && next.time.ok ? { date: next.date.date, time: next.time.time } : null,
  };
}
