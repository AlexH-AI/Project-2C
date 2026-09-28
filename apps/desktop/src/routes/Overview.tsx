import { useState } from 'react';
import { PIPELINE_STAGES, fromLocalDate, periodOf } from '@p2c/domain';
import { PeriodPicker } from '@p2c/ui';
import { t } from '../i18n';
import { PERIOD_LABELS } from './period-labels';
import { TeamAppointmentsChart } from './TeamAppointmentsChart';

export function Overview() {
  const [today] = useState(() => fromLocalDate(new Date()));
  const [period, setPeriod] = useState(() => periodOf('month', today));

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <PeriodPicker value={period} onChange={setPeriod} today={today} labels={PERIOD_LABELS} />
      </div>
      <section aria-labelledby="pipeline-title">
        <h2 id="pipeline-title" className="mb-2 text-sm font-medium text-heading">
          {t('pipeline.title')}
        </h2>
        <ol className="flex gap-2">
          {PIPELINE_STAGES.map((stage) => (
            <li
              key={stage}
              className="rounded-md border border-border bg-surface-2 px-3 py-1 tabular-nums"
            >
              {stage}
            </li>
          ))}
        </ol>
      </section>
      <TeamAppointmentsChart />
    </>
  );
}
