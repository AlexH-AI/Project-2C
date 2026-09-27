/** Policies (spec §3.7, §4): submitted, then issued with the submitted FYP unless changed (G2 D). */
import { compareDates, type CalendarDate, type Policy, type Vnd } from '@p2c/domain';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { fromIsoDate, requireAmount, requireRe, stampDeleted, toIsoDate } from './common';
import { liveCustomer } from './customers';
import type { Database } from './database';
import { DbError } from './errors';
import { ulid } from './ids';
import { customers, policies } from './schema';

type PolicyRow = typeof policies.$inferSelect;

export type NewPolicy = Pick<Policy, 'customerId' | 'reId' | 'submittedDate' | 'submittedFyp'>;
export type PolicyChanges = Partial<Omit<Policy, 'id' | 'customerId'>>;

// ---- reads ----------------------------------------------------------------

/** Live policies of live customers, by submission day. */
export function listPolicies(db: Database): Policy[] {
  return db.orm
    .select({ p: policies })
    .from(policies)
    .innerJoin(customers, eq(customers.id, policies.customerId))
    .where(and(isNull(policies.deletedAt), isNull(customers.deletedAt)))
    .orderBy(asc(policies.submittedDate), asc(policies.id))
    .all()
    .map(({ p }) => toPolicy(p));
}

export function getPolicy(db: Database, id: string): Policy | undefined {
  return listPolicies(db).find((policy) => policy.id === id);
}

// ---- commands -------------------------------------------------------------

export function submitPolicy(db: Database, input: NewPolicy): Policy {
  return db.transaction(() => {
    liveCustomer(db, input.customerId);
    const at = db.now().toISOString();
    const row: PolicyRow = {
      id: ulid(db.now(), db.random),
      customerId: input.customerId,
      ...validate(db, { ...input, issuedDate: null, issuedFyp: null }),
      createdAt: at,
      updatedAt: at,
      deletedAt: null,
    };
    db.orm.insert(policies).values(row).run();
    return toPolicy(row);
  });
}

/**
 * Issues (or re-issues) the policy. Without an issued FYP it keeps the current one, or takes the
 * submitted FYP on the first issue (G2 D).
 */
export function issuePolicy(
  db: Database,
  id: string,
  issue: { readonly issuedDate: CalendarDate; readonly issuedFyp?: Vnd },
): Policy {
  const current = toPolicy(livePolicy(db, id));
  return updatePolicy(db, id, {
    issuedDate: issue.issuedDate,
    issuedFyp: issue.issuedFyp ?? current.issuedFyp ?? current.submittedFyp,
  });
}

/** `undefined` keeps a field; the issued date and FYP must end up both set or both null. */
export function updatePolicy(db: Database, id: string, changes: PolicyChanges): Policy {
  return db.transaction(() => {
    const current = toPolicy(livePolicy(db, id));
    const merged = { ...current };
    for (const [key, value] of Object.entries(changes)) {
      if (value !== undefined) Object.assign(merged, { [key]: value });
    }
    updatePolicyRow(db, id, validate(db, merged));
    return toPolicy(livePolicy(db, id));
  });
}

export function softDeletePolicy(db: Database, id: string): void {
  db.transaction(() => {
    livePolicy(db, id);
    updatePolicyRow(db, id, stampDeleted(db));
  });
}

export function restorePolicy(db: Database, id: string): void {
  db.transaction(() => {
    const row = db.orm.select().from(policies).where(eq(policies.id, id)).get();
    if (!row) throw new DbError('POLICY_NOT_FOUND');
    liveCustomer(db, row.customerId);
    requireRe(db, row.reId);
    updatePolicyRow(db, id, { deletedAt: null });
  });
}

// ---- helpers --------------------------------------------------------------

function validate(db: Database, policy: Omit<Policy, 'id' | 'customerId'>) {
  const { issuedDate, issuedFyp } = policy;
  if ((issuedDate === null) !== (issuedFyp === null)) throw new DbError('ISSUE_INCOMPLETE');
  if (issuedDate !== null && compareDates(issuedDate, policy.submittedDate) < 0) {
    throw new DbError('ISSUED_BEFORE_SUBMITTED');
  }
  return {
    reId: requireRe(db, policy.reId),
    submittedDate: toIsoDate(policy.submittedDate),
    submittedFyp: requireAmount(policy.submittedFyp),
    issuedDate: issuedDate === null ? null : toIsoDate(issuedDate),
    issuedFyp: issuedFyp === null ? null : requireAmount(issuedFyp),
  };
}

function livePolicy(db: Database, id: string): PolicyRow {
  const row = db.orm.select().from(policies).where(eq(policies.id, id)).get();
  if (!row || row.deletedAt) throw new DbError('POLICY_NOT_FOUND');
  liveCustomer(db, row.customerId);
  return row;
}

function updatePolicyRow(db: Database, id: string, changes: Partial<PolicyRow>): void {
  db.orm
    .update(policies)
    .set({ updatedAt: db.now().toISOString(), ...changes })
    .where(eq(policies.id, id))
    .run();
}

function toPolicy(row: PolicyRow): Policy {
  return {
    id: row.id,
    customerId: row.customerId,
    reId: row.reId,
    submittedDate: fromIsoDate(row.submittedDate),
    submittedFyp: row.submittedFyp,
    issuedDate: row.issuedDate === null ? null : fromIsoDate(row.issuedDate),
    issuedFyp: row.issuedFyp,
  };
}
