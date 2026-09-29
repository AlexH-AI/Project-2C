import { describe, expect, it } from 'vitest';
import { calendarDate, type Appointment } from '@p2c/domain';
import { expectedCaseSize, readFyp, readPolicy, type PolicyDraft } from './policy-form';

const d = (day: number, month: number, year = 2026) => calendarDate(year, month, day);
const TODAY = d(26, 9);
const MILLION = 1_000_000;

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
