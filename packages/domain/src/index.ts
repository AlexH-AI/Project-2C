export { PIPELINE_STAGES, compareStages, isPipelineStage } from './pipeline-stage';
export type { PipelineStage } from './pipeline-stage';
export {
  PERIOD_KINDS,
  calendarDate,
  compareDates,
  customPeriod,
  formatDate,
  formatPeriodLabel,
  fromLocalDate,
  parseDate,
  periodOf,
  shift,
  switchKind,
} from './period';
export type { CalendarDate, Period, PeriodKind } from './period';
export {
  KYC_CATEGORIES,
  KYC_CATEGORY_SPECS,
  KYC_FIELDS,
  KYC_GATE_STATES,
  KYC_GATE_THRESHOLDS,
  KYC_INSUFFICIENT_MESSAGE,
} from './kyc-catalog';
export type { KycCategory, KycCategorySpec, KycField, KycGateState } from './kyc-catalog';
export { KYC_FACT_STATUSES } from './kyc-fact';
export {
  EMPTY_KYC_PROFILE,
  addNote,
  confirmFact,
  kycHash,
  markConflict,
  nextKycVersion,
  resolveConflict,
} from './kyc';
export type { KycFactInput, KycNote, KycProfile, KycVersion } from './kyc';
export type { KycFact, KycFactStatus, KycValue } from './kyc-fact';
export { APPOINTMENT_STATUSES, CLOSED_STAGES, PERSON_ROLES } from './model';
export type {
  Appointment,
  AppointmentStatus,
  ClosedStage,
  Customer,
  CustomerStage,
  Person,
  PersonRole,
  Policy,
  Scope,
  StageTransition,
  Team,
} from './model';
