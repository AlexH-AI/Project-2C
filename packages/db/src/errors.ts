/** Errors a command rejects with; the UI maps each code to an i18n message (spec §4). */
export const DB_ERROR_CODES = [
  'NAME_REQUIRED',
  'TEAM_NOT_FOUND',
  'TEAM_NAME_TAKEN',
  'TEAM_HAS_MEMBERS',
  'TEAM_REQUIRED',
  'PERSON_NOT_FOUND',
] as const;

export type DbErrorCode = (typeof DB_ERROR_CODES)[number];

export class DbError extends Error {
  readonly code: DbErrorCode;

  constructor(code: DbErrorCode) {
    super(code);
    this.name = 'DbError';
    this.code = code;
  }
}
