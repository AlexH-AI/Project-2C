import { useMemo, useState } from 'react';
import {
  listCustomers,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  type Database,
} from '@p2c/db';
import {
  CLOSED_STAGES,
  PIPELINE_STAGES,
  formatCount,
  formatDate,
  type ClosedStage,
  type CustomerStage,
} from '@p2c/domain';
import { Button, DataTable, Segmented, StageBadge, type DataTableColumn } from '@p2c/ui';
import { useQuery } from '../../data/AppDataContext';
import { joinParts, t, tableMore } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { RePicker } from '../../shell/RePicker';
import { teamRes } from '../../shell/scope';
import { useScopeState } from '../../shell/ScopeContext';
import { CustomerFormDialog } from './CustomerDialogs';
import { birthLabel, birthSortKey, customerBoard, type CustomerCard } from './customers-view';

type View = 'kanban' | 'table';

const VIEWS = [
  { value: 'kanban', label: t('customers.kanban') },
  { value: 'table', label: t('customers.table') },
] as const;

/** Cards per kanban column and names per closed list; the table shows everyone. */
const COLUMN_LIMIT = 6;
const CLOSED_LIMIT = 5;

const CARD = 'rounded-lg border border-border bg-surface-1 p-3';
const LINK = 'rounded-sm focus-visible:outline-2 focus-visible:outline-accent';

const readCustomers = (db: Database) => ({
  customers: listCustomers(db),
  people: listPeople(db),
  teams: listTeams(db),
  transitions: listStageTransitions(db),
  policies: listPolicies(db),
});

const profileHref = (card: CustomerCard) =>
  routeToHash({ screen: 'customer', id: card.customer.id });

/** "Nữ · 1991": whatever is known of gender and birth year. */
const personal = ({ customer }: CustomerCard) =>
  joinParts([
    customer.gender && t(`gender.${customer.gender}`),
    customer.birthDate && String(customer.birthDate.year),
  ]);

const COLUMNS: ReadonlyArray<DataTableColumn<CustomerCard>> = [
  { id: 'code', header: t('customers.colCode'), kind: 'text', value: (c) => c.customer.code },
  {
    id: 'name',
    header: t('customers.colName'),
    kind: 'text',
    value: (c) => c.customer.name,
    cell: (c) => (
      <a href={profileHref(c)} className={`text-accent hover:underline ${LINK}`}>
        {c.customer.name}
      </a>
    ),
  },
  {
    id: 'stage',
    header: t('customers.colStage'),
    kind: 'text',
    value: (c) => c.customer.stage,
    cell: (c) => <StageBadge stage={c.customer.stage} label={t(`stage.${c.customer.stage}`)} />,
  },
  { id: 're', header: t('customers.colRe'), kind: 'text', value: (c) => c.re?.name ?? '' },
  {
    id: 'birth',
    header: t('customers.colBirth'),
    kind: 'text',
    value: (c) => (c.customer.birthDate ? birthSortKey(c.customer.birthDate) : ''),
    cell: (c) => (c.customer.birthDate ? birthLabel(c.customer.birthDate) : ''),
  },
  {
    id: 'policies',
    header: t('customers.colPolicies'),
    kind: 'number',
    value: (c) => c.policies,
    align: 'end',
  },
  {
    id: 'since',
    header: t('customers.colSince'),
    kind: 'date',
    value: (c) => c.since,
    align: 'end',
  },
];

