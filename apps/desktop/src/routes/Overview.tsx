import { useMemo, useState } from 'react';
import { appointmentCounts, periodOf } from '@p2c/domain';
import { useTables, useToday } from '../data/AppDataContext';
import { t } from '../i18n';
import { useScopeState } from '../shell/ScopeContext';
import { FilterBar } from './FilterBar';
import { AppointmentsTile, KpiCard } from './overview/OverviewTiles';
import { StageBlock } from './overview/StageBlock';
import { TeamCompare } from './overview/TeamCompare';
import { kpiTiles, metricsScope, viewingText } from './overview/overview-view';
import { stageBlock } from './overview/stage-view';
import { teamCompare } from './overview/team-compare-view';
import { openReportAt } from './reports/reports-view';

/**
 * Tổng quan (spec Phase 4 §4.3, mockup overview.html 1a–1e): appointments, KPI, customers by stage
 * and So sánh team, for the period of its pill and the scope picked; it opens on the current month.
 * The KPI are Doanh số, then the six tiles of tong-quan.html `#tiles` (spec Phase 6 §4.4); a tile
 * opens Báo cáo at the period viewed, the scope picked being shared.
 */
export function Overview() {
  const today = useToday();
  const { picked } = useScopeState();
  const data = useTables();
  const [period, setPeriod] = useState(() => periodOf('month', today));

  const viewing = viewingText({ period, scope: picked }, today, data.people, data.teams);
  const scope = useMemo(() => metricsScope(picked), [picked]);
  const counts = useMemo(
    () => appointmentCounts(data.appointments, period, scope, data.people, today),
    [data, period, scope, today],
  );
  const stages = useMemo(
    () => stageBlock(data, period, picked, today),
    [data, period, picked, today],
  );
  const compare = useMemo(
    () => (picked.kind === 'rm' ? null : teamCompare(data, period, today)),
    [data, period, picked.kind, today],
  );
  const tiles = useMemo(() => kpiTiles(data, period, scope, today), [data, period, scope, today]);

  return (
    <>
      <FilterBar period={period} onPeriod={setPeriod} today={today} viewing={viewing} />
      <div className="flex gap-3">
        <div className="grid w-82.5 shrink-0">
          <AppointmentsTile counts={counts} kind={period.kind} />
        </div>
        <section aria-label={t('overview.kpis')} className="grid min-w-0 flex-1 grid-cols-3 gap-3">
          {/* A heading of their own, read only: in the list of headings the six KPI are beside
              the tile "Lịch hẹn", as on the screen, not under it (DR6-187). */}
          <h2 className="sr-only">{t('overview.kpis')}</h2>
          {tiles.map((tile) => (
            <KpiCard
              key={tile.key}
              tile={tile}
              wide={tile.key === 'revenue'}
              onOpen={() => openReportAt(period)}
            />
          ))}
        </section>
      </div>
      <StageBlock block={stages} />
      {compare && <TeamCompare view={compare} mtd={viewing.mtd} />}
    </>
  );
}
