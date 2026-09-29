import { useMemo, useState } from 'react';
import {
  APPOINTMENT_TRIGGERS,
  scheduleAppointment,
  type AppointmentRecord,
  type AppointmentTrigger,
  type CustomerRecord,
} from '@p2c/db';
import { formatDate, type CalendarDate } from '@p2c/domain';
import { Dialog, SelectField, StageBadge, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { reOptions } from '../../shell/scope';
import { routeToHash } from '../../shell/routes';
import { Actions, ALERT } from '../customers/CustomerDialogs';
import {
  dayText,
  MAX_HISTORY,
  parseTime,
  priorMeetings,
  readScheduleDate,
  searchCustomers,
  withTime,
  type PriorMeetings,
  type ScheduleDate,
} from './appointment-form';
import {
  FOCUS,
  LINK,
  outcomeText,
  personLabel,
  STATUS_TONE,
  type AppointmentData,
} from './appointments-view';

const CHIP = 'cursor-pointer rounded-md border border-border bg-surface-2 px-2 py-0.5 text-xs';
const MATCHES = 6;

/** How the day typed reads back: `Thứ Hai 28/09/2026 · 2 ngày nữa` (mockup `.read`). */
export function dateReading(date: Extract<ScheduleDate, { ok: true }>): string {
  const n = Math.abs(date.daysFromToday);
  const when =
    date.daysFromToday === 0
      ? t('appointmentForm.whenToday')
      : t(date.daysFromToday > 0 ? 'appointmentForm.whenAhead' : 'appointmentForm.whenBehind', {
          n,
        });
  return t('appointmentForm.dateRead', {
    weekday: t(`weekdayLong.${date.weekday}`),
    date: formatDate(date.date),
    when,
  });
}

/**
 * Mockup 6a/6b: a new appointment. With `from` (a past appointment) it is the next one (6h):
 * filled in from it, the day today or later, and no link back to it. `customer` fixes the customer.
 * `onSeeAll` replaces going to the customer profile for "Xem tất cả" (the dialog is open on it).
 */
export function AppointmentDialog({
  data,
  customer: fixed,
  from,
  onClose,
  onCreated,
  onSeeAll,
}: {
  data: AppointmentData;
  customer?: CustomerRecord;
  from?: AppointmentRecord;
  onClose: () => void;
  onCreated: (appointment: AppointmentRecord) => void;
  onSeeAll?: () => void;
}) {
  const app = useAppData();
  const today = app.today();
  const [customer, setCustomer] = useState(fixed);
  const [query, setQuery] = useState('');
  const [reId, setReId] = useState(from?.reId ?? fixed?.reId ?? '');
  const [dateText, setDateText] = useState(from ? dayText(from.date, today) : '');
  const [timeText, setTimeText] = useState(from?.time ?? '');
  const [trigger, setTrigger] = useState<AppointmentTrigger | ''>(from?.triggerType ?? '');
  const [triggerNote, setTriggerNote] = useState(from?.triggerNote ?? '');
  const [coordinatorIds, setCoordinatorIds] = useState<readonly string[]>(
    from?.coordinatorIds ?? [],
  );
  const [attempted, setAttempted] = useState(false);
  const [failure, setFailure] = useState<string>();

  const reChoices = useMemo(() => reOptions(data.people, data.teams), [data]);
  const history = useMemo(
    () => (customer ? priorMeetings(data, customer.id, today) : undefined),
    [data, customer, today],
  );
  const date = readScheduleDate(dateText, today, from ? 'fromToday' : 'any');
  const time = parseTime(timeText);
  // No RE coordinates (ADR-0007: TL / IS / BD / BDM do), so the appointment's RE never is one.
  const coordinators = data.people.filter((person) => coordinatorIds.includes(person.id));
  const addable = data.people
    .filter((person) => person.role !== 'RE' && !coordinatorIds.includes(person.id))
    .map((person) => ({ value: person.id, label: personLabel(person) }));
  const pending = dateText.trim() === '' && !attempted;

  const dateError = pending ? undefined : dateFieldError(date, today);

  const edit =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setFailure(undefined);
    };

  const save = () => {
    setAttempted(true);
    if (!customer || !reId || !trigger || !date.ok || !time.ok) return;
    try {
      const created = app.run((db) =>
        scheduleAppointment(db, {
          customerId: customer.id,
          reId,
          date: date.date,
          time: time.time,
          triggerType: trigger,
          triggerNote,
          coordinatorIds: coordinators.map((person) => person.id),
        }),
      );
      onCreated(created);
      onClose();
    } catch (error) {
      setFailure(errorMessage(error));
    }
  };

  return (
    <Dialog
      title={t(from ? 'appointmentForm.nextTitle' : 'appointmentForm.title')}
      subtitle={
        from
          ? t('appointmentForm.nextSub', {
              date: withTime(formatDate(from.date), from.time),
              status: t(`appointmentStatus.${from.status}`),
            })
          : t('appointmentForm.sub')
      }
      onClose={onClose}
      onSubmit={save}
      actions={<Actions onClose={onClose} save={t('appointmentForm.create')} />}
    >
      {failure && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {failure}
        </p>
      )}
      <CustomerField
        customers={data.customers}
        customer={customer}
        fixed={fixed !== undefined}
        query={query}
        onQuery={setQuery}
        onPick={(picked) => {
          setCustomer(picked);
          setReId(picked?.reId ?? '');
        }}
        error={attempted && !customer ? t('appointmentForm.customerRequired') : undefined}
        history={history}
      />
      {customer && history && (
        <History customer={customer} history={history} today={today} onSeeAll={onSeeAll} />
      )}
      <SelectField
        label={t('appointmentForm.re')}
        value={reId}
        options={reChoices}
        placeholder={t('customerForm.rePick')}
        onChange={edit(setReId)}
        error={attempted && !reId ? t('error.RE_REQUIRED') : undefined}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label={t(from ? 'appointmentForm.dateNext' : 'appointmentForm.date')}
          value={dateText}
          onChange={edit(setDateText)}
          error={dateError}
          hint={date.ok ? dateReading(date) : undefined}
          required
          autoFocus={fixed !== undefined}
        />
        <TextField
          label={t('appointmentForm.time')}
          value={timeText}
          onChange={edit(setTimeText)}
          error={time.ok ? undefined : t('appointmentForm.timeError')}
        />
      </div>
      <DateSuggestion date={date} onUse={edit(setDateText)} help={!from} />
      <SelectField
        label={t('appointmentForm.trigger')}
        value={trigger}
        options={APPOINTMENT_TRIGGERS.map((value) => ({ value, label: t(`trigger.${value}`) }))}
        placeholder={t('appointmentForm.triggerPick')}
        onChange={edit((value: string) => setTrigger(value as AppointmentTrigger | ''))}
        error={attempted && !trigger ? t('appointmentForm.triggerRequired') : undefined}
        required
      />
      <TextField
        label={t('appointmentForm.triggerNote')}
        value={triggerNote}
        onChange={edit(setTriggerNote)}
      />
      <fieldset className="m-0 flex flex-col gap-1 border-0 p-0">
        <legend className="p-0 font-medium">{t('appointmentForm.coordinators')}</legend>
        {coordinators.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {coordinators.map((person) => (
              <button
                key={person.id}
                type="button"
                aria-label={t('appointmentForm.coordinatorRemove', { name: personLabel(person) })}
                className={`${CHIP} ${FOCUS}`}
                onClick={() => setCoordinatorIds(coordinatorIds.filter((id) => id !== person.id))}
              >
                {personLabel(person)} ×
              </button>
            ))}
          </div>
        )}
        <SelectField
          label={t('appointmentForm.coordinatorPick')}
          labelHidden
          value=""
          options={addable}
          placeholder={t('appointmentForm.coordinatorAdd')}
          onChange={(id) => id && setCoordinatorIds([...coordinatorIds, id])}
        />
        <span className="text-xs text-fg-3">{t('appointmentForm.coordinatorHelp')}</span>
      </fieldset>
    </Dialog>
  );
}

