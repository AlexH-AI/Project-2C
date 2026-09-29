import { useMemo, useState } from 'react';
import {
  listAppointments,
  listCustomers,
  listPeople,
  listStageTransitions,
  listTeams,
  type AppointmentRecord,
  type Database,
} from '@p2c/db';
import {
  compareDates,
  formatDate,
  formatPeriodValue,
  isInPeriod,
  periodOf,
  type CalendarDate,
  type Period,
} from '@p2c/domain';
import { Button, DataTable, PeriodPicker, SelectField, type DataTableColumn } from '@p2c/ui';
import { useAppData, useQuery } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { useScope } from '../../shell/ScopeContext';
import { PERIOD_LABELS } from '../period-labels';
import { AppointmentDialog } from './AppointmentDialog';
import {
  appointmentRows,
  dayBoard,
  monthGrid,
  outcomeText,
  personLabel,
  pickDay,
  type AppointmentRow,
  type CoordinatorFilter,
  type DayCell,
} from './appointments-view';

const CARD = 'rounded-lg border border-border bg-surface-1 p-4';
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-accent';
const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const;

const readAppointments = (db: Database) => ({
  appointments: listAppointments(db),
  customers: listCustomers(db),
  people: listPeople(db),
  teams: listTeams(db),
  transitions: listStageTransitions(db),
});

const triggerText = ({ appointment: a }: AppointmentRow) =>
  a.triggerNote ?? t(`trigger.${a.triggerType}`);

const coordinatorText = (row: AppointmentRow) =>
  row.coordinators.map((person) => person.role).join(', ') || '—';

/** The day shown when the period changes: today if it is in the period, else its first day. */
const dayIn = (period: Period, today: CalendarDate) =>
  isInPeriod(today, period) ? today : period.start;

/** Appointments (mockup appointments.html): month calendar, the day by team → RE, the list, a detail. */
export function AppointmentsScreen() {
  const today = useAppData().today();
  const data = useQuery(readAppointments);
  const scope = useScope();
  const [period, setPeriod] = useState(() => periodOf('month', today));
  const [day, setDay] = useState(today);
  const [coordinator, setCoordinator] = useState<CoordinatorFilter>('any');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const rows = useMemo(() => appointmentRows(data, scope, coordinator), [data, scope, coordinator]);
  const inPeriod = useMemo(
    () => rows.filter((row) => isInPeriod(row.appointment.date, period)),
    [rows, period],
  );
  const selected = rows.find((row) => row.appointment.id === selectedId);
  const coordinatorOptions = [
    { value: 'any', label: t('appointments.coordinatorAny') },
    { value: 'none', label: t('appointments.coordinatorNone') },
    ...data.people
      .filter((person) => person.role !== 'RE')
      .map((person) => ({ value: person.id, label: personLabel(person) })),
  ];

  const columns = useMemo<ReadonlyArray<DataTableColumn<AppointmentRow>>>(
    () => [
      {
        id: 'date',
        header: t('appointments.date'),
        kind: 'date',
        value: (r) => r.appointment.date,
      },
      {
        id: 'time',
        header: t('appointments.time'),
        kind: 'text',
        value: (r) => r.appointment.time ?? '',
        cell: (r) => <span className="tabular-nums">{r.appointment.time}</span>,
      },
      {
        id: 'customer',
        header: t('appointments.customer'),
        kind: 'text',
        value: (r) => r.customer?.name ?? '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => setSelectedId(r.appointment.id)}
            className={`cursor-pointer rounded-sm font-semibold hover:underline ${FOCUS}`}
          >
            {r.customer?.name}
          </button>
        ),
      },
      { id: 're', header: t('appointments.re'), kind: 'text', value: (r) => r.re?.name ?? '' },
      { id: 'trigger', header: t('appointments.trigger'), kind: 'text', value: triggerText },
      {
        id: 'coordinators',
        header: t('appointments.coordinators'),
        kind: 'text',
        value: coordinatorText,
      },
      {
        id: 'status',
        header: t('appointments.status'),
        kind: 'text',
        value: (r) => t(`appointmentStatus.${r.appointment.status}`),
      },
      {
        id: 'outcome',
        header: t('appointments.outcome'),
        kind: 'text',
        value: (r) => outcomeText(r.outcome),
      },
    ],
    [],
  );

  const changePeriod = (next: Period) => {
    setPeriod(next);
    setDay(dayIn(next, today));
  };
  const pick = (date: CalendarDate) => {
    const next = pickDay(period, date);
    if (!next) return;
    setPeriod(next);
    setDay(date);
  };

  // Shows the day of the appointment just made, so it is there to see.
  const showCreated = (created: AppointmentRecord) => {
    setPeriod(pickDay(period, created.date) ?? periodOf('month', created.date));
    setDay(created.date);
    setSelectedId(created.id);
  };

  return (
    <>
      <div className="flex flex-wrap items-end gap-3">
        <PeriodPicker value={period} onChange={changePeriod} today={today} labels={PERIOD_LABELS} />
        <div className="w-60">
          <SelectField
            label={t('appointments.coordinator')}
            value={coordinator}
            options={coordinatorOptions}
            onChange={setCoordinator}
          />
        </div>
        <div className="flex-1" />
        <Button variant="primary" onClick={() => setCreating(true)}>
          {t('appointments.new')}
        </Button>
        <span className="text-sm text-fg-2 tabular-nums">
          {t('appointments.summary', {
            total: inPeriod.length,
            met: inPeriod.filter((row) => row.appointment.status === 'MET').length,
          })}
        </span>
      </div>
      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <MonthCalendar period={period} day={day} today={today} rows={rows} onPick={pick} />
          <DayTable day={day} rows={rows} onSelect={setSelectedId} />
        </div>
        <Detail row={selected} />
      </div>
      <section aria-labelledby="appointments-list" className={CARD}>
        <h2 id="appointments-list" className="m-0 mb-2 text-sm font-medium text-heading">
          {t('appointments.list')}
        </h2>
        <DataTable
          label={t('appointments.list')}
          columns={columns}
          rows={inPeriod}
          getRowId={(r) => r.appointment.id}
          initialSort={{ id: 'date', desc: true }}
        />
      </section>
      {creating && (
        <AppointmentDialog data={data} onClose={() => setCreating(false)} onCreated={showCreated} />
      )}
    </>
  );
}

