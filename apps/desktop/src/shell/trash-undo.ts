import { listTrash, type TrashRow } from '@p2c/db';
import type { AppData } from '../data/app-data';
import { t } from '../i18n';
import { restoreRow, restoredNotice, shownRow } from '../routes/trash-view';
import { nameMask } from './name-mask';
import type { Toaster, ToastSpec } from './toast-queue';

/**
 * The toast of a record just deleted (mockup components.html 08): it went to the trash, and "Hoàn
 * tác" brings it back at once, without the question the trash asks (the exception to TR-8, Owner
 * 17/11/2026). The record is restored as the trash restores it (`restoreRow`): its command checks
 * again and gives back what the deletion took. Refused, the data having changed since (or the
 * record no longer in the trash), it says why in a red toast and the record stays where it is.
 */
export function deletedToast(
  app: Pick<AppData, 'db' | 'run'>,
  toast: Toaster,
  kind: TrashRow['kind'],
  id: string,
): ToastSpec {
  const undo = () => {
    const row = listTrash(app.db()).find((deleted) => deleted.kind === kind && deleted.id === id);
    if (!row) return toast.show({ text: t('toast.undoGone'), tone: 'error' });
    // Names as the mask shows them as it runs (VA6b).
    const masked = nameMask.masked();
    const refused = restoreRow(app, row, masked);
    toast.show(
      refused === null
        ? { text: restoredNotice(shownRow(row, masked)).title }
        : { text: refused, tone: 'error' },
    );
  };
  return { text: t(`toast.movedToTrash.${kind}`), action: { label: t('toast.undo'), run: undo } };
}
