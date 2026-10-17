import { useCallback, useState } from 'react';
import {
  getKycProfile,
  listKycVersions,
  recordMeetingOutcome,
  recordOutcomeWithNext,
  rescheduleAppointment,
  type AppointmentRecord,
  type CustomerRecord,
  type Database,
} from '@p2c/db';
import { formatDate, weekdayOf, type CalendarDate, type Person } from '@p2c/domain';
import { Choices, Dialog, TextField } from '@p2c/ui';
import { useAppData, useQuery, useTables } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { Actions, ALERT, FailureAlert, useSaveFailure } from '../customers/CustomerDialogs';
import { KycNoteDialog } from '../customers/KycDialogs';
import { dateFieldError, dateReading } from './AppointmentDialog';
import { badge, EMPTY_MET, MetFields } from './MetFields';
import { RescheduleFields, useRescheduleForm, whenText } from './RescheduleFields';
import { parseTime, readScheduleDate } from './appointment-form';
import { LINK, type AppointmentRow } from './appointments-view';
import {
  heldStage,
  meetingDay,
  outcomeChoices,
  readOutcome,
  withoutError,
  type OutcomeChoice,
  type OutcomeError,
} from './outcome-form';

/**
 * Mockups 6c, 6d, 6e, 6i: the outcome of a scheduled appointment. Met moves the customer to the
 * stage after (a transition tied to the appointment, ADR-0007); "Dời lịch" moves it to a new day
 * (D3); a next appointment can be booked with the outcome, in one go. `onShow` gets the
 * appointment the reschedule or the booking made, as every other way of making one (DR6-42).
 */
export function OutcomeDialog({
  row,
  people,
  onClose,
  onShow,
}: {
  row: AppointmentRow & { customer: NonNullable<AppointmentRow['customer']> };
  people: readonly Person[];
  onClose: () => void;
  onShow: (appointment: AppointmentRecord) => void;
}) {
  const app = useAppData();
  const { transitions, appointments } = useTables();
  const today = app.today();
  const a = row.appointment;
  const customer = row.customer;
  const choices = outcomeChoices(a, today);
  // A meeting recorded late starts from the stage of its day, held there once the customer moved
  // on after it (T-232).
  const onDay = meetingDay(transitions, appointments, a, a.date);
  const [status, setStatus] = useState<OutcomeChoice | null>(
    choices.find((choice) => !choice.disabled && choice.value === 'MET') ? 'MET' : null,
  );
  const [metDraft, setMetDraft] = useState(EMPTY_MET);
  const [note, setNote] = useState('');
  const [booking, setBooking] = useState(false);
  const [nextDateText, setNextDateText] = useState('');
  const [nextTimeText, setNextTimeText] = useState(a.time ?? '');
  const [errors, setErrors] = useState<readonly OutcomeError[]>([]);
  const { failure, setFailure, edit } = useSaveFailure();
  // Saved before a status was picked (F-13); picking one clears it.
  const [noStatus, setNoStatus] = useState(false);
  const [kycNote, setKycNote] = useState(false);
  const moving = useRescheduleForm(a, today);

  const met = status === 'MET';
  const held = heldStage(onDay);
  const draft = held ? { ...metDraft, stageAfter: held } : metDraft;
  const nextDate = readScheduleDate(nextDateText, today, 'fromToday');
  const nextTime = parseTime(nextTimeText);
  const has = (error: OutcomeError) => errors.includes(error);

  const save = () => {
    if (status === null) {
      setNoStatus(true);
      return;
    }
    try {
      if (status === 'RESCHEDULED') {
        const when = moving.submit();
        if (!when) return;
        onShow(app.run((db) => rescheduleAppointment(db, a.id, when, moving.reason)));
      } else {
        const read = readOutcome({
          status,
          ...draft,
          note,
          next: booking ? { date: nextDate, time: nextTime } : null,
        });
        setErrors(read.ok ? [] : read.errors);
        if (!read.ok) return;
        const { outcome, next } = read;
        if (next) onShow(app.run((db) => recordOutcomeWithNext(db, a.id, outcome, next)).next);
        else app.run((db) => recordMeetingOutcome(db, a.id, outcome));
      }
      onClose();
    } catch (error) {
      setFailure(errorMessage(error));
    }
  };

  const saveLabel =
    status === 'RESCHEDULED'
      ? t('reschedule.save')
      : t(booking ? 'outcome.saveWithNext' : 'outcome.save');

  return (
    <>
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
        {failure && <FailureAlert>{failure}</FailureAlert>}
        {noStatus && status === null && <FailureAlert>{t('outcome.statusRequired')}</FailureAlert>}
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
            draft={draft}
            onChange={(changed, field) => {
              setMetDraft(changed);
              setFailure(undefined);
              setErrors(withoutError(errors, field));
            }}
            from={onDay.from ?? customer.stage}
            date={a.date}
            people={people}
            errors={errors}
            stageLocked={held !== undefined}
            lockNote={held && <DayLockNote day={a.date} held={onDay} customerId={customer.id} />}
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
            {met && (
              <span className="-mt-2 text-xs text-fg-3">
                {t('outcome.noteHelp')}{' '}
                <button type="button" onClick={() => setKycNote(true)} className={LINK}>
                  {t('outcome.kycNote')}
                </button>
              </span>
            )}
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
      {/* A sibling, not a child: a dialog's form cannot hold another form. */}
      {kycNote && (
        <KycNoteFromMeeting
          customer={customer}
          text={note}
          date={a.date}
          onClose={() => setKycNote(false)}
        />
      )}
    </>
  );
}

