import type { AppointmentRecord } from '@p2c/db';
import {
  addMoney,
  calendarDate,
  compareDates,
  daysBetween,
  formatDate,
  formatPeriodValue,
  periodOf,
  policyMetrics,
  type CalendarDate,
  type Money,
  type MoneyParseError,
  type Policy,
  type Scope,
} from '@p2c/domain';
import { t } from '../../i18n';
import { dayText } from '../appointments/appointment-form';
import { parseRecordDate, type RecordDateResult } from './customers-view';
import { formatAmount, formatAmountCompact, readMoney } from '../money-view';

export type FypResult =
  | { readonly ok: true; readonly amount: Money }
  | {
      readonly ok: false;
      readonly error: MoneyParseError | 'zero';
      /** Ways of writing the text that read, for the field to offer (ADR-0018 §5). */
      readonly suggestions: readonly string[];
    };

/** An FYP as typed (`500tr`, `1.2 tỷ`), read as every money field: more than 0 (spec §3.7). */
export function readFyp(text: string): FypResult {
  const parsed = readMoney(text);
  if (parsed.ok && parsed.amount <= 0) return { ok: false, error: 'zero', suggestions: [] };
  return parsed;
}

export type IssuedDateResult =
  | {
      readonly ok: true;
      readonly date: CalendarDate;
      /** Days since the submission; null while the submission day is not readable. */
      readonly daysAfter: number | null;
    }
  | { readonly ok: false; readonly error: 'beforeSubmitted'; readonly date: CalendarDate }
  /** A policy that stays cancelled keeps an issue on or before the day (golden mục 4.4 point 5). */
  | {
      readonly ok: false;
      readonly error: 'afterCancelled';
      readonly date: CalendarDate;
      readonly cancelled: CalendarDate;
    }
  | { readonly ok: false; readonly error: 'cancelled' }
  | Extract<RecordDateResult, { ok: false }>;

export type CancelledDateResult =
  | {
      readonly ok: true;
      readonly date: CalendarDate;
      /** Days since the issue; null while the issue day is not readable. */
      readonly daysAfter: number | null;
    }
  | {
      readonly ok: false;
      readonly error: 'beforeIssued';
      readonly date: CalendarDate;
      readonly issued: CalendarDate;
    }
  | Extract<RecordDateResult, { ok: false }>;

/** A policy's status, read from its days (golden `docs/golden/chi-so.md` mục 4.4 point 1). */
export type PolicyStatus = 'submitted' | 'issued' | 'cancelled';

type PolicyDays = Pick<Policy, 'issuedDate' | 'cancelledDate'>;

export const policyStatus = ({ issuedDate, cancelledDate }: PolicyDays): PolicyStatus =>
  cancelledDate ? 'cancelled' : issuedDate ? 'issued' : 'submitted';

/**
 * A policy's status as its badge words it, wherever the status is said: the badges of the Hợp đồng
 * card and of Thùng rác, the names of their buttons, the subtitle of 8d; a cancelled one with its
 * day (mockup huy-hd.html #row).
 */
export const policyStatusText = (policy: PolicyDays): string =>
  policy.cancelledDate
    ? t('policyStatus.cancelled', { date: formatDate(policy.cancelledDate) })
    : t(policy.issuedDate === null ? 'policyStatus.submitted' : 'policyStatus.issued');

/** `new` submits a policy (8a), `issue` issues it (8b, 8c), `edit` changes or deletes it (8d). */
export type PolicyMode =
  { readonly kind: 'new' } | { readonly kind: 'issue' | 'edit'; readonly policy: Policy };

/** What a policy dialog holds; `issued` is null until the policy is issued (mockups 8a–8d). */
export interface PolicyDraft {
  readonly submittedDate: string;
  readonly submittedFyp: string;
  readonly issued: { readonly date: string; readonly fyp: string } | null;
  /** The cancellation day of a cancelled policy (8d of B2); none once "Bỏ hủy" took it out. */
  readonly cancelled?: string | null;
}

