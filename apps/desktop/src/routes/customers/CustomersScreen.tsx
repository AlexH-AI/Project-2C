import { useEffect, useMemo, useRef, useState } from 'react';
import type { CustomerRecord } from '@p2c/db';
import {
  CLOSED_STAGES,
  PIPELINE_STAGES,
  formatNumber,
  formatDate,
  inScope,
  type ClosedStage,
  type CustomerStage,
} from '@p2c/domain';
import { Button, DataTable, Segmented, StateNote, type DataTableColumn } from '@p2c/ui';
import { useTables } from '../../data/AppDataContext';
import { joinParts, t, tableMore } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { isReturning } from '../../shell/useRoute';
import { CustomerName, useMasked } from '../../shell/NameMask';
import { RmPicker } from '../../shell/RmPicker';
import { teamRms } from '../../shell/scope';
import { useScopeState } from '../../shell/ScopeContext';
import { ScreenBar } from '../../shell/ScreenBar';
import { ALERT, BADGE, CARD_SKIN, CELL_NAME, FOCUS, LINK } from '../classes';
import { stageBadge } from '../stage-badge';
import { CustomerFormDialog } from './CustomerDialogs';
import {
  birthLabel,
  birthSortKey,
  customerBoard,
  kanbanColumn,
  type CustomerCard,
} from './customers-view';

type View = 'kanban' | 'table';

const VIEWS = [
  { value: 'kanban', label: t('customers.kanban') },
  { value: 'table', label: t('customers.table') },
] as const;

/** The view last shown: the way back from a profile opened here returns to it (VA7b, "Mở"). */
let lastView: View = 'kanban';

/** Names per closed list (cards per kanban column: `kanbanColumn`); the table shows everyone. */
const CLOSED_LIMIT = 5;

/** The card of one stage, a kanban column or a closed list: less room around its rows. */
const STAGE_CARD = `${CARD_SKIN} p-3`;

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
      <span className={CELL_NAME}>
        {/* "Mở": the row grows into the profile (VA7b). */}
        <a href={profileHref(c)} data-open="row" className={LINK}>
          <CustomerName name={c.customer.name} />
        </a>
      </span>
    ),
  },
  {
    id: 'stage',
    header: t('customers.colStage'),
    kind: 'text',
    value: (c) => c.customer.stage,
    cell: (c) => stageBadge(c.customer.stage),
  },
  {
    id: 'rm',
    header: t('customers.colRm'),
    kind: 'text',
    value: (c) => c.rm?.name ?? '',
    cell: (c) => <span className={CELL_NAME}>{c.rm?.name}</span>,
  },
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
  const data = useTables();
  const { picked, scope, pickRm } = useScopeState();
  const pickedBoard = useMemo(() => customerBoard(data, picked), [data, picked]);
  const board = useMemo(
    () => (scope === picked ? pickedBoard : customerBoard(data, scope)),
    [data, scope, picked, pickedBoard],
  );
  // The RM strip and its "đang xem" line belong to the Team scope (mockup phase-3-feedback B2).
  const team =
    picked.kind === 'team' ? data.teams.find((item) => item.id === picked.teamId) : undefined;
  const rm =
    scope !== picked && scope.kind === 'rm'
      ? data.people.find((person) => person.id === scope.rmId)
      : undefined;
  const summary = t('customers.summary', { open: board.openCount, closed: board.closedCount });
  const rows = useMemo(
    () => [
      ...PIPELINE_STAGES.flatMap((s) => board.open[s]),
      ...CLOSED_STAGES.flatMap((s) => board.closed[s]),
    ],
    [board],
  );
  const [view, setView] = useState<View>(() => (isReturning() ? lastView : 'kanban'));
  useEffect(() => {
    lastView = view;
  }, [view]);
  // "+ n KH" goes with the kanban it is on: the focus goes to the table it opens (DR6-35). A count,
  // so each click moves it.
  const table = useRef<HTMLTableElement>(null);
  const [toTable, setToTable] = useState(0);
  useEffect(() => {
    if (toTable > 0) table.current?.focus();
  }, [toTable]);
  const showTable = () => {
    setView('table');
    setToTable((count) => count + 1);
  };
  const [creating, setCreating] = useState(false);
  const scopeKey = JSON.stringify(scope);
  // The customer just made for an RM outside the scope, while the scope it was made in stays.
  const [created, setCreated] = useState<{ customer: CustomerRecord; scopeKey: string } | null>(
    null,
  );
  const outside =
    created?.scopeKey === scopeKey && !inScope(data.people, created.customer.rmId, scope)
      ? created.customer
      : null;
  const masked = useMasked();

  return (
    <>
      {team && (
        <RmPicker
          team={team}
          rms={teamRms(data.people, team.id)}
          picked={rm?.id ?? null}
          counts={pickedBoard.openByRm}
          total={pickedBoard.openCount}
          onPick={pickRm}
        />
      )}
      <ScreenBar
        sub={
          rm ? (
            <>
              <b className="font-semibold text-fg">{rm.name}</b> {t('sep.dot')} {summary}
            </>
          ) : team ? (
            joinParts([t('customers.viewingTeam', { team: team.name }), summary])
          ) : (
            summary
          )
        }
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            {t('customers.add')}
          </Button>
        }
      />
      <div data-part className="flex justify-end">
        <Segmented label={t('customers.view')} options={VIEWS} value={view} onChange={setView} />
      </div>
      {creating && (
        <CustomerFormDialog
          defaultRmId={scope.kind === 'rm' ? scope.rmId : undefined}
          onCreated={(customer) => setCreated({ customer, scopeKey })}
          onClose={() => setCreating(false)}
        />
      )}
      {outside && (
        <p role="status" className={`${ALERT} border-info text-sm`}>
          {t('customers.createdOutside', {
            name: masked.name(outside.name),
            rm: data.people.find((person) => person.id === outside.rmId)?.name ?? '',
          })}{' '}
          <a href={routeToHash({ screen: 'customer', id: outside.id })} className={LINK}>
            {t('customers.createdProfile')}
          </a>
        </p>
      )}
      {/* The table, or the board, rises as one part: not its rows, nor its cards (VA7a). */}
      {view === 'table' ? (
        <div data-part className="flex flex-col gap-4.5">
          <DataTable
            ref={table}
            label={t('screen.customers')}
            columns={COLUMNS}
            rows={rows}
            getRowId={(c) => c.customer.id}
            initialSort={{ id: 'since', desc: true }}
            moreLabels={tableMore('customers')}
            resetKey={scopeKey}
            empty={
              <StateNote
                size="table"
                icon="people"
                title={t('customers.empty')}
                next={t('customers.emptyNext')}
              />
            }
          />
        </div>
      ) : (
        <div data-part className="flex items-start gap-3.5">
          <div className="grid min-w-0 flex-1 grid-cols-4 gap-3">
            {PIPELINE_STAGES.map((stage) => {
              const { shown, more } = kanbanColumn(board.open[stage]);
              return (
                <section
                  key={stage}
                  aria-label={t(`stage.${stage}`)}
                  className={`${STAGE_CARD} flex flex-col gap-2`}
                >
                  <StageHead
                    stage={stage}
                    count={board.open[stage].length}
                    className="gap-2 pb-2"
                  />
                  {shown.map((card) => (
                    <Card key={card.customer.id} card={card} />
                  ))}
                  {more > 0 && (
                    <button type="button" onClick={showTable} className={`${LINK} text-xs`}>
                      {t('customers.more', { count: more })}
                    </button>
                  )}
                </section>
              );
            })}
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
      {stageBadge(stage)}
      <span className="ml-auto text-sm text-fg-2 tabular-nums">{formatNumber(count)}</span>
    </div>
  );
}

