import { useEffect, useMemo, useState } from 'react';
import type { AppointmentRecord } from '@p2c/db';
import {
  CLOSED_STAGES,
  PIPELINE_STAGES,
  formatDate,
  formatIsoDate,
  periodOf,
  weekdayOf,
  type CalendarDate,
  type Period,
} from '@p2c/domain';
import {
  Button,
  Count,
  DataTable,
  PeriodPill,
  Segmented,
  StateNote,
  type DataTableColumn,
  type DataTableView,
} from '@p2c/ui';
import { useTables, useToday } from '../../data/AppDataContext';
import { joinParts, t, tableMore } from '../../i18n';
import { CustomerName } from '../../shell/NameMask';
import { routeToHash } from '../../shell/routes';
import { ScreenBar } from '../../shell/ScreenBar';
import { isReturning, navigate } from '../../shell/useRoute';
import { BADGE, CARD, CARD_SKIN, CELL_NAME, HEADING, LINK, ROOMY } from '../classes';
import { CustomerFormDialog } from '../customers/CustomerDialogs';
import {
  KPI_STEP,
  kpiText,
  viewingLine,
  viewingText,
  type KpiTile,
} from '../overview/overview-view';
import { PERIOD_LABELS } from '../period-labels';
import { stageBadge } from '../stage-badge';
import { Boundary } from './Boundary';
import { PersonDialog } from './PersonDialogs';
import {
  CADENCE_MARKS,
  appointmentsByCustomer,
  cadence,
  cadenceLabel,
  cadenceWeekTitle,
  lastMetKey,
  nextKey,
  rmView,
  type CadenceMark,
  type CadenceWeek,
  type RmCustomer,
} from './rm-view';

/** The RM page as last left: its period, the closed or open customers, the sort and rows shown. */
let left: { rmId?: string; period?: Period; closed: boolean; table?: DataTableView } = {
  closed: false,
};

const keepTable = (table: DataTableView) => {
  left = { ...left, table };
};

const STAGES = [...PIPELINE_STAGES, ...CLOSED_STAGES];
const SMALL = 'block text-xs text-fg-3';

/** "29 ngày trước" under the day of the last meeting, in orange past four weeks. */
function LastMet({ row }: { row: RmCustomer }) {
  if (!row.lastMet) return <span className="text-fg-3">{t('rmPage.neverMet')}</span>;
  const { date, daysAgo } = row.lastMet;
  return (
    <>
      {formatDate(date)}
      <small className={`${SMALL} ${row.stale ? 'text-warn' : ''}`}>
        {daysAgo === 0 ? t('rmPage.today') : t('rmPage.daysAgo', { count: daysAgo })}
      </small>
    </>
  );
}

/** "12/11/2026 · 14:00" over "Thứ Năm · còn 2 ngày". */
function Next({ row }: { row: RmCustomer }) {
  if (!row.next) return <span className="text-fg-3">{t('rmPage.noNext')}</span>;
  const { date, time, daysAhead } = row.next;
  const weekday = t(`weekdayLong.${weekdayOf(date)}`);
  return (
    <>
      {joinParts([formatDate(date), time])}
      <small className={SMALL}>
        {daysAhead === 0 ? t('rmPage.today') : t('rmPage.daysAhead', { weekday, count: daysAhead })}
      </small>
    </>
  );
}

/** Each shape its own, not only its colour (mockup `.cad`): filled, ring with a dot, ring, cross. */
const MARK: Record<CadenceMark, string> = {
  met: 'bg-ok',
  unrecorded:
    'inset-ring-2 inset-ring-warn after:absolute after:inset-1 after:rounded-full after:bg-warn',
  planned: 'inset-ring-2 inset-ring-accent',
  missed:
    'before:absolute before:inset-x-px before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:rotate-45 before:rounded-full before:bg-danger after:absolute after:inset-x-px after:top-1/2 after:h-0.5 after:-translate-y-1/2 after:-rotate-45 after:rounded-full after:bg-danger',
  none: 'bg-fill-1 inset-ring inset-ring-hairline',
};

const Week = ({ mark, title }: { mark: CadenceMark; title?: string }) => (
  <i title={title} className={`relative size-3 shrink-0 ${MARK[mark]}`} />
);

/** "Nhịp gặp · 8 tuần" (mockup `#rm`): a week by the pointer, the strip as one sentence. */
function Cadence({ weeks }: { weeks: readonly CadenceWeek[] }) {
  return (
    <span role="img" aria-label={cadenceLabel(weeks)} className="inline-flex gap-0.75 align-middle">
      {weeks.map((week) => (
        <Week key={formatIsoDate(week.start)} mark={week.mark} title={cadenceWeekTitle(week)} />
      ))}
    </span>
  );
}

function Legend() {
  return (
    <ul
      aria-label={t('rmPage.cadence.legend')}
      className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-xs text-fg-2"
    >
      {CADENCE_MARKS.map((mark) => (
        <li key={mark} className="inline-flex items-center gap-1.5">
          <Week mark={mark} />
          {t(`rmPage.cadence.${mark}`)}
        </li>
      ))}
    </ul>
  );
}

