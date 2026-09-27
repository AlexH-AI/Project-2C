export { openDatabase } from './database';
export type { Database, OpenDatabaseOptions, Sources } from './database';
export { DB_ERROR_CODES, DbError } from './errors';
export type { DbErrorCode } from './errors';
export {
  createPerson,
  createTeam,
  getPerson,
  getTeam,
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
  restoreCustomer,
  softDeleteCustomer,
  updateCustomerProfile,
} from './customers';
export type { BirthDate, CustomerProfile, CustomerRecord, Gender, NewCustomer } from './customers';
export {
  getAppointment,
  listAppointments,
  recordMeetingOutcome,
  rescheduleAppointment,
  restoreAppointment,
  scheduleAppointment,
  softDeleteAppointment,
} from './appointments';
export type {
  AppointmentRecord,
  AppointmentTrigger,
  MeetingOutcome,
  NewAppointment,
} from './appointments';
export {
  getPolicy,
  issuePolicy,
  listPolicies,
  restorePolicy,
  softDeletePolicy,
  submitPolicy,
  updatePolicy,
} from './policies';
export type { NewPolicy, PolicyChanges } from './policies';
export {
  addKycNote,
  confirmKycFact,
  getKycProfile,
  listKycVersions,
  markKycConflict,
  markKycVersionMaterial,
  resolveKycConflict,
} from './kyc';
export type {
  KycChange,
  KycFactCommand,
  KycNoteRecord,
  KycProfileRecord,
  KycSource,
  KycVersionRecord,
} from './kyc';
export { loadMetricsData } from './metrics';
export { seedDemoData } from './seed';
export type { SeedOptions } from './seed';
export { APPOINTMENT_TRIGGERS, GENDERS, KYC_NOTE_SOURCES } from './schema';
