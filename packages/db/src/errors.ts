/** Errors a command rejects with; the UI maps each code to an i18n message (spec §4). */
export const DB_ERROR_CODES = [
  'NAME_REQUIRED',
  /**
   * Text the database cannot store as it is: a NUL, which it would cut the text at (DR-49), or a
   * lone surrogate half, which it would store as U+FFFD (DR6-49).
   */
  'INVALID_TEXT',
  /** A gender or a role outside its list: a bug of the caller, the screens offer only the list. */
  'INVALID_CHOICE',
  /** Params `name` when the team is deleted (spec Phase 6 TR-1). */
  'TEAM_NOT_FOUND',
  /** Params `name`. */
  'TEAM_NAME_TAKEN',
  'TEAM_HAS_MEMBERS',
  'TEAM_REQUIRED',
  /** A team already has a live TL; params `name` (that TL's). */
  'TEAM_HAS_LEAD',
  /** An IS, BD or BDM given a team: only RE and TL belong to one. */
  'TEAM_NOT_ALLOWED',
  /**
   * Params when the person is deleted: `name`, and `as` — what the record needs them as: `re`,
   * `coordinator` or `reviewer` (spec Phase 6 TR-1).
   */
  'PERSON_NOT_FOUND',
  'PERSON_IN_USE',
  /** Params `name` and `role`, the role the person holds instead. */
  'RE_REQUIRED',
  'INVALID_DATE',
  /**
   * A day after today for something that already happened: a customer's creation, a manual stage
   * change, a policy's submission or issue, a KYC note, fact or version, a birth date. Params
   * `date` (as shown), and `field` for a policy's day: `submitted` or `issued`.
   */
  'DATE_IN_FUTURE',
  'INVALID_TIME',
  'INVALID_TRIGGER',
  'INVALID_AMOUNT',
  /** A fee (FYP, case size) over `MAX_FEE_VND`, 100 tỷ đồng (DR-23). */
  'AMOUNT_TOO_LARGE',
  /** Params `name` when the customer is deleted (spec Phase 6 TR-1). */
  'CUSTOMER_NOT_FOUND',
  /** Params `to`, and `from` unless the customer is being created. */
  'INVALID_TRANSITION',
  'TRANSITION_NOT_LATEST',
  /**
   * A transition dated before the customer's latest, or of its day yet before it in the order of
   * recording (spec Phase 6 E20, params `sameDay`: 1); params `date` (that latest one's, as shown).
   */
  'TRANSITION_BEFORE_LATEST',
  /**
   * A transition dated before a met appointment of the customer, which recorded the stage of its
   * own day (T-232); params `date` (the latest such meeting's, as shown).
   */
  'TRANSITION_BEFORE_MEETING',
  /**
   * The stage move of a meeting withdrawn while a later met appointment kept the stage it moved to
   * (D7, T-232); params `date` (that meeting's, as shown).
   */
  'STAGE_KEPT_BY_MEETING',
  /**
   * A met appointment that moved no stage restored once the customer's stage on its day changed
   * while it was deleted (T-232); params `date` (its day, as shown).
   */
  'STAGE_NOT_ON_DAY',
  'APPOINTMENT_NOT_FOUND',
  'APPOINTMENT_NOT_SCHEDULED',
  /** A reschedule to the same day and time as the old appointment (mockup 6e). */
  'RESCHEDULE_UNCHANGED',
  'INVALID_STATUS',
  'OUTCOME_REQUIRED',
  /** Params `date` (the meeting's, as shown). */
  'OUTCOME_IN_FUTURE',
  'STAGE_AFTER_NOT_ALLOWED',
  'REVIEWER_NOT_ALLOWED',
  /** An outcome reviewer who is not an IS, TL, BDM or BD (D9); params `name`, `role`. */
  'INVALID_REVIEWER',
  /** A reviewer of a live appointment made an RE (D9). */
  'REVIEWER_IN_USE',
  'NEXT_APPOINTMENT_PAST',
  /** A coordinator who is not an IS, TL, BDM or BD (ADR-0007); params `name`, `role`. */
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
  /**
   * A write refused by the app while it replaces all the data (Nạp lại / Nhập backup, spec Phase 6
   * S2-2); never thrown by a command here.
   */
  'DATA_REPLACING',
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
