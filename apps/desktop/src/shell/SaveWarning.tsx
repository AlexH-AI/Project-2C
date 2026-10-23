import { useSyncExternalStore } from 'react';
import { useAppData } from '../data/AppDataContext';
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

/** Shown while the last save to the database file failed; the next save retries (spec §5). */
export function SaveWarning() {
  const { saves, saveError, subscribeSaveError } = useAppData();
  const failed = useSyncExternalStore(saves.subscribe, saves.failed);
  const error = useSyncExternalStore(subscribeSaveError, saveError);
  return failed ? <SaveFailed error={error} /> : null;
}

/** The warning for the storage's `error`, by its cause (see `SAVE_FAILED`). */
export function SaveFailed({ error }: { error: unknown }) {
  return (
    <div role="alert" className="border-b border-warn bg-surface-0 px-6 py-2.5 text-sm text-warn">
      {t(SAVE_FAILED[saveFailure(error)].banner)}
    </div>
  );
}
