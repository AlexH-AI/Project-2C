import { useMemo } from 'react';
import {
  listAppointments,
  listCustomers,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  type Database,
} from '@p2c/db';
import { appointmentCounts, calendarDate } from '@p2c/domain';
import { useAppData, useQuery } from '../data/AppDataContext';
import { t } from '../i18n';
import { useScopeState } from '../shell/ScopeContext';
import { FilterBar, useAppliedFilter } from './FilterBar';
import { AppointmentsTile, KpiCard } from './overview/OverviewTiles';
import { StageBlock } from './overview/StageBlock';
import { TeamCompare } from './overview/TeamCompare';
import { kpiTiles, metricsScope, viewingText } from './overview/overview-view';
import { stageBlock } from './overview/stage-view';
import { teamCompare } from './overview/team-compare-view';

const readOverview = (db: Database) => ({
  appointments: listAppointments(db),
  customers: listCustomers(db),
  people: listPeople(db),
  teams: listTeams(db),
  policies: listPolicies(db),
  transitions: listStageTransitions(db),
});

/**
 * Tổng quan (spec Phase 4 §4.3, mockup overview.html 1a–1e): the Lọc bar, appointments, KPI,
 * customers by stage and So sánh team.
 */
export function Overview() {
  // today() is a new object each render; its fields keep the memos below stable.
  const { year, month, day } = useAppData().today();
  const today = useMemo(() => calendarDate(year, month, day), [year, month, day]);
  const { picked } = useScopeState();
  const data = useQuery(readOverview);
  const filter = useAppliedFilter(today, picked);
  const { applied } = filter;

  const viewing = viewingText(applied, today, data.people, data.teams);
  const scope = useMemo(() => metricsScope(applied.scope), [applied.scope]);
  const counts = useMemo(
    () => appointmentCounts(data.appointments, applied.period, scope, data.people, today),
    [data, applied.period, scope, today],
  );
  const stages = useMemo(
    () => stageBlock(data, applied.period, applied.scope, today),
    [data, applied.period, applied.scope, today],
  );
  const compare = useMemo(
    () => (applied.scope.kind === 're' ? null : teamCompare(data, applied.period, today)),
    [data, applied.period, applied.scope.kind, today],
  );
  const tiles = useMemo(
    () => kpiTiles(data, applied.period, scope, today),
    [data, applied.period, scope, today],
  );

  return (
    <>
      <FilterBar filter={filter} today={today} viewing={viewing} />
      <div className="flex gap-3">
        <div className="grid w-82.5 shrink-0">
          <AppointmentsTile counts={counts} kind={applied.period.kind} />
        </div>
        <section aria-label={t('overview.kpis')} className="grid min-w-0 flex-1 grid-cols-3 gap-3">
          {tiles.map((tile) => (
            <KpiCard key={tile.key} tile={tile} />
          ))}
        </section>
      </div>
      <StageBlock block={stages} />
      {compare && <TeamCompare view={compare} mtd={viewing.mtd} />}
    </>
  );
}
