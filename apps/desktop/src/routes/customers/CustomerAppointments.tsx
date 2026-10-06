import { useMemo, type ReactNode } from 'react';
import type { AppointmentRecord } from '@p2c/db';
import type { CalendarDate, StageTransition } from '@p2c/domain';
import { DataTable, type DataTableColumn } from '@p2c/ui';
import { t, tableMore } from '../../i18n';
import { dayText, isPastOrToday, withTime } from '../appointments/appointment-form';
import {
  LINK,
  outcomeResolver,
  outcomeText,
  STATUS_TONE,
  statusLabel,
  type Outcome,
} from '../appointments/appointments-view';

interface Row {
  readonly appointment: AppointmentRecord;
  readonly outcome: Outcome;
}

/**
 * The stage move or stage kept; else the status (planned, unrecorded, rescheduled, cancelled, no
 * show), with its tone.
 */
function result({ appointment: a, outcome }: Row, today: CalendarDate) {
  if (outcome?.kind === 'move') return { text: outcomeText(outcome), tone: '' };
  if (outcome?.kind === 'keep') return { text: outcomeText(outcome), tone: STATUS_TONE[a.status] };
  const label = statusLabel(a, today);
  return { text: label.text, tone: label.tone || STATUS_TONE[a.status] };
}

/** "Hẹn tiếp": the next appointment after one up to today (6h); nothing for one ahead. */
export function NextButton({
  appointment: a,
  today,
  onNext,
  children,
}: {
  appointment: AppointmentRecord;
  today: CalendarDate;
  onNext: (from: AppointmentRecord) => void;
  children: ReactNode;
}) {
  if (!isPastOrToday(a.date, today)) return null;
  return (
    <button
      type="button"
      aria-label={t('customer.nextLabel', { date: withTime(dayText(a.date, today), a.time) })}
      onClick={() => onNext(a)}
      className={LINK}
    >
      {children}
    </button>
  );
}

/**
 * Mockup customer.html "Lịch hẹn": every appointment of the customer, newest first; any one up
 * to today offers the next ("Hẹn tiếp", 6h).
 */
export function CustomerAppointments({
  appointments,
  transitions,
  today,
  onNext,
}: {
  appointments: readonly AppointmentRecord[];
  transitions: readonly StageTransition[];
  today: CalendarDate;
  onNext: (from: AppointmentRecord) => void;
}) {
  const rows = useMemo(() => {
    const outcome = outcomeResolver({ appointments, transitions });
    // Latest first, so two on one day (which the date sort keeps in this order) stay newest first.
    return appointments
      .map((appointment) => ({ appointment, outcome: outcome(appointment) }))
      .reverse();
  }, [appointments, transitions]);

  const columns = useMemo<ReadonlyArray<DataTableColumn<Row>>>(
    () => [
      {
        id: 'date',
        header: t('appointments.date'),
        kind: 'date',
        value: (r) => r.appointment.date,
        thenBy: (r) => r.appointment.time ?? '',
        cell: ({ appointment: a }) => withTime(dayText(a.date, today), a.time),
      },
      {
        id: 'result',
        header: t('appointments.outcome'),
        kind: 'text',
        value: (r) => result(r, today).text,
        cell: (r) => {
          const { text, tone } = result(r, today);
          return <span className={tone}>{text}</span>;
        },
      },
      {
        id: 'note',
        header: t('appointments.note'),
        kind: 'text',
        value: (r) => r.appointment.note,
        cell: (r) => <span className="line-clamp-1 text-fg-2">{r.appointment.note}</span>,
      },
      {
        id: 'next',
        header: '',
        kind: 'text',
        sortable: false,
        value: () => '',
        cell: ({ appointment }) => (
          <NextButton appointment={appointment} today={today} onNext={onNext}>
            {t('customer.next')}
          </NextButton>
        ),
      },
    ],
    [today, onNext],
  );

  return (
    <section
      aria-labelledby="customer-appointments"
      className="rounded-lg border border-border bg-surface-1 p-4"
    >
      <div className="mb-2 flex items-baseline gap-2">
        <h2 id="customer-appointments" className="m-0 text-sm font-medium text-heading">
          {t('customer.appointments')}
        </h2>
        <span className="text-xs text-fg-3 tabular-nums">
          {t('appointments.summary', {
            total: appointments.length,
            met: appointments.filter((a) => a.status === 'MET').length,
          })}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="m-0 text-sm text-fg-3">{t('customer.noAppointments')}</p>
      ) : (
        <DataTable
          label={t('customer.appointments')}
          columns={columns}
          rows={rows}
          getRowId={(r) => r.appointment.id}
          initialSort={{ id: 'date', desc: true }}
          moreLabels={tableMore('appointments')}
        />
      )}
      <p className="m-0 mt-2 text-xs text-fg-3">{t('customer.appointmentsHelp')}</p>
    </section>
  );
}
