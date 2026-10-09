import type { AiAnalysisView, KycFactRecord, KycVersionRecord } from '@p2c/db';
import { evaluateKycGate, formatDate, formatDayMonth, KYC_INSUFFICIENT_MESSAGE } from '@p2c/domain';
import { Button } from '@p2c/ui';
import { useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { analyseCustomer, startChatGptWeb, type AnalysisOutcome } from '../../data/ai-analysis';
import { useAppData } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { LINK } from '../appointments/appointments-view';
import {
  aiPanelView,
  analysisContent,
  analysisSource,
  historyRows,
  modelLabel,
  panelRun,
  webOpened,
  type AiPanelBlocked,
  type AiPanelItem,
  type AiPanelSubgroup,
  type AiPanelWeb,
} from './ai-panel-view';
import { ALERT } from './CustomerDialogs';
import { BADGE } from './CustomerKyc';
import { AnalysisHistory, RejectedReportDialog, SourceBadge, sourceName } from './KycHistory';
import { factCodeTarget } from './kyc-view';
import { issueText, KycWebSession } from './KycWebSession';
import { useAiJob } from './use-ai-job';

const CARD = 'rounded-lg border border-border bg-surface-1 p-4';
const HEADING = 'm-0 text-sm font-medium text-heading';

export const BADGE_COLORS = {
  CURRENT: 'text-ok',
  STALE: 'text-fg-3',
  CONFLICT_RESOLUTION: 'text-danger',
  KYC_INSUFFICIENT: 'text-warn',
  PROFILE_DISCOVERY: 'text-info',
  PAIN_POINT_ANALYSIS: 'text-info',
} as const;

/** `text` with its `{fields}` slot filled by the names, in bold as the mockup shows them. */
function withNames(text: string, names: readonly string[]): ReactNode {
  const [before, after] = text.split('{fields}');
  return (
    <>
      {before}
      {names.map((name, index) => (
        <span key={name}>
          {index > 0 && t('sep.list')}
          <b>{name}</b>
        </span>
      ))}
      {after}
    </>
  );
}

/** Mockups 2b, 2c: why the gate lets no AI through, and where to act on it. */
function BlockedNote({ blocked }: { blocked: AiPanelBlocked }) {
  const names =
    blocked.state === 'CONFLICT_RESOLUTION'
      ? blocked.fields.map((field) => t(`kycField.${field}`))
      : blocked.categories.map((category) => t(`kycCategory.${category}`));
  const conflict = blocked.state === 'CONFLICT_RESOLUTION';
  return (
    <p className={`${ALERT} text-sm ${conflict ? 'border-danger' : 'border-warn'}`}>
      {/* The gate's own sentence (ADR-0008 Q9), as the KYC facts card shows it. */}
      {withNames(
        t(`aiPanel.blocked.${blocked.state}`, { message: KYC_INSUFFICIENT_MESSAGE }),
        names,
      )}
      {conflict && (
        <>
          {' '}
          <a
            href="#kyc-facts"
            className="text-accent hover:underline"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById('kyc-facts')?.scrollIntoView({ block: 'start' });
            }}
          >
            {t('aiPanel.toKyc')}
          </a>
        </>
      )}
    </p>
  );
}

/** "Bằng chứng: F12, F13", each code a link to its fact when the screen lists the facts (3a). */
function Codes({ codes, onCode }: { codes: readonly string[]; onCode?: (code: string) => void }) {
  const [before, after] = t('aiPanel.evidence').split('{value}');
  return (
    <>
      {before}
      {codes.map((code, index) => (
        <span key={code}>
          {index > 0 && t('sep.list')}
          {onCode ? (
            <button type="button" className={LINK} onClick={() => onCode(code)}>
              {code}
            </button>
          ) : (
            code
          )}
        </span>
      ))}
      {after}
    </>
  );
}

