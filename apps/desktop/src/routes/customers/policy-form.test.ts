import { describe, expect, it } from 'vitest';
import { calendarDate, type Appointment, type Policy } from '@p2c/domain';
import {
  effectText,
  expectedCaseSize,
  issuedChange,
  readFyp,
  readPolicy,
  type PolicyDraft,
} from './policy-form';

const d = (day: number, month: number, year = 2026) => calendarDate(year, month, day);
const TODAY = d(26, 9);
const MILLION = 1_000_000;

describe('effectText', () => {
  const down = { year: 2026, month: 9, diff: -14_500_000 };

  it('names the RE of the policy', () => {
    expect(effectText(down, 'Đỗ Khánh Linh')).toMatch(
      /^FYP phát hành tháng \S+ của RE Đỗ Khánh Linh giảm 14,5 tr$/,
    );
    expect(effectText({ ...down, diff: 2 * MILLION }, 'Linh')).toMatch(/của RE Linh tăng 2 tr$/);
  });

  it('never shows an empty RE name, e.g. when the RE was deleted', () => {
    for (const name of [undefined, '', '  ']) {
      expect(effectText(down, name)).toMatch(/^FYP phát hành tháng \S+ giảm 14,5 tr$/);
    }
  });
});

describe('readFyp', () => {
  it('reads a positive amount the way the money field does', () => {
    expect(readFyp('500tr')).toEqual({ ok: true, amount: 500 * MILLION });
    expect(readFyp('385,5tr')).toEqual({ ok: true, amount: 385_500_000 });
    expect(readFyp('500.000.000 ₫')).toEqual({ ok: true, amount: 500 * MILLION });
  });

  it('refuses nothing, zero, a negative amount and words (mockup 8c)', () => {
    expect(readFyp(' ')).toEqual({ ok: false, error: 'empty' });
    expect(readFyp('0')).toEqual({ ok: false, error: 'zero' });
    expect(readFyp('-50tr')).toEqual({ ok: false, error: 'negative' });
    expect(readFyp('năm trăm')).toEqual({ ok: false, error: 'format' });
  });
});

const submitted: PolicyDraft = { submittedDate: '20/8', submittedFyp: '400tr', issued: null };
const issued: PolicyDraft = { ...submitted, issued: { date: '18/9', fyp: '400tr' } };

describe('readPolicy', () => {
  it('gives the submitted policy, not issued', () => {
    const read = readPolicy(submitted, TODAY);
    expect(read.policy).toEqual({
      submittedDate: d(20, 8),
      submittedFyp: 400 * MILLION,
      issuedDate: null,
      issuedFyp: null,
    });
  });

  it('gives the issued day and FYP, and how many days after the submission it came', () => {
    const read = readPolicy({ ...issued, issued: { date: '18/9', fyp: '385,5tr' } }, TODAY);
    expect(read.policy).toMatchObject({ issuedDate: d(18, 9), issuedFyp: 385_500_000 });
    expect(read.issuedDate).toEqual({ ok: true, date: d(18, 9), daysAfter: 29 });
  });

  it('refuses an issue day before the submission (mockup 8c)', () => {
    const read = readPolicy({ ...issued, issued: { date: '15/8', fyp: '0' } }, TODAY);
    expect(read.policy).toBeNull();
    expect(read.issuedDate).toEqual({ ok: false, error: 'beforeSubmitted', date: d(15, 8) });
    expect(read.issuedFyp).toEqual({ ok: false, error: 'zero' });
  });

  it('allows the issue on the day of the submission', () => {
    const read = readPolicy({ ...issued, issued: { date: '20/8', fyp: '400tr' } }, TODAY);
    expect(read.issuedDate).toEqual({ ok: true, date: d(20, 8), daysAfter: 0 });
  });

  it('refuses a day after today and a day that does not exist', () => {
    const read = readPolicy(
      { ...issued, submittedDate: '27/9', issued: { date: '31/9', fyp: '1tr' } },
      TODAY,
    );
    expect(read.submittedDate).toEqual({ ok: false, error: 'future' });
    expect(read.issuedDate).toEqual({ ok: false, error: 'invalid-date' });
    expect(read.policy).toBeNull();
  });

  it('does not compare with a submission day it cannot read', () => {
    const read = readPolicy({ ...issued, submittedDate: 'x' }, TODAY);
    expect(read.issuedDate).toEqual({ ok: true, date: d(18, 9), daysAfter: null });
  });
});

describe('issuedChange', () => {
  const policy: Policy = {
    id: 'p',
    customerId: 'c',
    reId: 're',
    submittedDate: d(20, 8),
    submittedFyp: 400 * MILLION,
    issuedDate: d(18, 9),
    issuedFyp: 400 * MILLION,
  };

  it('tells how far the issued FYP now is from the submitted one and from the saved one', () => {
    expect(issuedChange(policy, { issuedDate: d(18, 9), issuedFyp: 385_500_000 })).toEqual({
      fromSubmitted: -14_500_000,
      metric: { year: 2026, month: 9, diff: -14_500_000 },
    });
  });

  it('leaves out the effect on the month when the FYP stays or the issue month moves', () => {
    expect(issuedChange(policy, { issuedDate: d(19, 9), issuedFyp: 400 * MILLION })).toEqual({
      fromSubmitted: 0,
      metric: null,
    });
    expect(issuedChange(policy, { issuedDate: d(1, 10), issuedFyp: 410 * MILLION })).toEqual({
      fromSubmitted: 10 * MILLION,
      metric: null,
    });
  });
});

describe('expectedCaseSize', () => {
  const met = (day: number, size: number | null, status: Appointment['status'] = 'MET') => ({
    date: d(day, 9),
    status,
    expectedCaseSize: size,
  });

  it('takes the case size of the latest met meeting that has one', () => {
    const list = [met(10, 600 * MILLION), met(1, 800 * MILLION), met(12, null)];
    expect(expectedCaseSize(list)).toBe(600 * MILLION);
    expect(expectedCaseSize([])).toBeNull();
  });
});