function MonthCalendar({
  period,
  day,
  today,
  rows,
  onPick,
}: {
  period: Period;
  day: CalendarDate;
  today: CalendarDate;
  rows: readonly AppointmentRow[];
  onPick: (date: CalendarDate) => void;
}) {
  const weeks = useMemo(() => monthGrid(day, rows), [day, rows]);
  const month = formatPeriodValue(periodOf('month', day));
  const days = weeks.flat().filter((cell) => cell.inMonth);
  const met = days.reduce((sum, cell) => sum + cell.met, 0);
  const total = days.reduce((sum, cell) => sum + cell.met + cell.planned + cell.missed, 0);
  return (
    <section aria-labelledby="appointments-calendar" className={CARD}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 id="appointments-calendar" className="m-0 text-sm font-medium text-heading">
          {t('appointments.calendar', { month })}
        </h2>
        <span className="text-xs text-fg-3 tabular-nums">
          {t('appointments.summary', { total, met })}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((n) => (
          <span key={n} className="px-1.5 text-xs tracking-wider text-fg-3 uppercase">
            {t(`weekday.${n}`)}
          </span>
        ))}
        {weeks.flat().map((cell, i) => (
          <DayButton
            key={formatDate(cell.date)}
            cell={cell}
            pickable={cell.inMonth && pickDay(period, cell.date) !== null}
            weekend={i % 7 >= 5}
            picked={compareDates(cell.date, day) === 0}
            isToday={compareDates(cell.date, today) === 0}
            onPick={onPick}
          />
        ))}
      </div>
      <p className="m-0 mt-2.5 flex gap-3.5 text-xs text-fg-2">
        <span>
          <Dot kind="met" /> {t('appointments.legendMet')}
        </span>
        <span>
          <Dot kind="planned" /> {t('appointments.legendPlanned')}
        </span>
        <span>
          <Dot kind="missed" /> {t('appointments.legendMissed')}
        </span>
      </p>
    </section>
  );
}

const DOT = {
  met: 'bg-ok',
  planned: 'border border-info',
  missed: 'bg-warn',
} as const;

function Dot({ kind }: { kind: keyof typeof DOT }) {
  return <i aria-hidden="true" className={`inline-block size-2 rounded-full ${DOT[kind]}`} />;
}

const CELL = 'flex min-h-15 flex-col rounded-sm border px-2 py-1.5 text-left tabular-nums';

