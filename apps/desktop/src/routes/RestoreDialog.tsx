import { useState } from 'react';
import type { TrashRow } from '@p2c/db';
import { Button, Dialog } from '@p2c/ui';
import { useAppData, useToday } from '../data/AppDataContext';
import { t } from '../i18n';
import { ALERT } from './classes';
import { FailureAlert } from './customers/CustomerDialogs';
import { stageBadge } from './stage-badge';
import { restoreRow, restoreView, type TeamsDeletedAt } from './trash-view';

/**
 * Mockup 11b, 11c: restoring always asks first and says what it does (TR-8). The command checks
 * again; a refusal (the data changed, or is being replaced: E17) shows here and the dialog stays,
 * in the words of the line of the row (`teams`: those of the whole trash, review of PR 1088).
 */
export function RestoreDialog({
  row,
  teams,
  onClose,
  onRestored,
}: {
  row: TrashRow;
  teams: TeamsDeletedAt;
  onClose: () => void;
  onRestored: () => void;
}) {
  const app = useAppData();
  const [failure, setFailure] = useState<string>();
  // An appointment's status as "Bản ghi" writes it, by the same day (NT-TR-07).
  const today = useToday();
  const view = restoreView(row, today);
  const restore = () => {
    const refused = restoreRow(app, row, teams);
    if (refused === null) onRestored();
    else setFailure(refused);
  };
  return (
    <Dialog
      title={view.title}
      subtitle={view.subtitle}
      onClose={onClose}
      onSubmit={restore}
      actions={
        <>
          <Button onClick={onClose}>{t('customerForm.cancel')}</Button>
          <Button type="submit" variant="primary">
            {t('trash.restore.confirm')}
          </Button>
        </>
      }
    >
      {failure && <FailureAlert>{failure}</FailureAlert>}
      {view.facts.length > 0 && (
        <dl className="m-0 flex flex-col gap-1.5 tabular-nums">
          {view.facts.map((fact) => (
            <div key={fact.term} className="flex gap-3">
              <dt className="w-32 shrink-0 text-fg-3">{fact.term}</dt>
              <dd className="m-0 flex flex-wrap items-center gap-1">
                {fact.text}
                {fact.stage && stageBadge(fact.stage)}
              </dd>
            </div>
          ))}
        </dl>
      )}
      <p className={`${ALERT} border-info`}>
        {view.effect.title && <b className="block">{view.effect.title}</b>}
        {view.effect.body}
      </p>
    </Dialog>
  );
}
