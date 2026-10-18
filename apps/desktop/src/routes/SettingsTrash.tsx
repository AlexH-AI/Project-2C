import { useCallback, useMemo, useRef, useState, type Ref } from 'react';
import { listTrash, type Database, type TrashRow } from '@p2c/db';
import {
  Button,
  DataTable,
  DialogFocusFallback,
  PolicyBadge,
  Segmented,
  StageBadge,
  type DataTableColumn,
} from '@p2c/ui';
import { useQuery, useToday } from '../data/AppDataContext';
import { t } from '../i18n';
import { RestoreDialog } from './RestoreDialog';
import {
  TRASH_FILTERS,
  TRASH_MORE,
  blockedReason,
  deletedAtText,
  filterTrash,
  ownerParts,
  recordDetail,
  recordTitle,
  restoreLabel,
  restoredNotice,
  trashCounts,
  type RestoredNotice,
  type TrashFilter,
} from './trash-view';

/** The line saying why a row is blocked, which its restore button is described by (DR6-43). */
const reasonId = (row: TrashRow) => `trash-blocked-${row.kind}-${row.id}`;

function RecordCell({ row }: { row: TrashRow }) {
  const detail = recordDetail(row);
  return (
    <>
      <b className="flex flex-wrap items-center gap-1.5 font-semibold">
        {recordTitle(row)}
        {row.kind === 'customer' && (
          <StageBadge stage={row.stage} label={t(`stage.${row.stage}`)} />
        )}
      </b>
      {row.kind === 'policy' && (
        <PolicyBadge
          issued={row.issuedDate !== null}
          label={t(row.issuedDate === null ? 'policyStatus.submitted' : 'policyStatus.issued')}
        />
      )}
      {detail && <span className="block text-xs text-fg-3">{detail}</span>}
      {row.blocked && (
        <span id={reasonId(row)} className="mt-1 block text-xs text-warn">
          {blockedReason(row, row.blocked)}
        </span>
      )}
    </>
  );
}

function OwnerCell({ row }: { row: TrashRow }) {
  const parts = ownerParts(row);
  if (parts.length === 0) return <span className="text-fg-3">{t('trash.owner.none')}</span>;
  // By place: a team's bare name could read as another part.
  return parts.map((owner, index) => (
    <span key={index}>
      {index > 0 && ` ${t('sep.dot')} `}
      {owner.text}
      {owner.deleted && <span className="text-fg-3"> {t('trash.gone')}</span>}
    </span>
  ));
}

/**
 * The columns of mockup 11a; the last one restores a row, off while it is blocked. "Bản ghi" holds
 * names and dd/mm/yyyy days alike, which no order sorts together: it does not sort (DR6-43).
 */
const trashColumns = (
  onRestore: (row: TrashRow) => void,
): ReadonlyArray<DataTableColumn<TrashRow>> => [
  {
    id: 'kind',
    header: t('trash.col.kind'),
    kind: 'text',
    value: (row) => t(`trash.kind.${row.kind}`),
    cell: (row) => (
      <span className="text-xs font-bold tracking-wider whitespace-nowrap text-fg-3">
        {t(`trash.kind.${row.kind}`)}
      </span>
    ),
  },
  {
    id: 'record',
    header: t('trash.col.record'),
    kind: 'text',
    sortable: false,
    value: recordTitle,
    cell: (row) => <RecordCell row={row} />,
  },
  {
    id: 'owner',
    header: t('trash.col.owner'),
    kind: 'text',
    value: (row) => ownerParts(row)[0]?.text ?? '',
    cell: (row) => <OwnerCell row={row} />,
  },
  {
    id: 'deletedAt',
    header: t('trash.col.deletedAt'),
    kind: 'number',
    value: (row) => Date.parse(row.deletedAt),
    cell: deletedAtText,
    cellClass: () => 'whitespace-nowrap',
  },
  {
    id: 'actions',
    header: t('trash.col.actions'),
    headerHidden: true,
    kind: 'text',
    align: 'end',
    sortable: false,
    value: () => '',
    cell: (row) => (
      <Button
        disabled={row.blocked !== undefined}
        aria-label={restoreLabel(row)}
        aria-describedby={row.blocked && reasonId(row)}
        onClick={() => onRestore(row)}
      >
        {t('trash.restore')}
      </Button>
    ),
  },
];

/**
 * Mockup 11e: what was restored, and a link to where it is now. It takes the focus after a restore,
 * whose row went with its button (DR6-83).
 */
