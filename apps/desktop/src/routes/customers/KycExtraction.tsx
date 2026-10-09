import type { ExtractedFact } from '@p2c/ai';
import type { KycNoteRecord } from '@p2c/db';
import type { KycFact } from '@p2c/domain';
import { Button } from '@p2c/ui';
import { useState, useSyncExternalStore } from 'react';
import { extractFromNote } from '../../data/ai-analysis';
import { useAppData } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { ALERT } from './CustomerDialogs';
import { YES_NO } from './CustomerKyc';
import { extractionButton, extractionView } from './extraction-view';
import { BusyLine } from './KycIntelligence';
import { factText } from './kyc-view';
import { useAiJob } from './use-ai-job';

/** Xác nhận of a proposal: the fact dialog, filled in; `onSaved` once the fact is saved. */
export type ConfirmProposal = (
  note: KycNoteRecord,
  proposal: ExtractedFact,
  onSaved: () => void,
) => void;

/**
 * A KYC note of the timeline with AI trích xuất (spec Phase 5 §8, mockup ai.html 3b–3e): the
 * button on a note the RE wrote, the run with Hủy, and below the note the proposals to confirm or
 * drop. Proposals stay here only: leaving the profile loses them (§8 item 4).
 */
export function NoteEvent({
  note,
  facts,
  onConfirm,
}: {
  note: KycNoteRecord;
  facts: readonly KycFact[];
  onConfirm: ConfirmProposal;
}) {
  const app = useAppData();
  const { runner } = app.ai;
  // Every AI button is off while any AI request runs (P5).
  const busy = useSyncExternalStore(runner.subscribe, () => runner.busy);
  const job = useAiJob('extraction', note.id);
  // The proposals the RE confirmed or dropped, by their place in the answer.
  const [handled, setHandled] = useState<ReadonlySet<number>>(new Set());
  const button = extractionButton(note);
  const view = job.phase === 'idle' ? extractionView(job.ended, handled, facts) : null;
  const handle = (index: number) => setHandled((now) => new Set(now).add(index));
  const extract = () => {
    setHandled(new Set());
    job.start((signal) => extractFromNote(app.ai, note.text, signal));
  };

  return (
    <>
      <span className="flex items-center gap-2">
        <b>{t(button ? 'timeline.note' : 'timeline.systemNote')}</b>
        {button && (
          <Button
            className="px-2 py-0.5 text-xs"
            disabled={busy || button.tooShort}
            title={button.tooShort ? t('extraction.tooShort') : undefined}
            onClick={extract}
          >
            {t('extraction.button')}
          </Button>
        )}
      </span>
      <span className="whitespace-pre-line text-fg-2">
        {note.text}
        {button?.tooShort && (
          <span className="text-xs text-fg-3">
            {' '}
            {t('sep.dot')} {t('extraction.tooShort')}
          </span>
        )}
      </span>
      {job.phase === 'running' && (
        <BusyLine action={<Button onClick={job.cancel}>{t('aiPanel.cancel')}</Button>}>
          {t('extraction.running')}
        </BusyLine>
      )}
      {job.phase === 'cancelling' && (
        <BusyLine>
          {t('aiPanel.cancelling')}
          <span className="text-fg-3"> {t('aiPanel.cancellingDetail')}</span>
        </BusyLine>
      )}
      {view?.kind === 'proposals' && (
        <>
          <ul
            aria-label={t('extraction.proposals')}
            className="m-0 flex list-none flex-col gap-1 p-0"
          >
            {view.items.map(({ index, fact }) => (
              <li key={index} className={`${ROW} border-dashed border-border-strong bg-surface-2`}>
                <span className="flex-1">
                  {t('extraction.proposed')} <b>{t(`kycField.${fact.field}`)}</b>:{' '}
                  {factText(fact.value, YES_NO)}{' '}
                  <span className="text-fg-3">{t('extraction.quote', { value: fact.quote })}</span>
                </span>
                <Button onClick={() => onConfirm(note, fact, () => handle(index))}>
                  {t('extraction.confirm')}
                </Button>
                <Button onClick={() => handle(index)}>{t('extraction.drop')}</Button>
              </li>
            ))}
          </ul>
          <span className="text-xs text-fg-3">
            {view.hidden > 0 && `${t('extraction.hidden', { count: view.hidden })} `}
            {t('extraction.notSaved')}
          </span>
        </>
      )}
      {view?.kind === 'empty' && (
        <p role="status" className={`${ROW} m-0 border-dashed border-border-strong bg-surface-2`}>
          <span className="flex-1">{t('extraction.empty')}</span>
          <Button onClick={job.clear}>{t('extraction.close')}</Button>
        </p>
      )}
      {view?.kind === 'error' && (
        <div role="alert" className={`${ALERT} flex items-center gap-2.5 border-danger`}>
          <span className="flex-1">
            {view.error === 'INVALID' ? t('extraction.invalid') : t(`aiError.${view.error}`)}
          </span>
          <Button disabled={busy} onClick={extract}>
            {t('aiPanel.retry')}
          </Button>
        </div>
      )}
    </>
  );
}

/** The mockup's `.pending` line: a proposal, or "nothing new". */
const ROW = 'flex flex-wrap items-center gap-2 rounded-sm border px-2.5 py-1.5';