/** The draft a dialog opens with, and the day it opened on. */
export interface OpenedDraft {
  readonly draft: PolicyDraft;
  readonly on: CalendarDate;
}

export function openDraft(mode: PolicyMode, today: CalendarDate): OpenedDraft {
  if (mode.kind === 'new') {
    return {
      draft: { submittedDate: dayText(today, today), submittedFyp: '', issued: null },
      on: today,
    };
  }
  const { policy } = mode;
  const draft = {
    submittedDate: dayText(policy.submittedDate, today),
    submittedFyp: formatAmount(policy.submittedFyp),
    issued:
      mode.kind === 'issue'
        ? // The issued FYP starts as the submitted one (G2 D).
          {
            date: dayText(today, today),
            fyp: formatAmount(policy.issuedFyp ?? policy.submittedFyp),
          }
        : policy.issuedDate && policy.issuedFyp !== null
          ? { date: dayText(policy.issuedDate, today), fyp: formatAmount(policy.issuedFyp) }
          : null,
    cancelled:
      mode.kind === 'edit' && policy.cancelledDate ? dayText(policy.cancelledDate, today) : null,
  };
  return { draft, on: today };
}

/** The fields of dialogs 8a–8d, and the cancellation day of 8d (null: none, or undone). */
export type PolicyValues = Omit<Policy, 'id' | 'customerId' | 'rmId'>;

/**
 * Reads every field of the draft, and the policy when all of them are right. Days are today or
 * earlier; the issue comes on the submission day or later (spec §3.7). A day left as the dialog
 * `opened` with reads in the year it opened in, so one left open across New Year keeps the day it
 * showed (DR6-38).
 */
export function readPolicy(draft: PolicyDraft, today: CalendarDate, opened?: OpenedDraft) {
  const on = (text: string, filled: string | undefined) =>
    opened && text === filled ? opened.on : today;
  const submittedDate = parseRecordDate(
    draft.submittedDate,
    on(draft.submittedDate, opened?.draft.submittedDate),
  );
  const submittedFyp = readFyp(draft.submittedFyp);
  let issuedDate =
    draft.issued &&
    readIssuedDate(
      draft.issued.date,
      on(draft.issued.date, opened?.draft.issued?.date),
      submittedDate,
    );
  const issuedFyp = draft.issued && readFyp(draft.issued.fyp);
  let cancelledDate =
    draft.cancelled == null
      ? null
      : readCancelledDate(
          draft.cancelled,
          on(draft.cancelled, opened?.draft.cancelled ?? undefined),
          issuedDate?.ok ? issuedDate.date : null,
        );
  // A policy that stays cancelled keeps its issue (golden mục 4.4 point 5). An issue after the
  // cancellation is the fault of the field typed in: the issue day while the cancellation day
  // stands as opened, so one field carries it.
  if (cancelledDate && issuedDate && !issuedDate.ok && issuedDate.error === 'empty') {
    issuedDate = { ok: false, error: 'cancelled' };
  }
  if (
    issuedDate?.ok &&
    cancelledDate &&
    !cancelledDate.ok &&
    cancelledDate.error === 'beforeIssued' &&
    draft.cancelled === opened?.draft.cancelled
  ) {
    const { date: cancelled } = cancelledDate;
    issuedDate = { ok: false, error: 'afterCancelled', date: issuedDate.date, cancelled };
    cancelledDate = { ok: true, date: cancelled, daysAfter: null };
  }
  const policy: PolicyValues | null =
    submittedDate.ok &&
    submittedFyp.ok &&
    (issuedDate?.ok ?? true) &&
    (issuedFyp?.ok ?? true) &&
    (cancelledDate?.ok ?? true)
      ? {
          submittedDate: submittedDate.date,
          submittedFyp: submittedFyp.amount,
          issuedDate: issuedDate?.ok ? issuedDate.date : null,
          issuedFyp: issuedFyp?.ok ? issuedFyp.amount : null,
          cancelledDate: cancelledDate?.ok ? cancelledDate.date : null,
        }
      : null;
  return { submittedDate, submittedFyp, issuedDate, issuedFyp, cancelledDate, policy };
}

