import { useState } from 'react';
import { issuePolicy, submitPolicy, type CustomerRecord } from '@p2c/db';
import {
  formatDate,
  formatPeriodValue,
  formatVnd,
  formatVndCompact,
  periodOf,
  weekdayOf,
  type CalendarDate,
  type Person,
  type Policy,
  type Team,
  type Vnd,
} from '@p2c/domain';
import { Dialog, SelectField, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { reOptions } from '../../shell/scope';
import { dayText } from '../appointments/appointment-form';
import { Actions, ALERT } from './CustomerDialogs';
import { readPolicy, type FypResult, type IssuedDateResult, type PolicyDraft } from './policy-form';

/** `new` submits a policy (8a), `issue` issues it (8b, 8c). */
export type PolicyMode =
  { readonly kind: 'new' } | { readonly kind: 'issue'; readonly policy: Policy };

const fypRead = (amount: Vnd) =>
  t('policyForm.fypRead', { amount: formatVnd(amount), compact: formatVndCompact(amount) });

const dateRead = (date: CalendarDate) =>
  t('policyForm.dateRead', {
    weekday: t(`weekdayLong.${weekdayOf(date)}`),
    date: formatDate(date),
  });

const fypError = (read: FypResult) =>
  read.ok ? undefined : t(read.error === 'zero' ? 'policyForm.zero' : `money.error.${read.error}`);

function draftOf(mode: PolicyMode, today: CalendarDate): PolicyDraft {
  if (mode.kind === 'new')
    return { submittedDate: dayText(today, today), submittedFyp: '', issued: null };
  const { policy } = mode;
  return {
    submittedDate: dayText(policy.submittedDate, today),
    submittedFyp: formatVnd(policy.submittedFyp),
    // The issued FYP starts as the submitted one (G2 D).
    issued: {
      date: dayText(today, today),
      fyp: formatVnd(policy.issuedFyp ?? policy.submittedFyp),
    },
  };
}

/** Mockups 8a–8c: the policy block of the customer profile opens this. */
export function PolicyDialog({
  customer,
  mode,
  people,
  teams,
  caseSize,
  onClose,
}: {
  customer: CustomerRecord;
  mode: PolicyMode;
  people: readonly Person[];
  teams: readonly Team[];
  /** The expected case size of the latest met meeting, shown for reference on a new policy. */
  caseSize: Vnd | null;
  onClose: () => void;
}) {
  const app = useAppData();
  const today = app.today();
  const saved = mode.kind === 'new' ? null : mode.policy;
  const [draft, setDraft] = useState(() => draftOf(mode, today));
  const [reId, setReId] = useState(customer.reId);
  const [attempted, setAttempted] = useState(false);
  const [failure, setFailure] = useState<string>();
  const read = readPolicy(draft, today);

  const edit = (changes: Partial<PolicyDraft>) => {
    setDraft({ ...draft, ...changes });
    setFailure(undefined);
  };
  const editIssued = (changes: Partial<NonNullable<PolicyDraft['issued']>>) =>
    draft.issued && edit({ issued: { ...draft.issued, ...changes } });
  // An empty field shows its error only once saving was tried.
  const shown = (text: string) => attempted || text.trim() !== '';

  const submittedDateError =
    shown(draft.submittedDate) && !read.submittedDate.ok
      ? t(`date.error.${read.submittedDate.error}`)
      : undefined;
  const submittedFypError = shown(draft.submittedFyp) ? fypError(read.submittedFyp) : undefined;
  const issuedDateError =
    draft.issued && read.issuedDate && shown(draft.issued.date)
      ? issuedDateMessage(read.issuedDate, read.submittedDate.ok ? read.submittedDate.date : null)
      : undefined;
  const issuedFypError =
    draft.issued && read.issuedFyp && shown(draft.issued.fyp)
      ? fypError(read.issuedFyp)
      : undefined;
  const reError = attempted && reId === '' ? t('error.RE_REQUIRED') : undefined;
  const errorCount = [
    submittedDateError,
    submittedFypError,
    issuedDateError,
    issuedFypError,
    reError,
  ].filter(Boolean).length;

  const save = () => {
    setAttempted(true);
    const values = read.policy;
    if (!values || reId === '') return;
    try {
      app.run((db) => {
        if (!saved) {
          const { submittedDate, submittedFyp } = values;
          return submitPolicy(db, { customerId: customer.id, reId, submittedDate, submittedFyp });
        }
        // An issue draft that reads always has its day and FYP.
        return issuePolicy(db, saved.id, {
          issuedDate: values.issuedDate!,
          issuedFyp: values.issuedFyp!,
        });
      });
      onClose();
    } catch (error) {
      setFailure(errorMessage(error));
    }
  };

  const issuedRead = read.issuedDate?.ok ? read.issuedDate : null;
  const issuedFyp = read.issuedFyp?.ok ? read.issuedFyp.amount : null;

  return (
    <Dialog
      title={t(saved ? 'policyForm.issueTitle' : 'policyForm.newTitle')}
      subtitle={
        saved
          ? t('policyForm.sub', {
              customer: customer.name,
              date: formatDate(saved.submittedDate),
              fyp: formatVndCompact(saved.submittedFyp),
            })
          : t('policyForm.newSub', { customer: customer.name, code: customer.code })
      }
      onClose={onClose}
      onSubmit={save}
      actions={
        <Actions onClose={onClose} save={t(saved ? 'policyForm.issueSave' : 'policyForm.save')} />
      }
    >
      {failure && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {failure}
        </p>
      )}
      {attempted && errorCount > 0 && (
        <p role="alert" className={`${ALERT} border-danger font-semibold text-danger`}>
          {t('policyForm.invalid', { count: errorCount })}
        </p>
      )}
      {!saved && (
        <>
          <SelectField
            label={t('policyForm.re')}
            value={reId}
            options={reOptions(people, teams)}
            onChange={(value) => {
              setReId(value);
              setFailure(undefined);
            }}
            error={reError}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label={t('policyForm.submittedDate')}
              value={draft.submittedDate}
              onChange={(submittedDate) => edit({ submittedDate })}
              error={submittedDateError}
              hint={read.submittedDate.ok ? dateRead(read.submittedDate.date) : undefined}
              required
              autoFocus
            />
            <TextField
              label={t('policyForm.submittedFyp')}
              value={draft.submittedFyp}
              onChange={(submittedFyp) => edit({ submittedFyp })}
              error={submittedFypError}
              hint={read.submittedFyp.ok ? fypRead(read.submittedFyp.amount) : undefined}
              required
            />
          </div>
          {caseSize !== null && (
            <span className="text-xs text-fg-3">
              {t('policyForm.caseSizeHelp', { amount: formatVndCompact(caseSize) })}
            </span>
          )}
        </>
      )}
      {draft.issued && (
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label={t('policyForm.issuedDate')}
            value={draft.issued.date}
            onChange={(date) => editIssued({ date })}
            error={issuedDateError}
            hint={issuedRead ? issuedDateRead(issuedRead) : undefined}
            required
            autoFocus
          />
          <TextField
            label={t('policyForm.issuedFypDefault')}
            value={draft.issued.fyp}
            onChange={(fyp) => editIssued({ fyp })}
            error={issuedFypError}
            hint={issuedFyp === null ? undefined : fypRead(issuedFyp)}
            required
          />
        </div>
      )}
      {issuedRead && read.submittedDate.ok && (
        <p className={`${ALERT} border-info`}>
          {t('policyForm.months', {
            submitted: monthOf(read.submittedDate.date),
            issued: monthOf(issuedRead.date),
          })}
        </p>
      )}
    </Dialog>
  );
}

function issuedDateMessage(read: IssuedDateResult, submitted: CalendarDate | null) {
  if (read.ok) return undefined;
  if (read.error === 'beforeSubmitted') {
    return t('policyForm.beforeSubmitted', {
      date: formatDate(read.date),
      submitted: submitted ? formatDate(submitted) : '',
    });
  }
  return t(`date.error.${read.error}`);
}

function issuedDateRead(read: Extract<IssuedDateResult, { ok: true }>) {
  const day = dateRead(read.date);
  if (read.daysAfter === null) return day;
  return read.daysAfter === 0
    ? t('policyForm.sameDay', { read: day })
    : t('policyForm.daysAfter', { read: day, n: read.daysAfter });
}

const monthOf = (date: CalendarDate) => formatPeriodValue(periodOf('month', date));
