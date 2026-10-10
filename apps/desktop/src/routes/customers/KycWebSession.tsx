import type { KycVersionRecord } from '@p2c/db';
import { Button, TextField } from '@p2c/ui';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { saveChatGptAnswer, type WebAnswerOutcome } from '../../data/ai-analysis';
import { useAppData } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { webAfter, webChip, type AiPanelIssue, type AiPanelWeb } from './ai-panel-view';
import { ALERT } from './CustomerDialogs';

const ROW = 'flex flex-wrap items-center gap-2';

const ISSUE_TEXT = {
  /** In a list (mockups 2k, 4g): "V3 · Behavioral Hypotheses #1: có …". */
  list: { place: 'aiPanel.issue', whole: 'aiPanel.issueWhole' },
  /** The reason of mockup 2i: "Behavioral Hypotheses #1 có … (V3)". */
  reason: { place: 'aiPanel.rejectedReason', whole: 'aiPanel.rejectedReasonWhole' },
} as const;

export function issueText(issue: AiPanelIssue, as: keyof typeof ISSUE_TEXT): string {
  const keys = ISSUE_TEXT[as];
  const value = issue.detail ?? t('aiPanel.issueNoJson');
  return issue.place
    ? t(keys.place, { code: issue.code, where: placeText(issue.place), value })
    : t(keys.whole, { code: issue.code, value });
}

function placeText(place: NonNullable<AiPanelIssue['place']>): string {
  const { key, number } = place;
  const name =
    key === 'personalityNotes'
      ? t('aiPanel.place.personalityNotes')
      : key === 'needs' || key === 'painPoints' || key === 'themes'
        ? t(`aiPanel.group.${key}`)
        : t(`aiPanel.section.${key}`);
  return number === null ? name : t('aiPanel.issuePlace', { name, n: number });
}

/**
 * Mockups 4e–4h: the session waiting for the answer pasted back. Hủy, or leaving the profile, ends
 * it with nothing saved; Kiểm tra và lưu checks the paste and, once over, saves the row.
 */
export function KycWebSession({
  web,
  versions,
  onChange,
  onChecked,
}: {
  web: AiPanelWeb;
  versions: readonly KycVersionRecord[];
  /** The session as it goes on; null once it is over (saved, discarded or Hủy). */
  onChange: Dispatch<SetStateAction<AiPanelWeb | null>>;
  /** How each Kiểm tra và lưu ended, so the panel can say a row was saved (DR5-33). */
  onChecked: (outcome: WebAnswerOutcome) => void;
}) {
  const app = useAppData();
  const [pasted, setPasted] = useState('');
  const chip = webChip(web, versions);
  const second = web.retry !== null;

  // A slow clipboard or browser answers for the session it was asked for, never a later one
  // (review of PR 459).
  const update = (change: Partial<AiPanelWeb>) =>
    onChange((now) => (now && now.session === web.session ? { ...now, ...change } : now));
  const copy = async (text: string) => {
    const copied = await app.ai.web.copy(text);
    update({ manual: copied ? null : text });
  };
  const reopen = async () => {
    const opened = await app.ai.web.openChatGpt();
    update({ openFailed: !opened });
  };
  const check = () => {
    const outcome = saveChatGptAnswer(app, web.session, pasted);
    onChecked(outcome);
    const next = webAfter(web, outcome);
    // A new attempt starts on an empty box; a paste refused at the box stays to be fixed.
    if (next?.session !== web.session) setPasted('');
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2.5 text-sm">
      {web.retry ? (
        <>
          <div role="alert" className={`${ALERT} border-danger`}>
            <b>{t('aiPanel.web.retryTitle')}</b>
            <ul className="m-0 mt-1.5 pl-5">
              {web.retry.issues.map((issue, index) => (
                <li key={index}>{issueText(issue, 'list')}</li>
              ))}
            </ul>
          </div>
          <div className={ROW}>
            <Button variant="primary" onClick={() => void copy(web.retry!.message)}>
              {t('aiPanel.web.copyFix')}
            </Button>
            <span className="text-xs text-fg-2">{withSameChat(t('aiPanel.web.copyFixHelp'))}</span>
          </div>
        </>
      ) : (
        <div role="status" className={`${ALERT} border-border-strong`}>
          {/* A failed copy or browser says so below instead (mockups 4c, 4f). */}
          {web.manual === null && !web.openFailed && (
            <p className="m-0 mb-1.5">
              <b>{t('aiPanel.web.readyTitle')}</b>
              {t('aiPanel.web.ready')}
            </p>
          )}
          <p className={`${ROW} m-0`}>
            <span className="rounded-sm bg-surface-2 px-2 py-0.5 text-xs text-fg-2 tabular-nums">
              {t('aiPanel.web.chip', { version: chip.version, label: chip.prompt, when: chip.at })}
            </span>
            <span className="text-xs text-fg-3">{t('aiPanel.web.attempt', { n: 1 })}</span>
          </p>
        </div>
      )}
      {web.openFailed && web.manual === null && (
        <p role="alert" className={`${ALERT} border-warn`}>
          {t('aiPanel.web.openFailed')}
        </p>
      )}
      {web.manual !== null && (
        <>
          <p role="alert" className={`${ALERT} border-warn`}>
            {t(web.openFailed ? 'aiPanel.web.bothFailed' : 'aiPanel.web.copyFailed')}
          </p>
          <textarea
            readOnly
            aria-label={t('aiPanel.web.manual')}
            value={web.manual}
            rows={4}
            className="rounded-md border border-border-strong bg-surface-0 px-2 py-1.5 font-mono text-xs text-fg-2"
          />
        </>
      )}
      {web.failed && (
        <p role="alert" className={`${ALERT} border-danger`}>
          {t('aiError.GENERAL')}
        </p>
      )}
      <TextField
        label={t(second ? 'aiPanel.web.pasteRetry' : 'aiPanel.web.paste')}
        rows={4}
        value={pasted}
        onChange={(value) => {
          setPasted(value);
          if (web.refused) onChange((now) => now && { ...now, refused: null });
        }}
        placeholder={t(
          second ? 'aiPanel.web.pasteRetryPlaceholder' : 'aiPanel.web.pastePlaceholder',
        )}
        error={web.refused ? t(`aiPanel.web.refused.${web.refused}`) : undefined}
      />
      <div className={ROW}>
        <Button onClick={() => void copy(web.message)}>{t('aiPanel.web.copyAgain')}</Button>
        <Button onClick={() => void reopen()}>{t('aiPanel.web.reopen')}</Button>
        <div className="flex-1" />
        <Button onClick={() => onChange(null)}>{t('aiPanel.cancel')}</Button>
        <Button variant="primary" disabled={pasted.trim() === ''} onClick={check}>
          {t('aiPanel.web.save')}
        </Button>
      </div>
    </div>
  );
}

/** The help line with "cùng cuộc chat" in bold, as mockup 4g shows it. */
function withSameChat(text: string) {
  const [before, after] = text.split('{where}');
  return (
    <>
      {before}
      <b>{t('aiPanel.web.sameChat')}</b>
      {after}
    </>
  );
}
