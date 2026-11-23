import { useEffect, useMemo, useRef, useState } from 'react';
import {
  formatDayMonth,
  type CalendarDate,
  type Person,
  type PersonRole,
  type Team,
} from '@p2c/domain';
import {
  Button,
  DataTable,
  DialogFocusFallback,
  StateNote,
  type DataTableColumn,
  type DataTableView,
} from '@p2c/ui';
import { useTables, useToday } from '../../data/AppDataContext';
import type { Tables } from '../../data/tables';
import { t, tableMore } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { ScreenBar } from '../../shell/ScreenBar';
import { isReturning } from '../../shell/useRoute';
import { CARD, FOCUS, HEADING, LINK } from '../classes';
import { formatCount, kpiText } from '../overview/overview-view';
import { DeletePersonDialog, PersonDialog } from './PersonDialogs';
import { RmSearch } from './RmSearch';
import { DeleteTeamDialog, TeamDialog } from './TeamDialogs';
import { TeamMark, TeamTop, teamNameClass } from './TeamLook';
import {
  groupByTeam,
  staffMetrics,
  teamBrief,
  type StaffMetrics,
  type TeamBrief,
  type TeamEntry,
} from './team-view';

type Editing =
  | { readonly kind: 'create' }
  | { readonly kind: 'edit'; readonly entry: TeamEntry }
  | { readonly kind: 'delete'; readonly team: Team }
  | { readonly kind: 'addPerson'; readonly teamId?: string; readonly role?: PersonRole }
  | { readonly kind: 'editPerson'; readonly person: Person }
  | { readonly kind: 'deletePerson'; readonly person: Person };

const teamsView = ({ teams, people, customers, appointments, policies }: Tables) => ({
  ...groupByTeam(teams, people),
  people,
  records: { customers, appointments, policies },
});

const LIST_TITLE = 'team-list-title';
const MEMBERS_TITLE = 'team-members-title';
const SHARED_TITLE = 'team-shared-title';

/**
 * The heading of the card a dialog's change leaves: where the focus goes once the button that opened
 * the dialog went with the change, e.g. the row of a person deleted or made another role, "+ Thêm
 * TL", the "Xóa team" of a team gone (DR6-116).
 */
function cardTitleOf(editing: Editing | null): string {
  switch (editing?.kind) {
    case 'delete':
      return LIST_TITLE;
    case 'editPerson':
    case 'deletePerson':
      return editing.person.teamId === null ? SHARED_TITLE : MEMBERS_TITLE;
    default:
      return MEMBERS_TITLE;
  }
}

const ROLE = 'text-xs font-bold tracking-wider text-fg-3';

/**
 * The person's full name, no avatar (Owner, 01/10/2026): on one line in the member table, which
 * scrolls sideways; `breaks` in a narrow card, even with no space (DR6-148).
 */
function PersonName({ person, breaks = false }: { person: Person; breaks?: boolean }) {
  return (
    <span className={breaks ? 'min-w-0 wrap-anywhere' : 'whitespace-nowrap'}>{person.name}</span>
  );
}

function EditLink({ person, onEdit }: { person: Person; onEdit: (person: Person) => void }) {
  return (
    <button
      type="button"
      aria-label={t('person.editOf', { name: person.name })}
      onClick={() => onEdit(person)}
      className={`${LINK} text-xs`}
    >
      {t('person.editShort')}
    </button>
  );
}

/** A metric cell of an RM, the only role the member table lists. */
function metricColumn(
  id: string,
  header: string,
  pick: (metrics: StaffMetrics) => number,
  metrics: ReadonlyMap<string, StaffMetrics>,
): DataTableColumn<Person> {
  const valueOf = (person: Person) => pick(metrics.get(person.id)!);
  return { id, header, kind: 'number', align: 'end', value: valueOf };
}

