import { useState, type ReactNode } from 'react';
import type { AppointmentRecord } from '@p2c/db';
import {
  compareDates,
  formatDate,
  normalizeText,
  type AppointmentStatus,
  type CalendarDate,
} from '@p2c/domain';
import { TextField } from '@p2c/ui';
import { t } from '../../i18n';
import { useMasked } from '../../shell/NameMask';
import { ALERT } from '../classes';
import { DateSuggestion, dateFieldError, dateReading } from './AppointmentDialog';
import {
  dayText,
  parseTime,
  readScheduleDate,
  rescheduleReason,
  withTime,
} from './appointment-form';
import { STATUS_TONE } from './appointments-view';

/** An appointment's day and time as the dialogs write it: `dd/mm/yyyy hh:mm`. */
export const whenText = (a: Pick<AppointmentRecord, 'date' | 'time'>) =>
  withTime(formatDate(a.date), a.time);

/** `text` with its `{slot}` filled by `node`, split as `KycExtraction` does. */
const withNode = (text: string, slot: string, node: ReactNode) => {
  const [before, after = ''] = text.split(`{${slot}}`);
  return (
    <>
      {before}
      {node}
      {after}
    </>
  );
};

/** The appointment shown in "Khi lưu" (6e, 6i): `28/09 14:00`, the year when not this one. */
export const shortWhen = (a: Pick<AppointmentRecord, 'date' | 'time'>, today: CalendarDate) =>
  withTime(dayText(a.date, today), a.time);

/**
 * "Khi lưu" of mockups 6e, 6i: the appointment shown and its new status, in the colour of that
 * status, then the new appointment, its day in bold.
 */
export function OnSave({
  title,
  oldLine,
  status,
  newLine,
  next,
}: {
  title: string;
  /** The line of the appointment shown, its `{status}` slot left to fill. */
  oldLine: string;
  status: AppointmentStatus;
  /** The line of the new appointment, its `{when}` slot left to fill. */
  newLine: string;
  next: Pick<AppointmentRecord, 'date' | 'time'> | null;
}) {
  return (
    <div className={`${ALERT} border-info`}>
      <b>{title}</b>
      <ul className="m-0 pl-5 tabular-nums">
        <li>
          {withNode(
            oldLine,
            'status',
            <span className={STATUS_TONE[status]}>{t(`appointmentStatus.${status}`)}</span>,
          )}
        </li>
        <li>
          {withNode(newLine, 'when', next ? <b>{whenText(next)}</b> : t('reschedule.newDay'))}
        </li>
      </ul>
    </div>
  );
}

/**
 * The new day of a scheduled appointment (mockup 6e), shared by "Dời lịch" and the outcome
 * dialog. `submit` marks the form tried and gives the new day, or null while it is not one.
 */
export function useRescheduleForm(old: AppointmentRecord, today: CalendarDate) {
  const [dateText, setDateText] = useState('');
  const [timeText, setTimeText] = useState(old.time ?? '');
  const [reason, setReason] = useState('');
  const [backfill, setBackfill] = useState(false);
  const [attempted, setAttempted] = useState(false);

  // The new day is today or later; a day past only to back-fill a meeting held then (Owner 29/09).
  const date = readScheduleDate(dateText, today, backfill ? 'any' : 'reschedule');
  const time = parseTime(timeText);
  const same =
    date.ok && time.ok && compareDates(date.date, old.date) === 0 && time.time === old.time;
  const when = date.ok && time.ok && !same ? { date: date.date, time: time.time } : null;
  return {
    old,
    today,
    dateText,
    setDateText,
    timeText,
    setTimeText,
    reason,
    setReason,
    backfill,
    setBackfill,
    attempted,
    date,
    time,
    same,
    when,
    submit: () => {
      setAttempted(true);
      return when;
    },
  };
}

export type RescheduleForm = ReturnType<typeof useRescheduleForm>;

/** Mockup 6e: new day and time, "Nhập bù", the reason, and what saving does. */
export function RescheduleFields({
  form,
  onEdit,
  autoFocus,
}: {
  form: RescheduleForm;
  /** Called on every change, e.g. to clear a failure shown above. */
  onEdit: () => void;
  autoFocus?: boolean;
}) {
  const { old, today, date, time, same } = form;
  const masked = useMasked();
  const reason = rescheduleReason(form.reason);
  const pending = normalizeText(form.dateText) === '' && !form.attempted;
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
    onEdit();
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label={t('reschedule.date')}
          value={form.dateText}
          onChange={edit(form.setDateText)}
          error={dateError}
          hint={date.ok && !same ? dateReading(date) : undefined}
          required
          autoFocus={autoFocus}
        />
        <TextField
          label={t('reschedule.time')}
          value={form.timeText}
          onChange={edit(form.setTimeText)}
          error={time.ok ? undefined : t('appointmentForm.timeError')}
        />
      </div>
      <DateSuggestion date={date} onUse={edit(form.setDateText)} help={false} />
      {(past || form.backfill) && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.backfill}
            onChange={(event) => form.setBackfill(event.target.checked)}
            className="accent-accent"
          />
          {t('reschedule.backfill')}
        </label>
      )}
      <TextField
        label={t('reschedule.reason')}
        value={form.reason}
        onChange={edit(form.setReason)}
      />
      <OnSave
        title={t('reschedule.onSave')}
        oldLine={t('reschedule.oldBecomes', { when: shortWhen(old, today) })}
        status="RESCHEDULED"
        newLine={t('reschedule.newOne')}
        next={date.ok && time.ok ? { date: date.date, time: time.time } : null}
      />
      {reason !== null && (
        <p className="m-0 text-xs text-fg-2 tabular-nums">
          {t('reschedule.historyRead', {
            date: dayText(old.date, today),
            note: masked.text(reason),
          })}
        </p>
      )}
    </>
  );
}