/**
 * The cancellation day as typed (mockup huy-hd.html #cancel): today or earlier, on or after the
 * issue day when there is one (golden mục 4.4 points 2, 3; G39).
 */
export function readCancelledDate(
  text: string,
  today: CalendarDate,
  issued: CalendarDate | null,
): CancelledDateResult {
  const parsed = parseRecordDate(text, today);
  if (!parsed.ok) return parsed;
  if (issued === null) return { ok: true, date: parsed.date, daysAfter: null };
  const daysAfter = daysBetween(issued, parsed.date);
  return daysAfter < 0
    ? { ok: false, error: 'beforeIssued', date: parsed.date, issued }
    : { ok: true, date: parsed.date, daysAfter };
}

export type PolicyRead = ReturnType<typeof readPolicy>;

function readIssuedDate(
  text: string,
  today: CalendarDate,
  submitted: RecordDateResult,
): IssuedDateResult {
  const parsed = parseRecordDate(text, today);
  if (!parsed.ok || !submitted.ok) return parsed.ok ? { ...parsed, daysAfter: null } : parsed;
  const daysAfter = daysBetween(submitted.date, parsed.date);
  return daysAfter < 0
    ? { ok: false, error: 'beforeSubmitted', date: parsed.date }
    : { ok: true, date: parsed.date, daysAfter };
}

/** A line of "Ảnh hưởng chỉ số" (8d): what an edit does to the metrics of the months. */
export type Effect =
  /** The FYP the policy's RM submitted, issued or cancelled in one month, or its Doanh số. */
  | {
      readonly kind: 'fyp';
      readonly metric: 'submitted' | 'issued' | 'cancelled' | 'revenue';
      readonly year: number;
      readonly month: number;
      readonly diff: Money;
    }
  /**
   * A day moved to another month: the policy leaves the count of policies submitted, issued or
   * cancelled of the month of `from` for that of `to` (mockup 8d "dời tháng", G3 T-284).
   */
  | {
      readonly kind: 'count';
      readonly metric: 'submitted' | 'issued' | 'cancelled';
      readonly from: CalendarDate;
      readonly to: CalendarDate;
    }
  /** One cancellation more or less in the month of `date` (mockup huy-hd.html #effect). */
  | {
      readonly kind: 'tally';
      readonly metric: 'cancelled';
      readonly date: CalendarDate;
      readonly diff: 1 | -1;
    }
  /** The cancellation moved within its month: no month's number changes (huy-hd.html #edit). */
  | {
      readonly kind: 'moved';
      readonly metric: 'cancelled';
      readonly from: CalendarDate;
      readonly to: CalendarDate;
    };

/**
 * Mockup 8d as the edit stands: how far the issued FYP is from the submitted one, both as typed
 * (DR6-40; null until both read), and "Ảnh hưởng chỉ số": what saving does to the FYP submitted
 * and issued of each month, and to the counts of the months a day moves between, from the saved
 * policy (none while a field is wrong).
 */
export function policyChange(saved: Policy, read: PolicyRead) {
  const submitted = read.submittedFyp.ok ? read.submittedFyp.amount : null;
  const issued = read.issuedFyp?.ok ? read.issuedFyp.amount : null;
  const next = read.policy && { ...saved, ...read.policy };
  const effects = next
    ? [
        ...monthEffects(
          'submitted',
          { date: saved.submittedDate, fyp: saved.submittedFyp },
          { date: next.submittedDate, fyp: next.submittedFyp },
        ),
        ...monthEffects(
          'issued',
          booked(saved.issuedDate, saved.issuedFyp),
          booked(next.issuedDate, next.issuedFyp),
        ),
        ...(saved.cancelledDate || next.cancelledDate ? cancellationEffects(saved, next) : []),
      ]
    : [];
  return {
    fromSubmitted: submitted !== null && issued !== null ? issued - submitted : null,
    effects,
    note: next && cancellationNote(saved, next),
  };
}

