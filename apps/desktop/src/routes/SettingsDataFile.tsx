import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { LATEST_SCHEMA_VERSION } from '@p2c/db';
import { formatCount, formatFileSize, formatLocalDateTime } from '@p2c/domain';
import { Button } from '@p2c/ui';
import { useAppData, useQuery } from '../data/AppDataContext';
import { countRecords, type DataFolder, type RecordCounts } from '../data/app-data';
import { t } from '../i18n';

/** `3 team · 36 nhân sự · 1.204 KH · …`, the same sentence in the card and in dialog 10a. */
export const countsText = (counts: RecordCounts) =>
  t('settings.backup.counts', {
    teams: formatCount(counts.teams),
    people: formatCount(counts.people),
    customers: formatCount(counts.customers),
    appointments: formatCount(counts.appointments),
    policies: formatCount(counts.policies),
  });

const PATH = 'font-mono text-fg-2';

/** Settings → Data, "File dữ liệu" (mockup settings-data; 10d in web mode). */
export function DataFileSection() {
  const data = useAppData();
  const counts = useQuery(countRecords);

  return (
    <section
      aria-labelledby="data-file-title"
      className="rounded-lg border border-border bg-surface-1 px-4 py-3"
    >
      <div className="mb-1 flex items-baseline gap-2">
        <h2 id="data-file-title" className="m-0 text-sm font-medium text-heading">
          {t('settings.file.title')}
        </h2>
        <span className="text-xs text-fg-3 tabular-nums">
          {t('settings.file.schema', { version: LATEST_SCHEMA_VERSION })}
        </span>
      </div>
      <dl className="m-0 flex flex-col gap-1.5 py-2 text-sm tabular-nums">
        {data.hasFile && <FileFacts />}
        <Fact term={t('settings.file.content')}>{countsText(counts)}</Fact>
      </dl>
      {!data.hasFile && (
        <p className="m-0 flex items-center gap-2 py-1 text-sm text-fg-2">
          <span aria-hidden className="inline-block size-2 rounded-full bg-info" />
          {t('settings.file.web')}
        </p>
      )}
    </section>
  );
}

/** What only the exe has: the file, its last save and the automatic backups. */
function FileFacts() {
  const data = useAppData();
  const lastSave = useSyncExternalStore(data.subscribeLastSave, data.lastSave);
  const revision = useSyncExternalStore(data.subscribe, data.revision);
  const [latest, setLatest] = useState<string>();

  // Asked again after every change: a reload or an import backs the file up first.
  useEffect(() => {
    let current = true;
    data.latestBackup().then(
      (name) => current && setLatest(name),
      () => current && setLatest(undefined),
    );
    return () => {
      current = false;
    };
  }, [data, revision]);

  return (
    <>
      <Fact term={t('settings.file.location')}>
        <span className={PATH}>{t('settings.file.path')}</span>{' '}
        <span className="text-fg-3">{t('settings.file.pathHint')}</span>
      </Fact>
      <Fact term={t('settings.file.lastSave')}>
        {lastSave
          ? t('settings.file.lastSaveValue', {
              time: formatLocalDateTime(lastSave.at, { seconds: true }),
              size: formatFileSize(lastSave.size),
            })
          : t('settings.file.notSaved')}
      </Fact>
      <Fact term={t('settings.file.autoBackup')}>
        <span className="flex flex-wrap items-center gap-2">
          <span>
            {t('settings.file.autoBackupValue')}{' '}
            <span className={PATH}>{t('settings.file.backupPath')}</span>{' '}
            {latest && t('settings.file.latest', { file: latest })}
          </span>
          <OpenFolderButton folder="backups" />
        </span>
      </Fact>
    </>
  );
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-fg-3">{term}</dt>
      <dd className="m-0">{children}</dd>
    </div>
  );
}

/** Shows `exports\` or `backups\` in Explorer (exe only). */
export function OpenFolderButton({ folder }: { folder: DataFolder }) {
  const data = useAppData();
  const [failed, setFailed] = useState(false);

  const open = async () => {
    setFailed(false);
    try {
      await data.openFolder(folder);
    } catch {
      setFailed(true);
    }
  };

  return (
    <span className="inline-flex shrink-0 items-center gap-2">
      <Button className="px-2 py-0.5" onClick={() => void open()}>
        {t('settings.file.openFolder')}
      </Button>
      {failed && (
        <span role="alert" className="text-danger">
          {t('settings.file.openFailed')}
        </span>
      )}
    </span>
  );
}
