import { useState } from 'react';
import { rescheduleAppointment, type AppointmentRecord } from '@p2c/db';
import { compareDates, formatDate, weekdayOf } from '@p2c/domain';
import { Dialog, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { Actions, ALERT } from '../customers/CustomerDialogs';
import { DateSuggestion, dateFieldError, dateReading } from './AppointmentDialog';
import { dayText, parseTime, readScheduleDate } from './appointment-form';
import type { AppointmentRow } from './appointments-view';

const when = (a: Pick<AppointmentRecord, 'date' | 'time'>) =>
  [formatDate(a.date), a.time].filter(Boolean).join(' ');

/**
 * Mockup 6e: a scheduled appointment moves to a new day. The old one stays as rescheduled, with
 * the reason in its note; a new one takes the same RE, trigger and coordinators (D3).
 */
export function RescheduleDialog({
  row,
  onClose,
  onMoved,
}: {
  row: AppointmentRow;
  onClose: () => void;
  onMoved: (appointment: AppointmentRecord) => void;
}) {
  const app = useAppData();
  const today = app.today();
  const old = row.appointment;
  const [dateText, setDateText] = useState('');
  const [timeText, setTimeText] = useState(old.time ?? '');
  const [reason, setReason] = useState('');
  const [backfill, setBackfill] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [failure, setFailure] = useState<string>();

  // The new day is today or later; a day past only to back-fill a meeting held then (Owner 29/09).
  const date = readScheduleDate(dateText, today, backfill ? 'any' : 'fromToday');
  const time = parseTime(timeText);
  const same =
    date.ok && time.ok && compareDates(date.date, old.date) === 0 && time.time === old.time;
  const pending = dateText.trim() === '' && !attempted;
  const past = !date.ok && date.error === 'past';
  const dateError = same
    ? t('reschedule.same')
    : pending
      ? undefined
      : past
        ? t('reschedule.past', { date: formatDate(date.date), today: formatDate(today) })
        : dateFieldError(date, today);

  const edit = (set: (value: string) => void) => (value: string) => {
    set(value);
    setFailure(undefined);
  };

  const save = () => {
    setAttempted(true);
    if (!date.ok || !time.ok || same) return;
    try {
      const moved = app.run((db) =>
        rescheduleAppointment(db, old.id, { date: date.date, time: time.time }, reason),
      );
      onMoved(moved);
      onClose();
    } catch (error) {
      setFailure(errorMessage(error));
    }
  };

  return (
    <Dialog
      title={t('reschedule.title')}
      subtitle={t('reschedule.sub', {
        customer: row.customer?.name ?? '',
        weekday: t(`weekdayLong.${weekdayOf(old.date)}`),
        when: when(old),
        status: t(`appointmentStatus.${old.status}`),
      })}
      onClose={onClose}
      onSubmit={save}
      actions={<Actions onClose={onClose} save={t('reschedule.save')} />}
    >
      {failure && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {failure}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label={t('reschedule.date')}
          value={dateText}
          onChange={edit(setDateText)}
          error={dateError}
          hint={date.ok && !same ? dateReading(date) : undefined}
          required
          autoFocus
        />
        <TextField
          label={t('reschedule.time')}
          value={timeText}
          onChange={edit(setTimeText)}
          error={time.ok ? undefined : t('appointmentForm.timeError')}
        />
      </div>
      <DateSuggestion date={date} onUse={edit(setDateText)} help={false} />
      {(past || backfill) && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={backfill}
            onChange={(event) => setBackfill(event.target.checked)}
            className="accent-accent"
          />
          {t('reschedule.backfill')}
        </label>
      )}
      <TextField label={t('reschedule.reason')} value={reason} onChange={edit(setReason)} />
      <div className={`${ALERT} border-info`}>
        <b>{t('reschedule.onSave')}</b>
        <ul className="m-0 pl-5 tabular-nums">
          <li>{t('reschedule.oldBecomes', { when: when(old) })}</li>
          <li>
            {t('reschedule.newOne', {
              when:
                date.ok && time.ok
                  ? when({ date: date.date, time: time.time })
                  : t('reschedule.newDay'),
            })}
          </li>
        </ul>
      </div>
      {reason.trim() !== '' && (
        <p className="m-0 text-xs text-fg-2 tabular-nums">
          {t('reschedule.historyRead', {
            date: dayText(old.date, today),
            note: reason.trim(),
          })}
        </p>
      )}
    </Dialog>
  );
}
