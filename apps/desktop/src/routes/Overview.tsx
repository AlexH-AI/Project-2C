import { useState } from 'react';
import { PIPELINE_STAGES, fromLocalDate, periodOf } from '@p2c/domain';
import { PeriodPicker, type PeriodPickerLabels } from '@p2c/ui';
import { t } from '../i18n';
import { TeamAppointmentsChart } from './TeamAppointmentsChart';

const PERIOD_LABELS: PeriodPickerLabels = {
  title: t('period.title'),
  kinds: {
    group: t('period.kinds'),
    day: t('period.day'),
    week: t('period.week'),
    month: t('period.month'),
    year: t('period.year'),
    custom: t('period.custom'),
  },
  previous: t('period.previous'),
  next: t('period.next'),
  from: t('period.from'),
  to: t('period.to'),
  dateFormat: t('period.dateFormat'),
};

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
