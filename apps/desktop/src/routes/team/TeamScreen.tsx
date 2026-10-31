import { useMemo, useState } from 'react';
import type { Person, PersonRole, Team } from '@p2c/domain';
import { Button, DataTable, DialogFocusFallback, type DataTableColumn } from '@p2c/ui';
import { useTables, useToday } from '../../data/AppDataContext';
import type { Tables } from '../../data/tables';
import { t, tableMore } from '../../i18n';
import { CARD, FOCUS, HEADING, LINK } from '../classes';
import { DeletePersonDialog, PersonDialog } from './PersonDialogs';
import { DeleteTeamDialog, TeamNameDialog } from './TeamDialogs';
import { groupByTeam, staffMetrics, type StaffMetrics, type TeamEntry } from './team-view';

type Editing =
  | { readonly kind: 'create' }
  | { readonly kind: 'rename'; readonly team: Team }
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

/** A metric cell of an RE, the only role the member table lists. */
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
      cell: (person) => <PersonName person={person} />,
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

/** Team & staff (mockup team.html): teams, their members, and the shared support staff. */
export function TeamScreen() {
  const tables = useTables();
  const view = useMemo(() => teamsView(tables), [tables]);
  const today = useToday();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const selected = view.teams.find((entry) => entry.team.id === selectedId) ?? view.teams[0];
  const tlCount = view.teams.reduce((sum, entry) => sum + entry.tl, 0);
  const reCount = view.teams.reduce((sum, entry) => sum + entry.re, 0);
  const teams = view.teams.map((entry) => entry.team);
  const close = () => setEditing(null);
  const editPerson = (person: Person) => setEditing({ kind: 'editPerson', person });
  const columns = useMemo(
    () => memberColumns(staffMetrics(view.people, view.records, today), today.year, editPerson),
    [view, today],
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <span className="text-sm text-fg-2 tabular-nums">
          {t('team.summary', {
            teams: view.teams.length,
            tl: tlCount,
            re: reCount,
            shared: view.shared.length,
          })}
        </span>
        <div className="flex-1" />
        <Button onClick={() => setEditing({ kind: 'addPerson', teamId: selected?.team.id })}>
          {t('person.add')}
        </Button>
        <Button variant="primary" onClick={() => setEditing({ kind: 'create' })}>
          {t('team.add')}
        </Button>
      </div>
      <div className="flex items-start gap-4">
        <div className="flex w-64 shrink-0 flex-col gap-4">
          <section aria-labelledby={LIST_TITLE} className={CARD}>
            <h2 id={LIST_TITLE} tabIndex={-1} className={`${HEADING} mb-2`}>
              {t('team.list')}
            </h2>
            {view.teams.length === 0 && <p className="m-0 text-sm text-fg-3">{t('team.none')}</p>}
            {view.teams.map((entry) => {
              const on = entry === selected;
              // The name breaks, even with no space, and leaves the count whole (DR6-148).
              return (
                <button
                  key={entry.team.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSelectedId(entry.team.id)}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 text-left text-sm wrap-anywhere ${FOCUS} ${
                    on ? 'bg-accent-soft font-semibold text-fg' : 'text-fg-2 hover:bg-surface-2'
                  }`}
                >
                  {entry.team.name}
                  <span className="ml-auto shrink-0 font-normal text-fg-3 tabular-nums">
                    {t(entry.lead ? 'team.count' : 'team.countNoLead', { re: entry.re })}
                  </span>
                </button>
              );
            })}
          </section>
          <SharedSupport people={view.shared} onEdit={editPerson} />
        </div>
        {selected && (
          <Members
            entry={selected}
            columns={columns}
            onEditLead={editPerson}
            onAddLead={() =>
              setEditing({ kind: 'addPerson', teamId: selected.team.id, role: 'TL' })
            }
            onRename={() => setEditing({ kind: 'rename', team: selected.team })}
            onDelete={() => setEditing({ kind: 'delete', team: selected.team })}
          />
        )}
      </div>
      <DialogFocusFallback value={() => document.getElementById(cardTitleOf(editing))}>
        {editing?.kind === 'create' && (
          <TeamNameDialog
            onClose={close}
            onSaved={(team) => {
              setSelectedId(team.id);
              close();
            }}
          />
        )}
        {editing?.kind === 'rename' && (
          <TeamNameDialog team={editing.team} onClose={close} onSaved={close} />
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
        <p className="m-0 text-sm text-fg-3">{t('team.sharedNone')}</p>
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

function Members({
  entry,
  columns,
  onEditLead,
  onAddLead,
  onRename,
  onDelete,
}: {
  entry: TeamEntry;
  columns: ReadonlyArray<DataTableColumn<Person>>;
  onEditLead: (person: Person) => void;
  onAddLead: () => void;
  onRename: () => void;
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
          (review of PR 744). */}
      <div key={entry.team.id} className="mb-2 flex items-center gap-2">
        {/* A team name with no space breaks rather than push the buttons out (DR6-148). */}
        <h2 id={MEMBERS_TITLE} tabIndex={-1} className={`${HEADING} min-w-0 wrap-anywhere`}>
          {t('team.heading', { name: entry.team.name })}
        </h2>
        <span className="text-fg-3">{t('sep.dot')}</span>
        {entry.lead ? (
          <>
            <span className="text-sm text-fg-2">
              <span className={`${ROLE} mr-1.5`}>{t('team.leadOf')}</span>
              {entry.lead.name}
            </span>
            <span className="text-fg-3">{t('sep.dot')}</span>
            <EditLink person={entry.lead} onEdit={onEditLead} />
          </>
        ) : (
          <>
            <span className="text-sm text-fg-3">{t('team.noLead')}</span>
            <span className="text-fg-3">{t('sep.dot')}</span>
            <button type="button" onClick={onAddLead} className={`${LINK} text-xs`}>
              {t('team.addLead')}
            </button>
          </>
        )}
        <div className="flex-1" />
        <Button onClick={onRename}>{t('team.rename')}</Button>
        <Button onClick={onDelete}>{t('team.delete')}</Button>
      </div>
      {entry.reps.length === 0 && <p className="m-0 text-sm text-fg-3">{t('team.empty')}</p>}
      {/* Hidden, not gone, for a team without RE: the sort holds for the team shown after.
          Positioned, so the hidden heading of the actions column scrolls with the table instead of
          widening the page when the table is wider than the card (DR6-148). */}
      <div className="relative overflow-x-auto" hidden={entry.reps.length === 0}>
        <DataTable
          label={t('team.members', { name: entry.team.name })}
          columns={columns}
          rows={entry.reps}
          getRowId={(person) => person.id}
          initialSort={{ id: 'name', desc: false }}
          moreLabels={tableMore('people')}
          // The table is not made anew for each team: this takes another team back to its first
          // hundred rows (DR6-32).
          resetKey={entry.team.id}
        />
      </div>
    </section>
  );
}
