import { useSyncExternalStore } from 'react';
import { useAppData } from '../data/AppDataContext';
import { t } from '../i18n';

/** Shown while the last save to the database file failed; the next save retries (spec §5). */
export function SaveWarning() {
  const { saves } = useAppData();
  const failed = useSyncExternalStore(saves.subscribe, saves.failed);
  if (!failed) return null;
  return (
    <div role="alert" className="border-b border-warn bg-surface-0 px-6 py-2.5 text-sm text-warn">
      {t('storage.saveFailed')}
    </div>
  );
}
