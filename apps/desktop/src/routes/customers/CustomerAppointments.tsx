import { useMemo } from 'react';
import type { AppointmentRecord } from '@p2c/db';
import type { CalendarDate, StageTransition } from '@p2c/domain';
import { DataTable, type DataTableColumn } from '@p2c/ui';
import { t } from '../../i18n';
import { STATUS_TONE } from '../appointments/AppointmentDialog';
import { dayText, isPastOrToday } from '../appointments/appointment-form';
import { outcomeResolver, outcomeText, type Outcome } from '../appointments/appointments-view';

interface Row {
  readonly appointment: AppointmentRecord;
  readonly outcome: Outcome;
}

/** The stage move or stage kept; else the status (planned, rescheduled, cancelled, no show). */
const resultText = ({ appointment: a, outcome }: Row) =>
  outcome?.kind === 'move' || outcome?.kind === 'keep'
    ? outcomeText(outcome)
    : t(`appointmentStatus.${a.status}`);

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
    return appointments.map((appointment) => ({ appointment, outcome: outcome(appointment) }));
  }, [appointments, transitions]);

  const columns = useMemo<ReadonlyArray<DataTableColumn<Row>>>(
    () => [
      {
        id: 'date',
        header: t('appointments.date'),
        kind: 'date',
        value: (r) => r.appointment.date,
        cell: ({ appointment: a }) => [dayText(a.date, today), a.time].filter(Boolean).join(' '),
      },
      {
        id: 'result',
        header: t('appointments.outcome'),
        kind: 'text',
        value: resultText,
        cell: (r) => (
          <span className={r.outcome?.kind === 'move' ? '' : STATUS_TONE[r.appointment.status]}>
            {resultText(r)}
          </span>
        ),
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
        cell: ({ appointment: a }) =>
          isPastOrToday(a.date, today) && (
            <button
              type="button"
              aria-label={t('customer.nextLabel', { date: dayText(a.date, today) })}
              onClick={() => onNext(a)}
              className="cursor-pointer rounded-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {t('customer.next')}
            </button>
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
        />
      )}
      <p className="m-0 mt-2 text-xs text-fg-3">{t('customer.appointmentsHelp')}</p>
    </section>
  );
}