/** The "Ảnh hưởng chỉ số" of the cancel dialog (mockup huy-hd.html #cancel, #effect). */
export function cancelChange(policy: Policy, cancelledDate: CalendarDate) {
  const next = { ...policy, cancelledDate };
  return { effects: cancellationEffects(policy, next), note: cancellationNote(policy, next) };
}

const sameMonth = (a: CalendarDate, b: CalendarDate) => a.year === b.year && a.month === b.month;

/**
 * What a cancellation, its undoing or a change of it does to Doanh số, FYP hủy and HĐ hủy of the
 * policy's RM, month by month (mockup huy-hd.html #effect, #edit): the metrics of `domain` of the
 * policy before and after, never added up here. Months of the cancellation first, the old one
 * before the new one.
 */
function cancellationEffects(before: Policy, after: Policy): Effect[] {
  const scope: Scope = { kind: 'rm', rmId: before.rmId };
  const metricsOf = (policy: Policy, date: CalendarDate) =>
    policyMetrics({ people: [], policies: [policy] }, periodOf('month', date), scope);
  const months: CalendarDate[] = [];
  for (const day of [
    before.cancelledDate,
    after.cancelledDate,
    before.issuedDate,
    after.issuedDate,
  ]) {
    if (day && !months.some((month) => sameMonth(month, day))) months.push(day);
  }
  const diffs = months.map((date) => {
    const [was, now] = [metricsOf(before, date), metricsOf(after, date)];
    return {
      date,
      revenue: addMoney(now.revenue, -was.revenue),
      fyp: addMoney(now.cancelledFyp, -was.cancelledFyp),
      count: now.cancelledCount - was.cancelledCount,
    };
  });
  const line = (metric: 'cancelled' | 'revenue', date: CalendarDate, diff: Money): Effect => ({
    kind: 'fyp',
    metric,
    year: date.year,
    month: date.month,
    diff,
  });
  const effects = [
    // The cancelled FYP follows the issued one (golden mục 4.4 point 5).
    ...diffs
      .filter((d) => d.count === 0 && d.fyp !== 0)
      .map((d) => line('cancelled', d.date, d.fyp)),
    ...diffs.filter((d) => d.revenue !== 0).map((d) => line('revenue', d.date, d.revenue)),
  ];
  const gone = diffs.some((d) => d.count < 0);
  const come = diffs.some((d) => d.count > 0);
  const from = before.cancelledDate;
  const to = after.cancelledDate;
  if (gone && come && from && to) effects.push({ kind: 'count', metric: 'cancelled', from, to });
  else if (come && to) effects.push({ kind: 'tally', metric: 'cancelled', date: to, diff: 1 });
  else if (gone && from) effects.push({ kind: 'tally', metric: 'cancelled', date: from, diff: -1 });
  else if (from && to && compareDates(from, to) !== 0) {
    effects.push({ kind: 'moved', metric: 'cancelled', from, to });
  }
  return effects;
}

/** The small line under "Ảnh hưởng chỉ số": what stays as it was (mockup huy-hd.html). */
function cancellationNote(before: Policy, after: Policy): string | null {
  const { cancelledDate: from } = before;
  const { cancelledDate: to, issuedDate: issued } = after;
  if (from && !to) return t('policyForm.note.undone');
  if (!from && to && issued) {
    return sameMonth(issued, to)
      ? t('policyForm.note.sameMonth', { date: formatDate(issued) })
      : t('policyForm.note.otherMonth', { month: monthOf(issued) });
  }
  return from && to && compareDates(from, to) !== 0 && sameMonth(from, to)
    ? t('policyForm.note.moved', { month: monthOf(to) })
    : null;
}

