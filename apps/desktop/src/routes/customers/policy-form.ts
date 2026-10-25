import type { AppointmentRecord } from '@p2c/db';
import {
  calendarDate,
  compareDates,
  daysBetween,
  formatPeriodValue,
  formatVnd,
  formatVndCompact,
  parseVnd,
  periodOf,
  type CalendarDate,
  type Policy,
  type Vnd,
  type VndParseError,
} from '@p2c/domain';
import { t } from '../../i18n';
import { dayText } from '../appointments/appointment-form';
import { parseRecordDate, type RecordDateResult } from './customers-view';

export type FypResult =
  | { readonly ok: true; readonly amount: Vnd }
  | { readonly ok: false; readonly error: VndParseError | 'zero' };

/** An FYP as typed (`500tr`, `1,2 tỷ`): more than 0 (spec §3.7). */
export function readFyp(text: string): FypResult {
  const parsed = parseVnd(text);
  if (parsed.ok && parsed.amount <= 0) return { ok: false, error: 'zero' };
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
  | Extract<RecordDateResult, { ok: false }>;

/**
 * A policy's status as its badge words it, wherever the status is said: the badges of the Hợp đồng
 * card and of Thùng rác, the names of their buttons, the subtitle of 8d.
 */
export const policyStatusText = (policy: { readonly issuedDate: CalendarDate | null }): string =>
  t(policy.issuedDate === null ? 'policyStatus.submitted' : 'policyStatus.issued');

/** `new` submits a policy (8a), `issue` issues it (8b, 8c), `edit` changes or deletes it (8d). */
export type PolicyMode =
  { readonly kind: 'new' } | { readonly kind: 'issue' | 'edit'; readonly policy: Policy };

/** What a policy dialog holds; `issued` is null until the policy is issued (mockups 8a–8d). */
export interface PolicyDraft {
  readonly submittedDate: string;
  readonly submittedFyp: string;
  readonly issued: { readonly date: string; readonly fyp: string } | null;
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
    submittedFyp: formatVnd(policy.submittedFyp),
    issued:
      mode.kind === 'issue'
        ? // The issued FYP starts as the submitted one (G2 D).
          { date: dayText(today, today), fyp: formatVnd(policy.issuedFyp ?? policy.submittedFyp) }
        : policy.issuedDate && policy.issuedFyp !== null
          ? { date: dayText(policy.issuedDate, today), fyp: formatVnd(policy.issuedFyp) }
          : null,
  };
  return { draft, on: today };
}

export type PolicyValues = Omit<Policy, 'id' | 'customerId' | 'reId'>;

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
  const issuedDate =
    draft.issued &&
    readIssuedDate(
      draft.issued.date,
      on(draft.issued.date, opened?.draft.issued?.date),
      submittedDate,
    );
  const issuedFyp = draft.issued && readFyp(draft.issued.fyp);
  const policy: PolicyValues | null =
    submittedDate.ok && submittedFyp.ok && (issuedDate?.ok ?? true) && (issuedFyp?.ok ?? true)
      ? {
          submittedDate: submittedDate.date,
          submittedFyp: submittedFyp.amount,
          issuedDate: issuedDate?.ok ? issuedDate.date : null,
          issuedFyp: issuedFyp?.ok ? issuedFyp.amount : null,
        }
      : null;
  return { submittedDate, submittedFyp, issuedDate, issuedFyp, policy };
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
  /** The FYP the policy's RE submitted or issued in one month. */
  | {
      readonly kind: 'fyp';
      readonly metric: 'submitted' | 'issued';
      readonly year: number;
      readonly month: number;
      readonly diff: Vnd;
    }
  /**
   * A day moved to another month: the policy leaves the count of policies submitted or issued of
   * the month of `from` for that of `to` (mockup 8d "dời tháng", G3 T-284).
   */
  | {
      readonly kind: 'count';
      readonly metric: 'submitted' | 'issued';
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
  const next = read.policy;
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
      ]
    : [];
  return {
    fromSubmitted: submitted !== null && issued !== null ? issued - submitted : null,
    effects,
  };
}

interface Booked {
  readonly date: CalendarDate;
  readonly fyp: Vnd;
}

const booked = (date: CalendarDate | null, fyp: Vnd | null): Booked | null =>
  date && fyp !== null ? { date, fyp } : null;

/**
 * One metric's months: an FYP that moves to another month leaves the old one, then comes into the
 * new one (DR6-41), and the policy with it in the count of that metric, a line after the FYP's
 * (G3 T-284); within one month only the difference of the FYP counts.
 */
function monthEffects(
  metric: Effect['metric'],
  before: Booked | null,
  after: Booked | null,
): Effect[] {
  const effect = ({ date }: Booked, diff: Vnd): Extract<Effect, { kind: 'fyp' }> => ({
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
 * A line of "Ảnh hưởng chỉ số" (8d). Without the RE's name (an RE no longer listed, e.g.
 * deleted), the sentence leaves the RE out rather than show an empty name; the line of the counts
 * names no RE (mockup 8d "dời tháng").
 */
export function effectText(effect: Effect, reName: string | undefined): string {
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
    re: reName?.trim() ?? '',
    amount: formatVndCompact(Math.abs(effect.diff)),
  };
  const key = effect.diff < 0 ? 'Down' : 'Up';
  return t(params.re ? `policyForm.effect${key}` : `policyForm.effect${key}NoRe`, params);
}

/**
 * "Case size dự kiến ở cuộc gặp gần nhất" (8a), for reference only: the one of the latest met
 * meeting, none when that one has none (§9 Q8, DR6-39). Latest by day, then hour (an untimed
 * meeting first); a tie goes to the one listed last, as `listAppointments` lists them in the
 * order made.
 */
export function expectedCaseSize(
  appointments: readonly Pick<AppointmentRecord, 'date' | 'time' | 'status' | 'expectedCaseSize'>[],
): Vnd | null {
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
