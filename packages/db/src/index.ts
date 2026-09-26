export { openDatabase } from './database';
export type { Database, OpenDatabaseOptions } from './database';
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
export { APPOINTMENT_TRIGGERS, GENDERS } from './schema';