interface Booked {
  readonly date: CalendarDate;
  readonly fyp: Money;
}

const booked = (date: CalendarDate | null, fyp: Money | null): Booked | null =>
  date && fyp !== null ? { date, fyp } : null;

/**
 * One metric's months: an FYP that moves to another month leaves the old one, then comes into the
 * new one (DR6-41), and the policy with it in the count of that metric, a line after the FYP's
 * (G3 T-284); within one month only the difference of the FYP counts.
 */
function monthEffects(
  metric: 'submitted' | 'issued',
  before: Booked | null,
  after: Booked | null,
): Effect[] {
  const effect = ({ date }: Booked, diff: Money): Extract<Effect, { kind: 'fyp' }> => ({
    kind: 'fyp',
    metric,
    year: date.year,
    month: date.month,
    diff,
  });
  const sameMonth =
    before &&
    after &&
    before.date.year === after.date.year &&
    before.date.month === after.date.month;
  const effects = sameMonth
    ? [effect(after, after.fyp - before.fyp)]
    : [
        ...(before ? [effect(before, -before.fyp)] : []),
        ...(after ? [effect(after, after.fyp)] : []),
      ];
  const moved: Effect[] =
    before && after && !sameMonth
      ? [{ kind: 'count', metric, from: before.date, to: after.date }]
      : [];
  return [...effects.filter((e) => e.diff !== 0), ...moved];
}

export const monthOf = (date: CalendarDate) => formatPeriodValue(periodOf('month', date));

/**
 * A line of "Ảnh hưởng chỉ số" (8d). Without the RM's name (an RM no longer listed, e.g.
 * deleted), the sentence leaves the RM out rather than show an empty name; the line of the counts
 * names no RM (mockup 8d "dời tháng").
 */
export function effectText(effect: Effect, rmName: string | undefined): string {
  if (effect.kind === 'moved') {
    return t('policyForm.cancelMoved', {
      from: formatDate(effect.from),
      to: formatDate(effect.to),
    });
  }
  if (effect.kind === 'tally') {
    return t(effect.diff > 0 ? 'policyForm.countUp' : 'policyForm.countDown', {
      month: monthOf(effect.date),
      label: t(`policyForm.count.${effect.metric}`),
    });
  }
  if (effect.kind === 'count') {
    return t('policyForm.countMoved', {
      from: monthOf(effect.from),
      to: monthOf(effect.to),
      label: t(`policyForm.count.${effect.metric}`),
    });
  }
  const params = {
    label: t(`policyForm.metric.${effect.metric}`),
    month: monthOf(calendarDate(effect.year, effect.month, 1)),
    rm: rmName?.trim() ?? '',
    amount: formatAmountCompact(Math.abs(effect.diff)),
  };
  const key = effect.diff < 0 ? 'Down' : 'Up';
  return t(params.rm ? `policyForm.effect${key}` : `policyForm.effect${key}NoRm`, params);
}

/**
 * "Case size dự kiến ở cuộc gặp gần nhất" (8a), for reference only: the one of the latest met
 * meeting, none when that one has none (§9 Q8, DR6-39). Latest by day, then hour (an untimed
 * meeting first); a tie goes to the one listed last, as `listAppointments` lists them in the
 * order made.
 */
export function expectedCaseSize(
  appointments: readonly Pick<AppointmentRecord, 'date' | 'time' | 'status' | 'expectedCaseSize'>[],
): Money | null {
  let latest: (typeof appointments)[number] | undefined;
  for (const a of appointments) {
    if (a.status !== 'MET') continue;
    const order = latest
      ? compareDates(a.date, latest.date) || (a.time ?? '').localeCompare(latest.time ?? '')
      : 1;
    if (order >= 0) latest = a;
  }
  return latest?.expectedCaseSize ?? null;
}
