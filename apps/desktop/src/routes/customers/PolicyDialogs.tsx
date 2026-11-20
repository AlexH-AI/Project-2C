import { useState } from 'react';
import {
  issuePolicy,
  softDeletePolicy,
  submitPolicy,
  updatePolicy,
  type CustomerRecord,
} from '@p2c/db';
import {
  formatDate,
  normalizeText,
  type CalendarDate,
  type Money,
  type Person,
  type Policy,
  type Team,
} from '@p2c/domain';
import { Button, Dialog, SelectField, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { useMasked } from '../../shell/NameMask';
import { rmOptions } from '../../shell/scope';
import { useTrashUndo } from '../../shell/Toasts';
import { ALERT } from '../classes';
import { MoneyField } from '../MoneyField';
import { amountRead, formatAmountCompact, formatAmountDelta, formRefusal } from '../money-view';
import { Actions, dayRead, FailureAlert, InvalidAlert } from './CustomerDialogs';
import {
  effectText,
  monthOf,
  openDraft,
  policyChange,
  policyStatusText,
  readPolicy,
  type FypResult,
  type IssuedDateResult,
  type PolicyDraft,
  type PolicyMode,
} from './policy-form';

export type { PolicyMode } from './policy-form';

/** What stands under an FYP field the form refuses: an FYP of 0, or what the money field refuses. */
const fypRefusal = (read: FypResult, text: string) =>
  read.ok ? undefined : formRefusal(read, text, { code: 'zero', message: t('policyForm.zero') });

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
  caseSize: Money | null;
  onClose: () => void;
}) {
  const app = useAppData();
  const masked = useMasked();
  const today = app.today();
  const saved = mode.kind === 'new' ? null : mode.policy;
  const [opened] = useState(() => openDraft(mode, today));
  const [draft, setDraft] = useState(opened.draft);
  const [rmId, setRmId] = useState(customer.rmId);
  const [attempted, setAttempted] = useState(false);
  const [failure, setFailure] = useState<string>();
  const [deleting, setDeleting] = useState(false);
  const read = readPolicy(draft, today, opened);

  const edit = (changes: Partial<PolicyDraft>) => {
    setDraft({ ...draft, ...changes });
    setFailure(undefined);
  };
  const editIssued = (changes: Partial<NonNullable<PolicyDraft['issued']>>) =>
    draft.issued && edit({ issued: { ...draft.issued, ...changes } });
  // An empty field shows its error only once saving was tried; one of invisible characters alone is
  // empty, as in 6b, 6c and 6e (DR6-150, DR6-173).
  const shown = (text: string) => attempted || normalizeText(text) !== '';

  const submittedDateError =
    shown(draft.submittedDate) && !read.submittedDate.ok
      ? t(`date.error.${read.submittedDate.error}`)
      : undefined;
  const submittedFypError = shown(draft.submittedFyp)
    ? fypRefusal(read.submittedFyp, draft.submittedFyp)
    : undefined;
  const issuedDateError =
    draft.issued && read.issuedDate && shown(draft.issued.date)
      ? issuedDateMessage(read.issuedDate, read.submittedDate.ok ? read.submittedDate.date : null)
      : undefined;
  const issuedFypError =
    draft.issued && read.issuedFyp && shown(draft.issued.fyp)
      ? fypRefusal(read.issuedFyp, draft.issued.fyp)
      : undefined;
  const rmError = attempted && rmId === '' ? t('error.RM_REQUIRED') : undefined;
  const errorCount = [
    submittedDateError,
    submittedFypError,
    issuedDateError,
    issuedFypError,
    rmError,
  ].filter(Boolean).length;

  const save = () => {
    setAttempted(true);
    const values = read.policy;
    if (!values || rmId === '') return;
    try {
      app.run((db) => {
        if (!saved) {
          const { submittedDate, submittedFyp } = values;
          return submitPolicy(db, { customerId: customer.id, rmId, submittedDate, submittedFyp });
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
  const change = mode.kind === 'edit' ? policyChange(mode.policy, read) : null;
  const rm = people.find((person) => person.id === saved?.rmId);

  return (
    <Dialog
      closeLabel={t('dialog.close')}
      title={
        mode.kind === 'edit'
          ? t('policyForm.editTitle', { customer: masked.name(customer.name) })
          : t(saved ? 'policyForm.issueTitle' : 'policyForm.newTitle')
      }
      subtitle={
        mode.kind === 'edit'
          ? t('policyForm.editSub', {
              status: policyStatusText(mode.policy),
              date: formatDate(mode.policy.issuedDate ?? mode.policy.submittedDate),
            })
          : saved
            ? t('policyForm.sub', {
                customer: masked.name(customer.name),
                date: formatDate(saved.submittedDate),
                fyp: formatAmountCompact(saved.submittedFyp),
              })
            : t('policyForm.newSub', { customer: masked.name(customer.name), code: customer.code })
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
      {failure && <FailureAlert>{failure}</FailureAlert>}
      <InvalidAlert count={attempted ? errorCount : 0} />
      {mode.kind !== 'issue' && (
        <>
          {mode.kind === 'new' && (
            <SelectField
              label={t('policyForm.rm')}
              value={rmId}
              options={rmOptions(people, teams)}
              onChange={(value) => {
                setRmId(value);
                setFailure(undefined);
              }}
              error={rmError}
              required
            />
          )}
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label={t('policyForm.submittedDate')}
              value={draft.submittedDate}
              onChange={(submittedDate) => edit({ submittedDate })}
              error={submittedDateError}
              hint={read.submittedDate.ok ? dayRead(read.submittedDate.date) : undefined}
              required
              autoFocus={mode.kind === 'new'}
            />
            <MoneyField
              label={t('policyForm.submittedFyp')}
              value={draft.submittedFyp}
              onChange={(submittedFyp) => edit({ submittedFyp })}
              refusal={submittedFypError}
              hint={read.submittedFyp.ok ? amountRead(read.submittedFyp.amount) : undefined}
              required
            />
          </div>
          {mode.kind === 'new' && caseSize !== null && (
            <span className="text-xs text-fg-3">
              {t('policyForm.caseSizeHelp', { amount: formatAmountCompact(caseSize) })}
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
          <MoneyField
            label={t(mode.kind === 'edit' ? 'policyForm.issuedFyp' : 'policyForm.issuedFypDefault')}
            value={draft.issued.fyp}
            onChange={(fyp) => editIssued({ fyp })}
            refusal={issuedFypError}
            hint={
              issuedFyp === null
                ? undefined
                : change?.fromSubmitted
                  ? t('policyForm.fromSubmitted', {
                      read: amountRead(issuedFyp),
                      diff: formatAmountDelta(change.fromSubmitted),
                    })
                  : amountRead(issuedFyp)
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
      {change && change.effects.length > 0 && (
        <dl className="m-0 flex gap-3 tabular-nums">
          <dt className="shrink-0 text-fg-3">{t('policyForm.effect')}</dt>
          <dd className="m-0 flex flex-col gap-0.5">
            {/* Keyed by its words: one line per month and metric, one per count moved. */}
            {change.effects
              .map((effect) => effectText(effect, rm?.name))
              .map((line) => (
                <span key={line}>{line}</span>
              ))}
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
  const day = dayRead(read.date);
  if (read.daysAfter === null) return day;
  return read.daysAfter === 0
    ? t('policyForm.sameDay', { read: day })
    : t('policyForm.daysAfter', { read: day, n: read.daysAfter });
}

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
  const masked = useMasked();
  const undo = useTrashUndo();
  const [failure, setFailure] = useState<string>();
  const remove = () => {
    try {
      app.run((db) => softDeletePolicy(db, policy.id));
      undo('policy', policy.id);
      onDeleted();
    } catch (error) {
      setFailure(errorMessage(error));
    }
  };
  return (
    <Dialog
      closeLabel={t('dialog.close')}
      size="confirm"
      title={t('policyDelete.title', { date: formatDate(policy.submittedDate) })}
      subtitle={t('policyDelete.sub', {
        customer: masked.name(customer.name),
        fyp: formatAmountCompact(policy.submittedFyp),
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
      {failure && <FailureAlert>{failure}</FailureAlert>}
      <p className="m-0 text-fg-2">{t('policyDelete.body')}</p>
      <p className={`${ALERT} border-info`}>{t('policyDelete.soft')}</p>
    </Dialog>
  );
}
