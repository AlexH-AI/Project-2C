import { useState } from 'react';
import {
  recordMeetingOutcome,
  recordOutcomeWithNext,
  rescheduleAppointment,
  type AppointmentRecord,
} from '@p2c/db';
import {
  compareDates,
  formatDate,
  weekdayOf,
  type Person,
  type StageTransition,
} from '@p2c/domain';
import { Choices, Dialog, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { Actions, ALERT } from '../customers/CustomerDialogs';
import { dateFieldError, dateReading } from './AppointmentDialog';
import { EMPTY_MET, MetFields } from './MetFields';
import { RescheduleFields, useRescheduleForm, whenText } from './RescheduleFields';
import { parseTime, readScheduleDate } from './appointment-form';
import type { AppointmentRow } from './appointments-view';
import { outcomeChoices, readOutcome, type OutcomeChoice, type OutcomeError } from './outcome-form';

/**
 * Mockups 6c, 6d, 6e, 6i: the outcome of a scheduled appointment. Met moves the customer to the
 * stage after (a transition tied to the appointment, ADR-0007); "Dời lịch" moves it to a new day
 * (D3); a next appointment can be booked with the outcome, in one go.
 */
export function OutcomeDialog({
  row,
  people,
  transitions,
  onClose,
  onMoved,
}: {
  row: AppointmentRow & { customer: NonNullable<AppointmentRow['customer']> };
  people: readonly Person[];
  transitions: readonly StageTransition[];
  onClose: () => void;
  onMoved: (appointment: AppointmentRecord) => void;
}) {
  const app = useAppData();
  const today = app.today();
  const a = row.appointment;
  const customer = row.customer;
  const choices = outcomeChoices(a, today);
  const [status, setStatus] = useState<OutcomeChoice | null>(
    choices.find((choice) => !choice.disabled && choice.value === 'MET') ? 'MET' : null,
  );
  const [metDraft, setMetDraft] = useState(EMPTY_MET);
  const [note, setNote] = useState('');
  const [booking, setBooking] = useState(false);
  const [nextDateText, setNextDateText] = useState('');
  const [nextTimeText, setNextTimeText] = useState(a.time ?? '');
  const [errors, setErrors] = useState<readonly OutcomeError[]>([]);
  const [failure, setFailure] = useState<string>();
  const moving = useRescheduleForm(a, today);

  const met = status === 'MET';
  const nextDate = readScheduleDate(nextDateText, today, 'fromToday');
  const nextTime = parseTime(nextTimeText);
  const has = (error: OutcomeError) => errors.includes(error);

  const edit =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setFailure(undefined);
    };

  const save = () => {
    if (status === null) return;
    try {
      if (status === 'RESCHEDULED') {
        const when = moving.submit();
        if (!when) return;
        onMoved(app.run((db) => rescheduleAppointment(db, a.id, when, moving.reason)));
      } else {
        const read = readOutcome({
          status,
          ...metDraft,
          note,
          next: booking ? { date: nextDate, time: nextTime } : null,
        });
        setErrors(read.ok ? [] : read.errors);
        if (!read.ok) return;
        const { outcome, next } = read;
        app.run((db) =>
          next
            ? recordOutcomeWithNext(db, a.id, outcome, next)
            : recordMeetingOutcome(db, a.id, outcome),
        );
      }
      onClose();
    } catch (error) {
      const latest = transitions
        .filter((transition) => transition.customerId === customer.id)
        .reduce<StageTransition | undefined>(
          (last, transition) =>
            last && compareDates(last.date, transition.date) >= 0 ? last : transition,
          undefined,
        );
      setFailure(errorMessage(error, { date: latest ? formatDate(latest.date) : '' }));
    }
  };

  const saveLabel =
    status === 'RESCHEDULED'
      ? t('reschedule.save')
      : t(booking ? 'outcome.saveWithNext' : 'outcome.save');

  return (
    <Dialog
      title={t('outcome.title')}
      subtitle={t('outcome.sub', {
        customer: customer.name,
        weekday: t(`weekdayLong.${weekdayOf(a.date)}`),
        when: whenText(a),
        stage: t(`stage.${customer.stage}`),
      })}
      onClose={onClose}
      onSubmit={save}
      actions={<Actions onClose={onClose} save={saveLabel} />}
    >
      {failure && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {failure}
        </p>
      )}
      {met && (has('stageAfter') || has('nextStep')) && (
        <p role="alert" className={`${ALERT} flex flex-col border-danger`}>
          <b>{t('outcome.missing')}</b>
          <span className="text-fg-2">{t('outcome.missingHelp')}</span>
        </p>
      )}
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
        help={
          choices.some((choice) => choice.disabled && choice.value !== 'RESCHEDULED')
            ? t('outcome.futureHelp', { date: formatDate(a.date) })
            : status === 'CANCELLED' || status === 'NO_SHOW'
              ? t('outcome.otherHelp')
              : undefined
        }
        required
      />
      {status === 'RESCHEDULED' && (
        <RescheduleFields form={moving} onEdit={() => setFailure(undefined)} />
      )}
      {met && (
        <MetFields
          draft={metDraft}
          onChange={(draft, field) => {
            setMetDraft(draft);
            setFailure(undefined);
            setErrors(errors.filter((error) => error !== field));
          }}
          from={customer.stage}
          date={a.date}
          people={people}
          errors={errors}
        />
      )}
      {status !== null && status !== 'RESCHEDULED' && (
        <>
          <TextField
            label={t(met ? 'outcome.note' : 'outcome.noteOther')}
            value={note}
            onChange={edit(setNote)}
            rows={met ? 3 : undefined}
          />
          {met && <span className="-mt-2 text-xs text-fg-3">{t('outcome.noteHelp')}</span>}
          <fieldset className="m-0 flex flex-col gap-3 rounded-md border border-border p-3">
            <legend className="px-1">
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={booking}
                  onChange={(event) => edit(setBooking)(event.target.checked)}
                  className="accent-accent"
                />
                {t('outcome.next')}
              </label>
            </legend>
            <span className="-mt-2 text-xs text-fg-3">{t('outcome.nextHelp')}</span>
            {booking && (
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label={t('outcome.nextDate')}
                  value={nextDateText}
                  onChange={edit(setNextDateText)}
                  error={
                    nextDateText.trim() === '' && !has('nextDate')
                      ? undefined
                      : dateFieldError(nextDate, today)
                  }
                  hint={nextDate.ok ? dateReading(nextDate) : undefined}
                  required
                />
                <TextField
                  label={t('outcome.nextTime')}
                  value={nextTimeText}
                  onChange={edit(setNextTimeText)}
                  error={nextTime.ok ? undefined : t('appointmentForm.timeError')}
                />
              </div>
            )}
          </fieldset>
          {booking && (
            <div className={`${ALERT} border-info`}>
              <b>{t('outcome.onSave')}</b>
              <ul className="m-0 pl-5 tabular-nums">
                <li>
                  {t('outcome.oldBecomes', {
                    when: whenText(a),
                    status: t(`appointmentStatus.${status}`),
                  })}
                </li>
                <li>
                  {t('outcome.newOne', {
                    when:
                      nextDate.ok && nextTime.ok
                        ? whenText({ date: nextDate.date, time: nextTime.time })
                        : t('reschedule.newDay'),
                  })}
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </Dialog>
  );
}