/** A customer on the board: a click grows the card into the profile (VA7b, "Mở"). */
function Card({ card }: { card: CustomerCard }) {
  return (
    <a
      href={profileHref(card)}
      data-open
      className={`press-card flex flex-col gap-1 rounded-control border border-border bg-surface-2 px-2.5 py-2 text-sm hover:border-border-strong ${FOCUS}`}
    >
      <span className="flex items-center justify-between gap-1.5">
        <b className="truncate font-semibold">
          <CustomerName name={card.customer.name} />
        </b>
        {card.policies > 0 && (
          <span className={`${BADGE} whitespace-nowrap text-issued`}>
            {t('customers.policies', { count: card.policies })}
          </span>
        )}
      </span>
      <span className="flex justify-between gap-1.5 text-xs whitespace-nowrap text-fg-3">
        <span className="truncate">{t('customers.rm', { name: card.rm?.name ?? '' })}</span>
        <span className="tabular-nums">{personal(card)}</span>
      </span>
    </a>
  );
}

function Closed({ stage, cards }: { stage: ClosedStage; cards: readonly CustomerCard[] }) {
  return (
    <section aria-label={t(`stage.${stage}`)} className={STAGE_CARD}>
      <StageHead stage={stage} count={cards.length} className="mb-1" />
      <ul className="m-0 list-none p-0 text-sm">
        {cards.slice(0, CLOSED_LIMIT).map((card) => (
          <li
            key={card.customer.id}
            className="flex gap-2 border-b border-border py-1.5 last:border-b-0"
          >
            <a
              href={profileHref(card)}
              data-open
              className={`truncate rounded-control-sm hover:underline ${FOCUS}`}
            >
              <CustomerName name={card.customer.name} />
            </a>
            <span className="ml-auto text-fg-3 tabular-nums">{formatDate(card.since)}</span>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-1 text-xs text-fg-3">{t('customers.reopenHelp')}</p>
    </section>
  );
}
