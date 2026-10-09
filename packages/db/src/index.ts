export { openDatabase } from './database';
export type { Database, OpenDatabaseOptions, Sources } from './database';
export { LATEST_SCHEMA_VERSION } from './migrations';
export type { Migration } from './migrations';
export { exportBackup, importBackup, MAX_BACKUP_BYTES } from './backup';
export type { ImportedBackup } from './backup';
export { countRecords } from './counts';
export type { RecordCounts } from './counts';
export { DB_ERROR_CODES, DbError } from './errors';
export type { DbErrorCode } from './errors';
export {
  createPerson,
  createTeam,
  listPeople,
  listTeams,
  renameTeam,
  restorePerson,
  restoreTeam,
  softDeletePerson,
  softDeleteTeam,
  updatePerson,
} from './team';
export type { PersonInput } from './team';
export {
  changeStageManually,
  createCustomer,
  getCustomer,
  listCustomers,
  listStageTransitions,
  previewCustomerProfile,
  restoreCustomer,
  softDeleteCustomer,
  updateCustomerProfile,
} from './customers';
export type { BirthDate, CustomerProfile, CustomerRecord, Gender, NewCustomer } from './customers';
export {
  editMeetingOutcome,
  listAppointments,
  recordMeetingOutcome,
  recordOutcomeWithNext,
  rescheduleAppointment,
  restoreAppointment,
  scheduleAppointment,
  softDeleteAppointment,
} from './appointments';
export type {
  AppointmentDetails,
  AppointmentRecord,
  AppointmentTrigger,
  MeetingOutcome,
  NewAppointment,
  NextAppointment,
} from './appointments';
export {
  issuePolicy,
  listPolicies,
  restorePolicy,
  softDeletePolicy,
  submitPolicy,
  updatePolicy,
} from './policies';
export type { NewPolicy, PolicyChanges } from './policies';
export {
  confirmKycFact,
  getKycProfile,
  listKycVersions,
  markKycConflict,
  normalizeKycValue,
  recordKycNote,
  resolveKycConflict,
} from './kyc';
export type {
  KycChange,
  KycFactCommand,
  KycFactRecord,
  KycNoteFact,
  KycNoteRecord,
  KycProfileRecord,
  KycSource,
  KycVersionRecord,
  ProfileKycPreview,
} from './kyc';
export { seedDemoData } from './seed';
export type { SeedOptions } from './seed';
export { APPOINTMENT_TRIGGERS } from './schema';
export { listAiAnalyses, recordAiAnalysis } from './ai-analyses';
export type {
  AiAnalysisMode,
  AiAnalysisProvider,
  AiAnalysisReasoning,
  AiAnalysisRecord,
  AiAnalysisReminder,
  AiAnalysisState,
  AiAnalysisStatus,
  AiAnalysisView,
  NewAiAnalysis,
} from './ai-analyses';
export * from './settings';