function Restored({ notice, ref }: { notice: RestoredNotice; ref: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="mb-3 flex items-center gap-3 rounded-md border border-ok bg-surface-0 px-3 py-2 text-sm"
    >
      <span aria-hidden="true" className="font-bold text-ok">
        {t('trash.restored.mark')}
      </span>
      <div className="min-w-0 flex-1">
        <b className="block font-semibold">{notice.title}</b>
        {notice.detail && <span className="text-fg-2">{notice.detail}</span>}
      </div>
      <a
        href={notice.href}
        className="rounded-md border border-border bg-surface-2 px-2.5 py-1 whitespace-nowrap text-fg no-underline hover:bg-surface-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {notice.open}
      </a>
    </div>
  );
}

/**
 * Settings → Thùng rác (spec Phase 6 §4.2, mockup trash.html 11a, 11d, 11e): every deleted record,
 * newest deletion first, whatever the scope of the top bar (TR-7), with why it cannot come back.
 */
export function TrashSection() {
  const today = useToday();
  // `today` is the point: `listTrash` reads the day from the database's clock, so a new day is a new
  // read, and a record dated after today (TR-5) can come back on its day without a write (DR6-43).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = useQuery(useCallback((db: Database) => listTrash(db), [today]));
  const [filter, setFilter] = useState<TrashFilter>('all');
  const [query, setQuery] = useState('');
  const [restoring, setRestoring] = useState<TrashRow | null>(null);
  const [notice, setNotice] = useState<RestoredNotice | null>(null);
  const restored = useRef<HTMLDivElement>(null);
  const columns = useMemo(() => trashColumns(setRestoring), []);
  const counts = useMemo(() => trashCounts(rows), [rows]);
  const shown = useMemo(() => filterTrash(rows, filter, query), [rows, filter, query]);
  const options = TRASH_FILTERS.map((kind) => ({
    value: kind,
    label: t('trash.kindCount', { label: t(`trash.kind.${kind}`), count: counts[kind] }),
  }));

  return (
    <section
      aria-labelledby="trash-title"
      className="rounded-lg border border-border bg-surface-1 px-4 py-3"
    >
      <div className="mb-1 flex items-baseline gap-2">
        <h2 id="trash-title" className="m-0 text-sm font-medium text-heading">
          {t('trash.title')}
        </h2>
        <span className="text-xs text-fg-3 tabular-nums">
          {t('trash.count', { count: rows.length })}
        </span>
      </div>
      <p className="m-0 mb-3 text-sm text-fg-2">{t('trash.help')}</p>
      {notice && <Restored ref={restored} notice={notice} />}
      {rows.length === 0 ? (
        <p className="m-0 px-3 py-7 text-center text-sm text-fg-2">
          <b className="mb-1 block text-md text-fg">{t('trash.empty')}</b>
          {t('trash.emptyHelp')}
        </p>
      ) : (
        <>
          <div className="mb-2.5 flex flex-wrap items-center gap-3">
            <Segmented
              label={t('trash.kinds')}
              options={options}
              value={filter}
              onChange={setFilter}
            />
            {/* A search box without a field label, as in mockup 11a; its name is for screen readers. */}
            <input
              type="search"
              aria-label={t('trash.search')}
              placeholder={t('trash.searchPlaceholder')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              className="min-w-56 flex-1 rounded-md border border-border-strong bg-surface-0 px-2 py-1.5 text-sm text-fg placeholder:text-fg-3 focus-visible:outline-2 focus-visible:outline-accent"
            />
          </div>
          {shown.length === 0 ? (
            <p className="m-0 py-4 text-center text-sm text-fg-2">{t('trash.noMatch')}</p>
          ) : (
            <DataTable
              label={t('trash.table')}
              columns={columns}
              rows={shown}
              getRowId={(row) => `${row.kind}-${row.id}`}
              initialSort={{ id: 'deletedAt', desc: true }}
              moreLabels={TRASH_MORE}
              resetKey={`${filter}|${query}`}
            />
          )}
        </>
      )}
      <DialogFocusFallback value={() => restored.current}>
        {restoring && (
          <RestoreDialog
            row={restoring}
            onClose={() => setRestoring(null)}
            onRestored={() => {
              setNotice(restoredNotice(restoring));
              setRestoring(null);
            }}
          />
        )}
      </DialogFocusFallback>
    </section>
  );
}
