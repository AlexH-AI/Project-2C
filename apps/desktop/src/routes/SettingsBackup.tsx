import { useRef, useState } from 'react';
import { DbError, LATEST_SCHEMA_VERSION } from '@p2c/db';
import { formatCount, formatLocalDateTime } from '@p2c/domain';
import { Button, Dialog } from '@p2c/ui';
import { useAppData } from '../data/AppDataContext';
import type { BackupPreview, RecordCounts } from '../data/app-data';
import { t } from '../i18n';

type Notice =
  | { readonly kind: 'exported'; readonly where: string }
  | { readonly kind: 'imported'; readonly exportedAt: string; readonly backup: string | undefined }
  | { readonly kind: 'failed'; readonly message: string };

interface Chosen {
  readonly name: string;
  readonly preview: BackupPreview;
}

interface Refused {
  readonly name: string;
  readonly error: unknown;
}

const ALERT = 'm-0 flex flex-col gap-1 rounded-md border px-3 py-2';

/** Settings → Data, "Xuất / nhập backup" (mockup settings-data, 10a, 10b; spec §6). */
export function BackupSection() {
  const data = useAppData();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<'export' | 'read' | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [chosen, setChosen] = useState<Chosen | null>(null);
  const [refused, setRefused] = useState<Refused | null>(null);

  const exportFile = async () => {
    setBusy('export');
    setNotice(null);
    try {
      const exported = await data.exportBackup();
      if (exported.path === undefined) download(exported.name, exported.text);
      setNotice({ kind: 'exported', where: exported.path ?? exported.name });
    } catch {
      setNotice({ kind: 'failed', message: t('settings.backup.exportFailed') });
    } finally {
      setBusy(null);
    }
  };

  const readFile = async (file: File) => {
    setBusy('read');
    setNotice(null);
    try {
      setChosen({ name: file.name, preview: await data.readBackup(await file.text()) });
    } catch (error) {
      setRefused({ name: file.name, error });
    } finally {
      setBusy(null);
    }
  };

  return (
    <section
      aria-labelledby="backup-title"
      className="rounded-lg border border-border bg-surface-1 px-4 py-3"
    >
      <div className="mb-1 flex items-baseline gap-2">
        <h2 id="backup-title" className="m-0 text-sm font-medium text-heading">
          {t('settings.backup.title')}
        </h2>
        <span className="text-xs text-fg-3">{t('settings.backup.meta')}</span>
      </div>
      <div className="flex items-center gap-3 border-b border-border py-2 text-sm">
        <div className="flex-1">
          <b className="block text-base">{t('settings.backup.export')}</b>
          <span className="text-fg-2">
            {t(data.hasFile ? 'settings.backup.exportHelp' : 'settings.backup.exportHelpWeb')}
          </span>
        </div>
        <Button disabled={busy !== null} onClick={() => void exportFile()}>
          {busy === 'export' ? t('settings.backup.exporting') : t('settings.backup.export')}
        </Button>
      </div>
      <div className="flex items-center gap-3 py-2 text-sm">
        <div className="flex-1">
          <b className="block text-base">{t('settings.backup.import')}</b>
          <span className="text-fg-2">
            {t('settings.backup.importHelp')}{' '}
            {data.hasFile && t('settings.backup.importHelpBackup')}
          </span>
        </div>
        <input
          ref={input}
          type="file"
          accept=".p2cbackup"
          hidden
          aria-label={t('settings.backup.import')}
          onChange={(event) => {
            const file = event.target.files?.[0];
            // Cleared so that choosing the same file again reads it again.
            event.target.value = '';
            if (file) void readFile(file);
          }}
        />
        <Button disabled={busy !== null} onClick={() => input.current?.click()}>
          {busy === 'read' ? t('settings.backup.reading') : t('settings.backup.importOpen')}
        </Button>
      </div>
      {notice?.kind === 'exported' && (
        <p role="status" className="m-0 py-1 text-sm text-ok">
          {t('settings.backup.exported')}: <span className="tabular-nums">{notice.where}</span>
        </p>
      )}
      {notice?.kind === 'imported' && (
        <p role="status" className="m-0 py-1 text-sm text-ok">
          {t('settings.backup.done', { date: formatLocalDateTime(new Date(notice.exportedAt)) })}{' '}
          {notice.backup && t('settings.demo.doneBackup', { file: notice.backup })}
        </p>
      )}
      {notice?.kind === 'failed' && (
        <p role="alert" className="m-0 py-1 text-sm text-danger">
          {notice.message}
        </p>
      )}
      {chosen && (
        <ImportDialog
          chosen={chosen}
          current={data.counts()}
          onClose={(result) => {
            setChosen(null);
            if (result) setNotice(result);
          }}
        />
      )}
      {refused && <RefusedDialog refused={refused} onClose={() => setRefused(null)} />}
    </section>
  );
}

