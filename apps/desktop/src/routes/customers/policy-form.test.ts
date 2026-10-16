import { describe, expect, it } from 'vitest';
import { calendarDate, type Appointment, type Policy } from '@p2c/domain';
import {
  effectText,
  expectedCaseSize,
  openDraft,
  policyChange,
  readFyp,
  readPolicy,
  type Effect,
  type PolicyDraft,
} from './policy-form';

const d = (day: number, month: number, year = 2026) => calendarDate(year, month, day);
const TODAY = d(26, 9);
const MILLION = 1_000_000;

describe('effectText', () => {
  const down: Effect = { metric: 'issued', year: 2026, month: 9, diff: -14_500_000 };

  it('names the metric, the month and the RE of the policy', () => {
    expect(effectText(down, 'Đỗ Khánh Linh')).toBe(
      'FYP phát hành tháng 09/2026 của RE Đỗ Khánh Linh giảm 14,5 tr',
    );
    expect(effectText({ ...down, diff: 2 * MILLION }, 'Linh')).toMatch(/của RE Linh tăng 2 tr$/);
    expect(effectText({ ...down, metric: 'submitted' }, 'Linh')).toMatch(/^FYP nộp tháng 09\/2026/);
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

  it('allows the issue on the day of the submission, not the day before', () => {
    const read = readPolicy({ ...issued, issued: { date: '20/8', fyp: '400tr' } }, TODAY);
    expect(read.issuedDate).toEqual({ ok: true, date: d(20, 8), daysAfter: 0 });
    expect(readPolicy({ ...issued, issued: { date: '19/8', fyp: '400tr' } }, TODAY)).toMatchObject({
      issuedDate: { ok: false, error: 'beforeSubmitted', date: d(19, 8) },
      policy: null,
    });
  });

  it('gives no policy while the issued FYP is wrong, even with a right issue day', () => {
    const read = readPolicy({ ...issued, issued: { date: '18/9', fyp: '0' } }, TODAY);
    expect(read.issuedDate).toEqual({ ok: true, date: d(18, 9), daysAfter: 29 });
    expect(read.policy).toBeNull();
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

// DR6-38: a dialog opened on 31/12 and saved after midnight.
describe('openDraft and readPolicy across New Year', () => {
  const OPENED = d(31, 12);
  const NEXT_YEAR = d(1, 1, 2027);
  const policy: Policy = {
    id: 'p',
    customerId: 'c',
    reId: 're',
    submittedDate: d(20, 12),
    submittedFyp: 400 * MILLION,
    issuedDate: null,
    issuedFyp: null,
  };

  it('issues on the day filled in and keeps the submission day it does not show (8b)', () => {
    const opened = openDraft({ kind: 'issue', policy }, OPENED);
    expect(opened.draft).toMatchObject({ submittedDate: '20/12', issued: { date: '31/12' } });
    const read = readPolicy(opened.draft, NEXT_YEAR, opened);
    expect(read.submittedDate).toEqual({ ok: true, date: d(20, 12) });
    expect(read.policy).toEqual({
      submittedDate: d(20, 12),
      submittedFyp: 400 * MILLION,
      issuedDate: d(31, 12),
      issuedFyp: 400 * MILLION,
    });
  });

  it('keeps the saved days of an edit (8d) and the day of a new one (8a)', () => {
    const saved = { ...policy, issuedDate: d(28, 12), issuedFyp: 380 * MILLION };
    const edit = openDraft({ kind: 'edit', policy: saved }, OPENED);
    expect(readPolicy(edit.draft, NEXT_YEAR, edit).policy).toEqual({
      submittedDate: d(20, 12),
      submittedFyp: 400 * MILLION,
      issuedDate: d(28, 12),
      issuedFyp: 380 * MILLION,
    });
    const fresh = openDraft({ kind: 'new' }, OPENED);
    const draft = { ...fresh.draft, submittedFyp: '1tr' };
    expect(readPolicy(draft, NEXT_YEAR, fresh).submittedDate).toEqual({ ok: true, date: OPENED });
  });

  it('reads a day typed over the filled-in one against today', () => {
    const opened = openDraft({ kind: 'issue', policy }, OPENED);
    const draft = { ...opened.draft, issued: { date: '1/1', fyp: '400tr' } };
    expect(readPolicy(draft, NEXT_YEAR, opened).issuedDate).toEqual({
      ok: true,
      date: NEXT_YEAR,
      daysAfter: 12,
    });
    expect(readPolicy(opened.draft, NEXT_YEAR).submittedDate).toEqual({
      ok: false,
      error: 'future',
    });
  });
});

describe('policyChange', () => {
  const policy: Policy = {
    id: 'p',
    customerId: 'c',
    reId: 're',
    submittedDate: d(20, 8),
    submittedFyp: 400 * MILLION,
    issuedDate: d(18, 9),
    issuedFyp: 400 * MILLION,
  };
  const change = (
    issued: { date: string; fyp: string },
    submitted: Partial<PolicyDraft> = {},
    saved = policy,
  ) =>
    policyChange(
      saved,
      readPolicy({ submittedDate: '20/8', submittedFyp: '400tr', issued, ...submitted }, TODAY),
    );

  it('tells how far the issued FYP is from the submitted one, both as typed (DR6-40)', () => {
    expect(change({ date: '18/9', fyp: '385,5tr' }).fromSubmitted).toBe(-14_500_000);
    expect(change({ date: '18/9', fyp: '385,5tr' }, { submittedFyp: '390tr' }).fromSubmitted).toBe(
      -4_500_000,
    );
    expect(change({ date: '18/9', fyp: '400tr' }).fromSubmitted).toBe(0);
    expect(change({ date: '18/9', fyp: 'x' }).fromSubmitted).toBeNull();
    expect(change({ date: '18/9', fyp: '400tr' }, { submittedFyp: '' }).fromSubmitted).toBeNull();
  });

  it('measures the effect on the month from the saved issued FYP (mockup 8d)', () => {
    expect(change({ date: '18/9', fyp: '385,5tr' }).effects).toEqual([
      { metric: 'issued', year: 2026, month: 9, diff: -14_500_000 },
    ]);
    const saved = { ...policy, issuedFyp: 390 * MILLION };
    expect(change({ date: '18/9', fyp: '385,5tr' }, {}, saved).effects).toEqual([
      { metric: 'issued', year: 2026, month: 9, diff: -4_500_000 },
    ]);
  });

  it('has no effect when no month gains or loses, or while a field is wrong', () => {
    expect(change({ date: '19/9', fyp: '400tr' }, { submittedDate: '21/8' }).effects).toEqual([]);
    expect(change({ date: '18/9', fyp: '0' }).effects).toEqual([]);
  });

  it('takes the FYP out of the old month and puts it in the new one (DR6-41)', () => {
    expect(change({ date: '25/8', fyp: '410tr' }).effects).toEqual([
      { metric: 'issued', year: 2026, month: 9, diff: -400 * MILLION },
      { metric: 'issued', year: 2026, month: 8, diff: 410 * MILLION },
    ]);
    expect(change({ date: '18/9', fyp: '400tr' }, { submittedDate: '2/9' }).effects).toEqual([
      { metric: 'submitted', year: 2026, month: 8, diff: -400 * MILLION },
      { metric: 'submitted', year: 2026, month: 9, diff: 400 * MILLION },
    ]);
    // The same month of another year is another month.
    expect(change({ date: '18/9', fyp: '400tr' }, { submittedDate: '20/8/2025' }).effects).toEqual([
      { metric: 'submitted', year: 2026, month: 8, diff: -400 * MILLION },
      { metric: 'submitted', year: 2025, month: 8, diff: 400 * MILLION },
    ]);
  });

  it('counts only the submitted FYP of a policy not issued', () => {
    const notIssued = { ...policy, issuedDate: null, issuedFyp: null };
    const read = readPolicy({ submittedDate: '20/8', submittedFyp: '450tr', issued: null }, TODAY);
    expect(policyChange(notIssued, read)).toEqual({
      fromSubmitted: null,
      effects: [{ metric: 'submitted', year: 2026, month: 8, diff: 50 * MILLION }],
    });
  });
});

describe('expectedCaseSize', () => {
  const met = (day: number, size: number | null, status: Appointment['status'] = 'MET') => ({
    date: d(day, 9),
    time: null,
    status,
    expectedCaseSize: size,
  });

  // §9 Q8 (a): the label says the latest meeting, so an older estimate never stands in for it.
  it('takes the case size of the latest met meeting, none when that one has none', () => {
    const list = [met(10, 600 * MILLION), met(1, 800 * MILLION), met(12, null, 'CANCELLED')];
    expect(expectedCaseSize(list)).toBe(600 * MILLION);
    expect(expectedCaseSize([...list, met(11, null)])).toBeNull();
    expect(expectedCaseSize([])).toBeNull();
  });

  // DR-24: two meetings on one day are told apart by the hour, the later one being the latest.
  it('takes the later meeting of the same day, an untimed one counting as the earliest', () => {
    const at = (time: string | null, size: number) => ({ ...met(5, size * MILLION), time });

    expect(expectedCaseSize([at('09:00', 100), at('16:00', 900)])).toBe(900 * MILLION);
    expect(expectedCaseSize([at('16:00', 900), at('09:00', 100)])).toBe(900 * MILLION);
    expect(expectedCaseSize([at('09:00', 100), at(null, 300)])).toBe(100 * MILLION);
    // Same day and hour: the one listed last, as `listAppointments` lists them in the order made.
    expect(expectedCaseSize([at('09:00', 100), at('09:00', 200)])).toBe(200 * MILLION);
  });
});
