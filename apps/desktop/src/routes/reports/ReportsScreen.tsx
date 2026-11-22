import { useEffect, useMemo, useState } from 'react';
import { Button, Segmented } from '@p2c/ui';
import { useTables, useToday } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { scopeName } from '../../shell/scope';
import { useScopeState } from '../../shell/ScopeContext';
import { HEADING, PANEL } from '../classes';
import { FilterBar } from '../FilterBar';
import { viewingText } from '../overview/overview-view';
import { ExportNoticeLine, useReportExport } from './ReportExport';
import { ReportTable, type ReportLead } from './ReportTable';
import {
  reportOpened,
  reportPeriod,
  reportRows,
  summaryMeta,
  type ReportRow,
  type ReportRows,
} from './reports-view';

type TableKey = 'byTeam' | 'byRm' | 'byMark';

/**
 * Báo cáo (spec Phase 4 §4.4, mockup reports.html 2a–2e): Tổng hợp always, and one of Theo team /
 * Theo RM / Theo mốc under it, for the period of its pill and the scope picked; it opens on the
 * current month. A table that would repeat Tổng hợp is left out. Xuất Excel exports every table
 * shown, one sheet each (2f): the period and scope on screen. A tile of Tổng quan opens it at the
 * period of Tổng quan (`openReportAt`); the scope is the one picked, shared by both screens.
 */
export function ReportsScreen() {
  const today = useToday();
  const { picked } = useScopeState();
  const data = useTables();
  const [period, setPeriod] = useState(() => reportPeriod(today));
  // Once drawn: the period a tile asked for is not the one of the next visit.
  useEffect(() => reportOpened(), []);
  const selection = useMemo(() => ({ period, scope: picked }), [period, picked]);
  const [chosenTable, setTable] = useState<TableKey>('byTeam');
  const exporter = useReportExport(selection);

  const viewing = {
    ...viewingText(selection, today, data.people, data.teams),
    scope: scopeName(picked, data.teams, data.people),
  };
  const rows = useMemo(
    () => reportRows(data, period, picked, today),
    [data, period, picked, today],
  );
  const tables = (['byTeam', 'byRm', 'byMark'] as const).filter((key) => rows[key]);
  // Theo mốc is always there, so the list is never empty.
  const shown = tables.includes(chosenTable) ? chosenTable : (tables[0] ?? 'byMark');
  const summary = t('reports.summary');
  const table = tableOf(rows, shown);

  return (
    <>
      {/* Xuất Excel, the main button of the screen, is on the toolbar (app-shell.html #toolbar). */}
      <FilterBar
        period={period}
        onPeriod={setPeriod}
        today={today}
        viewing={viewing}
        actions={
          // Off by `aria-disabled` while it writes, which keeps the focus on it (DR6-186).
          <Button
            variant="primary"
            aria-disabled={exporter.busy || undefined}
            onClick={() => {
              if (!exporter.busy) void exporter.run({ rows, period, viewing, today });
            }}
          >
            {exporter.busy ? t('reports.exporting') : t('reports.export')}
          </Button>
        }
      />
      {exporter.notice && <ExportNoticeLine notice={exporter.notice} />}
      <section aria-label={summary} className={PANEL}>
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className={HEADING}>{summary}</h2>
          {/* A long team or RM name breaks on its line rather than push the page (DR6-170). */}
          <span className="min-w-0 text-xs wrap-anywhere text-fg-3">
            {summaryMeta(picked, data.people, data.teams)}
          </span>
        </div>
        <ReportTable label={summary} lead="scope" rows={[rows.summary]} />
      </section>
      <section aria-label={t(`reports.${shown}`)} className={PANEL}>
        {/* A heading of its own, read only: the list of headings has the table shown, not
            "Tổng hợp" alone (DR6-187). */}
        <h2 className="sr-only">{t(`reports.${shown}`)}</h2>
        <div className="flex flex-wrap items-center gap-2.5">
          <Segmented
            label={t('reports.tables')}
            options={tables.map((key) => ({ value: key, label: t(`reports.${key}`) }))}
            value={shown}
            onChange={setTable}
          />
          <span className="text-xs text-fg-3">{table.meta}</span>
        </div>
        <ReportTable
          label={t(`reports.${shown}`)}
          lead={table.lead}
          rows={table.rows}
          total={table.total}
        />
      </section>
    </>
  );
}

interface ShownTable {
  readonly lead: ReportLead;
  readonly rows: readonly ReportRow[];
  readonly total?: ReportRow;
  readonly meta: string;
}

function tableOf(rows: ReportRows, shown: TableKey): ShownTable {
  if (shown === 'byMark') {
    const marks = rows.byMark;
    return { lead: 'mark', rows: marks, meta: t('reports.byMarkMeta', { count: marks.length }) };
  }
  // Only a table the scope has is ever shown.
  const table = rows[shown]!;
  return shown === 'byTeam'
    ? { lead: 'team', ...table, meta: t('reports.byTeamMeta', { teams: table.rows.length }) }
    : { lead: 'rm', ...table, meta: t('reports.byRmMeta', { rm: table.rows.length }) };
}
