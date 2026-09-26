/**
 * Drizzle schema (spec `docs/design/phase-3-du-lieu.md` §2–3). Migrations are generated from this
 * file with `pnpm db:generate`; never edit a generated migration by hand.
 */
import {
  APPOINTMENT_STATUSES,
  CLOSED_STAGES,
  KYC_FACT_STATUSES,
  KYC_FIELDS,
  PERSON_ROLES,
  PIPELINE_STAGES,
  type KycField,
} from '@p2c/domain';
import { sql } from 'drizzle-orm';
import {
  check,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
  type AnySQLiteColumn,
} from 'drizzle-orm/sqlite-core';

const list = (values: readonly string[]) => sql.raw(values.map((v) => `'${v}'`).join(', '));

const timestamps = {
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
};

export const teams = sqliteTable(
  'teams',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('teams_active_name')
      .on(t.name)
      .where(sql`${t.deletedAt} IS NULL`),
  ],
);

export const people = sqliteTable(
  'people',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    role: text('role', { enum: PERSON_ROLES }).notNull(),
    teamId: text('team_id').references(() => teams.id),
    ...timestamps,
  },
  (t) => [
    check('people_role', sql`${t.role} IN (${list(PERSON_ROLES)})`),
    check('people_team_required', sql`${t.role} NOT IN ('RE', 'TL') OR ${t.teamId} IS NOT NULL`),
  ],
);

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  valueJson: text('value_json').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const schemaMigrations = sqliteTable('schema_migrations', {
  id: integer('id').primaryKey(),
  appliedAt: text('applied_at').notNull(),
});

// ---- customers, stage transitions, appointments, policies (spec §3.3–3.7) ----

export const CUSTOMER_STAGES = [...PIPELINE_STAGES, ...CLOSED_STAGES] as const;
export const GENDERS = ['MALE', 'FEMALE'] as const;
/** Appointment triggers from the G3 mockup (spec §3.5). */
export const APPOINTMENT_TRIGGERS = [
  'REFERRAL',
  'ASSET_MATURITY',
  'EVENT',
  'OCCASION',
  'OTHER',
] as const;

export const customers = sqliteTable(
  'customers',
  {
    id: text('id').primaryKey(),
    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    reId: text('re_id')
      .notNull()
      .references(() => people.id),
    /** `YYYY` or `YYYY-MM-DD`. */
    birthDate: text('birth_date'),
    gender: text('gender', { enum: GENDERS }),
    stage: text('stage', { enum: CUSTOMER_STAGES }).notNull(),
    ...timestamps,
  },
  (t) => [
    check('customers_gender', sql`${t.gender} IN (${list(GENDERS)})`),
    check('customers_stage', sql`${t.stage} IN (${list(CUSTOMER_STAGES)})`),
  ],
);

export const appointments = sqliteTable(
  'appointments',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id),
    reId: text('re_id')
      .notNull()
      .references(() => people.id),
    date: text('date').notNull(),
    time: text('time'),
    status: text('status', { enum: APPOINTMENT_STATUSES }).notNull(),
    triggerType: text('trigger_type', { enum: APPOINTMENT_TRIGGERS }).notNull(),
    triggerNote: text('trigger_note'),
    stageAfter: text('stage_after', { enum: CUSTOMER_STAGES }),
    nextStep: text('next_step'),
    expectedCaseSize: integer('expected_case_size'),
    note: text('note').notNull(),
    rescheduledFromId: text('rescheduled_from_id').references(
      (): AnySQLiteColumn => appointments.id,
    ),
    ...timestamps,
  },
  (t) => [
    check('appointments_status', sql`${t.status} IN (${list(APPOINTMENT_STATUSES)})`),
    check('appointments_trigger', sql`${t.triggerType} IN (${list(APPOINTMENT_TRIGGERS)})`),
    check(
      'appointments_stage_after',
      sql`${t.stageAfter} IS NULL OR (${t.status} = 'MET' AND ${t.stageAfter} IN (${list(CUSTOMER_STAGES)}))`,
    ),
    check(
      'appointments_met_outcome',
      sql`${t.status} <> 'MET' OR (${t.stageAfter} IS NOT NULL AND ${t.nextStep} IS NOT NULL)`,
    ),
  ],
);

