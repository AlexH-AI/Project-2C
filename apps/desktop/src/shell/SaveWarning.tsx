import { useSyncExternalStore } from 'react';
import { useAppData } from '../data/AppDataContext';
import { saveFailure } from '../data/tauri-storage';
import { t } from '../i18n';

const SAVE_FAILED = {
  diskFull: 'storage.saveDiskFull',
  readOnly: 'storage.saveReadOnly',
  other: 'storage.saveFailed',
} as const;

/** Shown while the last save to the database file failed; the next save retries (spec §5). */
export function SaveWarning() {
  const { saves, saveError, subscribeSaveError } = useAppData();
  const failed = useSyncExternalStore(saves.subscribe, saves.failed);
  const error = useSyncExternalStore(subscribeSaveError, saveError);
  return failed ? <SaveFailed error={error} /> : null;
}

/**
 * The warning for the storage's `error`: a full disk and a file that can no longer be replaced
 * have their own, which say what to do; any other cause is read as a program holding the file.
 */
export function SaveFailed({ error }: { error: unknown }) {
  return (
    <div role="alert" className="border-b border-warn bg-surface-0 px-6 py-2.5 text-sm text-warn">
      {t(SAVE_FAILED[saveFailure(error)])}
    </div>
  );
}
