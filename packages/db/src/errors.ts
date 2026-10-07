/** Errors a command rejects with; the UI maps each code to an i18n message (spec §4). */
export const DB_ERROR_CODES = [
  'NAME_REQUIRED',
  /** Text with a NUL character, which the database would cut it at (DR-49). */
  'INVALID_TEXT',
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
  /**
   * A day after today for something that already happened: a customer's creation, a manual stage
   * change, a policy's submission or issue, a KYC note, fact or version, a birth date.
   */
  'DATE_IN_FUTURE',
  'INVALID_TIME',
  'INVALID_TRIGGER',
  'INVALID_AMOUNT',
  /** A fee (FYP, case size) over `MAX_FEE_VND`, 100 tỷ đồng (DR-23). */
  'AMOUNT_TOO_LARGE',
  'CUSTOMER_NOT_FOUND',
  'INVALID_TRANSITION',
  'TRANSITION_NOT_LATEST',
  /** A transition dated before the customer's latest; params `date` (that latest one's, as shown). */
  'TRANSITION_BEFORE_LATEST',
  'APPOINTMENT_NOT_FOUND',
  'APPOINTMENT_NOT_SCHEDULED',
  /** A reschedule to the same day and time as the old appointment (mockup 6e). */
  'RESCHEDULE_UNCHANGED',
  'INVALID_STATUS',
  'OUTCOME_REQUIRED',
  'OUTCOME_IN_FUTURE',
  'STAGE_AFTER_NOT_ALLOWED',
  'REVIEWER_NOT_ALLOWED',
  /** An outcome reviewer who is not an IS, TL, BDM or BD (D9). */
  'INVALID_REVIEWER',
  /** A reviewer of a live appointment made an RE (D9). */
  'REVIEWER_IN_USE',
  'NEXT_APPOINTMENT_PAST',
  /** A coordinator who is not an IS, TL, BDM or BD (ADR-0007). */
  'INVALID_COORDINATOR',
  /** A coordinator of a live appointment made an RE (ADR-0007). */
  'COORDINATOR_IN_USE',
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
  /** A customer's records numbered up to the last safe integer: no `seq` is left (DR-34). */
  'SEQ_LIMIT',
  /** An AI analysis whose fields do not fit together (spec Phase 5 §7.1); a bug of the caller. */
  'AI_ANALYSIS_INVALID',
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
