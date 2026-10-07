import { periodOf, type CalendarDate, type Period, type Scope } from '@p2c/domain';
import { Button, PeriodPicker } from '@p2c/ui';
import { useMemo, useState } from 'react';
import { t } from '../i18n';
import {
  applyFilter,
  chooseFilter,
  isPending,
  startFilter,
  type FilterSelection,
} from './applied-filter';
import type { ViewingText } from './overview/overview-view';
import { PERIOD_LABELS } from './period-labels';

export interface AppliedFilter {
  /** The period chosen in the picker, applied or not. */
  readonly period: Period;
  readonly setPeriod: (period: Period) => void;
  /** The period and scope the numbers on screen are counted for. */
  readonly applied: FilterSelection;
  readonly pending: boolean;
  readonly apply: () => void;
}

/**
 * The Lọc state of Tổng quan and Báo cáo: the screen opens on the current month with the scope
 * picked applied; later changes of period or scope wait for Lọc (spec Phase 4 §4.3, §4.5).
 */
export function useAppliedFilter(today: CalendarDate, picked: Scope): AppliedFilter {
  const [period, setPeriod] = useState(() => periodOf('month', today));
  const chosen = useMemo(() => ({ period, scope: picked }), [period, picked]);
  const [filter, setFilter] = useState(() => startFilter(chosen));
  const current = chooseFilter(filter, chosen);
  return {
    period,
    setPeriod,
    applied: current.applied,
    pending: isPending(current),
    apply: () => setFilter(applyFilter(current)),
  };
}

/** The period picker, Lọc and the "Đang xem" line (mockup overview.html 1a, reports.html 2a). */
export function FilterBar({
  filter,
  today,
  viewing,
}: {
  filter: AppliedFilter;
  today: CalendarDate;
  viewing: ViewingText;
}) {
  const { period, setPeriod, pending, apply } = filter;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <PeriodPicker value={period} onChange={setPeriod} today={today} labels={PERIOD_LABELS} />
      <Button
        variant={pending ? 'primary' : 'default'}
        onClick={apply}
        className="inline-flex items-center gap-1.5"
      >
        {t('overview.filter')}
        {pending && <i aria-hidden="true" className="size-1.5 rounded-full bg-on-accent" />}
      </Button>
      {/* Always there, so assistive tech reads the reminder the moment it appears (DR-72). */}
      <span role="status" className={pending ? 'text-sm text-accent' : 'sr-only'}>
        {pending && t('overview.pending')}
      </span>
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
  );
}
