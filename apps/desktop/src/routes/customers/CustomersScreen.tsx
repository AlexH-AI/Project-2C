import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  Button,
  DataTable,
  Segmented,
  StateNote,
  type DataTableColumn,
  type DataTableView,
} from '@p2c/ui';
import { useTables } from '../../data/AppDataContext';
import { joinParts, t, tableMore } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { isReturning } from '../../shell/useRoute';
import { CustomerName, useMasked } from '../../shell/NameMask';
import { RmPicker } from '../../shell/RmPicker';
import { scopeName, teamRms } from '../../shell/scope';
import { useScopeState } from '../../shell/ScopeContext';
import { ScreenBar } from '../../shell/ScreenBar';
import { ALERT, BADGE, CARD_SKIN, CELL_NAME, FOCUS, LINK } from '../classes';
import { stageBadge } from '../stage-badge';
import { CustomerFormDialog } from './CustomerDialogs';
import { CustomerSearch } from './CustomerSearch';
import { customerIndex, customerMatches } from './customer-search';
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

/**
 * Khách hàng as last left: its view, and the sort and the rows shown of its table. The way back
 * from a profile opened here draws it so again (VA7b, "Mở").
 */
let left: { view: View; table?: DataTableView } = { view: 'kanban' };

const keepTable = (table: DataTableView) => {
  left = { ...left, table };
};

/** Names per closed list (cards per kanban column: `kanbanColumn`); the table shows everyone. */
const CLOSED_LIMIT = 5;

/** The card of one stage, a kanban column or a closed list: less room around its rows. */
const STAGE_CARD = `${CARD_SKIN} p-3`;

/**
 * A card or a closed row while searching (mockup search-rm-team.html `.finding`), `lit` whether it
 * matches: a match edged in gold; the others at 70 %, less colour, in place and still a link.
 */
const findLook = (lit: boolean | undefined) =>
  lit === undefined ? '' : lit ? 'inset-ring inset-ring-accent' : 'opacity-70 saturate-30';

/**
 * The colour of a text of a card or a closed row: dimmed, a text in --text-3 or a colour takes a
 * lighter one to stay at AA over the brightest glass of macOS (L188): a card's second line
 * --text-2, its "n HĐ" and the day of a closed row --text.
 */
const tone = (lit: boolean | undefined, shown: string, dimmed: string) =>
  lit === false ? dimmed : shown;

