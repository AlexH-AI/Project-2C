import { useSyncExternalStore } from 'react';
import { useAppData } from '../data/AppDataContext';
import { DISK_FULL } from '../data/tauri-storage';
import { t } from '../i18n';

/** Shown while the last save to the database file failed; the next save retries (spec §5). */
export function SaveWarning() {
  const { saves, saveError, subscribeSaveError } = useAppData();
  const failed = useSyncExternalStore(saves.subscribe, saves.failed);
  const error = useSyncExternalStore(subscribeSaveError, saveError);
  return failed ? <SaveFailed error={error} /> : null;
}

/** The warning for the storage's `error`: a full disk has its own, which says to free some room. */
export function SaveFailed({ error }: { error: unknown }) {
  return (
    <div role="alert" className="border-b border-warn bg-surface-0 px-6 py-2.5 text-sm text-warn">
      {t(error === DISK_FULL ? 'storage.saveDiskFull' : 'storage.saveFailed')}
    </div>
  );
}
