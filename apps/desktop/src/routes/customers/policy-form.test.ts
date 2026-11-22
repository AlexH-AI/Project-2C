import { describe, expect, it } from 'vitest';
import { calendarDate, periodOf, policyMetrics, type Appointment, type Policy } from '@p2c/domain';
import {
  cancelChange,
  effectText,
  expectedCaseSize,
  openDraft,
  policyChange,
  policyStatusText,
  readCancelledDate,
  readFyp,
  readPolicy,
  type Effect,
  type PolicyDraft,
} from './policy-form';

const d = (day: number, month: number, year = 2026) => calendarDate(year, month, day);
const TODAY = d(26, 9);
const MILLION = 1_000_000;

describe('effectText', () => {
  const down: Effect = { kind: 'fyp', metric: 'issued', year: 2026, month: 9, diff: -14_500_000 };

  it('names the metric, the month and the RM of the policy', () => {
    expect(effectText(down, 'Đỗ Khánh Linh')).toBe(
      'FYP phát hành tháng 09/2026 của RM Đỗ Khánh Linh giảm 14.5 tr',
    );
    expect(effectText({ ...down, diff: 2 * MILLION }, 'Linh')).toMatch(/của RM Linh tăng 2 tr$/);
    expect(effectText({ ...down, metric: 'submitted' }, 'Linh')).toMatch(/^FYP nộp tháng 09\/2026/);
  });

  it('never shows an empty RM name, e.g. when the RM was deleted', () => {
    for (const name of [undefined, '', '  ']) {
      expect(effectText(down, name)).toMatch(/^FYP phát hành tháng \S+ giảm 14\.5 tr$/);
    }
  });

  // G3 T-284, mockup 8d "dời tháng": the months with their years, as the FYP lines name them.
  it('moves the policy from the count of one month to that of another, without the RM', () => {
    const moved: Effect = { kind: 'count', metric: 'submitted', from: d(20, 8), to: d(1, 9) };
    expect(effectText(moved, 'Đỗ Khánh Linh')).toBe(
      'tháng 08/2026: −1 HĐ nộp · tháng 09/2026: +1 HĐ nộp',
    );
    expect(effectText({ ...moved, metric: 'issued', from: d(31, 12, 2025) }, undefined)).toBe(
      'tháng 12/2025: −1 HĐ phát hành · tháng 09/2026: +1 HĐ phát hành',
    );
  });
});

// One text for the status of a policy: the badges of the Hợp đồng card and of Thùng rác, the
// names of their buttons, the subtitle of 8d (review of PR 748).
describe('policyStatusText', () => {
  it('words a policy submitted, then issued, as its badge does', () => {
    expect(policyStatusText({ issuedDate: null, cancelledDate: null })).toBe('Đã nộp');
    expect(policyStatusText({ issuedDate: d(18, 9), cancelledDate: null })).toBe('Đã phát hành');
  });

  // B2, mockup huy-hd.html #row: the red badge says the day.
  it('words a cancelled policy with its cancellation day', () => {
    expect(policyStatusText({ issuedDate: d(18, 9), cancelledDate: d(22, 9) })).toBe(
      'Đã hủy 22/09/2026',
    );
  });
});

