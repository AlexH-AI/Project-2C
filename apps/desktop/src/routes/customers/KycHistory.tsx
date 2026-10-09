import type { AiAnalysisView, KycVersionRecord } from '@p2c/db';
import { formatCount, formatDayMonth } from '@p2c/domain';
import { Button, Dialog } from '@p2c/ui';
import { joinParts, t } from '../../i18n';
import { historyRows, rejectedReport, type AiPanelSource } from './ai-panel-view';
import { ALERT } from './CustomerDialogs';
import { BADGE } from './CustomerKyc';
import { issueText } from './KycWebSession';

/** Who answered, as the chip and the history name it (mockups 2e, 4i). */
export function sourceName(source: AiPanelSource): string {
  if ('model' in source) return source.model;
  return t(source.badge === 'MOCK' ? 'aiPanel.mock' : 'aiPanel.chatgptWeb');
}

/** A provider that keeps no model has a badge: Mock in amber, ChatGPT web in blue (4i). */
export function SourceBadge({ source }: { source: AiPanelSource }) {
  if (!('badge' in source)) return null;
  const color = source.badge === 'MOCK' ? 'text-warn' : 'text-info';
  return <span className={`${BADGE} ${color}`}>{sourceName(source)}</span>;
}

const STATE_COLORS = { CURRENT: 'text-ok', STALE: 'text-fg-3', REJECTED: 'text-danger' } as const;
const CELL = 'border-b border-border px-1.5 py-1.5 text-start font-normal';

/**
 * Mockup ai.html 2j: every analysis, latest first; a row opens what it holds — an older ACCEPTED
 * one in the panel, a REJECTED one as its validator report. The row shown is marked.
 */
export function AnalysisHistory({
  analyses,
  versions,
  selected,
  onPick,
}: {
  analyses: readonly AiAnalysisView[];
  versions: readonly KycVersionRecord[];
  selected: string | null;
  onPick: (id: string) => void;
}) {
  const rows = historyRows(analyses, versions);
  if (rows.length === 0) return null;
  return (
    <section aria-labelledby="ai-history" className="mt-1 text-sm">
      <h3 id="ai-history" className="mt-0 mb-1.5 text-sm font-medium text-heading">
        {t('aiPanel.history.title')}{' '}
        <span className="font-normal text-fg-3">{t('aiPanel.history.hint')}</span>
      </h3>
      <table
        aria-label={t('aiPanel.history.title')}
        className="w-full border-collapse tabular-nums"
      >
        <thead className="text-xs text-fg-3">
          <tr>
            <th className={CELL}>{t('aiPanel.history.date')}</th>
            <th className={CELL}>{t('aiPanel.history.kyc')}</th>
            <th className={CELL}>{t('aiPanel.history.prompt')}</th>
            <th className={CELL}>{t('aiPanel.history.source')}</th>
            <th className={`${CELL} text-end`}>
              <span className="sr-only">{t('aiPanel.history.state')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              aria-current={row.id === selected ? 'true' : undefined}
              className={`cursor-pointer hover:bg-surface-2 ${row.id === selected ? 'bg-surface-2' : ''}`}
              onClick={() => onPick(row.id)}
            >
              <td className={CELL}>
                <button
                  type="button"
                  aria-label={t('aiPanel.history.open', { when: row.at })}
                  className="rounded-sm text-fg focus-visible:outline-2 focus-visible:outline-accent"
                  onClick={(event) => {
                    event.stopPropagation();
                    onPick(row.id);
                  }}
                >
                  {row.at}
                </button>
              </td>
              <td className={CELL}>{t('aiPanel.history.version', { version: row.version })}</td>
              <td className={CELL}>{row.prompt}</td>
              <td className={CELL}>
                {'badge' in row.source ? (
                  <SourceBadge source={row.source} />
                ) : (
                  sourceName(row.source)
                )}
              </td>
              <td className={`${CELL} text-end`}>
                <span className={`${BADGE} ${STATE_COLORS[row.state]}`}>{row.state}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/** Mockup ai.html 2k: the validator report of each attempt; the output is never shown (G3 #ask 6). */
export function RejectedReportDialog({
  row,
  analyses,
  versions,
  onClose,
}: {
  row: AiAnalysisView;
  analyses: readonly AiAnalysisView[];
  versions: readonly KycVersionRecord[];
  onClose: () => void;
}) {
  const report = rejectedReport(row, analyses, versions);
  return (
    <Dialog
      title={t('aiPanel.report.title', { when: report.at })}
      subtitle={joinParts([
        t('aiPanel.history.viewingVersion', { version: report.version }),
        report.prompt,
        sourceName(report.source),
        t('aiPanel.report.attempts', { count: report.attempts }),
        report.tokens !== null && t('aiPanel.report.tokens', { count: formatCount(report.tokens) }),
      ])}
      onClose={onClose}
      actions={
        <Button autoFocus onClick={onClose}>
          {t('aiPanel.report.close')}
        </Button>
      }
    >
      <div className="flex flex-col gap-2 text-sm">
        {report.reports.map(({ attempt, issues }) => (
          <div key={attempt}>
            <b className="text-xs text-fg-3">{t('aiPanel.report.attempt', { n: attempt })}</b>
            <ul className="m-0 pl-5 text-fg-2">
              {issues.map((issue, index) => (
                <li key={index}>{issueText(issue, 'list')}</li>
              ))}
            </ul>
          </div>
        ))}
        <p className={`${ALERT} border-info`}>
          {report.latest
            ? t('aiPanel.report.latest', { date: formatDayMonth(report.latest) })
            : t('aiPanel.report.none')}
        </p>
      </div>
    </Dialog>
  );
}
