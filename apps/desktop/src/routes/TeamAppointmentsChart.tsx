import { formatDate, parseDate } from '@p2c/domain';
import { Chart, type ChartOption } from '@p2c/ui';
import { t } from '../i18n';

function day(text: string): string {
  const date = parseDate(text);
  if (!date) throw new RangeError(`Bad sample date ${text}`);
  return formatDate(date);
}

// Placeholder numbers until appointments come from the database (Phase 3).
const DAYS = ['22/09/2026', '23/09/2026', '24/09/2026', '25/09/2026', '26/09/2026'].map(day);
const TEAMS: ReadonlyArray<[string, number[]]> = [
  ['Sao Mai', [6, 8, 5, 9, 7]],
  ['Bình Minh', [5, 6, 7, 4, 6]],
  ['Hừng Đông', [3, 5, 4, 6, 5]],
];

const OPTION: ChartOption = {
  grid: { left: 32, right: 8, top: 32, bottom: 24 },
  legend: { top: 0, left: 0 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: DAYS, axisLabel: { hideOverlap: true } },
  yAxis: { type: 'value', minInterval: 1 },
  series: TEAMS.map(([name, data]) => ({ name, type: 'bar', stack: 'teams', data })),
};

export function TeamAppointmentsChart() {
  return (
    <section aria-labelledby="team-appointments-title">
      <h2 id="team-appointments-title" className="mb-2 text-sm font-medium text-heading">
        {t('chart.teamAppointments')}
      </h2>
      <Chart label={t('chart.teamAppointments')} option={OPTION} />
    </section>
  );
}
