import type { CalendarDate, Period } from '@p2c/domain';
import { PeriodPill } from '@p2c/ui';
import type { ReactNode } from 'react';
import { ScreenBar } from '../shell/ScreenBar';
import { viewingLine, type ViewingText } from './overview/overview-view';
import { PERIOD_LABELS } from './period-labels';

/**
 * What Tổng quan and Báo cáo put on the toolbar (mockup app-shell.html `#toolbar`): under the name
 * of the screen, the period, the days counted and the scope the numbers are for; after the scope,
 * the period pill, then the buttons of the screen. A period picked applies at once, as a scope
 * does: there is no "Lọc" (ADR-0013 appendix 11/11/2026 §5).
 */
export function FilterBar({
  period,
  onPeriod,
  today,
  viewing,
  actions,
}: {
  period: Period;
  onPeriod: (period: Period) => void;
  today: CalendarDate;
  viewing: ViewingText;
  /** The buttons of the screen, after the period pill. */
  actions?: ReactNode;
}) {
  return (
    <ScreenBar
      // Read out when it changes: the numbers of the screen are now for another period or scope.
      sub={<span aria-live="polite">{viewingLine(viewing)}</span>}
      actions={
        <>
          <PeriodPill value={period} onChange={onPeriod} today={today} labels={PERIOD_LABELS} />
          {actions}
        </>
      }
    />
  );
}
