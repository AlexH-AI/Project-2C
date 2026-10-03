import { describe, expect, it } from 'vitest';
import { createCustomer, softDeleteCustomer } from './customers';
import {
  getPolicy,
  issuePolicy,
  listPolicies,
  restorePolicy,
  softDeletePolicy,
  submitPolicy,
  updatePolicy,
} from './policies';
import { codeOf, d, setup } from './test-support';

const MILLION = 1_000_000;

async function withCustomer() {
  const ctx = await setup();
  const customer = createCustomer(ctx.db, {
    name: 'Lan',
    reId: ctx.re.id,
    stage: 'N1',
    date: d(1, 1),
  });
  const submit = () =>
    submitPolicy(ctx.db, {
      customerId: customer.id,
      reId: ctx.re.id,
      submittedDate: d(31, 1),
      submittedFyp: 300 * MILLION,
    });
  return { ...ctx, customer, submit };
}

describe('policies', () => {
  it('submits a policy, then issues it with the submitted FYP by default', async () => {
    const { db, re, customer, submit } = await withCustomer();

    const policy = submit();
    expect(policy).toEqual({
      id: expect.any(String),
      customerId: customer.id,
      reId: re.id,
      submittedDate: d(31, 1),
      submittedFyp: 300 * MILLION,
      issuedDate: null,
      issuedFyp: null,
    });

    const issued = issuePolicy(db, policy.id, { issuedDate: d(2, 2) });
    expect(issued).toMatchObject({ issuedDate: d(2, 2), issuedFyp: 300 * MILLION });
    expect(issuePolicy(db, policy.id, { issuedDate: d(2, 2), issuedFyp: 280 * MILLION })).toEqual({
      ...issued,
      issuedFyp: 280 * MILLION,
    });
    expect(getPolicy(db, policy.id)?.issuedFyp).toBe(280 * MILLION);
    // Re-issuing with a new date keeps the hand-edited FYP.
    expect(issuePolicy(db, policy.id, { issuedDate: d(5, 2) })).toMatchObject({
      issuedDate: d(5, 2),
      issuedFyp: 280 * MILLION,
    });
    expect(listPolicies(db)).toHaveLength(1);
  });

  it('refuses a FYP that is not positive and an issue before submission', async () => {
    const { db, re, customer, tl, submit } = await withCustomer();
    const base = {
      customerId: customer.id,
      reId: re.id,
      submittedDate: d(31, 1),
      submittedFyp: MILLION,
    };

    expect(codeOf(() => submitPolicy(db, { ...base, submittedFyp: 0 }))).toBe('INVALID_AMOUNT');
    expect(codeOf(() => submitPolicy(db, { ...base, submittedFyp: 1.5 }))).toBe('INVALID_AMOUNT');
    expect(codeOf(() => submitPolicy(db, { ...base, reId: tl.id }))).toBe('RE_REQUIRED');
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

  it('updates any field but keeps the issued date and FYP together', async () => {
    const { db, otherRe, submit } = await withCustomer();
    const { id } = submit();

    expect(codeOf(() => updatePolicy(db, id, { issuedDate: d(2, 2) }))).toBe('ISSUE_INCOMPLETE');
    expect(codeOf(() => updatePolicy(db, id, { issuedFyp: MILLION }))).toBe('ISSUE_INCOMPLETE');

    const updated = updatePolicy(db, id, {
      reId: otherRe.id,
      submittedDate: d(30, 1),
      submittedFyp: 2 * MILLION,
      issuedDate: d(3, 2),
      issuedFyp: MILLION,
    });
    expect(updated).toMatchObject({
      reId: otherRe.id,
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
    const { db, re, customer, persist } = await withCustomer();
    const today = d(26, 9);
    const tomorrow = d(27, 9);
    const base = { customerId: customer.id, reId: re.id, submittedFyp: MILLION };
    persist.mockClear();

    expect(codeOf(() => submitPolicy(db, { ...base, submittedDate: tomorrow }))).toBe(
      'DATE_IN_FUTURE',
    );
    expect(listPolicies(db)).toEqual([]);
    expect(persist).not.toHaveBeenCalled();

    const { id } = submitPolicy(db, { ...base, submittedDate: today });
    expect(codeOf(() => issuePolicy(db, id, { issuedDate: tomorrow }))).toBe('DATE_IN_FUTURE');
    expect(codeOf(() => updatePolicy(db, id, { submittedDate: tomorrow }))).toBe('DATE_IN_FUTURE');
    expect(getPolicy(db, id)).toMatchObject({ submittedDate: today, issuedDate: null });
    expect(issuePolicy(db, id, { issuedDate: today }).issuedDate).toEqual(today);
  });

  it('hides deleted policies and those of deleted customers', async () => {
    const { db, customer, submit } = await withCustomer();
    const kept = submit();
    const { id } = submit();

    softDeletePolicy(db, id);
    expect(listPolicies(db).map((p) => p.id)).toEqual([kept.id]);
    expect(getPolicy(db, id)).toBeUndefined();
    expect(codeOf(() => softDeletePolicy(db, id))).toBe('POLICY_NOT_FOUND');

    restorePolicy(db, id);
    expect(getPolicy(db, id)?.id).toBe(id);
    expect(codeOf(() => restorePolicy(db, 'x'))).toBe('POLICY_NOT_FOUND');

    softDeleteCustomer(db, customer.id);
    expect(listPolicies(db)).toEqual([]);
    expect(getPolicy(db, id)).toBeUndefined();
    expect(codeOf(() => restorePolicy(db, id))).toBe('CUSTOMER_NOT_FOUND');
  });
});
