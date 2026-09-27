import { useEffect, useRef, useState } from 'react';
import { useAppData } from '../data/AppDataContext';
import { t } from '../i18n';
import { closeAfterSaving, type CloseChoice } from './close-guard';

/** The exe window as far as closing goes; Tauri's `Window` fits it. */
export interface AppWindow {
  onCloseRequested(
    handler: (event: { preventDefault(): void }) => Promise<void>,
  ): Promise<() => void>;
  destroy(): Promise<void>;
}

const BUTTON =
  'rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm hover:bg-surface-3';

/**
 * Exe only (T-057): closing the window first saves what is still waiting, and asks before
 * dropping changes the last save could not write.
 */
export function CloseGuard({ appWindow }: { appWindow: AppWindow }) {
  const { saves } = useAppData();
  const [answer, setAnswer] = useState<((choice: CloseChoice) => void) | null>(null);

  useEffect(() => {
    let closing = false;
    let unlisten: (() => void) | undefined;
    let gone = false;
    void appWindow
      .onCloseRequested(async (event) => {
        // The window closes itself once the save is settled; a second click waits for that.
        event.preventDefault();
        if (closing) return;
        closing = true;
        await closeAfterSaving(saves, {
          ask: () => new Promise((resolve) => setAnswer(() => resolve)),
          close: () => appWindow.destroy(),
        });
      })
      .then((stop) => {
        if (gone) stop();
        else unlisten = stop;
      });
    return () => {
      gone = true;
      unlisten?.();
    };
  }, [appWindow, saves]);

  if (!answer) return null;
  const choose = (choice: CloseChoice) => {
    setAnswer(null);
    answer(choice);
  };
  return <CloseDialog onChoose={choose} />;
}

function CloseDialog({ onChoose }: { onChoose: (choice: CloseChoice) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="close-title"
      className="m-auto w-full max-w-md rounded-lg border border-border bg-surface-1 p-0 text-fg backdrop:bg-surface-0/70"
      // Escape does nothing: the window stays open until the user picks one of the two answers.
      onCancel={(event) => {
        event.preventDefault();
      }}
    >
      <div className="flex flex-col gap-3 p-4 text-sm">
        <h2 id="close-title" className="m-0 text-base font-semibold">
          {t('close.unsavedTitle')}
        </h2>
        <p className="m-0">{t('close.unsavedBody')}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md bg-danger px-3 py-1.5 text-sm text-on-accent"
            onClick={() => onChoose('discard')}
          >
            {t('close.discard')}
          </button>
          <button type="button" className={BUTTON} onClick={() => onChoose('retry')} autoFocus>
            {t('close.retry')}
          </button>
        </div>
      </div>
    </dialog>
  );
}
