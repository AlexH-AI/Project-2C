import { useEffect, useState } from 'react';
import { Button, Dialog } from '@p2c/ui';
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
        try {
          await closeAfterSaving(saves, {
            ask: () => new Promise((resolve) => setAnswer(() => resolve)),
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
  const choose = (choice: CloseChoice) => {
    setAnswer(null);
    answer(choice);
  };
  return <CloseDialog onChoose={choose} />;
}

function CloseDialog({ onChoose }: { onChoose: (choice: CloseChoice) => void }) {
  // No onClose: Escape does nothing, the window stays open until one of the two answers.
  return (
    <Dialog
      title={t('close.unsavedTitle')}
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
      <p className="m-0">{t('close.unsavedBody')}</p>
    </Dialog>
  );
}
