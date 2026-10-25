/**
 * Every reference to a person (spec §3.3, ADR-0007, D9), one row each: `kind` is the column it is,
 * the RE of a customer, an appointment or a policy, or a coordinator or the reviewer of an
 * appointment; `appointment_id` the appointment it is on (none for a customer or a policy);
 * `customer_id` the customer it belongs to (the customer itself, for its RE); `live` whether that
 * record is not deleted (for a coordinator or the reviewer, its appointment).
 *
 * What keeps a person from deletion (`personUsage`), the customers in the trash it is about, what
 * the purge keeps of them and import rule 5 all read it. A column that points to a person takes a
 * kind here with its rows and whom it points to (`POINTS_TO`), then the field of `PersonUsage` that
 * counts the kind (`team.ts`, a line of 9b): the types ask for each, and a test finds each column of
 * the schema that points to a person read here.
 */
import { sqlTexts } from './common';

export const PERSON_REFERENCE_KINDS = [
  'customer',
  'appointment',
  'policy',
  'coordinator',
  'reviewer',
] as const;

export type PersonReferenceKind = (typeof PERSON_REFERENCE_KINDS)[number];

/**
 * Whom each kind points to: the RE of the record, who stays an RE while it is live (spec §3.3), or
 * one supporting an appointment (ADR-0007, D9). `ownsRecords` and import rule 5 both read it.
 */
export const POINTS_TO: Record<PersonReferenceKind, 're' | 'supporting'> = {
  customer: 're',
  appointment: 're',
  policy: 're',
  coordinator: 'supporting',
  reviewer: 'supporting',
};

/** The kinds as a list of SQL text, for `kind IN (…)`. */
export function quotedKinds(kinds: readonly PersonReferenceKind[]): string {
  return sqlTexts(kinds);
}

/** The columns of the list, in order. */
const COLUMNS = ['kind', 'person_id', 'appointment_id', 'customer_id', 'live'];

/** The rows of each kind: the person, the appointment, the customer, whether live; from where. */
const ROWS: Record<
  PersonReferenceKind,
  { readonly values: readonly [string, string, string, string]; readonly from: string }
> = {
  customer: { values: ['re_id', 'NULL', 'id', 'deleted_at IS NULL'], from: 'customers' },
  appointment: {
    values: ['re_id', 'id', 'customer_id', 'deleted_at IS NULL'],
    from: 'appointments',
  },
  policy: { values: ['re_id', 'NULL', 'customer_id', 'deleted_at IS NULL'], from: 'policies' },
  coordinator: {
    values: ['c.person_id', 'a.id', 'a.customer_id', 'a.deleted_at IS NULL'],
    from: 'appointment_coordinators c JOIN appointments a ON a.id = c.appointment_id',
  },
  reviewer: {
    values: ['outcome_reviewer_id', 'id', 'customer_id', 'deleted_at IS NULL'],
    from: 'appointments WHERE outcome_reviewer_id IS NOT NULL',
  },
};

/**
 * The list as one compound select; its first branch names the columns. Not a `WITH`: in `IN (…)`,
 * SQLite stored all of it in a temporary table before reading it (review #805).
 */
export const PERSON_REFERENCES = PERSON_REFERENCE_KINDS.map((kind, branch) => {
  const values = [quotedKinds([kind]), ...ROWS[kind].values];
  const named = branch === 0 ? values.map((value, i) => `${value} AS ${COLUMNS[i]}`) : values;
  return `SELECT ${named.join(', ')} FROM ${ROWS[kind].from}`;
}).join('\n  UNION ALL ');
