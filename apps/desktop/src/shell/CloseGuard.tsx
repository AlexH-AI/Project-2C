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
 * What answers each request to close the window. No request closes it: `close` does, once the save
 * is settled. A click while `close` is under way starts no second one; it waits for that, or for
 * the question to be answered or dismissed. Once `close` is over with the window still there, the
 * question left unanswered or closing failed (review of PR 125), the next click tries again.
 */
export function closeRequests(close: () => Promise<void>) {
  let closing = false;
  return async (event: { preventDefault(): void }) => {
    event.preventDefault();
    if (closing) return;
    closing = true;
    try {
      await close();
    } finally {
      closing = false;
    }
  };
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
    let unlisten: (() => void) | undefined;
    let gone = false;
    void appWindow
      .onCloseRequested(
        closeRequests(() =>
          closeAfterSaving(saves, {
            ask: () => askWhileFailed(saves, (choose) => setAnswer(() => choose)),
            close: () => appWindow.destroy(),
          }),
        ),
      )
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
