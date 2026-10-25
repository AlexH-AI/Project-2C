import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
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
import { useAppData, useQuery, useToday } from '../data/AppDataContext';
import { t } from '../i18n';
import { ConfirmWordDialog } from './ConfirmWordDialog';
import { ALERT } from './customers/CustomerDialogs';
import { policyStatusText } from './customers/policy-form';
import { RestoreDialog } from './RestoreDialog';
import {
  TRASH_FILTERS,
  TRASH_MORE,
  blockedReason,
  canPurge,
  deletedAtText,
  filterTrash,
  keptReason,
  ownerParts,
  purgedNotice,
  purgeFailure,
  purgePlan,
  purgeReminder,
  purgeView,
  recordDetail,
  recordTitle,
  restoreLabel,
  restoredNotice,
  trashCounts,
  type PurgedNotice,
  type PurgeRefusal,
  type PurgeView,
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
        <PolicyBadge issued={row.issuedDate !== null} label={policyStatusText(row)} />
      )}
      {detail && <span className="block text-xs text-fg-3">{detail}</span>}
      {row.blocked && (
        <span id={reasonId(row)} className="mt-1 block text-xs text-warn">
          {blockedReason(row, row.blocked)}
        </span>
      )}
      {row.keptBy && <span className="mt-1 block text-xs text-info">{keptReason(row.keptBy)}</span>}
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

/** The line at the head of the card: what was restored (11e) or purged (11j), or a purge refused. */
type Notice =
  | { readonly kind: 'restored'; readonly view: RestoredNotice }
  | { readonly kind: 'purged'; readonly view: PurgedNotice }
  | { readonly kind: 'refused'; readonly view: PurgeRefusal };

/**
 * Mockups 11e, 11j: what was restored, with a link to where it is now, or what was purged. It takes
 * the focus once its dialog closes, the button that opened it gone or off (DR6-83).
 */
function Done({
  title,
  link,
  children,
  ref,
}: {
  title: string;
  link?: { readonly href: string; readonly text: string };
  children: ReactNode;
  ref: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="mb-3 flex items-center gap-3 rounded-md border border-ok bg-surface-0 px-3 py-2 text-sm"
    >
      <span aria-hidden="true" className="font-bold text-ok">
        {t('trash.done.mark')}
      </span>
      <div className="min-w-0 flex-1">
        <b className="block font-semibold">{title}</b>
        {children && <span className="text-fg-2">{children}</span>}
      </div>
      {link && (
        <a
          href={link.href}
          className="rounded-md border border-border bg-surface-2 px-2.5 py-1 whitespace-nowrap text-fg no-underline hover:bg-surface-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {link.text}
        </a>
      )}
    </div>
  );
}

/** The line at the head of the card once a dialog closed: `Done`, or a purge refused. */
function NoticeLine({ notice, ref }: { notice: Notice; ref: Ref<HTMLDivElement> }) {
  switch (notice.kind) {
    case 'restored': {
      const { title, detail, href, open } = notice.view;
      return (
        <Done ref={ref} title={title} link={{ href, text: open }}>
          {detail}
        </Done>
      );
    }
    case 'purged': {
      // Sentence by sentence, side by side, as Nạp lại and Nhập backup place "Backup: …".
      const { title, deleted, kept, backup } = notice.view;
      return (
        <Done ref={ref} title={title}>
          {deleted}
          {kept && <> {kept}</>}
          {backup && <> {backup}</>}
        </Done>
      );
    }
    case 'refused':
      return <Refused notice={notice.view} />;
  }
}

/** Mockup 11j: a purge refused, at the same place; nothing changed (D7, D8, D9). */
function Refused({ notice }: { notice: PurgeRefusal }) {
  return (
    <p role="alert" className={`${ALERT} mb-3 border-danger text-sm`}>
      <b className="block text-danger">{notice.title}</b>
      <span className="text-fg-2">{notice.detail}</span>
    </p>
  );
}

/**
 * Mockup 11i: what the purge deletes for good, kind by kind, and what it keeps (TR-11, TR-12), as
 * the list read it when the dialog opened. Typing the word confirms, as for Nạp lại (10c); then the
 * exe backs the file up and purges. Closes with the notice of what came of it.
 */
