import { useEffect, useRef, useState } from 'react';
import { formatDate } from '@p2c/domain';
import { useAppData } from '../data/AppDataContext';
import { t } from '../i18n';

type Outcome =
  | { readonly ok: true; readonly anchor: string; readonly backup: string | undefined }
  | { readonly ok: false; readonly unsaved: boolean };

const BUTTON =
  'rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm hover:bg-surface-3';

/** Settings → Data (mockup settings-data): for now only "Reload simulated data" (T-045). */
export function Settings() {
  const [confirming, setConfirming] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const { hasFile } = useAppData();

  return (
    <section
      aria-labelledby="demo-data-title"
      className="max-w-3xl rounded-lg border border-border bg-surface-1 px-4 py-3"
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
        <button type="button" className={BUTTON} onClick={() => setConfirming(true)}>
          {t('settings.demo.reloadOpen')}
        </button>
      </div>
      {outcome?.ok && (
        <p role="status" className="m-0 py-1 text-sm text-ok">
          {t('settings.demo.done').replace('{date}', outcome.anchor)}{' '}
          {outcome.backup && t('settings.demo.doneBackup').replace('{file}', outcome.backup)}
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
  const dialog = useRef<HTMLDialogElement>(null);
  const [word, setWord] = useState('');
  const [running, setRunning] = useState(false);
  const anchor = formatDate(data.today());
  const confirmWord = t('settings.demo.confirmWord');

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const reload = async () => {
    setRunning(true);
    try {
      const backup = await data.reloadDemoData();
      onClose({ ok: true, anchor, backup });
    } catch (error) {
      const unsaved = error instanceof Error && error.message === 'RELOAD_UNSAVED_CHANGES';
      onClose({ ok: false, unsaved });
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="reload-title"
      className="m-auto w-full max-w-md rounded-lg border border-border bg-surface-1 p-0 text-fg backdrop:bg-surface-0/70"
      // Escape closes the dialog natively; nothing may close it while the reload runs.
      onCancel={(event) => {
        event.preventDefault();
        if (!running) onClose();
      }}
    >
      <form
        method="dialog"
        className="flex flex-col gap-3 p-4 text-sm"
        onSubmit={(event) => {
          event.preventDefault();
          if (word === confirmWord && !running) void reload();
        }}
      >
        <h2 id="reload-title" className="m-0 text-base font-semibold">
          {t('settings.demo.confirmTitle')}
        </h2>
        <p className="m-0">{t('settings.demo.confirmBody').replace('{date}', anchor)}</p>
        <p className="m-0 text-fg-2">
          {t(data.hasFile ? 'settings.demo.confirmBackup' : 'settings.demo.confirmWeb')}
        </p>
        <label className="flex flex-col gap-1">
          {t('settings.demo.confirmWordLabel').replace('{word}', confirmWord)}
          <input
            className="rounded-md border border-border bg-surface-0 px-2 py-1.5"
            value={word}
            disabled={running}
            onChange={(event) => setWord(event.target.value)}
            autoComplete="off"
          />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" className={BUTTON} disabled={running} onClick={() => onClose()}>
            {t('settings.demo.cancel')}
          </button>
          <button
            type="submit"
            className="rounded-md bg-danger px-3 py-1.5 text-sm text-on-accent disabled:opacity-50"
            disabled={word !== confirmWord || running}
          >
            {running
              ? t('settings.demo.running')
              : t(data.hasFile ? 'settings.demo.confirmWithBackup' : 'settings.demo.confirm')}
          </button>
        </div>
      </form>
    </dialog>
  );
}
