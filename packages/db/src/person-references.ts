/**
 * Every reference to a person (spec §3.3, ADR-0007, D9), one row each: `kind` is the column it is,
 * the RE of a customer, an appointment or a policy, or a coordinator or the reviewer of an
 * appointment; `appointment_id` the appointment it is on (none for a customer or a policy);
 * `customer_id` the customer it belongs to (the customer itself, for its RE); `live` whether that
 * record is not deleted (for a coordinator or the reviewer, its appointment).
 *
 * What keeps a person from deletion (`personUsage`), the customers in the trash it is about, what
 * the purge keeps of them and import rule 5 all read it. A column that points to a person takes a
 * kind here with its rows, then the field of `PersonUsage` that counts the kind (`team.ts`, a line
 * of 9b) and whom rule 5 lets it point to (`backup-validation.ts`): the types ask for both, and a
 * test finds each column of the schema that points to a person read here.
 */
export const PERSON_REFERENCE_KINDS = [
  'customer',
  'appointment',
  'policy',
  'coordinator',
  'reviewer',
] as const;

export type PersonReferenceKind = (typeof PERSON_REFERENCE_KINDS)[number];

/** The kinds as a list of SQL text, for `kind IN (…)`. */
export function quotedKinds(kinds: readonly PersonReferenceKind[]): string {
  return kinds.map((kind) => `'${kind}'`).join(', ');
}

/** The rows of each kind: the person, the appointment, the customer, whether live; from where. */
const ROWS: Record<PersonReferenceKind, string> = {
  customer: 're_id, NULL, id, deleted_at IS NULL FROM customers',
  appointment: 're_id, id, customer_id, deleted_at IS NULL FROM appointments',
  policy: 're_id, NULL, customer_id, deleted_at IS NULL FROM policies',
  coordinator: `c.person_id, a.id, a.customer_id, a.deleted_at IS NULL
    FROM appointment_coordinators c JOIN appointments a ON a.id = c.appointment_id`,
  reviewer: `outcome_reviewer_id, id, customer_id, deleted_at IS NULL
    FROM appointments WHERE outcome_reviewer_id IS NOT NULL`,
};

export const PERSON_REFERENCES = `WITH refs (kind, person_id, appointment_id, customer_id, live) AS (
  ${PERSON_REFERENCE_KINDS.map((kind) => `SELECT ${quotedKinds([kind])}, ${ROWS[kind]}`).join(
    '\n  UNION ALL ',
  )})
  SELECT * FROM refs`;
