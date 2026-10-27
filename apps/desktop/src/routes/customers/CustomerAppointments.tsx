import { useMemo, type ReactNode } from 'react';
import type { AppointmentRecord } from '@p2c/db';
import { appointmentGroup, type CalendarDate, type StageTransition } from '@p2c/domain';
import { DataTable, type DataTableColumn } from '@p2c/ui';
import { t, tableMore } from '../../i18n';
import { dayText, isPastOrToday, withTime, writtenDay } from '../appointments/appointment-form';
import {
  outcomeResolver,
  outcomeText,
  STATUS_TONE,
  statusLabel,
  UNRECORDED_TONE,
  type Outcome,
} from '../appointments/appointments-view';
import { CARD, HEADING, LINK } from '../classes';

interface Row {
  readonly appointment: AppointmentRecord;
  readonly outcome: Outcome;
}

/**
 * The stage move or stage kept; else the status (planned, unrecorded, rescheduled, cancelled, no
 * show), with its tone. "Chưa ghi kết quả" is text too, not the badge of the lists: the badge is
 * wider than the column, and does not wrap.
 */
function result({ appointment: a, outcome }: Row, today: CalendarDate) {
  if (outcome?.kind === 'move') return { text: outcomeText(outcome), tone: '' };
  if (outcome?.kind === 'keep') return { text: outcomeText(outcome), tone: STATUS_TONE[a.status] };
  const unrecorded = appointmentGroup(a, today) === 'unrecorded';
  return {
    text: statusLabel(a, today).text,
    tone: unrecorded ? UNRECORDED_TONE : STATUS_TONE[a.status],
  };
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

  // Built each render: `onNext` is a new function each time the profile renders (DR6-66).
  // Fixed widths, as the mockup's columns: sized by their content, a long note left the result too
  // little room at 1 440, where the card has 337 px (review of PR 838). The note takes the rest.
  const columns: ReadonlyArray<DataTableColumn<Row>> = [
    {
      id: 'date',
      header: t('appointments.date'),
      kind: 'date',
      value: (r) => r.appointment.date,
      thenBy: (r) => r.appointment.time ?? '',
      width: 'w-21',
      // One line, as the mockup (review of PR 746); a day written with its year puts its time under
      // it.
      cellClass: () => 'whitespace-nowrap',
      cell: ({ appointment: a }) => {
        const day = writtenDay(a.date, today);
        return !day.withYear || !a.time ? (
          withTime(day.text, a.time)
        ) : (
          <>
            <span className="block">{day.text}</span>
            <span className="block text-fg-3">{a.time}</span>
          </>
        );
      },
    },
    {
      id: 'result',
      header: t('appointments.outcome'),
      kind: 'text',
      value: (r) => result(r, today).text,
      // Room for the widest result on one line, "Chưa ghi kết quả": the mockup's 92 px only hold the
      // short ones. A move between the two closed stages alone takes two lines (Owner 26/10/2026).
      width: 'w-30',
      cell: (r) => {
        const { outcome } = r;
        // Mockup customer.html: "N3 → N2 · RF", the RF in the accent (T-298); the parts `outcomeText`
        // joins, joined the same way.
        if (outcome?.kind === 'move' && outcome.rf) {
          return (
            <span>
              {outcomeText({ ...outcome, rf: false })} {t('sep.dot')}{' '}
              <span className="text-accent">{t('appointments.rf')}</span>
            </span>
          );
        }
        const { text, tone } = result(r, today);
        return <span className={tone}>{text}</span>;
      },
    },
    {
      id: 'note',
      header: t('appointments.note'),
      kind: 'text',
      value: (r) => r.appointment.note,
      // A link with nowhere to break would stretch the column over the next card (DR6-117).
      cell: (r) => (
        <span className="line-clamp-1 wrap-anywhere text-fg-2">{r.appointment.note}</span>
      ),
    },
    {
      id: 'next',
      header: t('customer.colActions'),
      headerHidden: true,
      kind: 'text',
      sortable: false,
      value: () => '',
      width: 'w-14',
      // Small, as the mockup's `.act`.
      cellClass: () => 'whitespace-nowrap text-xs font-semibold',
      cell: ({ appointment }) => (
        <NextButton appointment={appointment} today={today} onNext={onNext}>
          {t('customer.next')}
        </NextButton>
      ),
    },
  ];

  return (
    <section aria-labelledby="customer-appointments" className={CARD}>
      <div className="mb-2 flex items-baseline gap-2">
        <h2 id="customer-appointments" className={HEADING}>
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
          fixed
          compact
        />
      )}
      <p className="m-0 mt-2 text-xs text-fg-3">{t('customer.appointmentsHelp')}</p>
    </section>
  );
}
