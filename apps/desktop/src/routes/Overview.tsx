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
import { appointmentCounts, calendarDate, periodOf } from '@p2c/domain';
import { Button, PeriodPicker } from '@p2c/ui';
import { useAppData, useQuery } from '../data/AppDataContext';
import { t } from '../i18n';
import { useScopeState } from '../shell/ScopeContext';
import { applyFilter, chooseFilter, isPending, startFilter } from './applied-filter';
import { AppointmentsTile, KpiCard } from './overview/OverviewTiles';
import { StageBlock } from './overview/StageBlock';
import { kpiTiles, metricsScope, viewingText } from './overview/overview-view';
import { stageBlock } from './overview/stage-view';
import { PERIOD_LABELS } from './period-labels';

const readOverview = (db: Database) => ({
  appointments: listAppointments(db),
  customers: listCustomers(db),
  people: listPeople(db),
  teams: listTeams(db),
  policies: listPolicies(db),
  transitions: listStageTransitions(db),
});

/**
 * Tổng quan (spec Phase 4 §4.3, mockup overview.html 1a–1e): the Lọc bar, appointments, KPI and
 * customers by stage.
 */
export function Overview() {
  // today() is a new object each render; its fields keep the memos below stable.
  const { year, month, day } = useAppData().today();
  const today = useMemo(() => calendarDate(year, month, day), [year, month, day]);
  const { picked } = useScopeState();
  const data = useQuery(readOverview);
  const [period, setPeriod] = useState(() => periodOf('month', today));
  const chosen = useMemo(() => ({ period, scope: picked }), [period, picked]);
  // Opening the screen applies the period and scope chosen; later changes wait for Lọc.
  const [filter, setFilter] = useState(() => startFilter(chosen));
  const current = chooseFilter(filter, chosen);
  const pending = isPending(current);
  const { applied } = current;

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
  const tiles = useMemo(
    () => kpiTiles(data, applied.period, scope, today),
    [data, applied.period, scope, today],
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <PeriodPicker value={period} onChange={setPeriod} today={today} labels={PERIOD_LABELS} />
        <Button
          variant={pending ? 'primary' : 'default'}
          onClick={() => setFilter(applyFilter(current))}
          className="inline-flex items-center gap-1.5"
        >
          {t('overview.filter')}
          {pending && <i aria-hidden="true" className="size-1.5 rounded-full bg-on-accent" />}
        </Button>
        {pending && <span className="text-sm text-accent">{t('overview.pending')}</span>}
        <div className="flex-1" />
        <p className="m-0 text-sm text-fg-3 tabular-nums" aria-live="polite">
          {t('overview.viewing')} <b className="font-semibold text-fg-2">{viewing.period}</b>
          {viewing.mtd && (
            <span className="ml-1.5 rounded-full border border-accent px-2 py-px text-xs font-bold text-accent">
              {t('overview.mtd')}
            </span>
          )}
          {viewing.range && ` ${viewing.range}`} {t('sep.dot')}{' '}
          <b className="font-semibold text-fg-2">{viewing.scope}</b>
        </p>
      </div>
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
    </>
  );
}