describe('readFyp', () => {
  it('reads a positive amount the way the money field does', () => {
    expect(readFyp('500tr')).toEqual({ ok: true, amount: 500 * MILLION });
    expect(readFyp('385.5tr')).toEqual({ ok: true, amount: 385_500_000 });
    // The FYP as a dialog fills it reads back (formatAmount).
    expect(readFyp('500,000,000 VNĐ')).toEqual({ ok: true, amount: 500 * MILLION });
  });

  it('refuses nothing, zero, a negative amount and words (mockup 8c)', () => {
    expect(readFyp(' ')).toEqual({ ok: false, error: 'empty', suggestions: [] });
    expect(readFyp('0')).toEqual({ ok: false, error: 'zero', suggestions: [] });
    expect(readFyp('-50tr')).toEqual({ ok: false, error: 'negative', suggestions: [] });
    expect(readFyp('năm trăm')).toEqual({ ok: false, error: 'format', suggestions: [] });
  });

  // ADR-0018 §5: a way of typing the rule does not read is refused, with ways of writing to offer.
  it('refuses the marks of today, with the ways of writing to offer', () => {
    expect(readFyp('1,2 tỷ')).toEqual({ ok: false, error: 'format', suggestions: ['1.2 tỷ'] });
    expect(readFyp('1.500 tr')).toEqual({
      ok: false,
      error: 'ambiguous',
      suggestions: ['1.5 tr', '1,500 tr'],
    });
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
      cancelledDate: null,
    });
  });

  it('gives the issued day and FYP, and how many days after the submission it came', () => {
    const read = readPolicy({ ...issued, issued: { date: '18/9', fyp: '385.5tr' } }, TODAY);
    expect(read.policy).toMatchObject({ issuedDate: d(18, 9), issuedFyp: 385_500_000 });
    expect(read.issuedDate).toEqual({ ok: true, date: d(18, 9), daysAfter: 29 });
  });

  it('refuses an issue day before the submission (mockup 8c)', () => {
    const read = readPolicy({ ...issued, issued: { date: '15/8', fyp: '0' } }, TODAY);
    expect(read.policy).toBeNull();
    expect(read.issuedDate).toEqual({ ok: false, error: 'beforeSubmitted', date: d(15, 8) });
    expect(read.issuedFyp).toEqual({ ok: false, error: 'zero', suggestions: [] });
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
    rmId: 'rm',
    submittedDate: d(20, 12),
    submittedFyp: 400 * MILLION,
    issuedDate: null,
    issuedFyp: null,
    cancelledDate: null,
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
      cancelledDate: null,
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
      cancelledDate: null,
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
    rmId: 'rm',
    submittedDate: d(20, 8),
    submittedFyp: 400 * MILLION,
    issuedDate: d(18, 9),
    issuedFyp: 400 * MILLION,
    cancelledDate: null,
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
    expect(change({ date: '18/9', fyp: '385.5tr' }).fromSubmitted).toBe(-14_500_000);
    expect(change({ date: '18/9', fyp: '385.5tr' }, { submittedFyp: '390tr' }).fromSubmitted).toBe(
      -4_500_000,
    );
    expect(change({ date: '18/9', fyp: '400tr' }).fromSubmitted).toBe(0);
    expect(change({ date: '18/9', fyp: 'x' }).fromSubmitted).toBeNull();
    expect(change({ date: '18/9', fyp: '400tr' }, { submittedFyp: '' }).fromSubmitted).toBeNull();
  });

  const fyp = (metric: Effect['metric'], month: number, diff: number, year = 2026): Effect => ({
    kind: 'fyp',
    metric,
    year,
    month,
    diff,
  });

  it('measures the effect on the month from the saved issued FYP (mockup 8d)', () => {
    expect(change({ date: '18/9', fyp: '385.5tr' }).effects).toEqual([
      fyp('issued', 9, -14_500_000),
    ]);
    const saved = { ...policy, issuedFyp: 390 * MILLION };
    expect(change({ date: '18/9', fyp: '385.5tr' }, {}, saved).effects).toEqual([
      fyp('issued', 9, -4_500_000),
    ]);
  });

  it('has no effect when no month gains or loses, or while a field is wrong', () => {
    expect(change({ date: '19/9', fyp: '400tr' }, { submittedDate: '21/8' }).effects).toEqual([]);
    expect(change({ date: '18/9', fyp: '0' }).effects).toEqual([]);
  });

  // DR6-41; G3 T-284 (mockup 8d "dời tháng"): the policy leaves the count of the old month for that
  // of the new one, a line right after the FYP lines of its metric.
  it('takes the FYP and the policy out of the old month and puts them in the new one', () => {
    expect(change({ date: '25/8', fyp: '410tr' }).effects).toEqual([
      fyp('issued', 9, -400 * MILLION),
      fyp('issued', 8, 410 * MILLION),
      { kind: 'count', metric: 'issued', from: d(18, 9), to: d(25, 8) },
    ]);
    expect(change({ date: '18/9', fyp: '400tr' }, { submittedDate: '1/9' }).effects).toEqual([
      fyp('submitted', 8, -400 * MILLION),
      fyp('submitted', 9, 400 * MILLION),
      { kind: 'count', metric: 'submitted', from: d(20, 8), to: d(1, 9) },
    ]);
    // The same month of another year is another month.
    expect(change({ date: '18/9', fyp: '400tr' }, { submittedDate: '20/8/2025' }).effects).toEqual([
      fyp('submitted', 8, -400 * MILLION),
      fyp('submitted', 8, 400 * MILLION, 2025),
      { kind: 'count', metric: 'submitted', from: d(20, 8), to: d(20, 8, 2025) },
    ]);
  });

  it('moves the policy in both counts when both days move to another month, each after its FYP', () => {
    expect(
      change({ date: '20/8', fyp: '400tr' }, { submittedDate: '10/7' }).effects.map(
        (effect) => `${effect.kind} ${effect.metric}`,
      ),
    ).toEqual([
      'fyp submitted',
      'fyp submitted',
      'count submitted',
      'fyp issued',
      'fyp issued',
      'count issued',
    ]);
  });

  it('counts only the submitted FYP of a policy not issued', () => {
    const notIssued = { ...policy, issuedDate: null, issuedFyp: null };
    const read = readPolicy({ submittedDate: '20/8', submittedFyp: '450tr', issued: null }, TODAY);
    expect(policyChange(notIssued, read)).toEqual({
      fromSubmitted: null,
      effects: [fyp('submitted', 8, 50 * MILLION)],
      note: null,
    });
  });
});

