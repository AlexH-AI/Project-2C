import type { AppointmentRecord } from '@p2c/db';
import {
  calendarDate,
  compareDates,
  daysBetween,
  formatPeriodValue,
  formatVndCompact,
  parseVnd,
  periodOf,
  type CalendarDate,
  type Policy,
  type Vnd,
  type VndParseError,
} from '@p2c/domain';
import { t } from '../../i18n';
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

/** What a policy dialog holds; `issued` is null until the policy is issued (mockups 8a–8d). */
export interface PolicyDraft {
  readonly submittedDate: string;
  readonly submittedFyp: string;
  readonly issued: { readonly date: string; readonly fyp: string } | null;
}

export type PolicyValues = Omit<Policy, 'id' | 'customerId' | 'reId'>;

/**
 * Reads every field of the draft, and the policy when all of them are right. Days are today or
 * earlier; the issue comes on the submission day or later (spec §3.7).
 */
export function readPolicy(draft: PolicyDraft, today: CalendarDate) {
  const submittedDate = parseRecordDate(draft.submittedDate, today);
  const submittedFyp = readFyp(draft.submittedFyp);
  const issuedDate = draft.issued && readIssuedDate(draft.issued.date, today, submittedDate);
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

/**
 * Mockup 8d: how far the issued FYP is from the submitted one, and what the edit does to the
 * issued FYP of the saved issue month (null when the FYP stays or the issue month moves).
 */
export function issuedChange(
  saved: Policy,
  next: { readonly issuedDate: CalendarDate; readonly issuedFyp: Vnd },
) {
  const before = saved.issuedDate;
  const sameMonth =
    before !== null &&
    before.year === next.issuedDate.year &&
    before.month === next.issuedDate.month;
  const diff = next.issuedFyp - (saved.issuedFyp ?? 0);
  return {
    fromSubmitted: next.issuedFyp - saved.submittedFyp,
    metric: sameMonth && diff !== 0 ? { year: before.year, month: before.month, diff } : null,
  };
}

export const monthOf = (date: CalendarDate) => formatPeriodValue(periodOf('month', date));

/**
 * "Ảnh hưởng chỉ số" (8d) for the `metric` of `issuedChange`. Without the RE's name (an RE no
 * longer listed, e.g. deleted), the sentence leaves the RE out rather than show an empty name.
 */
export function effectText(
  metric: { readonly year: number; readonly month: number; readonly diff: Vnd },
  reName: string | undefined,
): string {
  const params = {
    month: monthOf(calendarDate(metric.year, metric.month, 1)),
    re: reName?.trim() ?? '',
    amount: formatVndCompact(Math.abs(metric.diff)),
  };
  const key = metric.diff < 0 ? 'Down' : 'Up';
  return t(params.re ? `policyForm.effect${key}` : `policyForm.effect${key}NoRe`, params);
}

/**
 * "Case size dự kiến": the one of the latest met meeting that has it, for reference only (8a).
 * Latest by day, then hour (an untimed meeting first); a tie goes to the one listed last, as
 * `listAppointments` lists them in the order made.
 */
export function expectedCaseSize(
  appointments: readonly Pick<AppointmentRecord, 'date' | 'time' | 'status' | 'expectedCaseSize'>[],
): Vnd | null {
  let latest: (typeof appointments)[number] | undefined;
  for (const a of appointments) {
    if (a.status !== 'MET' || a.expectedCaseSize === null) continue;
    const order = latest
      ? compareDates(a.date, latest.date) || (a.time ?? '').localeCompare(latest.time ?? '')
      : 1;
    if (order >= 0) latest = a;
  }
  return latest?.expectedCaseSize ?? null;
}
