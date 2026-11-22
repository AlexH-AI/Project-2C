import { maxFee } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  createCustomer,
  listCustomers,
  listStageTransitions,
  softDeleteCustomer,
  updateCustomerProfile,
} from './customers';
import {
  cancelPolicy,
  issuePolicy,
  listPolicies,
  restorePolicy,
  softDeletePolicy,
  submitPolicy,
  updatePolicy,
} from './policies';
import { setCurrency } from './settings';
import { restorePerson, softDeletePerson, updatePerson } from './team';
import { byId, codeOf, d, errorOf, setup } from './test-support';

const MILLION = 1_000_000;

async function withCustomer() {
  const ctx = await setup();
  const customer = createCustomer(ctx.db, {
    name: 'Lan',
    rmId: ctx.rm.id,
    stage: 'N1',
    date: d(1, 1),
  });
  const submit = () =>
    submitPolicy(ctx.db, {
      customerId: customer.id,
      rmId: ctx.rm.id,
      submittedDate: d(31, 1),
      submittedFyp: 300 * MILLION,
    });
  return { ...ctx, customer, submit };
}

describe('policies', () => {
  it('submits a policy, then issues it with the submitted FYP by default', async () => {
    const { db, rm, customer, submit } = await withCustomer();

    const policy = submit();
    expect(policy).toEqual({
      id: expect.any(String),
      customerId: customer.id,
      rmId: rm.id,
      submittedDate: d(31, 1),
      submittedFyp: 300 * MILLION,
      issuedDate: null,
      issuedFyp: null,
      cancelledDate: null,
    });

    const issued = issuePolicy(db, policy.id, { issuedDate: d(2, 2) });
    expect(issued).toMatchObject({ issuedDate: d(2, 2), issuedFyp: 300 * MILLION });
    expect(issuePolicy(db, policy.id, { issuedDate: d(2, 2), issuedFyp: 280 * MILLION })).toEqual({
      ...issued,
      issuedFyp: 280 * MILLION,
    });
    expect(byId(listPolicies(db), policy.id)?.issuedFyp).toBe(280 * MILLION);
    // Re-issuing with a new date keeps the hand-edited FYP.
    expect(issuePolicy(db, policy.id, { issuedDate: d(5, 2) })).toMatchObject({
      issuedDate: d(5, 2),
      issuedFyp: 280 * MILLION,
    });
    expect(listPolicies(db)).toHaveLength(1);
  });

  it('refuses a FYP that is not positive and an issue before submission', async () => {
    const { db, rm, customer, tl, submit } = await withCustomer();
    const base = {
      customerId: customer.id,
      rmId: rm.id,
      submittedDate: d(31, 1),
      submittedFyp: MILLION,
    };

    expect(codeOf(() => submitPolicy(db, { ...base, submittedFyp: 0 }))).toBe('INVALID_AMOUNT');
    expect(codeOf(() => submitPolicy(db, { ...base, submittedFyp: 1.5 }))).toBe('INVALID_AMOUNT');
    expect(codeOf(() => submitPolicy(db, { ...base, rmId: tl.id }))).toBe('RM_REQUIRED');
    expect(codeOf(() => submitPolicy(db, { ...base, customerId: 'x' }))).toBe('CUSTOMER_NOT_FOUND');
    const { id } = submit();
    expect(codeOf(() => issuePolicy(db, id, { issuedDate: d(30, 1) }))).toBe(
      'ISSUED_BEFORE_SUBMITTED',
    );
    expect(codeOf(() => issuePolicy(db, id, { issuedDate: d(1, 2), issuedFyp: -5 }))).toBe(
      'INVALID_AMOUNT',
    );
    expect(codeOf(() => issuePolicy(db, 'x', { issuedDate: d(1, 2) }))).toBe('POLICY_NOT_FOUND');
  });

  // DR-23: a FYP is at most 100 tỷ đồng, so no total of them can lose a đồng.
  it('takes a FYP up to the cap and refuses one past it, on every command', async () => {
    const { db, rm, customer, persist, submit } = await withCustomer();
    const base = { customerId: customer.id, rmId: rm.id, submittedDate: d(31, 1) };
    const { id } = submit();
    persist.mockClear();

    for (const fyp of [maxFee('VND') + 1, Number.MAX_SAFE_INTEGER]) {
      expect(codeOf(() => submitPolicy(db, { ...base, submittedFyp: fyp }))).toBe(
        'AMOUNT_TOO_LARGE',
      );
      expect(codeOf(() => issuePolicy(db, id, { issuedDate: d(1, 2), issuedFyp: fyp }))).toBe(
        'AMOUNT_TOO_LARGE',
      );
      expect(codeOf(() => updatePolicy(db, id, { submittedFyp: fyp }))).toBe('AMOUNT_TOO_LARGE');
    }
    expect(persist).not.toHaveBeenCalled();
    expect(listPolicies(db)).toHaveLength(1);

    const atCap = submitPolicy(db, { ...base, submittedFyp: maxFee('VND') });
    expect(atCap.submittedFyp).toBe(100_000_000_000);
    expect(issuePolicy(db, id, { issuedDate: d(1, 2), issuedFyp: maxFee('VND') }).issuedFyp).toBe(
      maxFee('VND'),
    );
    expect(updatePolicy(db, id, { submittedFyp: maxFee('VND') }).submittedFyp).toBe(maxFee('VND'));
  });

  // ADR-0018 §3: the cap of the data's currency, 100 Bil dollars in cents.
  it('takes a FYP up to the cap of the currency of the data', async () => {
    const { db, rm, customer } = await withCustomer();
    setCurrency(db, 'USD');
    const base = { customerId: customer.id, rmId: rm.id, submittedDate: d(31, 1) };

    const { id } = submitPolicy(db, { ...base, submittedFyp: maxFee('USD') });

    expect(codeOf(() => updatePolicy(db, id, { submittedFyp: maxFee('USD') + 1 }))).toBe(
      'AMOUNT_TOO_LARGE',
    );
    expect(updatePolicy(db, id, { submittedFyp: 1 }).submittedFyp).toBe(1);
  });

  it('updates any field but keeps the issued date and FYP together', async () => {
    const { db, otherRm, submit } = await withCustomer();
    const { id } = submit();

    expect(codeOf(() => updatePolicy(db, id, { issuedDate: d(2, 2) }))).toBe('ISSUE_INCOMPLETE');
    expect(codeOf(() => updatePolicy(db, id, { issuedFyp: MILLION }))).toBe('ISSUE_INCOMPLETE');

    const updated = updatePolicy(db, id, {
      rmId: otherRm.id,
      submittedDate: d(30, 1),
      submittedFyp: 2 * MILLION,
      issuedDate: d(3, 2),
      issuedFyp: MILLION,
    });
    expect(updated).toMatchObject({
      rmId: otherRm.id,
      submittedDate: d(30, 1),
      submittedFyp: 2 * MILLION,
      issuedDate: d(3, 2),
      issuedFyp: MILLION,
    });
    expect(updatePolicy(db, id, { issuedDate: null, issuedFyp: null })).toMatchObject({
      issuedDate: null,
      issuedFyp: null,
    });
    expect(updatePolicy(db, id, {})).toMatchObject({ submittedFyp: 2 * MILLION });
  });

  // F-11: the commands keep this rule, not only the dialogs.
  it('refuses a submission or issue dated after today, and takes today itself', async () => {
    const { db, rm, customer, persist } = await withCustomer();
    const today = d(26, 9);
    const tomorrow = d(27, 9);
    const base = { customerId: customer.id, rmId: rm.id, submittedFyp: MILLION };
    persist.mockClear();

    expect(codeOf(() => submitPolicy(db, { ...base, submittedDate: tomorrow }))).toBe(
      'DATE_IN_FUTURE',
    );
    expect(listPolicies(db)).toEqual([]);
    expect(persist).not.toHaveBeenCalled();

    const { id } = submitPolicy(db, { ...base, submittedDate: today });
    expect(codeOf(() => issuePolicy(db, id, { issuedDate: tomorrow }))).toBe('DATE_IN_FUTURE');
    expect(codeOf(() => updatePolicy(db, id, { submittedDate: tomorrow }))).toBe('DATE_IN_FUTURE');
    expect(byId(listPolicies(db), id)).toMatchObject({ submittedDate: today, issuedDate: null });
    expect(issuePolicy(db, id, { issuedDate: today }).issuedDate).toEqual(today);
  });

  it('hides deleted policies and those of deleted customers', async () => {
    const { db, customer, submit } = await withCustomer();
    const kept = submit();
    const { id } = submit();

    softDeletePolicy(db, id);
    expect(listPolicies(db).map((p) => p.id)).toEqual([kept.id]);
    expect(byId(listPolicies(db), id)).toBeUndefined();
    expect(codeOf(() => softDeletePolicy(db, id))).toBe('POLICY_NOT_FOUND');

    restorePolicy(db, id);
    expect(byId(listPolicies(db), id)?.id).toBe(id);
    expect(codeOf(() => restorePolicy(db, 'x'))).toBe('POLICY_NOT_FOUND');

    softDeleteCustomer(db, customer.id);
    expect(listPolicies(db)).toEqual([]);
    expect(byId(listPolicies(db), id)).toBeUndefined();
    expect(codeOf(() => restorePolicy(db, id))).toBe('CUSTOMER_NOT_FOUND');
  });

  // DR-12, DR-45: a live policy points to its RM, so the backup it ends up in imports again (rule 5).
  it('keeps an RM whose only live record is a policy from leaving the role or being deleted', async () => {
    const { db, rm, otherRm, customer, submit } = await withCustomer();
    const { id } = submit();
    updateCustomerProfile(db, customer.id, { rmId: otherRm.id });

    expect(codeOf(() => updatePerson(db, rm.id, { role: 'IS', teamId: null }))).toBe(
      'PERSON_IN_USE',
    );
    expect(codeOf(() => softDeletePerson(db, rm.id))).toBe('PERSON_IN_USE');
    softDeletePolicy(db, id);
    expect(updatePerson(db, rm.id, { role: 'IS', teamId: null }).role).toBe('IS');
  });

  it('restores no policy whose RM was deleted or left the role while it was deleted', async () => {
    const { db, rm, otherRm, customer, submit, persist } = await withCustomer();
    const { id } = submit();
    softDeletePolicy(db, id);
    updateCustomerProfile(db, customer.id, { rmId: otherRm.id });
    softDeletePerson(db, rm.id);
    persist.mockClear();

    expect(codeOf(() => restorePolicy(db, id))).toBe('PERSON_NOT_FOUND');
    restorePerson(db, rm.id);
    updatePerson(db, rm.id, { role: 'IS', teamId: null });
    expect(codeOf(() => restorePolicy(db, id))).toBe('RM_REQUIRED');
    expect(byId(listPolicies(db), id)).toBeUndefined();
    expect(persist).toHaveBeenCalledTimes(2);
  });
});