// B2 (mockup huy-hd.html #cancel, #effect, #edit; golden chi-so.md mục 4.4): what cancelling,
// undoing or moving a cancellation does to the metrics, as `policyMetrics` counts them.
describe('cancellations', () => {
  const issuedPolicy: Policy = {
    id: 'p',
    customerId: 'c',
    rmId: 'rm',
    submittedDate: d(20, 8),
    submittedFyp: 60 * MILLION,
    issuedDate: d(25, 8),
    issuedFyp: 60 * MILLION,
    cancelledDate: null,
  };
  const cancelled: Policy = { ...issuedPolicy, cancelledDate: d(10, 9) };
  const words = (effects: readonly Effect[]) => effects.map((effect) => effectText(effect, 'Linh'));
  const opened = openDraft({ kind: 'edit', policy: cancelled }, TODAY);
  const read = (changes: Partial<PolicyDraft>) =>
    readPolicy({ ...opened.draft, ...changes }, TODAY, opened);
  const edit = (changes: Partial<PolicyDraft>) => policyChange(cancelled, read(changes));

  it('reads the day of the cancel dialog: on or after the issue, today at the latest', () => {
    expect(readCancelledDate('25/8', TODAY, d(25, 8))).toEqual({
      ok: true,
      date: d(25, 8),
      daysAfter: 0,
    });
    expect(readCancelledDate('24/8', TODAY, d(25, 8))).toEqual({
      ok: false,
      error: 'beforeIssued',
      date: d(24, 8),
      issued: d(25, 8),
    });
    expect(readCancelledDate('27/9', TODAY, d(25, 8))).toEqual({ ok: false, error: 'future' });
  });

  it('takes the FYP off the revenue of the month of the cancellation, the issue month unchanged', () => {
    const change = cancelChange(issuedPolicy, d(10, 9));
    expect(words(change.effects)).toEqual([
      'Doanh số tháng 09/2026 của RM Linh giảm 60 tr',
      'tháng 09/2026: +1 HĐ hủy',
    ]);
    expect(change.note).toBe(
      'HĐ phát hành tháng 08/2026 vẫn tính phát hành vào tháng 08/2026: số của tháng đó không đổi.',
    );
    expect(cancelChange(issuedPolicy, d(31, 8)).note).toBe(
      'HĐ phát hành và FYP phát hành của ngày 25/08/2026 giữ nguyên.',
    );
  });

  it('gives the numbers the metrics change by, among the other policies of the month', () => {
    const others: Policy[] = [
      { ...issuedPolicy, id: 'q', issuedDate: d(2, 9), issuedFyp: 90 * MILLION },
      { ...issuedPolicy, id: 'r', rmId: 'other', issuedDate: d(3, 9), cancelledDate: d(5, 9) },
    ];
    const day = d(10, 9);
    const metrics = (policy: Policy) =>
      policyMetrics({ people: [], policies: [...others, policy] }, periodOf('month', day), {
        kind: 'rm',
        rmId: 'rm',
      });
    const before = metrics(issuedPolicy);
    const after = metrics({ ...issuedPolicy, cancelledDate: day });
    expect(cancelChange(issuedPolicy, day).effects).toEqual([
      {
        kind: 'fyp',
        metric: 'revenue',
        year: 2026,
        month: 9,
        diff: after.revenue - before.revenue,
      },
      {
        kind: 'tally',
        metric: 'cancelled',
        date: day,
        diff: after.cancelledCount - before.cancelledCount,
      },
    ]);
  });

  it('undoes: the revenue comes back, one cancellation less, no trace kept', () => {
    const change = edit({ cancelled: null });
    expect(words(change.effects)).toEqual([
      'Doanh số tháng 09/2026 của RM Linh tăng 60 tr',
      'tháng 09/2026: −1 HĐ hủy',
    ]);
    expect(change.note).toBe('HĐ trở lại Đã phát hành. App không giữ dấu vết lần hủy này.');
    expect(edit({})).toEqual({ fromSubmitted: 0, effects: [], note: null });
  });

  it('moves the cancellation to another month, or within its month', () => {
    expect(words(edit({ cancelled: '30/8' }).effects)).toEqual([
      'Doanh số tháng 09/2026 của RM Linh tăng 60 tr',
      'Doanh số tháng 08/2026 của RM Linh giảm 60 tr',
      'tháng 09/2026: −1 HĐ hủy · tháng 08/2026: +1 HĐ hủy',
    ]);
    const within = edit({ cancelled: '20/9' });
    expect(words(within.effects)).toEqual([
      'HĐ hủy chuyển từ ngày 10/09/2026 sang ngày 20/09/2026',
    ]);
    expect(within.note).toBe('Số của tháng 09/2026 không đổi; số theo ngày và theo tuần đổi theo.');
  });

  it('moves the cancelled FYP with the issued one: the month of the issue and of the cancellation', () => {
    expect(words(edit({ issued: { date: '25/8', fyp: '45tr' } }).effects)).toEqual([
      'FYP phát hành tháng 08/2026 của RM Linh giảm 15 tr',
      'FYP hủy tháng 09/2026 của RM Linh giảm 15 tr',
      'Doanh số tháng 09/2026 của RM Linh tăng 15 tr',
      'Doanh số tháng 08/2026 của RM Linh giảm 15 tr',
    ]);
  });

  // Golden mục 4.4 point 5: one field carries the refusal.
  it('refuses an issue after the cancellation or none, and a cancellation before the issue', () => {
    expect(read({ issued: { date: '12/9', fyp: '60tr' } })).toMatchObject({
      issuedDate: { ok: false, error: 'afterCancelled', date: d(12, 9), cancelled: d(10, 9) },
      cancelledDate: { ok: true, date: d(10, 9) },
      policy: null,
    });
    expect(read({ issued: { date: ' ', fyp: '60tr' } })).toMatchObject({
      issuedDate: { ok: false, error: 'cancelled' },
      policy: null,
    });
    expect(read({ cancelled: '20/8' })).toMatchObject({
      issuedDate: { ok: true, date: d(25, 8) },
      cancelledDate: { ok: false, error: 'beforeIssued', date: d(20, 8), issued: d(25, 8) },
      policy: null,
    });
    expect(read({ cancelled: '27/9' }).cancelledDate).toEqual({ ok: false, error: 'future' });
    expect(read({}).policy).toMatchObject({ cancelledDate: d(10, 9) });
    // Undone in the same save, the issue may move past the old day (B1a).
    expect(read({ cancelled: null, issued: { date: '12/9', fyp: '60tr' } }).policy).toMatchObject({
      issuedDate: d(12, 9),
      cancelledDate: null,
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
