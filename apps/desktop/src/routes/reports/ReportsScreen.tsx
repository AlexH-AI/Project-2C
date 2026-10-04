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
import { Segmented } from '@p2c/ui';
import { useAppData, useQuery } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { useScopeState } from '../../shell/ScopeContext';
import { FilterBar, useAppliedFilter } from '../FilterBar';
import { viewingText } from '../overview/overview-view';
import { ReportTable } from './ReportTable';
import { reportRows, reportScopeName, summaryMeta } from './reports-view';

const readReports = (db: Database) => ({
  appointments: listAppointments(db),
  customers: listCustomers(db),
  people: listPeople(db),
  teams: listTeams(db),
  policies: listPolicies(db),
  transitions: listStageTransitions(db),
});

type TableKey = 'byTeam' | 'byRe';

const CARD = 'flex flex-col gap-3 rounded-md border border-border bg-surface-1 px-3.5 py-3';

/**
 * Báo cáo part 1 (spec Phase 4 §4.4, mockup reports.html 2a, 2b, 2d): the Lọc bar, Tổng hợp always,
 * and one of Theo team / Theo RE under it. A table that would repeat Tổng hợp is left out.
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

  const viewing = {
    ...viewingText(applied, today, data.people, data.teams),
    scope: reportScopeName(applied.scope, data.people, data.teams),
  };
  const rows = useMemo(
    () => reportRows(data, applied.period, applied.scope, today),
    [data, applied.period, applied.scope, today],
  );
  const tables = (['byTeam', 'byRe'] as const).filter((key) => rows[key]);
  const shown = tables.includes(chosenTable) ? chosenTable : tables[0];
  const table = shown && rows[shown];
  const summary = t('reports.summary');

  return (
    <>
      <FilterBar filter={filter} today={today} viewing={viewing} />
      <section aria-label={summary} className={CARD}>
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="m-0 text-sm font-medium text-heading">{summary}</h2>
          <span className="text-xs text-fg-3">
            {summaryMeta(applied.scope, data.people, data.teams)}
          </span>
        </div>
        <ReportTable label={summary} lead="scope" rows={[rows.summary]} />
      </section>
      {shown && table && (
        <section aria-label={t(`reports.${shown}`)} className={CARD}>
          <div className="flex flex-wrap items-center gap-2.5">
            <Segmented
              label={t('reports.tables')}
              options={tables.map((key) => ({ value: key, label: t(`reports.${key}`) }))}
              value={shown}
              onChange={setTable}
            />
            <span className="text-xs text-fg-3">
              {shown === 'byTeam'
                ? t('reports.byTeamMeta', { teams: table.rows.length })
                : t('reports.byReMeta', { re: table.rows.length })}
            </span>
          </div>
          <ReportTable
            label={t(`reports.${shown}`)}
            lead={shown === 'byTeam' ? 'team' : 're'}
            rows={table.rows}
            total={table.total}
          />
        </section>
      )}
    </>
  );
}
