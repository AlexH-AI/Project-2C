import type { RefObject } from 'react';
import { Button } from '@p2c/ui';
import { useAppData, useSaveStatus } from '../data/AppDataContext';
import { saveFailure, type SaveFailure } from '../data/tauri-storage';
import { t, type MessageKey } from '../i18n';

/**
 * What the save warning and the close question say for each cause of a failed save, in one table
 * so that a new cause is told in both. A cause the storage tells apart says what to do about it;
 * any other is read as a program holding the file.
 */
export const SAVE_FAILED = {
  diskFull: { banner: 'storage.saveDiskFull', close: 'close.unsavedBodyDiskFull' },
  readOnly: { banner: 'storage.saveReadOnly', close: 'close.unsavedBodyReadOnly' },
  folderReadOnly: {
    banner: 'storage.saveFolderReadOnly',
    close: 'close.unsavedBodyFolderReadOnly',
  },
  other: { banner: 'storage.saveFailed', close: 'close.unsavedBody' },
} as const satisfies Record<SaveFailure, { banner: MessageKey; close: MessageKey }>;

/**
 * Shown while the last save to the database file failed; the next save retries (spec §5), and
 * "Thử lại" writes what the app holds at once (mockup settings-data). A retry that saves takes the
 * warning away with its button: the focus goes to the screen's heading, the next thing on the page,
 * unless it moved on meanwhile.
 */
export function SaveWarning({ heading }: { heading: RefObject<HTMLElement | null> }) {
  const { saves } = useAppData();
  const { failed, error } = useSaveStatus();
  if (!failed) return null;
  const retry = (button: HTMLButtonElement) => {
    saves.flush().then(
      () => {
        const focused = document.activeElement;
        if (focused === button || focused === document.body) heading.current?.focus();
      },
      // Failed again: the warning stays, saying the cause of this try.
      () => undefined,
    );
  };
  return <SaveFailed error={error} onRetry={retry} />;
}

/** The warning for the storage's `error`, by its cause (see `SAVE_FAILED`), with "Thử lại". */
export function SaveFailed({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: (button: HTMLButtonElement) => void;
}) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 border-b border-warn bg-surface-0 px-6 py-2.5 text-sm text-warn"
    >
      <span className="min-w-0 flex-1">{t(SAVE_FAILED[saveFailure(error)].banner)}</span>
      <Button className="px-2 py-0.5" onClick={(event) => onRetry(event.currentTarget)}>
        {t('storage.saveRetry')}
      </Button>
    </div>
  );
}