/**
 * Under a stage after held at the stage of the meeting day (6c, 6f; T-232), as the D7 lock of 6f
 * explains its own: what came after the meeting, and where to change the stage instead. The
 * customer's creation, which holds a meeting before it (DR-43), is no stage change to tell.
 */
export function DayLockNote({
  day,
  held,
  customerId,
}: {
  day: CalendarDate;
  held: ReturnType<typeof meetingDay>;
  customerId: string;
}) {
  const { change, meeting } = held;
  return (
    <div role="note" className={`${ALERT} flex flex-col gap-1 border-warn`}>
      <b>{t('outcome.dayLockTitle', { date: formatDate(day) })}</b>
      {change?.from && (
        <span className="flex flex-wrap items-center gap-1 tabular-nums">
          {t('outcome.dayLockChange', { date: formatDate(change.date) })}
          {badge(change.from)} {t('sep.arrow')} {badge(change.to)}
        </span>
      )}
      {!change && meeting && (
        <span className="tabular-nums">
          {t('outcome.dayLockMeeting', { date: formatDate(meeting.date) })}
        </span>
      )}
      <span>
        {t('outcome.dayLockHelp')}{' '}
        <a href={routeToHash({ screen: 'customer', id: customerId })} className={LINK}>
          {t('outcomeEdit.lockLink')}
        </a>
        .
      </span>
    </div>
  );
}

/**
 * Mockup 6c → 7a: the customer's KYC note over the outcome, from the meeting's note and day. It is
 * saved on its own; the outcome, still unsaved, stays as typed.
 */
function KycNoteFromMeeting({
  customer,
  text,
  date,
  onClose,
}: {
  customer: CustomerRecord;
  text: string;
  date: CalendarDate;
  onClose: () => void;
}) {
  const kyc = useQuery(
    useCallback(
      (db: Database) => ({
        profile: getKycProfile(db, customer.id),
        versions: listKycVersions(db, customer.id),
      }),
      [customer.id],
    ),
  );
  return (
    <KycNoteDialog
      customer={customer}
      profile={kyc.profile}
      versions={kyc.versions}
      initialText={text}
      initialDate={date}
      onClose={onClose}
    />
  );
}