/** The error under the day field, once it is not a day the form takes. */
export function dateFieldError(date: ScheduleDate, today: CalendarDate): string | undefined {
  if (date.ok) return undefined;
  return date.error === 'past'
    ? t('appointmentForm.past', { date: formatDate(date.date), today: formatDate(today) })
    : t(`date.error.${date.error}`);
}

/** A year-less day long past offers the same day next year (6b); the RE picks. */
export function DateSuggestion({
  date,
  onUse,
  help,
}: {
  date: ScheduleDate;
  onUse: (text: string) => void;
  help: boolean;
}) {
  const read = date.ok || date.error === 'past' ? date : null;
  if (!read?.suggestion) return null;
  const next = formatDate(read.suggestion);
  return (
    <p className={`${ALERT} flex flex-col items-start gap-1.5 border-warn`}>
      {t('appointmentForm.suggest', {
        date: formatDate(read.date),
        n: Math.abs(read.daysFromToday),
        next,
      })}
      <button type="button" className={`${CHIP} ${FOCUS}`} onClick={() => onUse(next)}>
        {t('appointmentForm.suggestUse', { date: next })}
      </button>
      {help && <span className="text-xs text-fg-2">{t('appointmentForm.suggestHelp')}</span>}
    </p>
  );
}

/** A fixed customer, or a search by name / code to pick one (mockup 6a "Khách hàng"). */
function CustomerField({
  customers,
  customer,
  fixed,
  query,
  onQuery,
  onPick,
  error,
  history,
}: {
  customers: readonly CustomerRecord[];
  customer: CustomerRecord | undefined;
  fixed: boolean;
  query: string;
  onQuery: (query: string) => void;
  onPick: (customer: CustomerRecord | undefined) => void;
  error: string | undefined;
  history: PriorMeetings | undefined;
}) {
  const matches = useMemo(() => searchCustomers(customers, query, MATCHES), [customers, query]);
  if (customer) {
    return (
      <div className="flex flex-col gap-1">
        <span className="font-medium">{t('appointmentForm.customer')}</span>
        <p className="m-0 flex flex-wrap items-center gap-2">
          <b>{customer.name}</b>
          <span className="text-fg-3 tabular-nums">{customer.code}</span>
          <StageBadge stage={customer.stage} label={t(`stage.${customer.stage}`)} />
          {!fixed && (
            <button
              type="button"
              className={`${CHIP} ${FOCUS} ml-auto`}
              onClick={() => onPick(undefined)}
            >
              {t('appointmentForm.customerChange')}
            </button>
          )}
        </p>
        {history && (
          <span className="text-xs text-fg-2 tabular-nums">
            {history.lastMet
              ? t('appointmentForm.meetings', {
                  n: history.metCount + 1,
                  date: formatDate(history.lastMet),
                })
              : t('appointmentForm.neverMet')}
          </span>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1.5">
      <TextField
        label={t('appointmentForm.customer')}
        value={query}
        onChange={onQuery}
        hint={t('appointmentForm.customerHint')}
        error={error}
        required
        autoFocus
      />
      {query.trim() !== '' && (
        <ul
          aria-label={t('appointmentForm.customerResults')}
          className="m-0 flex list-none flex-col gap-1 p-0"
        >
          {matches.length === 0 && (
            <li className="text-fg-3">{t('appointmentForm.customerNone')}</li>
          )}
          {matches.map((match) => (
            <li key={match.id}>
              <button
                type="button"
                className={`${CHIP} ${FOCUS} flex w-full items-center gap-2 text-left text-sm`}
                onClick={() => onPick(match)}
              >
                <b>{match.name}</b>
                <span className="text-fg-3 tabular-nums">{match.code}</span>
                <StageBadge stage={match.stage} label={t(`stage.${match.stage}`)} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** "Các lần hẹn trước": the 5 latest, newest first; the year shows when it is not this year's. */
function History({
  customer,
  history,
  today,
  onSeeAll,
}: {
  customer: CustomerRecord;
  history: PriorMeetings;
  today: CalendarDate;
  onSeeAll: (() => void) | undefined;
}) {
  if (history.rows.length === 0) return null;
  return (
    <section aria-label={t('appointmentForm.history')} className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="font-medium">{t('appointmentForm.history')}</span>
        {history.rows.length > MAX_HISTORY && (
          <a
            href={routeToHash({ screen: 'customer', id: customer.id })}
            onClick={
              onSeeAll &&
              ((event) => {
                event.preventDefault();
                onSeeAll();
              })
            }
            className={LINK}
          >
            {t('appointmentForm.historyAll', { n: history.rows.length })}
          </a>
        )}
      </div>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-xs">
        {history.rows.slice(0, MAX_HISTORY).map(({ appointment: a, outcome }) => (
          <li key={a.id} className="flex gap-1 whitespace-nowrap">
            <span className="tabular-nums">{dayText(a.date, today)}</span>
            <span>·</span>
            <span className={STATUS_TONE[a.status]}>{t(`appointmentStatus.${a.status}`)}</span>
            {(outcome?.kind === 'move' || outcome?.kind === 'keep') && (
              <span>· {outcomeText(outcome)}</span>
            )}
            {a.note && (
              <span className="min-w-0 truncate text-fg-3">
                · {t('appointmentForm.historyNote', { note: a.note })}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