function PurgeDialog({ view, onClose }: { view: PurgeView; onClose: (notice?: Notice) => void }) {
  const data = useAppData();

  const purge = async () => {
    try {
      onClose({ kind: 'purged', view: purgedNotice(await data.purgeTrash()) });
    } catch (error) {
      onClose({ kind: 'refused', view: purgeFailure(error) });
    }
  };

  return (
    <ConfirmWordDialog
      title={t('trash.purge.title')}
      subtitle={view.subtitle}
      word={t('trash.purge.word')}
      confirmLabel={t(data.hasFile ? 'trash.purge.confirmWithBackup' : 'trash.purge.confirm')}
      runningLabel={t('trash.purge.running')}
      run={purge}
      onClose={() => onClose()}
    >
      <p className="m-0 text-fg-2">{t('trash.purge.intro')}</p>
      <dl className="m-0 flex flex-col gap-1.5 tabular-nums">
        {view.facts.map((fact) => (
          <div key={fact.term} className="flex gap-3">
            <dt className="w-20 shrink-0 text-fg-3">{fact.term}</dt>
            <dd className="m-0">{fact.text}</dd>
          </div>
        ))}
      </dl>
      {view.kept && (
        <p className={`${ALERT} border-info`}>
          <b className="block">{view.kept}</b>
          {t('trash.purge.keptHelp')}
        </p>
      )}
      <p className={`${ALERT} border-warn`}>
        <b className="block">{t('trash.purge.final')}</b>
        {t('trash.purge.finalHelp')}
      </p>
      <p className={`${ALERT} border-info`}>
        {t(data.hasFile ? 'trash.purge.backup' : 'settings.demo.confirmWeb')}
      </p>
    </ConfirmWordDialog>
  );
}

/**
 * Settings → Thùng rác (spec Phase 6 §4.2, mockup trash.html 11a, 11d, 11e, 11h–11j): every deleted
 * record, newest deletion first, whatever the scope of the top bar (TR-7), with why it cannot come
 * back or why a purge keeps it; and the purge of them all.
 */
export function TrashSection() {
  const { hasFile } = useAppData();
  const today = useToday();
  // `today` is the point: `listTrash` reads the day from the database's clock, so a new day is a new
  // read, and a record dated after today (TR-5) can come back on its day without a write (DR6-43).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = useQuery(useCallback((db: Database) => listTrash(db), [today]));
  const [filter, setFilter] = useState<TrashFilter>('all');
  const [query, setQuery] = useState('');
  const [restoring, setRestoring] = useState<TrashRow | null>(null);
  const [purging, setPurging] = useState<PurgeView | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const done = useRef<HTMLDivElement>(null);
  const columns = useMemo(() => trashColumns(setRestoring), []);
  const counts = useMemo(() => trashCounts(rows), [rows]);
  const shown = useMemo(() => filterTrash(rows, filter, query), [rows, filter, query]);
  const reminder = purgeReminder(rows.length);
  const options = TRASH_FILTERS.map((kind) => ({
    value: kind,
    label: t('trash.kindCount', { label: t(`trash.kind.${kind}`), count: counts[kind] }),
  }));
  // A purge that kept records leaves its button, off, which takes the focus back as its dialog
  // goes: the notice takes it after that, as when the button went with the records (11j).
  useEffect(() => {
    if (notice?.kind === 'purged') done.current?.focus();
  }, [notice]);

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
        {rows.length > 0 && (
          <Button
            variant="danger"
            className="ml-auto"
            disabled={!canPurge(rows)}
            // The plan of the rows shown, read once: the dialog runs `keptRecords` neither as it
            // opens nor on the data it purged as it closes (review of PR 710).
            onClick={() => setPurging(purgeView(purgePlan(rows)))}
          >
            {t('trash.purge.open')}
          </Button>
        )}
      </div>
      <p className="m-0 mb-3 text-sm text-fg-2">{t(hasFile ? 'trash.helpFile' : 'trash.help')}</p>
      {reminder && <p className={`${ALERT} mb-3 border-info text-sm`}>{reminder}</p>}
      {notice && <NoticeLine ref={done} notice={notice} />}
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
      <DialogFocusFallback value={() => done.current}>
        {restoring && (
          <RestoreDialog
            row={restoring}
            onClose={() => setRestoring(null)}
            onRestored={() => {
              setNotice({ kind: 'restored', view: restoredNotice(restoring) });
              setRestoring(null);
            }}
          />
        )}
        {purging && (
          <PurgeDialog
            view={purging}
            onClose={(outcome) => {
              setPurging(null);
              if (outcome) setNotice(outcome);
            }}
          />
        )}
      </DialogFocusFallback>
    </section>
  );
}