// B1a (spec Phase 6 phản hồi §4.2; golden `docs/golden/chi-so.md` mục 4.4, points 2–6).
describe('cancelling a policy', () => {
  /** A policy submitted 31/01, issued on `issuedDate` with its submitted FYP, 300 tr. */
  async function issued(issuedDate = d(2, 2)) {
    const ctx = await withCustomer();
    const { id } = ctx.submit();
    issuePolicy(ctx.db, id, { issuedDate });
    return { ...ctx, id };
  }

  it('cancels an issued policy, on its issue day too (G39), and moves no stage', async () => {
    const { db, customer, id, submit } = await issued();
    const transitions = listStageTransitions(db);

    expect(cancelPolicy(db, id, d(2, 2))).toMatchObject({
      issuedDate: d(2, 2),
      issuedFyp: 300 * MILLION,
      cancelledDate: d(2, 2),
    });
    const later = submit();
    issuePolicy(db, later.id, { issuedDate: d(2, 2) });
    cancelPolicy(db, later.id, d(23, 2));

    expect(listPolicies(db).map((p) => [p.id, p.cancelledDate])).toEqual([
      [id, d(2, 2)],
      [later.id, d(23, 2)],
    ]);
    expect(listStageTransitions(db)).toEqual(transitions);
    expect(byId(listCustomers(db), customer.id)?.stage).toBe('N1');
  });

  it('refuses a policy not issued or already cancelled, deleted, or of a deleted customer', async () => {
    const { db, customer, id, submit, persist } = await issued();
    const submitted = submit();
    cancelPolicy(db, id, d(10, 2));
    const gone = submit();
    issuePolicy(db, gone.id, { issuedDate: d(2, 2) });
    softDeletePolicy(db, gone.id);
    persist.mockClear();

    expect(codeOf(() => cancelPolicy(db, submitted.id, d(10, 2)))).toBe('POLICY_NOT_ISSUED');
    expect(errorOf(() => cancelPolicy(db, id, d(12, 2)))).toMatchObject({
      code: 'POLICY_ALREADY_CANCELLED',
      params: { date: '10/02/2026' },
    });
    expect(codeOf(() => cancelPolicy(db, gone.id, d(10, 2)))).toBe('POLICY_NOT_FOUND');
    expect(codeOf(() => cancelPolicy(db, 'x', d(10, 2)))).toBe('POLICY_NOT_FOUND');
    expect(persist).not.toHaveBeenCalled();
    expect(byId(listPolicies(db), id)?.cancelledDate).toEqual(d(10, 2));

    const other = submit();
    issuePolicy(db, other.id, { issuedDate: d(2, 2) });
    softDeleteCustomer(db, customer.id);
    expect(codeOf(() => cancelPolicy(db, other.id, d(10, 2)))).toBe('CUSTOMER_NOT_FOUND');
  });

  it('refuses a day before the issue, after today, or outside 1900–2100, and takes today', async () => {
    const { db, id, persist } = await issued();
    persist.mockClear();

    expect(errorOf(() => cancelPolicy(db, id, d(1, 2)))).toMatchObject({
      code: 'CANCELLED_BEFORE_ISSUED',
      params: { date: '02/02/2026' },
    });
    expect(errorOf(() => cancelPolicy(db, id, d(27, 9)))).toMatchObject({
      code: 'DATE_IN_FUTURE',
      params: { date: '27/09/2026', field: 'cancelled' },
    });
    for (const date of [
      { year: 1899, month: 12, day: 31 },
      { year: 2101, month: 1, day: 1 },
      { year: 2026, month: 2, day: 30 },
    ]) {
      expect(codeOf(() => cancelPolicy(db, id, date))).toBe('INVALID_DATE');
    }
    expect(persist).not.toHaveBeenCalled();
    expect(byId(listPolicies(db), id)?.cancelledDate).toBeNull();

    expect(cancelPolicy(db, id, d(26, 9)).cancelledDate).toEqual(d(26, 9));
  });

  it('changes the cancellation day and undoes the cancellation through updatePolicy', async () => {
    const { db, id } = await issued();
    cancelPolicy(db, id, d(10, 2));

    expect(updatePolicy(db, id, { cancelledDate: d(20, 2) }).cancelledDate).toEqual(d(20, 2));
    expect(codeOf(() => updatePolicy(db, id, { cancelledDate: d(1, 2) }))).toBe(
      'CANCELLED_BEFORE_ISSUED',
    );
    expect(codeOf(() => updatePolicy(db, id, { cancelledDate: d(27, 9) }))).toBe('DATE_IN_FUTURE');
    // The cancelled FYP is the issued one: a new issued FYP keeps the cancellation as it is.
    expect(updatePolicy(db, id, { issuedFyp: 280 * MILLION })).toMatchObject({
      issuedFyp: 280 * MILLION,
      cancelledDate: d(20, 2),
    });
    expect(updatePolicy(db, id, {}).cancelledDate).toEqual(d(20, 2));

    // Undone: issued again, with no trace of the cancellation.
    expect(updatePolicy(db, id, { cancelledDate: null })).toMatchObject({
      issuedDate: d(2, 2),
      issuedFyp: 280 * MILLION,
      cancelledDate: null,
    });
    expect(db.sqlite.exec('SELECT cancelled_date FROM policies')[0]!.values).toEqual([[null]]);
    // A cancellation day given to an issued policy cancels it, by the same rules.
    expect(updatePolicy(db, id, { cancelledDate: d(3, 2) }).cancelledDate).toEqual(d(3, 2));
  });

  it('refuses to clear the issue of a cancelled policy, or move it past the cancellation', async () => {
    const { db, id, submit, persist } = await issued();
    cancelPolicy(db, id, d(10, 2));
    persist.mockClear();

    const refusal = { code: 'POLICY_CANCELLED', params: { date: '10/02/2026' } };
    expect(
      errorOf(() => updatePolicy(db, id, { issuedDate: null, issuedFyp: null })),
    ).toMatchObject(refusal);
    expect(errorOf(() => updatePolicy(db, id, { issuedDate: d(11, 2) }))).toMatchObject(refusal);
    expect(errorOf(() => issuePolicy(db, id, { issuedDate: d(11, 2) }))).toMatchObject(refusal);
    expect(persist).not.toHaveBeenCalled();
    expect(byId(listPolicies(db), id)).toMatchObject({
      issuedDate: d(2, 2),
      cancelledDate: d(10, 2),
    });

    // Up to the cancellation day itself, the issue day moves.
    expect(updatePolicy(db, id, { issuedDate: d(10, 2) }).issuedDate).toEqual(d(10, 2));
    expect(updatePolicy(db, id, { issuedDate: d(5, 2) }).issuedDate).toEqual(d(5, 2));
    // Undone in the same save (Bỏ hủy, then the issue cleared, mockup `huy-hd.html`): submitted.
    expect(
      updatePolicy(db, id, { issuedDate: null, issuedFyp: null, cancelledDate: null }),
    ).toMatchObject({ issuedDate: null, issuedFyp: null, cancelledDate: null });

    const submitted = submit();
    expect(codeOf(() => updatePolicy(db, submitted.id, { cancelledDate: d(10, 2) }))).toBe(
      'POLICY_NOT_ISSUED',
    );
  });

  // Golden B (`docs/golden/chi-so.md` mục 4.1): `hd-18` of KH 16, cancelled on 08/02/2028 and then
  // the cancellation undone — the walk B1b reads G36 and then G37 on.
  it('B: cancels hd-18 on 08/02/2028, then undoes it', async () => {
    const { db, rm } = await setup(d(29, 2, 2028));
    const kh16 = createCustomer(db, {
      name: 'KH 16',
      rmId: rm.id,
      stage: 'N3',
      date: d(3, 1, 2028),
    });
    const hd18 = submitPolicy(db, {
      customerId: kh16.id,
      rmId: rm.id,
      submittedDate: d(1, 2, 2028),
      submittedFyp: 200 * MILLION,
    });
    issuePolicy(db, hd18.id, { issuedDate: d(3, 2, 2028) });
    const read = () => byId(listPolicies(db), hd18.id);
    expect(read()?.cancelledDate).toBeNull();

    cancelPolicy(db, hd18.id, d(8, 2, 2028));
    expect(read()).toMatchObject({
      issuedDate: d(3, 2, 2028),
      issuedFyp: 200 * MILLION,
      cancelledDate: d(8, 2, 2028),
    });

    updatePolicy(db, hd18.id, { cancelledDate: null });
    expect(read()).toMatchObject({
      issuedDate: d(3, 2, 2028),
      issuedFyp: 200 * MILLION,
      cancelledDate: null,
    });
  });
});