/** Customers (mockup customers.html): kanban N4 → N1 with the closed stages beside, or a table. */
export function CustomersScreen() {
  const data = useQuery(readCustomers);
  const { picked, scope, pickRe } = useScopeState();
  const pickedBoard = useMemo(() => customerBoard(data, picked), [data, picked]);
  const board = useMemo(
    () => (scope === picked ? pickedBoard : customerBoard(data, scope)),
    [data, scope, picked, pickedBoard],
  );
  // The RE strip and its "đang xem" line belong to the Team scope (mockup phase-3-feedback B2).
  const team =
    picked.kind === 'team' ? data.teams.find((item) => item.id === picked.teamId) : undefined;
  const re =
    scope !== picked && scope.kind === 're'
      ? data.people.find((person) => person.id === scope.reId)
      : undefined;
  const summary = t('customers.summary', { open: board.openCount, closed: board.closedCount });
  const rows = useMemo(
    () => [
      ...PIPELINE_STAGES.flatMap((s) => board.open[s]),
      ...CLOSED_STAGES.flatMap((s) => board.closed[s]),
    ],
    [board],
  );
  const [view, setView] = useState<View>('kanban');
  const [creating, setCreating] = useState(false);

  return (
    <>
      {team && (
        <RePicker
          team={team}
          res={teamRes(data.people, team.id)}
          picked={re?.id ?? null}
          counts={pickedBoard.openByRe}
          total={pickedBoard.openCount}
          onPick={pickRe}
        />
      )}
      <div className="flex items-center gap-3">
        <span className="text-sm text-fg-2 tabular-nums">
          {re ? (
            <>
              <b className="font-semibold text-fg">{re.name}</b> {t('sep.dot')} {summary}
            </>
          ) : team ? (
            joinParts([t('customers.viewingTeam', { team: team.name }), summary])
          ) : (
            summary
          )}
        </span>
        <div className="flex-1" />
        <Segmented label={t('customers.view')} options={VIEWS} value={view} onChange={setView} />
        <Button variant="primary" onClick={() => setCreating(true)}>
          {t('customers.add')}
        </Button>
      </div>
      {creating && <CustomerFormDialog onClose={() => setCreating(false)} />}
      {view === 'table' ? (
        <DataTable
          label={t('screen.customers')}
          columns={COLUMNS}
          rows={rows}
          getRowId={(c) => c.customer.id}
          initialSort={{ id: 'since', desc: true }}
          moreLabels={tableMore('customers')}
          resetKey={JSON.stringify(scope)}
        />
      ) : (
        <div className="flex items-start gap-3.5">
          <div className="grid min-w-0 flex-1 grid-cols-4 gap-3">
            {PIPELINE_STAGES.map((stage) => (
              <section
                key={stage}
                aria-label={t(`stage.${stage}`)}
                className={`${CARD} flex flex-col gap-2`}
              >
                <StageHead stage={stage} count={board.open[stage].length} className="gap-2 pb-2" />
                {board.open[stage].slice(0, COLUMN_LIMIT).map((card) => (
                  <Card key={card.customer.id} card={card} />
                ))}
                {board.open[stage].length > COLUMN_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setView('table')}
                    className={`cursor-pointer text-xs text-accent hover:underline ${LINK}`}
                  >
                    {t('customers.more', { count: board.open[stage].length - COLUMN_LIMIT })}
                  </button>
                )}
              </section>
            ))}
          </div>
          <div className="flex w-64 shrink-0 flex-col gap-3">
            {CLOSED_STAGES.map((stage) => (
              <Closed key={stage} stage={stage} cards={board.closed[stage]} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/** The head of a kanban column or closed block: the stage and its count, thousands grouped. */
export function StageHead({
  stage,
  count,
  className,
}: {
  stage: CustomerStage;
  count: number;
  className: string;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <StageBadge stage={stage} label={t(`stage.${stage}`)} />
      <span className="ml-auto text-sm text-fg-2 tabular-nums">{formatCount(count)}</span>
    </div>
  );
}

function Card({ card }: { card: CustomerCard }) {
  return (
    <a
      href={profileHref(card)}
      className="flex flex-col gap-1 rounded-md border border-border bg-surface-2 px-2.5 py-2 text-sm hover:border-border-strong focus-visible:outline-2 focus-visible:outline-accent"
    >
      <span className="flex items-center justify-between gap-1.5">
        <b className="truncate font-semibold">{card.customer.name}</b>
        {card.policies > 0 && (
          <span className="rounded-full border border-current px-2 text-xs font-semibold whitespace-nowrap text-issued">
            {t('customers.policies', { count: card.policies })}
          </span>
        )}
      </span>
      <span className="flex justify-between gap-1.5 text-xs whitespace-nowrap text-fg-3">
        <span className="truncate">{t('customers.re', { name: card.re?.name ?? '' })}</span>
        <span className="tabular-nums">{personal(card)}</span>
      </span>
    </a>
  );
}

function Closed({ stage, cards }: { stage: ClosedStage; cards: readonly CustomerCard[] }) {
  return (
    <section aria-label={t(`stage.${stage}`)} className={CARD}>
      <StageHead stage={stage} count={cards.length} className="mb-1" />
      <ul className="m-0 list-none p-0 text-sm">
        {cards.slice(0, CLOSED_LIMIT).map((card) => (
          <li
            key={card.customer.id}
            className="flex gap-2 border-b border-border py-1.5 last:border-b-0"
          >
            <a href={profileHref(card)} className={`truncate hover:underline ${LINK}`}>
              {card.customer.name}
            </a>
            <span className="ml-auto text-fg-3 tabular-nums">{formatDate(card.since)}</span>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-1 text-xs text-fg-3">{t('customers.reopenHelp')}</p>
    </section>
  );
}
