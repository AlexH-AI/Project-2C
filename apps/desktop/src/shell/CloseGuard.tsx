import { useEffect, useState } from 'react';
import { Button, Dialog } from '@p2c/ui';
import { useAppData, useSaveStatus } from '../data/AppDataContext';
import { saveFailure } from '../data/tauri-storage';
import { t } from '../i18n';
import { askWhileFailed, closeAfterSaving, type CloseChoice } from './close-guard';
import { SAVE_FAILED } from './SaveWarning';

/** The exe window as far as closing it and its title go; Tauri's `Window` fits it. */
export interface AppWindow {
  onCloseRequested(
    handler: (event: { preventDefault(): void }) => Promise<void>,
  ): Promise<() => void>;
  destroy(): Promise<void>;
  /** The title bar, which does not follow the page's title (Tauri 2). */
  setTitle(title: string): Promise<void>;
}

/**
 * Exe only (T-057): closing the window first saves what is still waiting, a replace of the data
 * included (`flush`, review of PR 125), while the sidebar says "Đang lưu…"; and asks before
 * dropping changes the last save could not write, until a save succeeds (`askWhileFailed`).
 */
export function CloseGuard({ appWindow }: { appWindow: AppWindow }) {
  const { saves } = useAppData();
  const { error } = useSaveStatus();
  const [answer, setAnswer] = useState<((choice: CloseChoice) => void) | null>(null);

  useEffect(() => {
    let closing = false;
    let unlisten: (() => void) | undefined;
    let gone = false;
    void appWindow
      .onCloseRequested(async (event) => {
        // The window closes itself once the save is settled; a second click waits for that, or
        // for the question to be answered or dismissed.
        event.preventDefault();
        if (closing) return;
        closing = true;
        try {
          await closeAfterSaving(saves, {
            ask: () => askWhileFailed(saves, (choose) => setAnswer(() => choose)),
            close: () => appWindow.destroy(),
          });
        } finally {
          // Only matters when closing failed (review of PR 125): the next click must try again.
          closing = false;
        }
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
  return <CloseDialog error={error} onChoose={answer} />;
}

/**
 * The question for the storage's `error` of the last failed save, by its cause like the save
 * warning (see `SAVE_FAILED`).
 */
export function CloseDialog({
  error,
  onChoose,
}: {
  error: unknown;
  onChoose: (choice: CloseChoice) => void;
}) {
  // Escape leaves the question unanswered: the window stays open and the next close asks again.
  return (
    <Dialog
      title={t('close.unsavedTitle')}
      onClose={() => onChoose('stay')}
      actions={
        <>
          <Button variant="danger" onClick={() => onChoose('discard')}>
            {t('close.discard')}
          </Button>
          <Button onClick={() => onChoose('retry')} autoFocus>
            {t('close.retry')}
          </Button>
        </>
      }
    >
      <p className="m-0">{t(SAVE_FAILED[saveFailure(error)].close)}</p>
    </Dialog>
  );
}
