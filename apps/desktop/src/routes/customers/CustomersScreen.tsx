import { useMemo, useState } from 'react';
import {
  listCustomers,
  listPeople,
  listPolicies,
  listStageTransitions,
  type Database,
} from '@p2c/db';
import { CLOSED_STAGES, PIPELINE_STAGES, formatDate, type ClosedStage } from '@p2c/domain';
import { Button, DataTable, Segmented, StageBadge, type DataTableColumn } from '@p2c/ui';
import { useQuery } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { useScope } from '../../shell/ScopeContext';
import { CustomerFormDialog } from './CustomerDialogs';
import { birthLabel, customerBoard, type CustomerCard } from './customers-view';

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
  transitions: listStageTransitions(db),
  policies: listPolicies(db),
});

const profileHref = (card: CustomerCard) =>
  routeToHash({ screen: 'customer', id: card.customer.id });

/** "Nữ · 1991": whatever is known of gender and birth year. */
const personal = ({ customer }: CustomerCard) =>
  [
    customer.gender && t(`gender.${customer.gender}`),
    customer.birthDate && String(customer.birthDate.year),
  ]
    .filter(Boolean)
    .join(' · ');

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
    value: (c) => (c.customer.birthDate ? birthLabel(c.customer.birthDate) : ''),
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
  const scope = useScope();
  const board = useMemo(() => customerBoard(data, scope), [data, scope]);
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
      <div className="flex items-center gap-3">
        <span className="text-sm text-fg-2 tabular-nums">
          {t('customers.summary', { open: board.openCount, closed: board.closedCount })}
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
                <div className="flex items-center gap-2 pb-2">
                  <StageBadge stage={stage} label={t(`stage.${stage}`)} />
                  <span className="ml-auto text-sm text-fg-2 tabular-nums">
                    {board.open[stage].length}
                  </span>
                </div>
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
      <div className="mb-1 flex items-center">
        <StageBadge stage={stage} label={t(`stage.${stage}`)} />
        <span className="ml-auto text-sm text-fg-2 tabular-nums">{cards.length}</span>
      </div>
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