/** Hands the file to the browser's downloads (web mode has no `exports\` folder). */
function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  // Revoked later: the download may start only after `click` returns.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

const countsText = (counts: RecordCounts) =>
  t('settings.backup.counts', {
    teams: formatCount(counts.teams),
    people: formatCount(counts.people),
    customers: formatCount(counts.customers),
    appointments: formatCount(counts.appointments),
    policies: formatCount(counts.policies),
  });

/** Mockup 10a: what the file holds against the current data, then back up (exe) and replace. */
function ImportDialog({
  chosen,
  current,
  onClose,
}: {
  chosen: Chosen;
  current: RecordCounts;
  onClose: (notice?: Notice) => void;
}) {
  const data = useAppData();
  const [running, setRunning] = useState(false);
  const { preview } = chosen;
  const exportedAt = formatLocalDateTime(new Date(preview.exportedAt));
  const version = { version: preview.schemaVersion, supported: LATEST_SCHEMA_VERSION };

  const replace = async () => {
    setRunning(true);
    try {
      const backup = await data.importBackup(preview);
      onClose({ kind: 'imported', exportedAt: preview.exportedAt, backup });
    } catch (error) {
      const unsaved = error instanceof Error && error.message === 'RELOAD_UNSAVED_CHANGES';
      onClose({
        kind: 'failed',
        message: t(unsaved ? 'settings.backup.failedUnsaved' : 'settings.backup.failed'),
      });
    }
  };

  const facts: [string, string][] = [
    [t('settings.backup.exportedAt'), exportedAt],
    [
      t('settings.backup.version'),
      t(
        preview.schemaVersion < LATEST_SCHEMA_VERSION
          ? 'settings.backup.versionOlder'
          : 'settings.backup.versionSame',
        version,
      ),
    ],
    [t('settings.backup.inFile'), countsText(preview.counts)],
    [t('settings.backup.current'), countsText(current)],
  ];

  return (
    <Dialog
      title={t('settings.backup.confirmTitle')}
      subtitle={chosen.name}
      // Nothing may close the dialog while the import runs.
      onClose={running ? undefined : () => onClose()}
      onSubmit={() => {
        if (!running) void replace();
      }}
      actions={
        <>
          <Button disabled={running} onClick={() => onClose()}>
            {t('settings.backup.cancel')}
          </Button>
          <Button type="submit" variant="danger" disabled={running}>
            {running
              ? t('settings.backup.running')
              : t(data.hasFile ? 'settings.backup.confirmWithBackup' : 'settings.backup.confirm')}
          </Button>
        </>
      }
    >
      <dl className="m-0 flex flex-col gap-1.5 tabular-nums">
        {facts.map(([term, value]) => (
          <div key={term} className="flex gap-3">
            <dt className="w-24 shrink-0 text-fg-3">{term}</dt>
            <dd className="m-0">{value}</dd>
          </div>
        ))}
      </dl>
      <div role="note" className={`${ALERT} border-warn`}>
        <b>{t('settings.backup.lossWarning', { date: exportedAt })}</b>
        <span className="text-fg-2">
          {t(data.hasFile ? 'settings.backup.confirmBackup' : 'settings.backup.confirmWeb')}
        </span>
      </div>
    </Dialog>
  );
}

/** Mockup 10b: the file cannot be used; the current data is untouched. */
function RefusedDialog({ refused, onClose }: { refused: Refused; onClose: () => void }) {
  const tooNew = refused.error instanceof DbError && refused.error.code === 'SCHEMA_TOO_NEW';
  const params = refused.error instanceof DbError ? refused.error.params : undefined;
  return (
    <Dialog
      title={t('settings.backup.refusedTitle')}
      subtitle={refused.name}
      onClose={onClose}
      onSubmit={onClose}
      actions={<Button type="submit">{t('settings.backup.close')}</Button>}
    >
      <div role="alert" className={`${ALERT} border-danger`}>
        <b className="text-danger">
          {tooNew ? t('settings.backup.tooNew', params) : t('settings.backup.invalid')}
        </b>
        <span className="text-fg-2">
          {t(tooNew ? 'settings.backup.tooNewHelp' : 'settings.backup.invalidHelp')}
        </span>
      </div>
    </Dialog>
  );
}