/**
 * The columns of the list (mockup `#rm`); the strip of each customer is worked out as its cell
 * draws, so a failure stays in the card (`Boundary`).
 */
const columnsOf = (
  byCustomer: ReadonlyMap<string, readonly AppointmentRecord[]>,
  rmId: string,
  today: CalendarDate,
): ReadonlyArray<DataTableColumn<RmCustomer>> => [
  {
    id: 'name',
    header: t('rmPage.colCustomer'),
    kind: 'text',
    value: (row) => row.card.customer.name,
    cell: ({ card: { customer } }) => (
      <span className={CELL_NAME}>
        {/* "Mở": the row grows into the profile, which goes back here (VA7b). */}
        <a
          href={routeToHash({ screen: 'customer', id: customer.id })}
          data-open="row"
          className={LINK}
        >
          <CustomerName name={customer.name} />
        </a>
        <small className={`${SMALL} tabular-nums`}>{customer.code}</small>
      </span>
    ),
  },
  {
    id: 'stage',
    header: t('customers.colStage'),
    kind: 'number',
    value: (row) => STAGES.indexOf(row.card.customer.stage),
    cell: (row) => stageBadge(row.card.customer.stage),
  },
  {
    id: 'cadence',
    header: t('rmPage.colCadence'),
    kind: 'text',
    sortable: false,
    value: () => '',
    cell: ({ card: { customer } }) => (
      <Cadence weeks={cadence(byCustomer.get(customer.id) ?? [], customer.id, rmId, today)} />
    ),
  },
  {
    id: 'lastMet',
    header: t('rmPage.colLastMet'),
    kind: 'number',
    align: 'end',
    value: lastMetKey,
    cell: (row) => <LastMet row={row} />,
  },
  {
    id: 'next',
    header: t('rmPage.colNext'),
    kind: 'number',
    align: 'end',
    value: nextKey,
    thenBy: (row) => row.next?.time ?? '',
    cell: (row) => <Next row={row} />,
  },
  {
    id: 'policies',
    header: t('rmPage.colPolicies'),
    kind: 'number',
    align: 'end',
    value: (row) => row.card.policies,
  },
];

/** One of the four numbers of the period, with how it is worked out (mockup `#rm`). */
function Stat({ tile }: { tile: KpiTile }) {
  return (
    <section aria-label={tile.label} className={`${CARD_SKIN} flex flex-col gap-1.5 ${ROOMY}`}>
      <h3 className="m-0 text-sm font-normal text-fg-2">{tile.label}</h3>
      <p
        className={`m-0 text-2xl leading-tight font-semibold tabular-nums ${tile.negative ? 'text-danger' : ''}`}
      >
        <Count
          value={tile.amount}
          step={KPI_STEP[tile.kind]}
          write={(amount) => {
            const { value, unit, unitSpaced } = kpiText(tile.kind, amount);
            return (
              <>
                {value}
                {unit && (
                  <small className="text-md font-medium text-fg-3">
                    {unitSpaced ? ` ${unit}` : unit}
                  </small>
                )}
              </>
            );
          }}
        />
      </p>
      {tile.formula && <p className="m-0 text-xs text-fg-2 tabular-nums">{tile.formula}</p>}
    </section>
  );
}

/** The page failed as a whole (mockup `#states`, L232): its own words and the way back to Team. */
export function PageFailed({ error }: { error: unknown }) {
  return (
    <StateNote
      size="screen"
      tone="error"
      icon="alert"
      heading={2}
      title={t('rmPage.error.title')}
      next={t('rmPage.error.help')}
      action={
        <Button onClick={() => navigate(routeToHash({ screen: 'team' }))}>
          {t('nav.back', { name: t('screen.team') })}
        </Button>
      }
      detail={{ label: t('storage.technicalDetail'), text: String(error) }}
    />
  );
}

/** The strips could not be worked out: said in the card, the four numbers above still there. */
export function CadenceFailed({ retry }: { retry: () => void }) {
  return (
    <StateNote
      size="card"
      tone="error"
      icon="alert"
      title={t('rmPage.cadence.failed')}
      next={t('rmPage.cadence.failedNext')}
      action={<Button onClick={retry}>{t('rmPage.cadence.retry')}</Button>}
    />
  );
}

/**
 * The page of an RM (spec Phase 6 §5, mockup search-rm-team.html `#rm`): the four numbers of the
 * period of its pill, then the customers whose profile names this RM, longest unmet first. A
 * customer opens by "Mở"; the way back draws the page as it was left. A page of no RM never comes
 * here: the shell takes it to Team & nhân sự (`resolveRoute`).
 */
export function RmPage({ id }: { id: string }) {
  return (
    <Boundary fallback={(error) => <PageFailed error={error} />}>
      <RmPageBody id={id} />
    </Boundary>
  );
}

