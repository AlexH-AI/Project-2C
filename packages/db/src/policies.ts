/**
 * Policies (spec §3.7, §4): submitted, then issued with the submitted FYP unless changed (G2 D),
 * then maybe cancelled (golden `docs/golden/chi-so.md` mục 4.4). No column holds the status: it
 * reads from the days.
 */
import {
  compareDates,
  formatDate,
  fromIsoDate,
  type CalendarDate,
  type Money,
  type Policy,
} from '@p2c/domain';
import { and, asc, eq, isNull } from 'drizzle-orm';
import {
  liveCustomer,
  liveRow,
  requireAmount,
  requireRm,
  requireRow,
  stampDeleted,
  storedPastDate,
  updateRow,
} from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { getCurrency } from './settings';
import { ulid } from './ids';
import { customers, policies } from './schema';

type PolicyRow = typeof policies.$inferSelect;

export type NewPolicy = Pick<Policy, 'customerId' | 'rmId' | 'submittedDate' | 'submittedFyp'>;
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

// ---- commands -------------------------------------------------------------

export function submitPolicy(db: Database, input: NewPolicy): Policy {
  return db.transaction(() => {
    liveCustomer(db, input.customerId);
    const at = db.now().toISOString();
    const row: PolicyRow = {
      id: ulid(db.now(), db.random),
      customerId: input.customerId,
      ...validate(db, { ...input, issuedDate: null, issuedFyp: null, cancelledDate: null }),
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
  issue: { readonly issuedDate: CalendarDate; readonly issuedFyp?: Money },
): Policy {
  const current = toPolicy(livePolicy(db, id));
  return updatePolicy(db, id, {
    issuedDate: issue.issuedDate,
    issuedFyp: issue.issuedFyp ?? current.issuedFyp ?? current.submittedFyp,
  });
}

/**
 * `undefined` keeps a field; the issued date and FYP must end up both set or both null. A null
 * cancellation day undoes the cancellation, leaving no trace of it; a day given to an issued
 * policy changes it, or cancels the policy by the rules of `cancelPolicy`. A policy that stays
 * cancelled on its day keeps an issue on or before it (`POLICY_CANCELLED`, golden mục 4.4 point 5);
 * its cancelled FYP is the issued one, so it follows a new issued FYP.
 */
export function updatePolicy(db: Database, id: string, changes: PolicyChanges): Policy {
  return db.transaction(() => {
    const current = toPolicy(livePolicy(db, id));
    const merged = { ...current };
    for (const [key, value] of Object.entries(changes)) {
      if (value !== undefined) Object.assign(merged, { [key]: value });
    }
    updateRow(db, policies, id, validate(db, merged, current.cancelledDate));
    return toPolicy(livePolicy(db, id));
  });
}

/**
 * Cancels an issued policy on `cancelledDate` (golden `docs/golden/chi-so.md` mục 4.4 point 6): on
 * or after its issue day, today at the latest. The cancelled FYP is the issued one; no stage moves.
 * Changing the day or undoing it goes through `updatePolicy`.
 */
export function cancelPolicy(db: Database, id: string, cancelledDate: CalendarDate): Policy {
  return db.transaction(() => {
    const current = toPolicy(livePolicy(db, id));
    if (current.issuedDate === null) throw new DbError('POLICY_NOT_ISSUED');
    if (current.cancelledDate !== null) {
      throw new DbError('POLICY_ALREADY_CANCELLED', { date: formatDate(current.cancelledDate) });
    }
    updateRow(db, policies, id, validate(db, { ...current, cancelledDate }));
    return toPolicy(livePolicy(db, id));
  });
}

export function softDeletePolicy(db: Database, id: string): void {
  db.transaction(() => {
    livePolicy(db, id);
    updateRow(db, policies, id, stampDeleted(db));
  });
}

/** A deleted policy may be dated ahead in an imported file (spec §6 rule 10): checked again (DR-25). */
export function restorePolicy(db: Database, id: string): void {
  db.transaction(() => {
    const row = requireRow(db, policies, id, 'POLICY_NOT_FOUND');
    checkRestorePolicy(db, row);
    updateRow(db, policies, id, { deletedAt: null });
  });
}

/** Why the policy cannot be restored, thrown as `restorePolicy` throws it (spec Phase 6 TR-2, TR-5). */
export function checkRestorePolicy(db: Database, row: PolicyRow): void {
  liveCustomer(db, row.customerId);
  validate(db, toPolicy(row));
}

// ---- helpers --------------------------------------------------------------

/**
 * The columns of a policy as stored: the CHECKs of the table as errors of their own, each day a
 * stored past day. The cancellation day reads the clock only when there is one, so a policy never
 * cancelled reads it as before (the seed's clock ticks on each read). An issue that no longer fits
 * the cancellation `kept` from before the change is `POLICY_CANCELLED`: judged on what the save
 * leaves, not on the fields sent, as the dialog sends the whole form.
 */
function validate(
  db: Database,
  policy: Omit<Policy, 'id' | 'customerId'>,
  kept: CalendarDate | null = null,
) {
  const { issuedDate, issuedFyp, cancelledDate } = policy;
  const currency = getCurrency(db);
  if ((issuedDate === null) !== (issuedFyp === null)) throw new DbError('ISSUE_INCOMPLETE');
  if (issuedDate !== null && compareDates(issuedDate, policy.submittedDate) < 0) {
    throw new DbError('ISSUED_BEFORE_SUBMITTED');
  }
  const stored = {
    rmId: requireRm(db, policy.rmId),
    submittedDate: storedPastDate(db, policy.submittedDate, 'submitted'),
    submittedFyp: requireAmount(policy.submittedFyp, currency),
    issuedDate: issuedDate === null ? null : storedPastDate(db, issuedDate, 'issued'),
    issuedFyp: issuedFyp === null ? null : requireAmount(issuedFyp, currency),
    cancelledDate: cancelledDate === null ? null : storedPastDate(db, cancelledDate, 'cancelled'),
  };
  // After storing, so a day outside 1900–2100 is `INVALID_DATE`, not compared.
  if (
    cancelledDate !== null &&
    (issuedDate === null || compareDates(cancelledDate, issuedDate) < 0)
  ) {
    if (kept !== null && compareDates(cancelledDate, kept) === 0) {
      throw new DbError('POLICY_CANCELLED', { date: formatDate(cancelledDate) });
    }
    if (issuedDate === null) throw new DbError('POLICY_NOT_ISSUED');
    throw new DbError('CANCELLED_BEFORE_ISSUED', { date: formatDate(issuedDate) });
  }
  return stored;
}

function livePolicy(db: Database, id: string): PolicyRow {
  const row = liveRow(db, policies, id, 'POLICY_NOT_FOUND');
  liveCustomer(db, row.customerId);
  return row;
}

function toPolicy(row: PolicyRow): Policy {
  return {
    id: row.id,
    customerId: row.customerId,
    rmId: row.rmId,
    submittedDate: fromIsoDate(row.submittedDate),
    submittedFyp: row.submittedFyp,
    issuedDate: row.issuedDate === null ? null : fromIsoDate(row.issuedDate),
    issuedFyp: row.issuedFyp,
    cancelledDate: row.cancelledDate === null ? null : fromIsoDate(row.cancelledDate),
  };
}
