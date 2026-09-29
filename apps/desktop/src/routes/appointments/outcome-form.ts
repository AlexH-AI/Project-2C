import type { AppointmentRecord, MeetingOutcome, NextAppointment } from '@p2c/db';
import {
  CLOSED_STAGES,
  PIPELINE_STAGES,
  parseVnd,
  type CalendarDate,
  type CustomerStage,
} from '@p2c/domain';
import { allowedStages } from '../customers/customers-view';
import { isPastOrToday, type parseTime, type ScheduleDate } from './appointment-form';

/** The statuses the outcome dialog offers (mockups 6c–6e, 6i), in their order. */
export const OUTCOME_CHOICES = ['MET', 'RESCHEDULED', 'CANCELLED', 'NO_SHOW'] as const;
export type OutcomeChoice = (typeof OUTCOME_CHOICES)[number];

/**
 * The statuses the appointment can take now: met and no-show only once its day has come (Owner
 * 29/09/2026), a new day only while it is scheduled (D3). Cancelling is always there.
 */
export function outcomeChoices(
  appointment: Pick<AppointmentRecord, 'status' | 'date'>,
  today: CalendarDate,
): { readonly value: OutcomeChoice; readonly disabled: boolean }[] {
  const arrived = isPastOrToday(appointment.date, today);
  return OUTCOME_CHOICES.map((value) => ({
    value,
    disabled:
      value === 'RESCHEDULED'
        ? appointment.status !== 'SCHEDULED'
        : value !== 'CANCELLED' && !arrived,
  }));
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
    const size = draft.caseSize.trim() === '' ? null : parseVnd(draft.caseSize);
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
