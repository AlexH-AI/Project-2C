import type { ExtractedFact } from '@p2c/ai';
import type { KycNoteRecord } from '@p2c/db';
import type { KycFact } from '@p2c/domain';
import { Button } from '@p2c/ui';
import { useEffect, useId, useState, useSyncExternalStore } from 'react';
import { extractFromNote } from '../../data/ai-analysis';
import { useAppData } from '../../data/AppDataContext';
import { fillSlots, t } from '../../i18n';
import { UpdateHead, VersionLines, YES_NO } from './CustomerKyc';
import { busyElsewhere, extractionButton, extractionView } from './extraction-view';
import { AiErrorText, AiRunStatus } from './KycIntelligence';
import { factText, type TimelineVersion } from './kyc-view';
import { useAiJob } from './use-ai-job';

/** Xác nhận of a proposal: the fact dialog, filled in; `onSaved` once the fact is saved. */
type ConfirmProposal = (note: KycNoteRecord, proposal: ExtractedFact, onSaved: () => void) => void;

/**
 * "AI đề xuất: <trường>: <giá trị>" (spec Phase 5 §8 item 2), the trường in bold; the value is put
 * in once the sentence is split, so one holding "{field}" reads as given.
 */
function Proposed({ fact }: { fact: ExtractedFact }) {
  const [before, after = ''] = t('extraction.proposed').split('{field}');
  return (
    <>
      {before}
      <b>{t(`kycField.${fact.field}`)}</b>
      {fillSlots(after, { value: factText(fact.value, YES_NO) })}
    </>
  );
}

/**
 * A KYC note of the timeline with AI trích xuất (spec Phase 5 §8, mockup ai.html 3b–3e): a KYC
 * update with the versions its facts recorded (customer.html), the button on a note the RE wrote,
 * the run with Hủy, and below the note the proposals to confirm or drop. Proposals stay here only:
 * leaving the profile loses them (§8 item 4).
 */
export function NoteEvent({
  note,
  versions,
  facts,
  webOpen,
  onConfirm,
}: {
  note: KycNoteRecord;
  /** The versions its facts recorded on its day: then it reads "Cập nhật KYC dd/mm/yyyy". */
  versions: readonly TimelineVersion[];
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
  // else the one before, else this note's button (R2-05); Hủy and Thử lại take their line with them,
  // to this note's button (DR6-20). While the button is off for a request, the note's text has the
  // focus. A new object each time.
  const proposalId = (index: number) => `${buttonId}-${index}`;
  const textId = `${buttonId}-text`;
  const [focusTo, setFocusTo] = useState<{ readonly id: string } | null>(null);
  useEffect(() => {
    if (!focusTo) return;
    const active = document.activeElement;
    if (active && active !== document.body) return;
    [focusTo.id, buttonId, textId]
      .map((id) => document.getElementById(id))
      .find((node) => node && !(node instanceof HTMLButtonElement && node.disabled))
      ?.focus();
  }, [focusTo, buttonId, textId]);
  const thenFocus = (action: () => void) => () => {
    action();
    setFocusTo({ id: buttonId });
  };
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
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {versions.length > 0 ? (
          <UpdateHead versions={versions} />
        ) : (
          <b>{t(note.source === 'SYSTEM' ? 'timeline.systemNote' : 'timeline.note')}</b>
        )}
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
      {/* The note quoted as the RE or the profile wrote it, one per note of the timeline. */}
      <div className="whitespace-pre-line wrap-anywhere text-fg-2">
        <blockquote id={textId} tabIndex={-1} className="m-0 inline">
          {note.text}
        </blockquote>
        {button?.tooShort && (
          <span className="text-xs text-fg-3">
            {' '}
            {t('sep.dot')} {t('extraction.tooShort')}
          </span>
        )}
      </div>
      <VersionLines versions={versions} />
      {busyElsewhere(button, { busy: running, webOpen, phase: job.phase }) && (
        <span className="text-xs text-fg-3">{t('aiError.AI_BUSY')}</span>
      )}
      <AiRunStatus
        phase={job.phase}
        running={t('extraction.running')}
        error={
          view?.kind === 'error' &&
          (view.error === 'INVALID' ? t('extraction.invalid') : <AiErrorText error={view.error} />)
        }
        retryOn={!busy}
        onCancel={thenFocus(job.cancel)}
        onRetry={thenFocus(extract)}
      />
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
                <span className="min-w-0 flex-1 wrap-anywhere">
                  <Proposed fact={fact} />{' '}
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
    </>
  );
}

/** The mockup's `.pending` line: a proposal, or "nothing new". */
const ROW = 'flex flex-wrap items-center gap-2 rounded-sm border px-2.5 py-1.5';
