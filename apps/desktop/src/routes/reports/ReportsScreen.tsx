import { useMemo, useState } from 'react';
import {
  listAppointments,
  listCustomers,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  type Database,
} from '@p2c/db';
import { calendarDate } from '@p2c/domain';
import { Button, Segmented } from '@p2c/ui';
import { useAppData, useQuery } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { useScopeState } from '../../shell/ScopeContext';
import { FilterBar, useAppliedFilter } from '../FilterBar';
import { viewingText } from '../overview/overview-view';
import { ExportNoticeLine, useReportExport } from './ReportExport';
import { ReportTable, type ReportLead } from './ReportTable';
import {
  reportRows,
  reportScopeName,
  summaryMeta,
  type ReportRow,
  type ReportRows,
} from './reports-view';

const readReports = (db: Database) => ({
  appointments: listAppointments(db),
  customers: listCustomers(db),
  people: listPeople(db),
  teams: listTeams(db),
  policies: listPolicies(db),
  transitions: listStageTransitions(db),
});

type TableKey = 'byTeam' | 'byRe' | 'byMark';

const CARD = 'flex flex-col gap-3 rounded-md border border-border bg-surface-1 px-3.5 py-3';

/**
 * Báo cáo (spec Phase 4 §4.4, mockup reports.html 2a–2e): the Lọc bar, Tổng hợp always, and one of
 * Theo team / Theo RE / Theo mốc under it. A table that would repeat Tổng hợp is left out. Xuất
 * Excel exports every table shown for the scope, one sheet each (2f).
 */
export function ReportsScreen() {
  // today() is a new object each render; its fields keep the memos below stable.
  const { year, month, day } = useAppData().today();
  const today = useMemo(() => calendarDate(year, month, day), [year, month, day]);
  const { picked } = useScopeState();
  const data = useQuery(readReports);
  const filter = useAppliedFilter(today, picked);
  const { applied } = filter;
  const [chosenTable, setTable] = useState<TableKey>('byTeam');
  const exporter = useReportExport();

  const viewing = {
    ...viewingText(applied, today, data.people, data.teams),
    scope: reportScopeName(applied.scope, data.people, data.teams),
  };
  const rows = useMemo(
    () => reportRows(data, applied.period, applied.scope, today),
    [data, applied.period, applied.scope, today],
  );
  const tables = (['byTeam', 'byRe', 'byMark'] as const).filter((key) => rows[key]);
  // Theo mốc is always there, so the list is never empty.
  const shown = tables.includes(chosenTable) ? chosenTable : (tables[0] ?? 'byMark');
  const summary = t('reports.summary');
  const table = tableOf(rows, shown);

  return (
    <>
      {/* Xuất Excel at the right end of the period picker's line (mockup reports.html 2a). */}
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <FilterBar filter={filter} today={today} viewing={viewing} />
        </div>
        <Button
          variant="primary"
          disabled={exporter.busy}
          onClick={() => void exporter.run({ rows, period: applied.period, viewing, today })}
        >
          {exporter.busy ? t('reports.exporting') : t('reports.export')}
        </Button>
      </div>
      {exporter.notice && <ExportNoticeLine notice={exporter.notice} />}
      <section aria-label={summary} className={CARD}>
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="m-0 text-sm font-medium text-heading">{summary}</h2>
          <span className="text-xs text-fg-3">
            {summaryMeta(applied.scope, data.people, data.teams)}
          </span>
        </div>
        <ReportTable label={summary} lead="scope" rows={[rows.summary]} />
      </section>
      <section aria-label={t(`reports.${shown}`)} className={CARD}>
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
    : { lead: 're', ...table, meta: t('reports.byReMeta', { re: table.rows.length }) };
}
