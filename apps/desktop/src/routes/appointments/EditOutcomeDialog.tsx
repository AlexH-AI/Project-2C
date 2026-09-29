import { useState, type ReactNode } from 'react';
import {
  APPOINTMENT_TRIGGERS,
  editMeetingOutcome,
  type AppointmentTrigger,
  type CustomerRecord,
} from '@p2c/db';
import { formatDate, type Person, type StageTransition } from '@p2c/domain';
import { Button, Choices, Dialog, SelectField, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { Actions, ALERT } from '../customers/CustomerDialogs';
import { CoordinatorsField, dateFieldError, dateReading, liveIds } from './AppointmentDialog';
import { DeleteAppointmentDialog } from './DeleteAppointmentDialog';
import { badge, MetFields, metDraftOf, EMPTY_MET } from './MetFields';
import { whenText } from './RescheduleFields';
import { dayText, isPastOrToday, parseTime, readScheduleDate } from './appointment-form';
import { LINK, LOCKED, outcomeText, type AppointmentRow } from './appointments-view';
import {
  outcomeChoices,
  outcomeLock,
  readOutcome,
  type OutcomeChoice,
  type OutcomeError,
} from './outcome-form';

type EditStatus = Exclude<OutcomeChoice, 'RESCHEDULED'>;

/**
 * Mockup 6f: the outcome of a met, cancelled or missed appointment, and its day, trigger and
 * coordinators. Once the customer moved on after the meeting, its status, day and stage after are
 * locked and it cannot be deleted (D7); the rest stays open.
 */
export function EditOutcomeDialog({
  row,
  people,
  transitions,
  onClose,
}: {
  row: AppointmentRow & { customer: CustomerRecord };
  people: readonly Person[];
  transitions: readonly StageTransition[];
  onClose: () => void;
}) {
  const app = useAppData();
  const today = app.today();
  const a = row.appointment;
  const customer = row.customer;
  const { caused, later } = outcomeLock(transitions, a);
  const [status, setStatus] = useState(a.status as EditStatus);
  const [metDraft, setMetDraft] = useState(a.status === 'MET' ? metDraftOf(a) : EMPTY_MET);
  const [note, setNote] = useState(a.note);
  const [dateText, setDateText] = useState(dayText(a.date, today));
  const [timeText, setTimeText] = useState(a.time ?? '');
  const [trigger, setTrigger] = useState<AppointmentTrigger>(a.triggerType);
  const [triggerNote, setTriggerNote] = useState(a.triggerNote ?? '');
  const [coordinatorIds, setCoordinatorIds] = useState(a.coordinatorIds);
  const [errors, setErrors] = useState<readonly OutcomeError[]>([]);
  const [failure, setFailure] = useState<string>();
  const [deleting, setDeleting] = useState(false);

  const date = readScheduleDate(dateText, today, 'any');
  const day = date.ok ? date.date : a.date;
  const time = parseTime(timeText);
  // Met and no-show only by today (Owner 29/09/2026), whatever day is typed.
  const held = status === 'MET' || status === 'NO_SHOW';
  const dateError = !date.ok
    ? dateFieldError(date, today)
    : held && !isPastOrToday(date.date, today)
      ? t('error.OUTCOME_IN_FUTURE')
      : undefined;
  const choices = outcomeChoices({ status: a.status, date: day }, today).filter(
    (choice): choice is { value: EditStatus; disabled: boolean } => choice.value !== 'RESCHEDULED',
  );
  // The meeting's own move starts from the stage before it; otherwise from where the customer is.
  const from = caused?.from ?? customer.stage;

  const edit =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setFailure(undefined);
    };

  const save = () => {
    const read = readOutcome({ status, ...metDraft, note, next: null });
    setErrors(read.ok ? [] : read.errors);
    if (!read.ok || (!later && (!date.ok || dateError)) || !time.ok) return;
    try {
      app.run((db) =>
        editMeetingOutcome(db, a.id, read.outcome, {
          date: later || !date.ok ? undefined : date.date,
          time: time.time,
          triggerType: trigger,
          triggerNote,
          coordinatorIds: liveIds(people, coordinatorIds),
        }),
      );
      onClose();
    } catch (error) {
      const latest = transitions.findLast((tr) => tr.customerId === customer.id);
      setFailure(errorMessage(error, { date: latest ? formatDate(latest.date) : '' }));
    }
  };

  if (deleting) {
    return (
      <DeleteAppointmentDialog
        appointment={a}
        customer={customer}
        caused={caused}
        onClose={() => setDeleting(false)}
        onDeleted={onClose}
      />
    );
  }

  return (
    <Dialog
      title={t('outcomeEdit.title')}
      subtitle={[
        customer.name,
        whenText(a),
        t(`appointmentStatus.${a.status}`),
        outcomeText(row.outcome),
      ]
        .filter(Boolean)
        .join(' · ')}
      onClose={onClose}
      onSubmit={save}
      actions={
        <>
          <Button onClick={() => setDeleting(true)} disabled={later !== undefined}>
            {t('outcomeEdit.delete')}
          </Button>
          <span className="mr-auto self-center text-xs text-fg-3">
            {later && t('outcomeEdit.deleteBlocked')}
          </span>
          <Actions onClose={onClose} save={t('outcomeEdit.save')} />
        </>
      }
    >
      {failure && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {failure}
        </p>
      )}
      {later && (
        <div role="note" className={`${ALERT} flex flex-col gap-1 border-warn`}>
          <b>{t('outcomeEdit.lockTitle')}</b>
          <span className="flex flex-wrap items-center gap-1 tabular-nums">
            {t('outcomeEdit.lockBody', { date: formatDate(later.date) })}
            {later.from && badge(later.from)} {t('timeline.arrow')} {badge(later.to)}
          </span>
          <span>
            {t('outcomeEdit.lockHelp')}{' '}
            <a href={routeToHash({ screen: 'customer', id: customer.id })} className={LINK}>
              {t('outcomeEdit.lockLink')}
            </a>
            . {t('outcomeEdit.lockRest')}
          </span>
        </div>
      )}
      {later ? (
        <Locked label={t('outcome.status')}>{t(`appointmentStatus.${a.status}`)}</Locked>
      ) : (
        <Choices
          label={t('outcome.status')}
          value={status}
          onChange={(value) => {
            setStatus(value);
            setErrors([]);
            setFailure(undefined);
          }}
          options={choices.map((choice) => ({
            ...choice,
            label: t(`appointmentStatus.${choice.value}`),
          }))}
          required
        />
      )}
      <div className="grid grid-cols-2 gap-3">
        {later ? (
          <Locked label={t('outcomeEdit.date')}>{formatDate(a.date)}</Locked>
        ) : (
          <TextField
            label={t('outcomeEdit.date')}
            value={dateText}
            onChange={edit(setDateText)}
            error={dateError}
            hint={date.ok && !dateError ? dateReading(date) : undefined}
            required
          />
        )}
        <TextField
          label={t('appointmentForm.time')}
          value={timeText}
          onChange={edit(setTimeText)}
          error={time.ok ? undefined : t('appointmentForm.timeError')}
        />
      </div>
      {status === 'MET' && (
        <MetFields
          draft={metDraft}
          onChange={(draft, field) => {
            setMetDraft(draft);
            setFailure(undefined);
            setErrors(errors.filter((error) => error !== field));
          }}
          from={from}
          date={day}
          people={people}
          errors={errors}
          stageLocked={later !== undefined}
        />
      )}
      <TextField
        label={t(status === 'MET' ? 'outcome.note' : 'outcome.noteOther')}
        value={note}
        onChange={edit(setNote)}
        rows={status === 'MET' ? 3 : undefined}
      />
      <SelectField
        label={t('appointmentForm.trigger')}
        value={trigger}
        options={APPOINTMENT_TRIGGERS.map((value) => ({ value, label: t(`trigger.${value}`) }))}
        onChange={edit((value: string) => setTrigger(value as AppointmentTrigger))}
        required
      />
      <TextField
        label={t('appointmentForm.triggerNote')}
        value={triggerNote}
        onChange={edit(setTriggerNote)}
      />
      <CoordinatorsField people={people} ids={coordinatorIds} onChange={edit(setCoordinatorIds)} />
    </Dialog>
  );
}

function Locked({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium">{label}</span>
      <p className={LOCKED}>
        {children} {t('outcomeEdit.lockMark')}
      </p>
    </div>
  );
}