function memberColumns(
  metrics: ReadonlyMap<string, StaffMetrics>,
  year: number,
  onEdit: (person: Person) => void,
): ReadonlyArray<DataTableColumn<Person>> {
  return [
    {
      id: 'name',
      header: t('team.colName'),
      kind: 'text',
      value: (person) => person.name,
      // "Mở": the row grows into the page of the RM, which goes back here (VA7b). Only the name:
      // "Sửa" of the row opens the dialog alone (mockup team.html, phase-3-feedback.html B1).
      cell: (person) => (
        <a href={routeToHash({ screen: 'rm', id: person.id })} data-open="row" className={LINK}>
          <PersonName person={person} />
        </a>
      ),
    },
    {
      id: 'role',
      header: t('team.colRole'),
      kind: 'text',
      value: (person) => person.role,
      cell: (person) => <span className={ROLE}>{person.role}</span>,
    },
    metricColumn('open', t('team.colOpen'), (m) => m.openCustomers, metrics),
    metricColumn('appointments', t('team.colAppointments'), (m) => m.appointments30, metrics),
    metricColumn('issued', t('team.colIssued', { year }), (m) => m.issuedThisYear, metrics),
    {
      id: 'actions',
      header: t('team.colActions'),
      headerHidden: true,
      kind: 'text',
      align: 'end',
      sortable: false,
      value: () => '',
      cell: (person) => <EditLink person={person} onEdit={onEdit} />,
    },
  ];
}

/** Team & nhân sự as last left: the team shown, the sort and rows of its members. */
let left: { teamId?: string; table?: DataTableView } = {};

const keepTable = (table: DataTableView) => {
  left = { ...left, table };
};

/**
 * Team & staff (mockup team.html): teams, their members, and the shared support staff. The way
 * back from the page of an RM draws it as it was left (VA7b, "Mở").
 */
