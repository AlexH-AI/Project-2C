import type { ExtractedFact } from '@p2c/ai';
import type { KycNoteRecord } from '@p2c/db';
import type { KycFact } from '@p2c/domain';
import { Button } from '@p2c/ui';
import { useEffect, useId, useState, useSyncExternalStore } from 'react';
import { extractFromNote } from '../../data/ai-analysis';
import { useAppData } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { ALERT } from './CustomerDialogs';
import { YES_NO } from './CustomerKyc';
import { busyElsewhere, extractionButton, extractionView } from './extraction-view';
import { AiErrorText, BusyLine } from './KycIntelligence';
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
  webOpen,
  onConfirm,
}: {
  note: KycNoteRecord;
  facts: readonly KycFact[];
  /** This customer's ChatGPT web session waits for its paste (§3.1 item 4). */
  webOpen: boolean;
  onConfirm: ConfirmProposal;
}) {
  const app = useAppData();
  const { runner } = app.ai;
  // Every AI button is off while any AI request runs (P5), and this customer's while its ChatGPT web
  // session waits (ADR-0009 W-1 item 6).
  const running = useSyncExternalStore(runner.subscribe, () => runner.busy);
  const busy = running || webOpen;
  const job = useAiJob('extraction', note.id);
  // The proposals the RE confirmed or dropped, by their place in the answer.
  const [handled, setHandled] = useState<ReadonlySet<number>>(new Set());
  const button = extractionButton(note);
  const view = job.phase === 'idle' ? extractionView(job.ended, handled, facts) : null;
  // Đóng takes the focus with the line it closes: back to this note's button (DR5-43).
  const buttonId = useId();
  const close = () => {
    job.clear();
    document.getElementById(buttonId)?.focus();
  };
  // A proposal confirmed or dropped takes its buttons with it: the focus goes to the next one left,
  // else the one before, else this note's button (R2-05). A new object per proposal handled.
  const proposalId = (index: number) => `${buttonId}-${index}`;
  const [focusTo, setFocusTo] = useState<{ readonly id: string } | null>(null);
  useEffect(() => {
    if (!focusTo) return;
    const active = document.activeElement;
    if (active && active !== document.body) return;
    (document.getElementById(focusTo.id) ?? document.getElementById(buttonId))?.focus();
  }, [focusTo, buttonId]);
  const handle = (index: number) => {
    const left =
      view?.kind === 'proposals' ? view.items.filter((item) => item.index !== index) : [];
    const next = left.find((item) => item.index > index) ?? left.at(-1);
    setHandled((now) => new Set(now).add(index));
    setFocusTo({ id: next ? proposalId(next.index) : buttonId });
  };
  const extract = () => {
    setHandled(new Set());
    job.start((signal, call) => extractFromNote(app, note.text, signal, call));
  };

  return (
    <>
      <span className="flex items-center gap-2">
        <b>{t(button ? 'timeline.note' : 'timeline.systemNote')}</b>
        {button && (
          <Button
            id={buttonId}
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
      {busyElsewhere(button, { busy: running, webOpen, phase: job.phase }) && (
        <span className="text-xs text-fg-3">{t('aiError.AI_BUSY')}</span>
      )}
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
      {/* Present before it is filled, so a screen reader hears the run end (DR5-33). */}
      <div aria-live="polite" className="sr-only">
        {view?.kind === 'proposals' && <p role="status">{t('extraction.done')}</p>}
        {view?.kind === 'empty' && <p role="status">{t('extraction.empty')}</p>}
      </div>
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
                <Button
                  id={proposalId(index)}
                  onClick={() => onConfirm(note, fact, () => handle(index))}
                >
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
        <p className={`${ROW} m-0 border-dashed border-border-strong bg-surface-2`}>
          {/* Read from the live region above (R2-17). */}
          <span aria-hidden="true" className="flex-1">
            {t('extraction.empty')}
          </span>
          <Button onClick={close}>{t('extraction.close')}</Button>
        </p>
      )}
      {view?.kind === 'error' && (
        <div role="alert" className={`${ALERT} flex items-center gap-2.5 border-danger`}>
          <span className="flex-1">
            {view.error === 'INVALID' ? (
              t('extraction.invalid')
            ) : (
              <AiErrorText error={view.error} />
            )}
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
