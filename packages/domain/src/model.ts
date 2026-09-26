/**
 * Entities the metrics are computed from (ADR-0007, approved at G2). Only the fields the stats
 * engine and the customer lifecycle need; KYC entities live elsewhere (ADR-0008).
 * FYP amounts are integer đồng until the shared money type lands (T-026).
 */
import type { CalendarDate } from './period';
import type { PipelineStage } from './pipeline-stage';

export interface Team {
  readonly id: string;
  readonly name: string;
}

/** Only RE have metrics; the other roles take part in appointments as coordinators (G2 G). */
export const PERSON_ROLES = ['RE', 'TL', 'IS', 'BD', 'BDM'] as const;

export type PersonRole = (typeof PERSON_ROLES)[number];

export interface Person {
  readonly id: string;
  readonly name: string;
  readonly role: PersonRole;
  /** The person's current team; v1 keeps no history of team moves (G2 E). */
  readonly teamId: string | null;
}

/** Closed stages a customer can be reopened from, always back to N3 (T-027). */
export const CLOSED_STAGES = ['ON_HOLD', 'LOST'] as const;

export type ClosedStage = (typeof CLOSED_STAGES)[number];

export type CustomerStage = PipelineStage | ClosedStage;

export interface Customer {
  readonly id: string;
  readonly name: string;
  /** The RE in charge; the customer's metrics count for this RE and their team (G2 E). */
  readonly reId: string;
  /** Always equal to the `to` of the customer's latest stage transition. */
  readonly stage: CustomerStage;
}

/**
 * One change of a customer's stage. `from` is null for the stage the customer was created in.
 * Transitions recorded on the same day are ordered as they were recorded.
 */
export interface StageTransition {
  readonly id: string;
  readonly customerId: string;
  readonly from: CustomerStage | null;
  readonly to: CustomerStage;
  readonly date: CalendarDate;
  /** Set when the change was recorded as the "stage after" of an appointment; null for manual edits. */
  readonly appointmentId: string | null;
}

/** Đã lên lịch / Đã gặp / Dời lịch / KH hủy / Không gặp được (G2 B). */
export const APPOINTMENT_STATUSES = [
  'SCHEDULED',
  'MET',
  'RESCHEDULED',
  'CANCELLED',
  'NO_SHOW',
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export interface Appointment {
  readonly id: string;
  readonly customerId: string;
  /** The RE in charge of the appointment. */
  readonly reId: string;
  /** TL/IS/BD/BDM (or other RE) joining the meeting; they get no metrics from it. */
  readonly coordinatorIds: readonly string[];
  /** The meeting day; an RF counts on this day (G2 C). */
  readonly date: CalendarDate;
  readonly status: AppointmentStatus;
  /**
   * Structured outcome (W3): the customer's stage after the meeting. When it differs from the
   * stage before, the change is recorded as a transition pointing back to this appointment.
   */
  readonly stageAfter: CustomerStage | null;
  readonly expectedCaseSize: number | null;
  readonly nextStep: string | null;
  readonly note: string;
}

export interface Policy {
  readonly id: string;
  readonly customerId: string;
  /** The RE in charge written on the policy; the policy counts for this RE and their team (G2 E). */
  readonly reId: string;
  /** Day the customer paid and the policy was submitted. */
  readonly submittedDate: CalendarDate;
  readonly submittedFyp: number;
  /** Null until the policy is issued. */
  readonly issuedDate: CalendarDate | null;
  /** Defaults to `submittedFyp` when issued; the Owner may overwrite it by hand (G2 D). */
  readonly issuedFyp: number | null;
}

/** Góc nhìn: everyone, one team, or one RE. */
export type Scope =
  | { readonly kind: 'all' }
  | { readonly kind: 'team'; readonly teamId: string }
  | { readonly kind: 're'; readonly reId: string };