export function TeamScreen() {
  const tables = useTables();
  const view = useMemo(() => teamsView(tables), [tables]);
  const today = useToday();
  const [back] = useState(() => (isReturning() ? left : null));
  const [selectedId, setSelectedId] = useState<string | null>(back?.teamId ?? null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const selected = view.teams.find((entry) => entry.team.id === selectedId) ?? view.teams[0];
  const brief = useMemo(
    () => selected && teamBrief(tables, selected.team.id, today),
    [tables, selected, today],
  );
  const list = useRef<HTMLDivElement>(null);
  // From about 8 teams the list scrolls in its card; the team shown stays in sight (mockup #team).
  useEffect(() => {
    const box = list.current;
    const on = box?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!box || !on) return;
    const below = on.offsetTop + on.offsetHeight > box.scrollTop + box.clientHeight;
    if (on.offsetTop < box.scrollTop || below) {
      box.scrollTop = on.offsetTop - (box.clientHeight - on.offsetHeight) / 2;
    }
  }, [selected?.team.id, view.teams.length]);
  // The team shown stays the one shown: a team renamed or added never moves it (CLR6-D6). One
  // gone gives way to the first.
  if (selected && selected.team.id !== selectedId) setSelectedId(selected.team.id);
  useEffect(() => {
    left = { ...left, teamId: selected?.team.id };
  }, [selected]);
  const tlCount = view.teams.reduce((sum, entry) => sum + entry.tl, 0);
  const rmCount = view.teams.reduce((sum, entry) => sum + entry.rm, 0);
  const teams = view.teams.map((entry) => entry.team);
  const close = () => setEditing(null);
  const editPerson = (person: Person) => setEditing({ kind: 'editPerson', person });
  const columns = useMemo(
    () => memberColumns(staffMetrics(view.people, view.records, today), today.year, editPerson),
    [view, today],
  );

  return (
    <>
      <ScreenBar
        sub={t('team.summary', {
          teams: view.teams.length,
          tl: tlCount,
          rm: rmCount,
          shared: view.shared.length,
        })}
        actions={
          <>
            <Button onClick={() => setEditing({ kind: 'addPerson', teamId: selected?.team.id })}>
              {t('person.add')}
            </Button>
            <Button variant="primary" onClick={() => setEditing({ kind: 'create' })}>
              {t('team.add')}
            </Button>
          </>
        }
      />
      {/* Over the cards, which its list opens on; under the toolbar (z-10), as on Khách hàng. */}
      <div data-part className="relative z-1 flex items-center">
        <RmSearch people={view.people} teams={teams} />
      </div>
      <div className="flex items-start gap-4">
        {/* 220 px under 1 280 (mockup @container 1240): the member table fits 1 100 (L205). */}
        <div className="flex w-64 shrink-0 flex-col gap-4 max-xl:w-55">
          <section aria-labelledby={LIST_TITLE} className={CARD}>
            <h2 id={LIST_TITLE} tabIndex={-1} className={`${HEADING} mb-2`}>
              {t('team.list')}
            </h2>
            {view.teams.length === 0 && (
              <StateNote
                size="card"
                icon="people"
                title={t('team.none')}
                next={t('team.noneNext')}
              />
            )}
            <div ref={list} className="relative -mx-1.5 max-h-78 overflow-y-auto px-1.5 py-0.5">
              {view.teams.map((entry) => {
                const on = entry === selected;
                // The name breaks, even with no space; the count stays whole, by the name's first line
                // (DR6-148). On the gold tint of the chosen team both are in --text: --text-3 is under
                // 4.5:1 there, and so are four of the six team colours over the brightest glass of
                // macOS (ADR-0013 appendix 11/11/2026 §7, L188); its icon keeps the colour (C3).
                return (
                  <button
                    key={entry.team.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelectedId(entry.team.id)}
                    className={`flex w-full cursor-pointer items-baseline gap-2 rounded-control-sm px-2 py-2 text-left text-sm font-semibold wrap-anywhere ${FOCUS} ${
                      on ? 'chosen-tint' : 'hover:bg-surface-2'
                    }`}
                  >
                    <TeamMark team={entry.team} className="self-start" />
                    <span className={`min-w-0 ${on ? 'text-fg' : teamNameClass(entry.team)}`}>
                      {entry.team.name}
                    </span>
                    <span
                      className={`ml-auto shrink-0 text-xs font-normal tabular-nums ${on ? 'text-fg' : 'text-fg-3'}`}
                    >
                      {t(entry.lead ? 'team.count' : 'team.countNoLead', { rm: entry.rm })}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
          <SharedSupport people={view.shared} onEdit={editPerson} />
        </div>
        {selected && (
          <Members
            entry={selected}
            brief={brief!}
            today={today}
            columns={columns}
            back={back?.table}
            onEditLead={editPerson}
            onAddLead={() =>
              setEditing({ kind: 'addPerson', teamId: selected.team.id, role: 'TL' })
            }
            onEdit={() => setEditing({ kind: 'edit', entry: selected })}
            onDelete={() => setEditing({ kind: 'delete', team: selected.team })}
          />
        )}
      </div>
      <DialogFocusFallback value={() => document.getElementById(cardTitleOf(editing))}>
        {editing?.kind === 'create' && (
          <TeamDialog
            onClose={close}
            onSaved={(team) => {
              setSelectedId(team.id);
              close();
            }}
          />
        )}
        {editing?.kind === 'edit' && (
          <TeamDialog
            team={editing.entry.team}
            lead={editing.entry.lead?.name}
            rm={editing.entry.rm}
            onClose={close}
            onSaved={close}
          />
        )}
        {editing?.kind === 'delete' && <DeleteTeamDialog team={editing.team} onClose={close} />}
        {(editing?.kind === 'addPerson' || editing?.kind === 'editPerson') && (
          <PersonDialog
            person={editing.kind === 'editPerson' ? editing.person : undefined}
            teams={teams}
            defaultTeamId={editing.kind === 'addPerson' ? editing.teamId : undefined}
            defaultRole={editing.kind === 'addPerson' ? editing.role : undefined}
            onClose={close}
            onSaved={(person) => {
              if (person.teamId) setSelectedId(person.teamId);
              close();
            }}
            onDelete={
              editing.kind === 'editPerson'
                ? () => setEditing({ kind: 'deletePerson', person: editing.person })
                : undefined
            }
          />
        )}
        {editing?.kind === 'deletePerson' && (
          <DeletePersonDialog
            person={editing.person}
            teamName={
              teams.find((team) => team.id === editing.person.teamId)?.name ?? t('team.shared')
            }
            onClose={close}
          />
        )}
      </DialogFocusFallback>
    </>
  );
}

function SharedSupport({
  people,
  onEdit,
}: {
  people: readonly Person[];
  onEdit: (person: Person) => void;
}) {
  return (
    <section aria-labelledby={SHARED_TITLE} className={CARD}>
      <h2 id={SHARED_TITLE} tabIndex={-1} className={`${HEADING} mb-2`}>
        {t('team.shared')}
      </h2>
      {people.length === 0 ? (
        <StateNote size="card" icon="people" title={t('team.sharedNone')} />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
          {people.map((person) => (
            <li key={person.id} className="flex items-center gap-2">
              <PersonName person={person} breaks />
              <span className={`ml-auto ${ROLE}`}>{person.role}</span>
              <EditLink person={person} onEdit={onEdit} />
            </li>
          ))}
        </ul>
      )}
      <p className="m-0 mt-2.5 text-xs text-fg-3">{t('team.sharedHelp')}</p>
    </section>
  );
}

/**
 * Doanh số and Số HĐ of the month running, bold in champagne (mockup `#team` `.brief`); its third
 * column waits for Forecast tuần (D6).
 */
function Brief({ brief, today }: { brief: TeamBrief; today: CalendarDate }) {
  const money = kpiText('money', brief.revenue);
  const when = t('team.brief.when', { month: today.month, date: formatDayMonth(today) });
  const numbers = [
    [
      t('overview.kpi.revenue'),
      `${money.value}${money.unitSpaced ? ' ' : ''}${money.unit}`,
      brief.revenue < 0,
    ],
    [t('team.brief.net'), formatCount(brief.net), brief.net < 0],
  ] as const;
  return (
    <dl className="my-4 grid grid-cols-3 gap-3 border-y border-hairline py-3.5 tabular-nums">
      {numbers.map(([label, value, negative]) => (
        <div key={label} className="flex flex-col">
          <dt className="text-sm text-fg-2">{label}</dt>
          <dd
            className={`order-first m-0 text-2xl leading-tight font-bold tracking-tight whitespace-nowrap max-xl:text-xl ${negative ? 'text-danger' : 'text-accent'}`}
          >
            {value}
          </dd>
          <dd className="m-0 text-xs text-fg-2">{when}</dd>
        </div>
      ))}
    </dl>
  );
}

function Members({
  entry,
  brief,
  today,
  columns,
  back,
  onEditLead,
  onAddLead,
  onEdit,
  onDelete,
}: {
  entry: TeamEntry;
  brief: TeamBrief;
  today: CalendarDate;
  columns: ReadonlyArray<DataTableColumn<Person>>;
  /** The sort and rows of the table as left, drawn again by the way back of "Mở". */
  back: DataTableView | undefined;
  onEditLead: (person: Person) => void;
  onAddLead: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <section
      aria-label={t('team.members', { name: entry.team.name })}
      className={`${CARD} min-w-0 flex-1`}
    >
      {/* One top per team: reused, it would keep the "Xóa team" of a team just deleted for the
          team shown next, and the focus on it (DR6-116). The table below stays: the sort picked
          holds, and a person moved to the team shown keeps their row and the focus on its Sửa
          (review of PR 744). It wraps as the mockup's `.members-head`: a team or TL name too long
          for the line takes a line of its own and breaks there, even with no space, rather than
          push the buttons out or squeeze the other name (DR6-148). */}
      <div key={entry.team.id}>
        <TeamTop
          team={entry.team}
          id={MEMBERS_TITLE}
          lead={
            entry.lead?.name ?? <span className="font-normal text-fg-3">{t('team.noLead')}</span>
          }
        >
          {entry.lead ? (
            <EditLink person={entry.lead} onEdit={onEditLead} />
          ) : (
            <button type="button" onClick={onAddLead} className={`${LINK} text-xs`}>
              {t('team.addLead')}
            </button>
          )}
          {/* Together at the right, on the last line when the names take more than one. */}
          <div className="ml-auto flex gap-2">
            <Button onClick={onEdit}>{t('team.edit')}</Button>
            <Button onClick={onDelete}>{t('team.delete')}</Button>
          </div>
        </TeamTop>
      </div>
      <Brief brief={brief} today={today} />
      {/* Kept for a team without RM, its headers over the note: the sort holds for the team shown
          after. */}
      <div className="overflow-x-auto">
        <DataTable
          label={t('team.members', { name: entry.team.name })}
          columns={columns}
          rows={entry.reps}
          getRowId={(person) => person.id}
          initialSort={back ? (back.sort ?? undefined) : { id: 'name', desc: false }}
          initialLimit={back?.limit}
          onView={keepTable}
          moreLabels={tableMore('people')}
          // The table is not made anew for each team: this takes another team back to its first
          // hundred rows (DR6-32).
          resetKey={entry.team.id}
          // At 1 100 px it runs past its card already: no further, until C3 (L170).
          narrow
          empty={
            <StateNote
              size="table"
              icon="people"
              title={t('team.empty')}
              next={t('team.emptyNext')}
            />
          }
        />
      </div>
    </section>
  );
}