export function Item({ item, onCode }: { item: AiPanelItem; onCode?: (code: string) => void }) {
  const { evidence } = item;
  const missing = item.missing && t('aiPanel.missing', { label: t(`kycCategory.${item.missing}`) });
  return (
    <li className="rounded-sm border border-border bg-surface-2 px-2.5 py-2">
      {item.system && <b>{t(`aiPanel.system.${item.system}`)} </b>}
      {item.text}
      <span className="mt-1 flex flex-wrap justify-between gap-x-2 gap-y-0.5 text-xs text-fg-3">
        <span>
          {item.codes.length > 0 && <Codes codes={item.codes} onCode={onCode} />}
          {item.codes.length > 0 && missing && ` ${t('sep.dot')} `}
          {missing}
        </span>
        {evidence && (
          <span className="whitespace-nowrap tabular-nums">
            {t('aiPanel.level', {
              label: t(`aiPanel.levelName.${evidence.level}`),
              count: evidence.factCount,
              date: formatDate(evidence.latestConfirmedDate),
            })}
          </span>
        )}
      </span>
    </li>
  );
}

export const ITEMS = 'm-0 flex list-none flex-col gap-1.5 p-0';
const SUBHEADING = 'mt-3 mb-1.5 text-sm font-medium text-heading';

