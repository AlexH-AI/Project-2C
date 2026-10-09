import type { AiAnalysisView, KycVersionRecord } from '@p2c/db';
import { evaluateKycGate, formatDate, formatDayMonth, type KycFact } from '@p2c/domain';
import { Button } from '@p2c/ui';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { analyseCustomer, startChatGptWeb } from '../../data/ai-analysis';
import { useAppData } from '../../data/AppDataContext';
import { joinParts, t } from '../../i18n';
import {
  aiPanelView,
  analysisContent,
  analysisSource,
  modelLabel,
  runAfter,
  shownRun,
  webOpened,
  type AiPanelBlocked,
  type AiPanelItem,
  type AiPanelRun,
  type AiPanelSource,
  type AiPanelSubgroup,
  type AiPanelWeb,
} from './ai-panel-view';
import { ALERT } from './CustomerDialogs';
import { BADGE } from './CustomerKyc';
import { KycWebSession, rejectedReason } from './KycWebSession';

const CARD = 'rounded-lg border border-border bg-surface-1 p-4';
const HEADING = 'm-0 text-sm font-medium text-heading';
const IDLE: AiPanelRun = { phase: 'idle' };

export const BADGE_COLORS = {
  CURRENT: 'text-ok',
  STALE: 'text-fg-3',
  CONFLICT_RESOLUTION: 'text-danger',
  KYC_INSUFFICIENT: 'text-warn',
  PROFILE_DISCOVERY: 'text-info',
  PAIN_POINT_ANALYSIS: 'text-info',
} as const;

/** Who answered, as the chip names it (mockups 2e, 4i). */
function sourceName(source: AiPanelSource): string {
  if ('model' in source) return source.model;
  return t(source.badge === 'MOCK' ? 'aiPanel.mock' : 'aiPanel.chatgptWeb');
}

/** A provider that keeps no model has a badge: Mock in amber, ChatGPT web in blue (4i). */
function SourceBadge({ source }: { source: AiPanelSource }) {
  if (!('badge' in source)) return null;
  const color = source.badge === 'MOCK' ? 'text-warn' : 'text-info';
  return <span className={`${BADGE} ${color}`}>{sourceName(source)}</span>;
}

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
      {withNames(t(`aiPanel.blocked.${blocked.state}`), names)}
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

export function Item({ item }: { item: AiPanelItem }) {
  const { evidence } = item;
  return (
    <li className="rounded-sm border border-border bg-surface-2 px-2.5 py-2">
      {item.system && <b>{t(`aiPanel.system.${item.system}`)} </b>}
      {item.text}
      <span className="mt-1 flex flex-wrap justify-between gap-x-2 gap-y-0.5 text-xs text-fg-3">
        <span>
          {joinParts([
            item.codes.length > 0 && t('aiPanel.evidence', { value: item.codes.join(', ') }),
            item.missing && t('aiPanel.missing', { label: t(`kycCategory.${item.missing}`) }),
          ])}
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
}: {
  analysis: AiAnalysisView;
  versions: readonly KycVersionRecord[];
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
                  <Item key={index} item={item} />
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
              <Item key={index} item={item} />
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
}: {
  customerId: string;
  facts: readonly KycFact[];
  versions: readonly KycVersionRecord[];
  analyses: readonly AiAnalysisView[];
}) {
  const app = useAppData();
  const { runner } = app.ai;
  const busy = useSyncExternalStore(runner.subscribe, () => runner.busy);
  const [run, setRun] = useState<AiPanelRun>(IDLE);
  const running = useRef<AbortController | null>(null);
  // This customer's ChatGPT web session: it lives in the panel only, so leaving ends it (§3.1).
  const [web, setWeb] = useState<AiPanelWeb | null>(null);
  const starting = useRef(false);
  const gate = useMemo(() => evaluateKycGate(facts), [facts]);
  const view = aiPanelView({ gate, analyses, busy, webOpen: web !== null });
  const shown = shownRun(run, busy);

  // Once the request after Hủy has ended, the panel is back: a later request elsewhere (Settings →
  // AI) must not show "Đang hủy…" here.
  useEffect(
    () =>
      runner.subscribe(() => {
        if (!runner.busy) setRun((now) => (now.phase === 'cancelling' ? IDLE : now));
      }),
    [runner],
  );

  const analyse = async () => {
    const controller = new AbortController();
    running.current = controller;
    setRun({ phase: 'running' });
    const outcome = await analyseCustomer(app, customerId, controller.signal);
    if (running.current === controller) setRun(runAfter(outcome));
  };
  const cancel = () => {
    running.current?.abort();
    setRun({ phase: 'cancelling' });
  };
  const startWeb = async () => {
    if (starting.current) return;
    starting.current = true;
    const outcome = await startChatGptWeb(app, customerId);
    starting.current = false;
    if (outcome.kind === 'session') {
      setRun(IDLE);
      setWeb(webOpened(outcome));
    } else if (outcome.kind === 'failed') {
      setRun({ phase: 'error', error: 'GENERAL' });
    }
  };

  const settings = app.ai.settings();
  const faded =
    view.blocked !== null ||
    view.shown?.state === 'STALE' ||
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
          onClick={() => void analyse()}
        >
          {t(view.button.again ? 'aiPanel.reanalyse' : 'aiPanel.analyse')}
        </Button>
      </div>
      {view.blocked && <BlockedNote blocked={view.blocked} />}
      {web && <KycWebSession web={web} versions={versions} onChange={setWeb} />}
      {view.rejected && !web && (
        <p className={`${ALERT} border-danger text-sm`}>
          {view.rejected.issue
            ? t('aiPanel.rejected', {
                date: formatDayMonth(view.rejected.date),
                value: rejectedReason(view.rejected.issue),
              })
            : t('aiPanel.rejectedPlain', { date: formatDayMonth(view.rejected.date) })}
        </p>
      )}
      {shown.phase === 'running' && (
        <BusyLine action={<Button onClick={cancel}>{t('aiPanel.cancel')}</Button>}>
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
          <Button disabled={!view.button.enabled} onClick={() => void analyse()}>
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
      {view.shown ? (
        <div className={faded ? 'opacity-50' : undefined}>
          <Analysis analysis={view.shown} versions={versions} />
        </div>
      ) : (
        !view.blocked && <p className="m-0 text-sm text-fg-3">{t('aiPanel.empty')}</p>
      )}
    </section>
  );
}