function DayButton({
  cell,
  pickable,
  weekend,
  picked,
  isToday,
  onPick,
}: {
  cell: DayCell;
  pickable: boolean;
  weekend: boolean;
  picked: boolean;
  isToday: boolean;
  onPick: (date: CalendarDate) => void;
}) {
  const background = picked ? 'bg-accent-soft' : weekend ? 'bg-surface-1' : 'bg-surface-2';
  const dayNumber = (
    <span className={`text-xs ${isToday ? 'font-bold text-accent' : 'text-fg-3'}`}>
      {String(cell.date.day).padStart(2, '0')}
    </span>
  );
  // Days outside the month only fill the weeks, days outside a custom range cannot be picked:
  // the period picker moves there.
  if (!pickable) {
    return (
      <div aria-hidden="true" className={`${CELL} border-border opacity-35 ${background}`}>
        {dayNumber}
      </div>
    );
  }
  const count = cell.met + cell.planned + cell.missed;
  const dots = [
    ...Array<'met'>(cell.met).fill('met'),
    ...Array<'planned'>(cell.planned).fill('planned'),
    ...Array<'missed'>(cell.missed).fill('missed'),
  ].slice(0, 8);
  return (
    <button
      type="button"
      aria-pressed={picked}
      aria-label={t('appointments.dayCount', { date: formatDate(cell.date), count })}
      onClick={() => onPick(cell.date)}
      className={`${CELL} cursor-pointer ${FOCUS} ${background} ${
        picked || isToday ? 'border-accent' : 'border-border'
      } ${isToday ? 'inset-ring inset-ring-accent' : ''}`}
    >
      <span className="flex items-start justify-between">
        {dayNumber}
        <b className="text-lg">{count > 0 ? count : ''}</b>
      </span>
      <span className="mt-auto flex gap-0.5">
        {dots.map((kind, i) => (
          <Dot key={i} kind={kind} />
        ))}
      </span>
    </button>
  );
}

function DayTable({
  day,
  rows,
  onSelect,
}: {
  day: CalendarDate;
  rows: readonly AppointmentRow[];
  onSelect: (id: string) => void;
}) {
  const groups = useMemo(() => dayBoard(rows, day), [rows, day]);
  return (
    <section aria-labelledby="appointments-day" className={CARD}>
      <h2 id="appointments-day" className="m-0 mb-2 text-sm font-medium text-heading">
        {t('appointments.day', { date: formatDate(day) })}
      </h2>
      {groups.length === 0 && <p className="m-0 text-sm text-fg-3">{t('appointments.dayEmpty')}</p>}
      {groups.map((group) => (
        <section
          key={group.team?.id ?? ''}
          aria-label={group.team?.name}
          className="mb-3 last:mb-0"
        >
          <h3 className="m-0 mb-1 text-sm font-semibold">{group.team?.name}</h3>
          {group.res.map(({ re, rows: list }) => (
            <section key={re?.id} aria-label={re?.name} className="mb-1.5 pl-3">
              <h4 className="m-0 text-xs font-medium text-fg-2">{re?.name}</h4>
              <ul className="m-0 list-none p-0 text-sm">
                {list.map((row) => (
                  <li key={row.appointment.id} className="flex gap-3 py-0.5">
                    <span className="w-11 text-fg-3 tabular-nums">{row.appointment.time}</span>
                    <button
                      type="button"
                      onClick={() => onSelect(row.appointment.id)}
                      className={`cursor-pointer truncate rounded-sm hover:underline ${FOCUS}`}
                    >
                      {row.customer?.name}
                    </button>
                    <span className="ml-auto text-xs text-fg-3">
                      {t(`appointmentStatus.${row.appointment.status}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </section>
      ))}
    </section>
  );
}

function Detail({ row }: { row: AppointmentRow | undefined }) {
  if (!row) {
    return (
      <aside aria-label={t('appointments.detail')} className={`${CARD} w-full lg:w-84 lg:shrink-0`}>
        <p className="m-0 text-sm text-fg-3">{t('appointments.detailEmpty')}</p>
      </aside>
    );
  }
  const a = row.appointment;
  const facts: [string, string][] = [
    [t('appointments.re'), [row.re?.name, row.team?.name].filter(Boolean).join(' · ')],
    [t('appointments.coordinators'), row.coordinators.map(personLabel).join(', ') || '—'],
    [
      t('appointments.trigger'),
      [t(`trigger.${a.triggerType}`), a.triggerNote].filter(Boolean).join(' · '),
    ],
    [t('appointments.status'), t(`appointmentStatus.${a.status}`)],
    [t('appointments.outcome'), outcomeText(row.outcome) || '—'],
    [t('appointments.note'), a.note || '—'],
  ];
  return (
    <aside
      aria-label={t('appointments.detail')}
      className={`${CARD} flex w-full flex-col gap-3 lg:sticky lg:top-20 lg:w-84 lg:shrink-0`}
    >
      <h2 className="m-0 text-base font-semibold tabular-nums">
        {[formatDate(a.date), a.time].filter(Boolean).join(' ')} · {row.customer?.name}
      </h2>
      <dl className="m-0 flex flex-col gap-1.5 text-sm">
        {facts.map(([term, value]) => (
          <div key={term} className="flex gap-3">
            <dt className="w-24 shrink-0 text-fg-3">{term}</dt>
            <dd className="m-0">{value}</dd>
          </div>
        ))}
      </dl>
      <a
        href={routeToHash({ screen: 'customer', id: a.customerId })}
        className={`self-start rounded-sm text-sm text-accent hover:underline ${FOCUS}`}
      >
        {t('appointments.profile')}
      </a>
    </aside>
  );
}