function RmPageBody({ id }: { id: string }) {
  const data = useTables();
  const today = useToday();
  const [back] = useState(() => (isReturning() && left.rmId === id ? left : null));
  const [period, setPeriod] = useState<Period>(back?.period ?? periodOf('month', today));
  const [closed, setClosed] = useState(back?.closed ?? false);
  useEffect(() => {
    left = { ...left, rmId: id, period, closed };
  }, [id, period, closed]);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const view = useMemo(() => rmView(data, id, period, today), [data, id, period, today]);
  const columns = useMemo(
    () => columnsOf(appointmentsByCustomer(data.appointments, id), id, today),
    [data.appointments, id, today],
  );
  if (!view) return null;
  const { rm, stats, open } = view;
  const team = data.teams.find((one) => one.id === rm.teamId);
  const lead = data.people.find((person) => person.teamId === rm.teamId && person.role === 'TL');
  const viewing = viewingText(
    { period, scope: { kind: 'rm', rmId: id } },
    today,
    data.people,
    data.teams,
  );
  const rows = closed ? view.closed : open;
  const counts = [
    t('rmPage.openCount', { count: open.length }),
    t('rmPage.closedCount', { count: view.closed.length }),
  ];

  return (
    <>
      <ScreenBar
        sub={
          <span aria-live="polite">
            {joinParts([
              t('rmPage.role'),
              team && t('scope.teamName', { name: team.name }),
              viewingLine({ ...viewing, scope: '' }),
            ])}
          </span>
        }
        actions={
          <PeriodPill value={period} onChange={setPeriod} today={today} labels={PERIOD_LABELS} />
        }
      />
      <a href={routeToHash({ screen: 'team' })} className={`${LINK} self-start text-sm`}>
        {t('nav.back', { name: t('screen.team') })}
      </a>
      <section
        aria-labelledby="rm-page-name"
        className={`${CARD} flex flex-wrap items-center gap-3`}
      >
        <div className="min-w-0">
          <h2 id="rm-page-name" className={`${HEADING} wrap-anywhere`}>
            {rm.name} <span className={BADGE}>{t('rmPage.role')}</span>
          </h2>
          <p className="m-0 mt-1 text-sm text-fg-2 tabular-nums">
            {joinParts([
              team && t('scope.teamName', { name: team.name }),
              lead ? t('rmPage.lead', { name: lead.name }) : t('team.noLead'),
              ...counts,
            ])}
          </p>
        </div>
        <Button className="ml-auto" onClick={() => setEditing(true)}>
          {t('person.edit')}
        </Button>
      </section>
      <div data-part className="grid grid-cols-4 gap-3">
        {stats.map((tile) => (
          <Stat key={tile.key} tile={tile} />
        ))}
      </div>
      <section aria-labelledby="rm-page-list" className={`${CARD} flex flex-col gap-3`}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="rm-page-list" className={HEADING}>
            {t('rmPage.listTitle')}
          </h2>
          <span className="text-xs text-fg-3 tabular-nums">
            {joinParts([counts[0], t('rmPage.listNote')])}
          </span>
          <span className="ml-auto">
            <Segmented
              label={t('rmPage.status')}
              options={[
                { value: 'open', label: t('rmPage.open') },
                { value: 'closed', label: t('rmPage.closed') },
              ]}
              value={closed ? 'closed' : 'open'}
              onChange={(value) => setClosed(value === 'closed')}
            />
          </span>
        </div>
        <Boundary fallback={(_, retry) => <CadenceFailed retry={retry} />}>
          {open.length + view.closed.length > 0 && <Legend />}
          <div className="overflow-x-auto">
            <DataTable
              label={t('rmPage.listTitle')}
              columns={columns}
              rows={rows}
              getRowId={(row) => row.card.customer.id}
              initialSort={back ? (back.table?.sort ?? undefined) : { id: 'lastMet', desc: false }}
              initialLimit={back?.table?.limit}
              onView={keepTable}
              moreLabels={tableMore('customers')}
              resetKey={closed ? 'closed' : 'open'}
              empty={
                open.length + view.closed.length === 0 ? (
                  <StateNote
                    size="table"
                    icon="people"
                    title={t('rmPage.none', { name: rm.name })}
                    next={t('rmPage.noneNext')}
                    action={<Button onClick={() => setCreating(true)}>{t('customers.add')}</Button>}
                  />
                ) : (
                  <StateNote
                    size="table"
                    icon="people"
                    title={t(closed ? 'rmPage.noClosed' : 'rmPage.noOpen')}
                  />
                )
              }
            />
          </div>
          <p className="m-0 text-xs text-fg-3">{t('rmPage.foot')}</p>
        </Boundary>
      </section>
      {editing && (
        <PersonDialog
          person={rm}
          teams={data.teams}
          onClose={() => setEditing(false)}
          onSaved={() => setEditing(false)}
        />
      )}
      {creating && <CustomerFormDialog defaultRmId={rm.id} onClose={() => setCreating(false)} />}
    </>
  );
}
