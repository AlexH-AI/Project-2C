import { useState, type ReactNode } from 'react';
import {
  APPOINTMENT_TRIGGERS,
  editMeetingOutcome,
  type AppointmentTrigger,
  type CustomerRecord,
} from '@p2c/db';
import { formatDate, type Person, type StageTransition } from '@p2c/domain';
import { Button, Choices, Dialog, SelectField, TextField } from '@p2c/ui';
import { useAppData, useTables } from '../../data/AppDataContext';
import { errorMessage, joinParts, t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { ALERT, LINK } from '../classes';
import { Actions, FailureAlert, useSaveFailure } from '../customers/CustomerDialogs';
import { stageBadge } from '../stage-badge';
import { CoordinatorsField, dateFieldError, dateReading, liveIds } from './AppointmentDialog';
import { DeleteAppointmentDialog, UndoneMoveNote } from './DeleteAppointmentDialog';
import { MetFields, metDraftOf, EMPTY_MET } from './MetFields';
import { DayLockNote } from './OutcomeDialog';
import { whenText } from './RescheduleFields';
import { isPastOrToday, parseTime, prefill, readScheduleDate } from './appointment-form';
import { LOCKED, outcomeText, type AppointmentRow } from './appointments-view';
import {
  editedDay,
  heldStage,
  outcomeChoices,
  outcomeLock,
  readOutcome,
  undoneMove,
  withoutError,
  type OutcomeChoice,
  type OutcomeError,
} from './outcome-form';

type EditStatus = Exclude<OutcomeChoice, 'RESCHEDULED'>;

/**
 * Mockup 6f: the outcome of a met, cancelled or missed appointment, and its day, trigger and
 * coordinators. Once the customer moved on after the meeting, or a later meeting kept the stage it
 * moved to, its status, day and stage after are locked and it cannot be deleted (D7); the rest
 * stays open. Otherwise the stage after is held at the stage of the day once something came after
 * it (T-232), and a save that takes back the stage move the meeting made says so first (DR6-70).
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
  const { appointments } = useTables();
  const today = app.today();
  const a = row.appointment;
  const customer = row.customer;
  const lock = outcomeLock(transitions, appointments, a);
  const { caused, later, keptBy } = lock;
  const locked = later !== undefined || keptBy !== undefined;
  const [status, setStatus] = useState(a.status as EditStatus);
  const [metDraft, setMetDraft] = useState(a.status === 'MET' ? metDraftOf(a) : EMPTY_MET);
  const [note, setNote] = useState(a.note);
  const [filled] = useState(() => prefill(a.date, today));
  const [dateText, setDateText] = useState(filled.text);
  const [timeText, setTimeText] = useState(a.time ?? '');
  const [trigger, setTrigger] = useState<AppointmentTrigger>(a.triggerType);
  const [triggerNote, setTriggerNote] = useState(a.triggerNote ?? '');
  const [coordinatorIds, setCoordinatorIds] = useState(a.coordinatorIds);
  const [errors, setErrors] = useState<readonly OutcomeError[]>([]);
  const { failure, setFailure, edit } = useSaveFailure();
  const [deleting, setDeleting] = useState(false);

  const date = readScheduleDate(dateText, today, 'any', filled);
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
  // The stage of the day, without the meeting's own move (T-232).
  const onDay = editedDay(transitions, appointments, a, day);
  const from = onDay.from ?? customer.stage;
  const holding = locked ? undefined : heldStage(onDay);
  const draft = holding ? { ...metDraft, stageAfter: holding } : metDraft;
  const undone = undoneMove(lock, status, draft.stageAfter, from);

  const save = () => {
    const read = readOutcome({ status, ...draft, note, next: null });
    setErrors(read.ok ? [] : read.errors);
    if (!read.ok || (!locked && (!date.ok || dateError)) || !time.ok) return;
    try {
      app.run((db) =>
        editMeetingOutcome(db, a.id, read.outcome, {
          date: locked || !date.ok ? undefined : date.date,
          time: time.time,
          triggerType: trigger,
          triggerNote,
          coordinatorIds: liveIds(people, coordinatorIds),
        }),
      );
      onClose();
    } catch (error) {
      setFailure(errorMessage(error));
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
      subtitle={joinParts([
        customer.name,
        whenText(a),
        t(`appointmentStatus.${a.status}`),
        outcomeText(row.outcome),
      ])}
      onClose={onClose}
      onSubmit={save}
      actions={
        <>
          <Button onClick={() => setDeleting(true)} disabled={locked}>
            {t('outcomeEdit.delete')}
          </Button>
          <span className="mr-auto self-center text-xs text-fg-3">
            {locked && t('outcomeEdit.deleteBlocked')}
          </span>
          <Actions onClose={onClose} save={t('outcomeEdit.save')} />
        </>
      }
    >
      {failure && <FailureAlert>{failure}</FailureAlert>}
      {locked && (
        <div role="note" className={`${ALERT} flex flex-col gap-1 border-warn`}>
          <b>{t('outcomeEdit.lockTitle')}</b>
          <span className="flex flex-wrap items-center gap-1 tabular-nums">
            {later ? (
              <>
                {t('outcomeEdit.lockBody', { date: formatDate(later.date) })}
                {later.from && stageBadge(later.from)} {t('sep.arrow')} {stageBadge(later.to)}
              </>
            ) : (
              keptBy && (
                <>
                  {t('outcomeEdit.lockKept', { date: formatDate(keptBy.date) })}
                  {keptBy.stageAfter && stageBadge(keptBy.stageAfter)}
                </>
              )
            )}
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
      {locked ? (
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
        {locked ? (
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
          draft={draft}
          onChange={(changed, field) => {
            setMetDraft(changed);
            setFailure(undefined);
            setErrors(withoutError(errors, field));
          }}
          from={from}
          date={day}
          people={people}
          errors={errors}
          stageLocked={locked || holding !== undefined}
          lockNote={holding && <DayLockNote day={day} held={onDay} customerId={customer.id} />}
        />
      )}
      {undone && <UndoneMoveNote caused={undone} />}
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
