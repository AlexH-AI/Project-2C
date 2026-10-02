/** Errors a command rejects with; the UI maps each code to an i18n message (spec §4). */
export const DB_ERROR_CODES = [
  'NAME_REQUIRED',
  'TEAM_NOT_FOUND',
  'TEAM_NAME_TAKEN',
  'TEAM_HAS_MEMBERS',
  'TEAM_REQUIRED',
  /** A team already has a live TL; params `name` (that TL's). */
  'TEAM_HAS_LEAD',
  /** An IS, BD or BDM given a team: only RE and TL belong to one. */
  'TEAM_NOT_ALLOWED',
  'PERSON_NOT_FOUND',
  'PERSON_IN_USE',
  'RE_REQUIRED',
  'INVALID_DATE',
  'INVALID_TIME',
  'INVALID_TRIGGER',
  'INVALID_AMOUNT',
  'CUSTOMER_NOT_FOUND',
  'INVALID_TRANSITION',
  'TRANSITION_NOT_LATEST',
  'TRANSITION_BEFORE_LATEST',
  'APPOINTMENT_NOT_FOUND',
  'APPOINTMENT_NOT_SCHEDULED',
  'INVALID_STATUS',
  'OUTCOME_REQUIRED',
  'OUTCOME_IN_FUTURE',
  'STAGE_AFTER_NOT_ALLOWED',
  'REVIEWER_NOT_ALLOWED',
  'NEXT_APPOINTMENT_PAST',
  'INVALID_COORDINATOR',
  'POLICY_NOT_FOUND',
  'ISSUED_BEFORE_SUBMITTED',
  'ISSUE_INCOMPLETE',
  'KYC_NOTE_EMPTY',
  'KYC_NOTE_NOT_FOUND',
  /** A fact given a `SYSTEM` note: only the customer profile writes there (D2). */
  'KYC_NOTE_FROM_PROFILE',
  'KYC_FACT_NOT_FOUND',
  'KYC_VERSION_NOT_FOUND',
  'INVALID_KYC_FIELD',
  'INVALID_KYC_VALUE',
  'KYC_FIELD_FROM_PROFILE',
  'KYC_PROFILE_FIELD_REQUIRED',
  'KYC_NO_CONFLICT',
  'KYC_NOT_IN_CONFLICT',
  'SEED_DATABASE_NOT_EMPTY',
  /** The file was written by a newer app; params `version` (the file's), `supported` (the app's). */
  'SCHEMA_TOO_NEW',
  /** A backup file that is damaged or not a Project-2C backup. */
  'BACKUP_INVALID',
  /** A backup file over `MAX_BACKUP_BYTES`; params `limitMb`. */
  'BACKUP_TOO_LARGE',
] as const;

export type DbErrorCode = (typeof DB_ERROR_CODES)[number];

export class DbError extends Error {
  readonly code: DbErrorCode;
  /** Values for the slots of the error's message, when it has any. */
  readonly params?: Readonly<Record<string, string | number>>;

  constructor(code: DbErrorCode, params?: Readonly<Record<string, string | number>>) {
    super(code);
    this.name = 'DbError';
    this.code = code;
    if (params) this.params = params;
  }
}
