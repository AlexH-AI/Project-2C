import { useState } from 'react';
import { formatDate } from '@p2c/domain';
import { Button, Dialog, TextField } from '@p2c/ui';
import { useAppData } from '../data/AppDataContext';
import { isUnsavedChangesError } from '../data/app-data';
import { t } from '../i18n';
import { BackupSection } from './SettingsBackup';
import { DataFileSection } from './SettingsDataFile';

type Outcome =
  | { readonly ok: true; readonly anchor: string; readonly backup: string | undefined }
  | { readonly ok: false; readonly unsaved: boolean };

/**
 * Settings → Data (mockup settings-data): the data file (T-070), backup files (T-052), then the
 * simulated data (T-045).
 */
export function Settings() {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <DataFileSection />
      <BackupSection />
      <DemoSection />
    </div>
  );
}

function DemoSection() {
  const [confirming, setConfirming] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const { hasFile } = useAppData();

  return (
    <section
      aria-labelledby="demo-data-title"
      className="rounded-lg border border-border bg-surface-1 px-4 py-3"
    >
      <h2 id="demo-data-title" className="m-0 mb-1 text-sm font-medium text-heading">
        {t('settings.demo.title')}
      </h2>
      <div className="flex items-center gap-3 py-2 text-sm">
        <div className="flex-1">
          <b className="block text-base">{t('settings.demo.reload')}</b>
          <span className="text-fg-2">
            {t('settings.demo.reloadHelp')} {hasFile && t('settings.demo.reloadHelpBackup')}
          </span>
        </div>
        <Button onClick={() => setConfirming(true)}>{t('settings.demo.reloadOpen')}</Button>
      </div>
      {outcome?.ok && (
        <p role="status" className="m-0 py-1 text-sm text-ok">
          {t('settings.demo.done', { date: outcome.anchor })}{' '}
          {outcome.backup && t('settings.demo.doneBackup', { file: outcome.backup })}
        </p>
      )}
      {outcome?.ok === false && (
        <p role="alert" className="m-0 py-1 text-sm text-danger">
          {t(outcome.unsaved ? 'settings.demo.failedUnsaved' : 'settings.demo.failed')}
        </p>
      )}
      {confirming && (
        <ReloadDialog
          onClose={(result) => {
            setConfirming(false);
            if (result) setOutcome(result);
          }}
        />
      )}
    </section>
  );
}

/** Mockup 10c: type the confirmation word, then back up (exe) and reload. */
function ReloadDialog({ onClose }: { onClose: (outcome?: Outcome) => void }) {
  const data = useAppData();
  const [word, setWord] = useState('');
  const [running, setRunning] = useState(false);
  const anchor = formatDate(data.today());
  const confirmWord = t('settings.demo.confirmWord');
  // An IME may type the word decomposed (review R4).
  const confirmed = word.normalize('NFC') === confirmWord;

  const reload = async () => {
    setRunning(true);
    try {
      const backup = await data.reloadDemoData();
      onClose({ ok: true, anchor, backup });
    } catch (error) {
      const unsaved = isUnsavedChangesError(error);
      onClose({ ok: false, unsaved });
    }
  };

  return (
    <Dialog
      title={t('settings.demo.confirmTitle')}
      // Nothing may close the dialog while the reload runs.
      onClose={running ? undefined : () => onClose()}
      onSubmit={() => {
        if (confirmed && !running) void reload();
      }}
      actions={
        <>
          <Button disabled={running} onClick={() => onClose()}>
            {t('settings.demo.cancel')}
          </Button>
          <Button type="submit" variant="danger" disabled={!confirmed || running}>
            {running
              ? t('settings.demo.running')
              : t(data.hasFile ? 'settings.demo.confirmWithBackup' : 'settings.demo.confirm')}
          </Button>
        </>
      }
    >
      <p className="m-0">{t('settings.demo.confirmBody', { date: anchor })}</p>
      <p className="m-0 text-fg-2">
        {t(data.hasFile ? 'settings.demo.confirmBackup' : 'settings.demo.confirmWeb')}
      </p>
      <TextField
        label={t('settings.demo.confirmWordLabel', { word: confirmWord })}
        value={word}
        disabled={running}
        onChange={setWord}
      />
    </Dialog>
  );
}
