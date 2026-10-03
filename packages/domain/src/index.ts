export { PIPELINE_STAGES, compareStages, isPipelineStage } from './pipeline-stage';
export type { PipelineStage } from './pipeline-stage';
export {
  MAX_YEAR,
  MIN_YEAR,
  NEXT_YEAR_SUGGESTION_DAYS,
  PERIOD_KINDS,
  addDays,
  calendarDate,
  canShift,
  compareDates,
  customPeriod,
  daysBetween,
  formatDate,
  formatDayMonth,
  formatDayOfMonth,
  formatLocalDateTime,
  formatPeriodValue,
  fromLocalDate,
  localFileStamp,
  isInPeriod,
  monthToDate,
  parseDate,
  parseQuickDate,
  periodOf,
  shift,
  switchKind,
  weekdayOf,
} from './period';
export type {
  CalendarDate,
  Period,
  PeriodKind,
  QuickDateError,
  QuickDateResult,
  Weekday,
} from './period';
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
  currentFacts,
  isMaterialChange,
  kycHash,
  markConflict,
  nextKycVersion,
  resolveConflict,
} from './kyc';
export type { KycFactInput, KycNote, KycProfile, KycVersion } from './kyc';
export type { KycFact, KycFactStatus, KycValue } from './kyc-fact';
export { evaluateKycGate } from './kyc-gate';
export type { KycGateResult, KycSuggestedQuestions } from './kyc-gate';
export { assertValidTransition, isRfTransition, policyBadge, stageOn } from './customer-lifecycle';
export {
  closeRate,
  inScope,
  isRfAppointment,
  periodMetrics,
  policyMetrics,
  rfCount,
} from './stats';
export type { CloseRate, MetricsData, PeriodMetrics, PolicyMetrics } from './stats';
export { appointmentCounts, appointmentGroup } from './appointment-counts';
export type { AppointmentCounts, AppointmentGroup } from './appointment-counts';
export { formatVnd, formatVndCompact, formatVndDelta, parseVnd } from './money';
export { formatCount, formatFileSize } from './number';
export type { Vnd, VndParseError, VndParseResult } from './money';
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