export const appointmentCoordinators = sqliteTable(
  'appointment_coordinators',
  {
    appointmentId: text('appointment_id')
      .notNull()
      .references(() => appointments.id),
    personId: text('person_id')
      .notNull()
      .references(() => people.id),
  },
  (t) => [primaryKey({ columns: [t.appointmentId, t.personId] })],
);

export const stageTransitions = sqliteTable(
  'stage_transitions',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id),
    /** Order of recording per customer; "latest" is the highest live `seq`, never the date. */
    seq: integer('seq').notNull(),
    fromStage: text('from_stage', { enum: CUSTOMER_STAGES }),
    toStage: text('to_stage', { enum: CUSTOMER_STAGES }).notNull(),
    date: text('date').notNull(),
    appointmentId: text('appointment_id').references(() => appointments.id),
    createdAt: text('created_at').notNull(),
    /** Set only when an appointment's outcome is withdrawn (D7); transitions are never edited. */
    deletedAt: text('deleted_at'),
  },
  (t) => [
    uniqueIndex('stage_transitions_customer_seq').on(t.customerId, t.seq),
    check('stage_transitions_from', sql`${t.fromStage} IN (${list(CUSTOMER_STAGES)})`),
    check('stage_transitions_to', sql`${t.toStage} IN (${list(CUSTOMER_STAGES)})`),
  ],
);

export const policies = sqliteTable(
  'policies',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id),
    reId: text('re_id')
      .notNull()
      .references(() => people.id),
    submittedDate: text('submitted_date').notNull(),
    submittedFyp: integer('submitted_fyp').notNull(),
    issuedDate: text('issued_date'),
    issuedFyp: integer('issued_fyp'),
    ...timestamps,
  },
  (t) => [
    check('policies_submitted_fyp', sql`${t.submittedFyp} > 0`),
    check('policies_issued_pair', sql`(${t.issuedDate} IS NULL) = (${t.issuedFyp} IS NULL)`),
    check(
      'policies_issued',
      sql`${t.issuedDate} IS NULL OR (${t.issuedFyp} > 0 AND ${t.issuedDate} >= ${t.submittedDate})`,
    ),
  ],
);

// ---- KYC notes, facts and versions (spec §3.8–3.10, ADR-0008) ----

/** `SYSTEM` notes carry the birth year and gender written from the customer profile (D2). */
export const KYC_NOTE_SOURCES = ['RE', 'SYSTEM'] as const;
const KYC_FIELD_KEYS = Object.keys(KYC_FIELDS) as [KycField, ...KycField[]];

/** Append-only: no `updated_at` / `deleted_at`, and a trigger refuses any update or delete. */
export const kycNotes = sqliteTable(
  'kyc_notes',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id),
    seq: integer('seq').notNull(),
    text: text('text').notNull(),
    createdDate: text('created_date').notNull(),
    source: text('source', { enum: KYC_NOTE_SOURCES }).notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [
    uniqueIndex('kyc_notes_customer_seq').on(t.customerId, t.seq),
    check('kyc_notes_source', sql`${t.source} IN (${list(KYC_NOTE_SOURCES)})`),
  ],
);

/** Never deleted; `status` (and `updated_at`) is the only column that changes. */
export const kycFacts = sqliteTable(
  'kyc_facts',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id),
    seq: integer('seq').notNull(),
    field: text('field', { enum: KYC_FIELD_KEYS }).notNull(),
    /** JSON of the `KycValue`, already normalised to the type of its trường. */
    valueJson: text('value_json').notNull(),
    noteId: text('note_id')
      .notNull()
      .references(() => kycNotes.id),
    confirmedDate: text('confirmed_date').notNull(),
    status: text('status', { enum: KYC_FACT_STATUSES }).notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => [
    uniqueIndex('kyc_facts_customer_seq').on(t.customerId, t.seq),
    check('kyc_facts_field', sql`${t.field} IN (${list(KYC_FIELD_KEYS)})`),
    check('kyc_facts_status', sql`${t.status} IN (${list(KYC_FACT_STATUSES)})`),
  ],
);

export const kycVersions = sqliteTable(
  'kyc_versions',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id),
    seq: integer('seq').notNull(),
    hash: text('hash').notNull(),
    date: text('date').notNull(),
    material: integer('material', { mode: 'boolean' }).notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [
    uniqueIndex('kyc_versions_customer_seq').on(t.customerId, t.seq),
    check('kyc_versions_material', sql`${t.material} IN (0, 1)`),
  ],
);
