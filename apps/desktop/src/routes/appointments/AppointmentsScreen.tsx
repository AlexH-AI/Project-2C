import { useMemo, useState, type ReactNode } from 'react';
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
  appointmentGroup,
  compareDates,
  formatDate,
  formatDayMonth,
  formatCount,
  formatDayOfMonth,
  formatPeriodValue,
  isInPeriod,
  periodOf,
  type AppointmentGroup,
  type AppointmentStatus,
  type CalendarDate,
  type Period,
} from '@p2c/domain';
import { Button, DataTable, PeriodPicker, SelectField, type DataTableColumn } from '@p2c/ui';
import { useAppData, useQuery } from '../../data/AppDataContext';
import { joinParts, t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { RePicker } from '../../shell/RePicker';
import { teamRes } from '../../shell/scope';
import { useScopeState } from '../../shell/ScopeContext';
import { ALERT } from '../customers/CustomerDialogs';
import { PERIOD_LABELS } from '../period-labels';
import { AppointmentDialog } from './AppointmentDialog';
import { DeleteAppointmentDialog } from './DeleteAppointmentDialog';
import { EditOutcomeDialog } from './EditOutcomeDialog';
import { OutcomeDialog } from './OutcomeDialog';
import { RescheduleDialog } from './RescheduleDialog';
import { YearGrid } from './YearGrid';
import { isPastOrToday } from './appointment-form';
import {
  APPOINTMENT_GROUPS,
  appointmentRows,
  appointmentsByRe,
  CARD,
  dateTone,
  dayBoard,
  DATE_TONE_CELL,
  FOCUS,
  groupTotal,
  monthGrid,
  outcomeText,
  personLabel,
  pickDay,
  rescheduleLinks,
  revealCreated,
  statusLabel,
  summaryText,
  yearGrid,
  type AppointmentRow,
  type CoordinatorFilter,
  type DayCell,
} from './appointments-view';

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
  const { picked, scope, pickRe } = useScopeState();
  const [period, setPeriod] = useState(() => periodOf('month', today));
  const [day, setDay] = useState(today);
  const [coordinator, setCoordinator] = useState<CoordinatorFilter>('any');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState<{ from?: AppointmentRow } | null>(null);
  const [moving, setMoving] = useState<AppointmentRow | null>(null);
  const [recording, setRecording] = useState<AppointmentRow | null>(null);
  const [editing, setEditing] = useState<AppointmentRow | null>(null);
  const [deleting, setDeleting] = useState<AppointmentRow | null>(null);
  // The appointment just made for an RE outside the scope, while it is the one selected.
  const [hiddenCreated, setHiddenCreated] = useState<AppointmentRecord | null>(null);

  const pickedRows = useMemo(
    () => appointmentRows(data, picked, coordinator),
    [data, picked, coordinator],
  );
  const rows = useMemo(
    () => (scope === picked ? pickedRows : appointmentRows(data, scope, coordinator)),
    [data, scope, picked, coordinator, pickedRows],
  );
  const inPeriod = useMemo(
    // Latest first, so two on one day (which the date sort keeps in this order) stay newest first.
    () => rows.filter((row) => isInPeriod(row.appointment.date, period)).reverse(),
    [rows, period],
  );
  // The RE strip and its "đang xem" line belong to the Team scope (mockup phase-3-feedback B3).
  const team =
    picked.kind === 'team' ? data.teams.find((item) => item.id === picked.teamId) : undefined;
  const re =
    scope !== picked && scope.kind === 're'
      ? data.people.find((person) => person.id === scope.reId)
      : undefined;
  // today() is a new object each render; its fields keep the grid and the columns stable.
  const { year: thisYear, month: thisMonth, day: thisDay } = today;
  const yearCells = useMemo(
    () => yearGrid(period.start.year, rows, { year: thisYear, month: thisMonth, day: thisDay }),
    [period.start.year, rows, thisYear, thisMonth, thisDay],
  );
  const reCounts = useMemo(() => appointmentsByRe(pickedRows, period), [pickedRows, period]);
  const summary = summaryText({
    total: inPeriod.length,
    met: inPeriod.filter((row) => row.appointment.status === 'MET').length,
    unrecorded: inPeriod.filter((row) => appointmentGroup(row.appointment, today) === 'unrecorded')
      .length,
  });
  const selected = rows.find((row) => row.appointment.id === selectedId);
  const coordinatorOptions = [
    { value: 'any', label: t('appointments.coordinatorAny') },
    { value: 'none', label: t('appointments.coordinatorNone') },
    ...data.people
      .filter((person) => person.role !== 'RE')
      .map((person) => ({ value: person.id, label: personLabel(person) })),
  ];

  const columns = useMemo<ReadonlyArray<DataTableColumn<AppointmentRow>>>(() => {
    const day = { year: thisYear, month: thisMonth, day: thisDay };
    return [
      {
        id: 'date',
        header: t('appointments.date'),
        kind: 'date',
        value: (r) => r.appointment.date,
        cellClass: (r) => DATE_TONE_CELL[dateTone(r.appointment.date, day)],
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
        value: (r) => statusLabel(r.appointment, day).text,
        cell: (r) => {
          const label = statusLabel(r.appointment, day);
          return <span className={label.tone}>{label.text}</span>;
        },
      },
      {
        id: 'outcome',
        header: t('appointments.outcome'),
        kind: 'text',
        value: (r) => outcomeText(r.outcome),
      },
    ];
  }, [thisYear, thisMonth, thisDay]);

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

  // Shows the day of the appointment just made (or linked by a reschedule), so it is there to see.
  // A coordinator filter hiding it is cleared; the scope is shared by every screen, so a line
  // says it hides it.
  const show = (created: AppointmentRecord) => {
    const reveal = revealCreated(created, data.people, scope, coordinator);
    setPeriod(pickDay(period, created.date) ?? periodOf('month', created.date));
    setDay(created.date);
    setCoordinator(reveal.coordinator);
    setSelectedId(created.id);
    setHiddenCreated(reveal.outsideScope ? created : null);
  };
  const outside = hiddenCreated?.id === selectedId && !selected ? hiddenCreated : null;

  return (
    <>
      {team && (
        <RePicker
          team={team}
          res={teamRes(data.people, team.id)}
          picked={re?.id ?? null}
          counts={reCounts}
          total={[...reCounts.values()].reduce((sum, n) => sum + n, 0)}
          onPick={pickRe}
        />
      )}
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
        <span className="text-sm text-fg-2 tabular-nums">
          {re ? (
            <>
              <b className="font-semibold text-fg">{re.name}</b> {t('sep.dot')} {summary}
            </>
          ) : team ? (
            joinParts([t('appointments.viewingTeam', { team: team.name }), summary])
          ) : (
            summary
          )}
        </span>
        <Button variant="primary" onClick={() => setCreating({})}>
          {t('appointments.new')}
        </Button>
      </div>
      {outside && (
        <p role="status" className={`${ALERT} border-info text-sm`}>
          {t('appointments.createdOutside', {
            date: formatDate(outside.date),
            re: data.people.find((person) => person.id === outside.reId)?.name ?? '',
          })}
        </p>
      )}
      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          {period.kind === 'year' ? (
            // The year has no day of its own: the grid opens a month (mockup phase-3-feedback B6).
            <YearGrid
              cells={yearCells}
              year={period.start.year}
              onPickMonth={(month) =>
                changePeriod(periodOf('month', { year: period.start.year, month, day: 1 }))
              }
            />
          ) : (
            <>
              <MonthCalendar period={period} day={day} today={today} rows={rows} onPick={pick} />
              <DayTable day={day} rows={rows} onSelect={setSelectedId} />
            </>
          )}
        </div>
        <Detail
          row={selected}
          links={selected && rescheduleLinks(data.appointments, selected.appointment)}
          today={today}
          onNext={(from) => setCreating({ from })}
          onReschedule={setMoving}
          onRecord={setRecording}
          onEdit={setEditing}
          onDelete={setDeleting}
          onShow={show}
        />
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
        <AppointmentDialog
          data={data}
          customer={creating.from?.customer}
          from={creating.from?.appointment}
          onClose={() => setCreating(null)}
          onCreated={show}
        />
      )}
      {moving && <RescheduleDialog row={moving} onClose={() => setMoving(null)} onMoved={show} />}
      {recording?.customer && (
        <OutcomeDialog
          row={{ ...recording, customer: recording.customer }}
          people={data.people}
          transitions={data.transitions}
          onClose={() => setRecording(null)}
          onMoved={show}
        />
      )}
      {editing?.customer && (
        <EditOutcomeDialog
          row={{ ...editing, customer: editing.customer }}
          people={data.people}
          transitions={data.transitions}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting?.customer && (
        <DeleteAppointmentDialog
          appointment={deleting.appointment}
          customer={deleting.customer}
          caused={undefined}
          onClose={() => setDeleting(null)}
          onDeleted={() => setDeleting(null)}
        />
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
  // today is a new object each render; its fields keep the grid stable.
  const { year, month: thisMonth, day: thisDay } = today;
  const weeks = useMemo(
    () => monthGrid(day, rows, period, { year, month: thisMonth, day: thisDay }),
    [day, rows, period, year, thisMonth, thisDay],
  );
  const month = formatPeriodValue(periodOf('month', day));
  const days = weeks.flat().filter((cell): cell is DayCell => cell?.inMonth === true);
  const sum = (count: (cell: DayCell) => number) => days.reduce((n, cell) => n + count(cell), 0);
  return (
    <section aria-labelledby="appointments-calendar" className={CARD}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 id="appointments-calendar" className="m-0 text-sm font-medium text-heading">
          {t('appointments.calendar', { month })}
        </h2>
        <span className="text-xs text-fg-3 tabular-nums">
          {summaryText({
            total: sum(groupTotal),
            met: sum((cell) => cell.met),
            unrecorded: sum((cell) => cell.unrecorded),
          })}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((n) => (
          <span key={n} className="px-1.5 text-xs tracking-wider text-fg-3 uppercase">
            {t(`weekday.${n}`)}
          </span>
        ))}
        {weeks.flat().map((cell, i) =>
          // After 31/12/2100: a blank cell that cannot be picked (spec Phase 4 §3.4).
          cell === null ? (
            <div key={`blank-${i}`} aria-hidden="true" />
          ) : (
            <DayButton
              key={formatDate(cell.date)}
              cell={cell}
              pickable={(cell.inMonth && pickDay(period, cell.date) !== null) || cell.inPeriod}
              weekend={i % 7 >= 5}
              picked={compareDates(cell.date, day) === 0}
              isToday={compareDates(cell.date, today) === 0}
              onPick={onPick}
            />
          ),
        )}
      </div>
      <p className="m-0 mt-2.5 flex flex-wrap gap-3.5 text-xs text-fg-2">
        {APPOINTMENT_GROUPS.map((group) => (
          <span key={group.key}>
            <Dot kind={group.key} /> {t(group.label)}
          </span>
        ))}
      </p>
    </section>
  );
}

const DOT = Object.fromEntries(APPOINTMENT_GROUPS.map((group) => [group.key, group.dot])) as Record<
  AppointmentGroup,
  string
>;

/** The dots of a day (mockup overview.html part 2). */
const DOT_ORDER = ['unrecorded', 'missed', 'met', 'planned'] as const;

function Dot({ kind }: { kind: AppointmentGroup }) {
  return <i aria-hidden="true" className={`inline-block size-2 rounded-full ${DOT[kind]}`} />;
}

const CELL = 'relative flex min-h-15 flex-col rounded-sm border px-2 py-1.5 text-left tabular-nums';

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
  // A day of the period in another month says which month, and picking it moves the calendar there.
  const otherMonth = cell.inPeriod && !cell.inMonth;
  const background = picked
    ? 'bg-accent-soft'
    : cell.inPeriod
      ? 'bg-period-band'
      : weekend
        ? 'bg-surface-1'
        : 'bg-surface-2';
  const border = picked
    ? 'border-accent'
    : isToday
      ? 'border-date-today'
      : cell.inPeriod
        ? 'border-period-band-border'
        : 'border-border';
  const dayNumber = (
    <span className={picked ? 'text-sm font-bold text-accent' : 'text-xs text-fg-3'}>
      {otherMonth ? formatDayMonth(cell.date) : formatDayOfMonth(cell.date)}
      {isToday && (
        <span className="ml-1 inline-block text-xs font-normal whitespace-nowrap text-date-today">
          {t('appointments.todayTag')}
        </span>
      )}
    </span>
  );
  const ring = isToday ? 'inset-ring inset-ring-date-today' : '';
  // Days outside the month and the period only fill the weeks, days outside a custom range
  // cannot be picked: the period picker moves there.
  if (!pickable) {
    return (
      <div aria-hidden="true" className={`${CELL} opacity-35 ${border} ${ring} ${background}`}>
        {dayNumber}
      </div>
    );
  }
  const count = groupTotal(cell);
  // Unrecorded first, so a day of many appointments never hides the ones still to record.
  const dots = DOT_ORDER.flatMap((kind) => Array<AppointmentGroup>(cell[kind]).fill(kind)).slice(
    0,
    8,
  );
  return (
    <button
      type="button"
      aria-pressed={picked}
      aria-current={isToday ? 'date' : undefined}
      aria-label={t('appointments.dayCount', { date: formatDate(cell.date), count })}
      onClick={() => onPick(cell.date)}
      className={`${CELL} cursor-pointer ${FOCUS} ${background} ${border} ${ring}`}
    >
      <span className="flex items-start justify-between">
        {dayNumber}
        <b className="text-lg">{count > 0 ? formatCount(count) : ''}</b>
      </span>
      <span className="mt-auto flex gap-0.5">
        {dots.map((kind, i) => (
          <Dot key={i} kind={kind} />
        ))}
      </span>
      {otherMonth && (
        <span aria-hidden="true" className="absolute right-1.5 bottom-1 text-xs text-accent">
          {t('sep.arrow')}
        </span>
      )}
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

/** The statuses whose outcome can be edited (mockup 6f). */
const EDITABLE: readonly AppointmentStatus[] = ['MET', 'CANCELLED', 'NO_SHOW'];

const dateTime = (a: AppointmentRecord) => [formatDate(a.date), a.time].filter(Boolean).join(' ');

function Detail({
  row,
  links,
  today,
  onNext,
  onReschedule,
  onRecord,
  onEdit,
  onDelete,
  onShow,
}: {
  row: AppointmentRow | undefined;
  links: ReturnType<typeof rescheduleLinks> | undefined;
  today: CalendarDate;
  onNext: (from: AppointmentRow) => void;
  onReschedule: (row: AppointmentRow) => void;
  onRecord: (row: AppointmentRow) => void;
  onEdit: (row: AppointmentRow) => void;
  /** Planned appointments only: they moved no stage (D7); rescheduled ones sit in a chain. */
  onDelete: (row: AppointmentRow) => void;
  onShow: (appointment: AppointmentRecord) => void;
}) {
  if (!row) {
    return (
      <aside aria-label={t('appointments.detail')} className={`${CARD} w-full lg:w-84 lg:shrink-0`}>
        <p className="m-0 text-sm text-fg-3">{t('appointments.detailEmpty')}</p>
      </aside>
    );
  }
  const a = row.appointment;
  const link = (other: AppointmentRecord) => (
    <button
      type="button"
      onClick={() => onShow(other)}
      className={`cursor-pointer rounded-sm text-accent tabular-nums hover:underline ${FOCUS}`}
    >
      {dateTime(other)}
    </button>
  );
  const facts: [string, ReactNode][] = [
    [t('appointments.re'), joinParts([row.re?.name, row.team?.name])],
    [t('appointments.coordinators'), row.coordinators.map(personLabel).join(', ') || '—'],
    [t('appointments.trigger'), joinParts([t(`trigger.${a.triggerType}`), a.triggerNote])],
    [t('appointments.status'), t(`appointmentStatus.${a.status}`)],
    [t('appointments.outcome'), outcomeText(row.outcome) || '—'],
    [t('appointments.note'), a.note || '—'],
  ];
  if (links?.from) facts.push([t('appointments.rescheduledFrom'), link(links.from)]);
  if (links?.to) facts.push([t('appointments.rescheduledToLink'), link(links.to)]);
  return (
    <aside
      aria-label={t('appointments.detail')}
      className={`${CARD} flex w-full flex-col gap-3 lg:sticky lg:top-20 lg:w-84 lg:shrink-0`}
    >
      <h2 className="m-0 text-base font-semibold tabular-nums">
        {joinParts([dateTime(a), row.customer?.name])}
      </h2>
      <dl className="m-0 flex flex-col gap-1.5 text-sm">
        {facts.map(([term, value]) => (
          <div key={term} className="flex gap-3">
            <dt className="w-24 shrink-0 text-fg-3">{term}</dt>
            <dd className="m-0 whitespace-pre-line">{value}</dd>
          </div>
        ))}
      </dl>
      <a
        href={routeToHash({ screen: 'customer', id: a.customerId })}
        className={`self-start rounded-sm text-sm text-accent hover:underline ${FOCUS}`}
      >
        {t('appointments.profile')}
      </a>
      <div className="flex flex-wrap gap-2">
        {a.status === 'SCHEDULED' && row.customer && (
          <Button variant="primary" onClick={() => onRecord(row)}>
            {t('appointments.record')}
          </Button>
        )}
        {a.status === 'SCHEDULED' && (
          <Button onClick={() => onReschedule(row)}>{t('appointments.reschedule')}</Button>
        )}
        {EDITABLE.includes(a.status) && row.customer && (
          <Button onClick={() => onEdit(row)}>{t('appointments.edit')}</Button>
        )}
        {row.customer && isPastOrToday(a.date, today) && (
          <Button onClick={() => onNext(row)}>{t('appointments.next')}</Button>
        )}
        {a.status === 'SCHEDULED' && row.customer && (
          <Button onClick={() => onDelete(row)}>{t('appointments.delete')}</Button>
        )}
      </div>
    </aside>
  );
}
