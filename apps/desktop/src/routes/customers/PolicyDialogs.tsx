import { useState } from 'react';
import {
  issuePolicy,
  softDeletePolicy,
  submitPolicy,
  updatePolicy,
  type CustomerRecord,
} from '@p2c/db';
import {
  calendarDate,
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
import { Button, Dialog, SelectField, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { reOptions } from '../../shell/scope';
import { dayText } from '../appointments/appointment-form';
import { Actions, ALERT } from './CustomerDialogs';
import {
  issuedChange,
  readPolicy,
  type FypResult,
  type IssuedDateResult,
  type PolicyDraft,
} from './policy-form';

/** `new` submits a policy (8a), `issue` issues it (8b, 8c), `edit` changes or deletes it (8d). */
export type PolicyMode =
  { readonly kind: 'new' } | { readonly kind: 'issue' | 'edit'; readonly policy: Policy };

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
    issued:
      mode.kind === 'issue'
        ? // The issued FYP starts as the submitted one (G2 D).
          { date: dayText(today, today), fyp: formatVnd(policy.issuedFyp ?? policy.submittedFyp) }
        : policy.issuedDate && policy.issuedFyp !== null
          ? { date: dayText(policy.issuedDate, today), fyp: formatVnd(policy.issuedFyp) }
          : null,
  };
}

/** Mockups 8a–8d: the policy block of the customer profile opens this. */
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
  const [deleting, setDeleting] = useState(false);
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
        if (mode.kind === 'edit') return updatePolicy(db, saved.id, values);
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

  if (deleting && saved) {
    return (
      <DeletePolicyDialog
        policy={saved}
        customer={customer}
        onClose={() => setDeleting(false)}
        onDeleted={onClose}
      />
    );
  }

  const issuedRead = read.issuedDate?.ok ? read.issuedDate : null;
  const issuedFyp = read.issuedFyp?.ok ? read.issuedFyp.amount : null;
  const change =
    mode.kind === 'edit' && issuedRead && issuedFyp !== null
      ? issuedChange(mode.policy, { issuedDate: issuedRead.date, issuedFyp })
      : null;
  const re = people.find((person) => person.id === saved?.reId);

  return (
    <Dialog
      title={
        mode.kind === 'edit'
          ? t('policyForm.editTitle', { customer: customer.name })
          : t(saved ? 'policyForm.issueTitle' : 'policyForm.newTitle')
      }
      subtitle={
        mode.kind === 'edit'
          ? t('policyForm.editSub', {
              status: t(mode.policy.issuedDate ? 'policyStatus.issued' : 'policyStatus.submitted'),
              date: formatDate(mode.policy.issuedDate ?? mode.policy.submittedDate),
            })
          : saved
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
        mode.kind === 'edit' ? (
          <>
            <Button className="mr-auto" onClick={() => setDeleting(true)}>
              {t('policyForm.delete')}
            </Button>
            <Actions onClose={onClose} save={t('policyForm.editSave')} />
          </>
        ) : (
          <Actions onClose={onClose} save={t(saved ? 'policyForm.issueSave' : 'policyForm.save')} />
        )
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
      {mode.kind !== 'issue' && (
        <>
          {mode.kind === 'new' && (
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
          )}
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label={t('policyForm.submittedDate')}
              value={draft.submittedDate}
              onChange={(submittedDate) => edit({ submittedDate })}
              error={submittedDateError}
              hint={read.submittedDate.ok ? dateRead(read.submittedDate.date) : undefined}
              required
              autoFocus={mode.kind === 'new'}
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
          {mode.kind === 'new' && caseSize !== null && (
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
            autoFocus={mode.kind === 'issue'}
          />
          <TextField
            label={t(mode.kind === 'edit' ? 'policyForm.issuedFyp' : 'policyForm.issuedFypDefault')}
            value={draft.issued.fyp}
            onChange={(fyp) => editIssued({ fyp })}
            error={issuedFypError}
            hint={
              issuedFyp === null
                ? undefined
                : change && change.fromSubmitted !== 0
                  ? t('policyForm.fromSubmitted', {
                      read: fypRead(issuedFyp),
                      diff: signed(change.fromSubmitted),
                    })
                  : fypRead(issuedFyp)
            }
            required
          />
        </div>
      )}
      {mode.kind === 'issue' && issuedRead && read.submittedDate.ok && (
        <p className={`${ALERT} border-info`}>
          {t('policyForm.months', {
            submitted: monthOf(read.submittedDate.date),
            issued: monthOf(issuedRead.date),
          })}
        </p>
      )}
      {change?.metric && (
        <dl className="m-0 flex gap-3 tabular-nums">
          <dt className="shrink-0 text-fg-3">{t('policyForm.effect')}</dt>
          <dd className="m-0">
            {t(change.metric.diff < 0 ? 'policyForm.effectDown' : 'policyForm.effectUp', {
              month: monthOf(calendarDate(change.metric.year, change.metric.month, 1)),
              re: re?.name ?? '',
              amount: formatVndCompact(Math.abs(change.metric.diff)),
            })}
          </dd>
        </dl>
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

const signed = (amount: Vnd) => `${amount < 0 ? '−' : '+'}${formatVndCompact(Math.abs(amount))}`;

/** Deleting a policy is soft (D4); the customer's stage stays. */
function DeletePolicyDialog({
  policy,
  customer,
  onClose,
  onDeleted,
}: {
  policy: Policy;
  customer: CustomerRecord;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const app = useAppData();
  const [failure, setFailure] = useState<string>();
  const remove = () => {
    try {
      app.run((db) => softDeletePolicy(db, policy.id));
      onDeleted();
    } catch (error) {
      setFailure(errorMessage(error));
    }
  };
  return (
    <Dialog
      title={t('policyDelete.title', { date: formatDate(policy.submittedDate) })}
      subtitle={t('policyDelete.sub', {
        customer: customer.name,
        fyp: formatVndCompact(policy.submittedFyp),
      })}
      onClose={onClose}
      onSubmit={remove}
      actions={
        <>
          <Button onClick={onClose}>{t('customerForm.cancel')}</Button>
          <Button type="submit" variant="danger">
            {t('policyDelete.confirm')}
          </Button>
        </>
      }
    >
      {failure && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {failure}
        </p>
      )}
      <p className="m-0 text-fg-2">{t('policyDelete.body')}</p>
      <p className={`${ALERT} border-info`}>{t('policyDelete.soft')}</p>
    </Dialog>
  );
}