/** One ACCEPTED analysis as mockup customer.html shows it, 2g in discovery mode. */
function Analysis({
  analysis,
  versions,
  onCode,
}: {
  analysis: AiAnalysisView;
  versions: readonly KycVersionRecord[];
  onCode: (code: string) => void;
}) {
  const content = analysisContent(analysis, versions);
  const { chip } = content;
  return (
    <div className="flex flex-col text-sm">
      <p className="m-0 flex flex-wrap items-center gap-1.5">
        <span className={`${BADGE} ${BADGE_COLORS[analysis.gateState]}`}>{analysis.gateState}</span>
        <span className="rounded-sm bg-surface-2 px-2 py-0.5 text-xs text-fg-2 tabular-nums">
          {t('aiPanel.chip', {
            version: chip.version,
            label: chip.prompt,
            name: sourceName(chip.source),
            when: chip.at,
          })}
        </span>
      </p>
      {analysis.provider === 'MOCK' && (
        <p className="m-0 mt-1.5 text-xs text-fg-3">{t('aiPanel.mockNote')}</p>
      )}
      {content.conflicts.map(({ field, codes }) => (
        <p key={field} className={`${ALERT} mt-2.5 border-warn`}>
          {t('aiPanel.conflict', { field, value: codes.join(' / ') })}
        </p>
      ))}
      {content.sections.map((section) => (
        <section key={section.key} aria-label={t(`aiPanel.section.${section.key}`)}>
          <h3 className={SUBHEADING}>
            {t(`aiPanel.section.${section.key}`)}
            {section.key === 'hypotheses' && (
              <span className="font-normal text-fg-3">
                {' '}
                {t(`aiPanel.hypothesesNote.${analysis.mode}`)}
              </span>
            )}
          </h3>
          {section.groups.map((group) => (
            <div key={group.key}>
              {section.groups.length > 1 && (
                <h4 className="mt-2 mb-1 text-xs font-semibold tracking-wide text-fg-3 uppercase">
                  {t(`aiPanel.group.${group.key as AiPanelSubgroup}`)}
                </h4>
              )}
              <ul className={ITEMS}>
                {group.items.map((item, index) => (
                  <Item key={index} item={item} onCode={onCode} />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
      {content.reference.length > 0 && (
        <section
          aria-label={t('aiPanel.reference')}
          className="mt-3.5 rounded-sm border border-dashed border-border-strong px-2.5 pb-2.5"
        >
          <h3 className={SUBHEADING}>{t('aiPanel.reference')}</h3>
          <ul className={ITEMS}>
            {content.reference.map((item, index) => (
              <Item key={index} item={item} onCode={onCode} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** A spinner-less busy line: the mockup's `.busy` box. */
function BusyLine({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div
      role="status"
      className="flex items-center gap-2.5 rounded-sm border border-border-strong bg-surface-2 px-3 py-2.5 text-sm"
    >
      <span className="flex-1">{children}</span>
      {action}
    </div>
  );
}

/**
 * Mockup customer.html "KYC Intelligence" (spec Phase 5 §9.1): the gate, a run of the AI with Hủy,
 * its errors, and the latest ACCEPTED analysis, CURRENT or STALE. Every AI button follows the app's
 * one runner (P5), so it is off while any AI request runs, also after Hủy.
 */
export function KycIntelligence({
  customerId,
  facts,
  versions,
  analyses,
  onShowFact,
}: {
  customerId: string;
  facts: readonly KycFactRecord[];
  versions: readonly KycVersionRecord[];
  analyses: readonly AiAnalysisView[];
  /** A code cited as evidence, of a fact in effect: the facts list scrolls to it (mockup 3a). */
  onShowFact: (code: string) => void;
}) {
  const app = useAppData();
  const { runner } = app.ai;
  const busy = useSyncExternalStore(runner.subscribe, () => runner.busy);
  // Kept by the app, so the profile left and shown again still has it (review of PR 439).
  const analysis = useAiJob<AnalysisOutcome>(`analysis:${customerId}`);
  // This customer's ChatGPT web session: it lives in the panel only, so leaving ends it (§3.1).
  const [web, setWeb] = useState<AiPanelWeb | null>(null);
  // While the copy and the browser are on their way, both buttons are off already (§3.1 item 4).
  const [startingWeb, setStartingWeb] = useState(false);
  const [webFailed, setWebFailed] = useState(false);
  // The history row picked (mockup 2j) holds until a new row is saved, from any run, so the result
  // shows once saved (review of PR 462).
  const latest = analyses[0]?.id ?? null;
  const [picked, setPicked] = useState<{ readonly id: string; readonly over: string | null }>();
  const viewing = picked?.over === latest ? picked.id : null;
  const setViewing = (id: string | null) =>
    setPicked(id === null ? undefined : { id, over: latest });
  // The REJECTED row whose report is open (2k).
  const [report, setReport] = useState<AiAnalysisView | null>(null);
  const gate = useMemo(() => evaluateKycGate(facts), [facts]);
  const view = aiPanelView({
    gate,
    analyses,
    busy,
    webOpen: web !== null || startingWeb,
    viewing,
  });
  const shown = panelRun(analysis.phase, analysis.ended);
  const showing = view.viewing ?? view.shown;
  // Mockup 2j: "Đang xem lần <dd/mm hh:mm> · kyc v<n> · STALE" over an older one picked.
  const banner = view.viewing && historyRows([view.viewing], versions)[0];
  // A code cited of a fact no longer in effect (mockup 3a), said while the analysis shown and the
  // KYC stay as they were (review of PR 462).
  const on = `${showing?.id}|${versions.at(-1)?.id}`;
  const [goneAt, setGoneAt] = useState<{ readonly code: string; readonly on: string }>();
  const gone = goneAt?.on === on ? goneAt.code : null;

  const pick = (id: string) => {
    const row = analyses.find((analysis) => analysis.id === id);
    setGoneAt(undefined);
    if (row?.status === 'REJECTED') setReport(row);
    else setViewing(id);
  };
  const showFact = (code: string) => {
    const target = factCodeTarget(facts, code);
    setGoneAt(target.kind === 'gone' ? { code, on } : undefined);
    if (target.kind === 'shown') onShowFact(code);
  };

  const analyse = () => {
    setWebFailed(false);
    analysis.start((signal) => analyseCustomer(app, customerId, signal));
  };
  const startWeb = async () => {
    setStartingWeb(true);
    setWebFailed(false);
    // An error of Phân tích would sit beside the session's (review of PR 459).
    analysis.clear();
    const outcome = await startChatGptWeb(app, customerId);
    setStartingWeb(false);
    if (outcome.kind === 'session') {
      setViewing(null);
      setWeb(webOpened(outcome));
    } else if (outcome.kind === 'failed') {
      // Its own message: Thử lại starts ChatGPT web again, never a call to the AI (review of PR 459).
      setWebFailed(true);
    }
  };

  const settings = app.ai.settings();
  const faded =
    view.blocked !== null ||
    showing?.state === 'STALE' ||
    shown.phase === 'running' ||
    shown.phase === 'cancelling';
  return (
    <section aria-labelledby="kyc-intelligence" className={`${CARD} flex flex-col gap-2.5`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="kyc-intelligence" className={HEADING}>
          {t('aiPanel.title')}
        </h2>
        <span className={`${BADGE} ${BADGE_COLORS[view.badge]}`}>{view.badge}</span>
        {view.shown && !view.blocked && <SourceBadge source={analysisSource(view.shown)} />}
        <div className="flex-1" />
        <Button disabled={!view.button.enabled} onClick={() => void startWeb()}>
          {t('aiPanel.web.start')}
        </Button>
        <Button
          variant={view.button.primary ? 'primary' : 'default'}
          disabled={!view.button.enabled}
          onClick={analyse}
        >
          {t(view.button.again ? 'aiPanel.reanalyse' : 'aiPanel.analyse')}
        </Button>
      </div>
      {view.blocked && <BlockedNote blocked={view.blocked} />}
      {web && <KycWebSession web={web} versions={versions} onChange={setWeb} />}
      {webFailed && !web && (
        <div role="alert" className={`${ALERT} flex items-center gap-2.5 border-danger text-sm`}>
          <span className="flex-1">{t('aiError.GENERAL')}</span>
          <Button disabled={!view.button.enabled} onClick={() => void startWeb()}>
            {t('aiPanel.retry')}
          </Button>
        </div>
      )}
      {view.rejected && !web && (
        <p className={`${ALERT} border-danger text-sm`}>
          {view.rejected.issue
            ? t('aiPanel.rejected', {
                date: formatDayMonth(view.rejected.date),
                value: issueText(view.rejected.issue, 'reason'),
              })
            : t('aiPanel.rejectedPlain', { date: formatDayMonth(view.rejected.date) })}{' '}
          <button type="button" className={LINK} onClick={() => setReport(analyses[0]!)}>
            {t('aiPanel.rejectedMore')}
          </button>
        </p>
      )}
      {shown.phase === 'running' && (
        <BusyLine action={<Button onClick={analysis.cancel}>{t('aiPanel.cancel')}</Button>}>
          {t('aiPanel.running')}
          {settings.provider !== 'MOCK' && (
            <span className="text-fg-3">
              {' '}
              {t('aiPanel.runningDetail', { name: modelLabel(settings.model) })}
            </span>
          )}
        </BusyLine>
      )}
      {shown.phase === 'cancelling' && (
        <BusyLine>
          {t('aiPanel.cancelling')}
          <span className="text-fg-3"> {t('aiPanel.cancellingDetail')}</span>
        </BusyLine>
      )}
      {shown.phase === 'error' && (
        <div role="alert" className={`${ALERT} flex items-center gap-2.5 border-danger text-sm`}>
          <span className="flex-1">{t(`aiError.${shown.error}`)}</span>
          <Button disabled={!view.button.enabled} onClick={analyse}>
            {t('aiPanel.retry')}
          </Button>
        </div>
      )}
      {view.reminder && (
        <p
          className={`${ALERT} text-sm ${view.reminder.material ? 'border-warn' : 'border-border'}`}
        >
          {t(view.reminder.material ? 'aiPanel.reminder.material' : 'aiPanel.reminder.minor', {
            date: formatDayMonth(view.reminder.since),
          })}
        </p>
      )}
      {banner && (
        <p className={`${ALERT} flex flex-wrap items-center gap-1.5 border-border text-sm`}>
          <span className="tabular-nums">
            {t('aiPanel.history.viewing')} <b>{banner.at}</b> {t('sep.dot')}{' '}
            {t('aiPanel.history.viewingVersion', { version: banner.version })}
          </span>{' '}
          <span className={`${BADGE} ${BADGE_COLORS.STALE}`}>{banner.state}</span>{' '}
          <button type="button" className={LINK} onClick={() => setViewing(null)}>
            {t('aiPanel.history.back')}
          </button>
        </p>
      )}
      {gone && (
        <p role="status" className={`${ALERT} border-warn text-sm`}>
          {t('aiPanel.factGone', { code: gone })}
        </p>
      )}
      {showing ? (
        <div className={faded ? 'opacity-50' : undefined}>
          <Analysis analysis={showing} versions={versions} onCode={showFact} />
        </div>
      ) : (
        !view.blocked && <p className="m-0 text-sm text-fg-3">{t('aiPanel.empty')}</p>
      )}
      <AnalysisHistory
        analyses={analyses}
        versions={versions}
        selected={showing?.id ?? null}
        onPick={pick}
      />
      {report && (
        <RejectedReportDialog
          row={report}
          analyses={analyses}
          versions={versions}
          onClose={() => setReport(null)}
        />
      )}
    </section>
  );
}
