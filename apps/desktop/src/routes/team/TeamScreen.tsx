import { useState } from 'react';
import { listPeople, listTeams, type Database } from '@p2c/db';
import type { Person, Team } from '@p2c/domain';
import { Button, DataTable, type DataTableColumn } from '@p2c/ui';
import { useQuery } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { DeleteTeamDialog, TeamNameDialog } from './TeamDialogs';
import { groupByTeam, initials, type TeamEntry } from './team-view';

type Editing =
  | { readonly kind: 'create' }
  | { readonly kind: 'rename'; readonly team: Team }
  | { readonly kind: 'delete'; readonly team: Team };

const readTeams = (db: Database) => groupByTeam(listTeams(db), listPeople(db));

const CARD = 'rounded-lg border border-border bg-surface-1 p-4';
const CARD_TITLE = 'm-0 text-sm font-medium text-heading';
const ROLE = 'text-xs font-bold tracking-wider text-fg-3';

function Who({ person }: { person: Person }) {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-semibold text-fg-2"
      >
        {initials(person.name)}
      </span>
      {person.name}
    </span>
  );
}

const COLUMNS: ReadonlyArray<DataTableColumn<Person>> = [
  {
    id: 'name',
    header: t('team.colName'),
    kind: 'text',
    value: (person) => person.name,
    cell: (person) => <Who person={person} />,
  },
  {
    id: 'role',
    header: t('team.colRole'),
    kind: 'text',
    value: (person) => person.role,
    cell: (person) => <span className={ROLE}>{person.role}</span>,
  },
];

/** Team & staff (mockup team.html): teams, their members, and the shared support staff. */
export function TeamScreen() {
  const view = useQuery(readTeams);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const selected = view.teams.find((entry) => entry.team.id === selectedId) ?? view.teams[0];
  const staff = view.teams.reduce((sum, entry) => sum + entry.tl + entry.re, 0);
  const close = () => setEditing(null);

  return (
    <>
      <div className="flex items-center gap-3">
        <span className="text-sm text-fg-2 tabular-nums">
          {t('team.summary', { teams: view.teams.length, staff, shared: view.shared.length })}
        </span>
        <div className="flex-1" />
        <Button variant="primary" onClick={() => setEditing({ kind: 'create' })}>
          {t('team.add')}
        </Button>
      </div>
      <div className="flex items-start gap-4">
        <div className="flex w-64 shrink-0 flex-col gap-4">
          <section aria-labelledby="team-list-title" className={CARD}>
            <h2 id="team-list-title" className={`${CARD_TITLE} mb-2`}>
              {t('team.list')}
            </h2>
            {view.teams.length === 0 && <p className="m-0 text-sm text-fg-3">{t('team.none')}</p>}
            {view.teams.map((entry) => {
              const on = entry === selected;
              return (
                <button
                  key={entry.team.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSelectedId(entry.team.id)}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-accent ${
                    on ? 'bg-accent-soft font-semibold text-fg' : 'text-fg-2 hover:bg-surface-2'
                  }`}
                >
                  {entry.team.name}
                  <span className="ml-auto font-normal text-fg-3 tabular-nums">
                    {t('team.count', { tl: entry.tl, re: entry.re })}
                  </span>
                </button>
              );
            })}
          </section>
          <SharedSupport people={view.shared} />
        </div>
        {selected && (
          <Members
            entry={selected}
            onRename={() => setEditing({ kind: 'rename', team: selected.team })}
            onDelete={() => setEditing({ kind: 'delete', team: selected.team })}
          />
        )}
      </div>
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
    </>
  );
}

function SharedSupport({ people }: { people: readonly Person[] }) {
  return (
    <section aria-labelledby="team-shared-title" className={CARD}>
      <div className="mb-2 flex items-baseline gap-2">
        <h2 id="team-shared-title" className={CARD_TITLE}>
          {t('team.shared')}
        </h2>
        <span className="text-xs text-fg-3">{t('team.sharedMeta')}</span>
      </div>
      {people.length === 0 ? (
        <p className="m-0 text-sm text-fg-3">{t('team.sharedNone')}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
          {people.map((person) => (
            <li key={person.id} className="flex items-center gap-2">
              <Who person={person} />
              <span className={`ml-auto ${ROLE}`}>{person.role}</span>
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
  onRename,
  onDelete,
}: {
  entry: TeamEntry;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <section
      aria-label={t('team.members', { name: entry.team.name })}
      className={`${CARD} min-w-0 flex-1`}
    >
      <div className="mb-2 flex items-center gap-2">
        <h2 className={CARD_TITLE}>{entry.team.name}</h2>
        <span className="text-xs text-fg-3 tabular-nums">
          {t('team.memberCount', { count: entry.members.length })}
        </span>
        <div className="flex-1" />
        <Button onClick={onRename}>{t('team.rename')}</Button>
        <Button onClick={onDelete}>{t('team.delete')}</Button>
      </div>
      {entry.members.length === 0 ? (
        <p className="m-0 text-sm text-fg-3">{t('team.empty')}</p>
      ) : (
        <DataTable
          label={t('team.members', { name: entry.team.name })}
          columns={COLUMNS}
          rows={entry.members as Person[]}
          getRowId={(person) => person.id}
          initialSort={{ id: 'name', desc: false }}
        />
      )}
    </section>
  );
}