/** The ids of the customers a search matches; undefined while nothing is searched. */
type FoundIds = ReadonlySet<string> | undefined;
type Cards = readonly CustomerCard[];

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
  // Drawn by the way back of "Mở": as it was left. Else the board, and a table of the newest first.
  const [back] = useState(() => (isReturning() ? left : null));
  const [view, setView] = useState<View>(back?.view ?? 'kanban');
  useEffect(() => {
    left = { ...left, view };
  }, [view]);
  const tableBack = back?.view === 'table' ? back.table : undefined;
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
  // C1: every customer, whatever the view, read once a search starts; the board lights those of its
  // view as the typing lets it (one letter lights thousands of cards at 10× the data).
  const [query, setQuery] = useState('');
  const field = useRef<HTMLInputElement>(null);
  const searching = query !== '';
  const index = useMemo(() => (searching ? customerIndex(data) : null), [data, searching]);
  const found = useMemo(() => index && customerMatches(index, query, scope), [index, query, scope]);
  const lit = useDeferredValue(found)?.ids;
  const clear = () => {
    setQuery('');
    field.current?.focus();
  };

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
      {/* Over the board, which the list under the field opens on; under the toolbar (z-10), which
          the screen scrolls under and whose menus open over this row (review of PR 1483). */}
      <div data-part className="relative z-1 flex items-center gap-3">
        <CustomerSearch
          query={query}
          onQuery={setQuery}
          found={found}
          view={scopeName(scope, data.teams, data.people)}
          field={field}
        />
        <span className="ml-auto">
          <Segmented label={t('customers.view')} options={VIEWS} value={view} onChange={setView} />
        </span>
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
      {lit?.size === 0 ? (
        <div data-part role="status" className={STAGE_CARD}>
          <StateNote
            size="card"
            icon="search"
            // What is typed may hold a name: masked, it shows as dots, as typed text does.
            title={t('customers.search.none', { text: masked.text(query.trim()) })}
            next={t('customers.search.noneNext')}
            action={<Button onClick={clear}>{t('customers.search.clear')}</Button>}
          />
        </div>
      ) : view === 'table' ? (
        <div data-part className="flex flex-col gap-4.5">
          <DataTable
            ref={table}
            label={t('screen.customers')}
            columns={COLUMNS}
            rows={rows}
            getRowId={(c) => c.customer.id}
            initialSort={tableBack ? (tableBack.sort ?? undefined) : { id: 'since', desc: true }}
            initialLimit={tableBack?.limit}
            onView={keepTable}
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
              const { shown, more, found: matched } = kanbanColumn(board.open[stage], lit);
              return (
                <section
                  key={stage}
                  aria-label={t(`stage.${stage}`)}
                  className={`${STAGE_CARD} flex flex-col gap-2`}
                >
                  <StageHead
                    stage={stage}
                    count={board.open[stage].length}
                    found={matched}
                    className="gap-2 pb-2"
                  />
                  {shown.map((card) => (
                    <Card key={card.customer.id} card={card} lit={lit?.has(card.customer.id)} />
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
              <Closed key={stage} stage={stage} cards={board.closed[stage]} lit={lit} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/** The head of a kanban column or closed block: the stage, "n khớp" while searching, its count. */
export function StageHead({
  stage,
  count,
  found,
  className,
}: {
  stage: CustomerStage;
  count: number;
  found?: number;
  className: string;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      {stageBadge(stage)}
      {found !== undefined && (
        <span className="ml-auto text-xs font-semibold text-accent">
          {t('customers.search.found', { count: found })}
        </span>
      )}
      <span
        className={`${found === undefined ? 'ml-auto' : 'ml-2'} text-sm text-fg-2 tabular-nums`}
      >
        {formatNumber(count)}
      </span>
    </div>
  );
}

/** A customer on the board: a click grows the card into the profile (VA7b, "Mở"). */
function Card({ card, lit }: { card: CustomerCard; lit: boolean | undefined }) {
  return (
    <a
      href={profileHref(card)}
      data-open
      className={`press-card flex flex-col gap-1 rounded-control border bg-surface-2 px-2.5 py-2 text-sm hover:border-border-strong ${lit ? 'border-accent' : 'border-border'} ${FOCUS} ${findLook(lit)}`}
    >
      <span className="flex items-center justify-between gap-1.5">
        <b className="truncate font-semibold">
          <CustomerName name={card.customer.name} />
        </b>
        {card.policies > 0 && (
          <span className={`${BADGE} whitespace-nowrap ${tone(lit, 'text-issued', 'text-fg')}`}>
            {t('customers.policies', { count: card.policies })}
          </span>
        )}
      </span>
      <span
        className={`flex justify-between gap-1.5 text-xs whitespace-nowrap ${tone(lit, 'text-fg-3', 'text-fg-2')}`}
      >
        <span className="truncate">{t('customers.rm', { name: card.rm?.name ?? '' })}</span>
        <span className="tabular-nums">{personal(card)}</span>
      </span>
    </a>
  );
}

function Closed({ stage, cards, lit }: { stage: ClosedStage; cards: Cards; lit: FoundIds }) {
  const { shown, found } = kanbanColumn(cards, lit, CLOSED_LIMIT);
  const on = (card: CustomerCard) => lit?.has(card.customer.id);
  return (
    <section aria-label={t(`stage.${stage}`)} className={STAGE_CARD}>
      <StageHead stage={stage} count={cards.length} found={found} className="mb-1" />
      <ul className="m-0 list-none p-0 text-sm">
        {shown.map((card) => (
          <li
            key={card.customer.id}
            className={`flex gap-2 border-b border-border py-1.5 last:border-b-0 ${on(card) ? '-mx-1 rounded-control-sm px-1' : ''} ${findLook(on(card))}`}
          >
            <a
              href={profileHref(card)}
              data-open
              className={`truncate rounded-control-sm hover:underline ${FOCUS}`}
            >
              <CustomerName name={card.customer.name} />
            </a>
            <span className={`ml-auto tabular-nums ${tone(on(card), 'text-fg-3', 'text-fg')}`}>
              {formatDate(card.since)}
            </span>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-1 text-xs text-fg-3">{t('customers.reopenHelp')}</p>
    </section>
  );
}
