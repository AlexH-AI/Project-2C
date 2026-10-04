import { useMemo, useState } from 'react';
import { formatCount } from '@p2c/domain';
import { Chart, StageBadge } from '@p2c/ui';
import { t } from '../../i18n';
import { stageChartOption, stagePalette } from './stage-chart';
import {
  CHART_STAGES,
  type ChartStage,
  type StageBlock as Block,
  type StageChart,
} from './stage-view';

const TOP = {
  N4: 'border-t-n4',
  N3: 'border-t-n3',
  N2: 'border-t-n2',
  N1: 'border-t-n1',
} as const satisfies Record<ChartStage, string>;

/**
 * "Khách hàng theo nhóm" (mockup overview.html 1a–1c, 1e): the four tiles are the chart legend, a
 * click hides or shows that stage on every chart.
 */
export function StageBlock({ block }: { block: Block }) {
  const [hidden, setHidden] = useState<ReadonlySet<ChartStage>>(new Set());
  const shown = useMemo(() => CHART_STAGES.filter((stage) => !hidden.has(stage)), [hidden]);
  const palette = useMemo(() => stagePalette(shown), [shown]);
  const toggle = (stage: ChartStage) =>
    setHidden((before) => {
      const after = new Set(before);
      if (!after.delete(stage)) after.add(stage);
      return after;
    });
  const teams = block.charts.some((chart) => chart.team !== null);
  const title = t('overview.stages.title');

  return (
    <section
      aria-label={title}
      className="flex flex-col gap-3 rounded-md border border-border bg-surface-1 px-3.5 py-3"
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="m-0 text-sm font-medium text-heading">{title}</h2>
        {block.note && <span className="text-xs text-fg-3 tabular-nums">{block.note}</span>}
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {CHART_STAGES.map((stage) => {
          const off = hidden.has(stage);
          return (
            <button
              key={stage}
              type="button"
              aria-pressed={!off}
              disabled={!block.tiles}
              onClick={() => toggle(stage)}
              className={`flex cursor-pointer items-baseline gap-2.5 rounded-md border border-t-3 border-border px-3 pt-2 pb-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default ${TOP[stage]} ${off ? 'border-dashed bg-surface-1' : 'bg-surface-2'}`}
            >
              <StageBadge stage={stage} label={t(`stage.${stage}`)} />
              {off && <span className="text-xs text-fg-3">{t('overview.stages.hidden')}</span>}
              <b
                className={`ml-auto text-2xl tabular-nums ${off || !block.tiles ? 'font-medium text-fg-3' : 'font-semibold'}`}
              >
                {block.tiles ? formatCount(block.tiles[stage]) : t('overview.none')}
              </b>
            </button>
          );
        })}
      </div>
      {teams ? (
        <div className="grid grid-cols-3 gap-3.5">
          {block.charts.map((chart) => (
            <div key={chart.key} className="min-w-0">
              <h3 className="m-0 mb-1.5 flex items-baseline gap-2 text-sm font-semibold">
                {t('overview.stages.team', { name: chart.team ?? '' })}
                <span className="text-xs font-normal text-fg-3 tabular-nums">
                  {lastText(chart, shown)}
                </span>
              </h3>
              <StageChartBox chart={chart} shown={shown} palette={palette} short />
            </div>
          ))}
        </div>
      ) : (
        block.charts.map((chart) => (
          <StageChartBox key={chart.key} chart={chart} shown={shown} palette={palette} />
        ))
      )}
    </section>
  );
}

/** "N3 90 · N2 44 · N1 22": the last column drawn, the stages shown (mockup 1b). */
function lastText(chart: StageChart, shown: readonly ChartStage[]): string {
  const last = chart.columns.findLast((column) => column.values !== null)?.values;
  if (!last) return '';
  return shown
    .map((stage) => `${t(`stage.${stage}`)} ${formatCount(last[stage])}`)
    .join(` ${t('sep.dot')} `);
}

function StageChartBox({
  chart,
  shown,
  palette,
  short = false,
}: {
  chart: StageChart;
  shown: readonly ChartStage[];
  palette: readonly string[];
  short?: boolean;
}) {
  const option = useMemo(() => stageChartOption(chart, shown), [chart, shown]);
  const empty = chart.columns.every((column) => column.values === null);
  const label =
    chart.team === null
      ? t('overview.stages.chart')
      : t('overview.stages.teamChart', { name: chart.team });
  return (
    <div className="relative">
      <Chart
        label={label}
        option={option}
        palette={palette}
        className={short ? 'h-44 w-full' : 'h-56 w-full'}
      />
      {empty && (
        <p className="pointer-events-none absolute inset-0 m-0 grid place-items-center text-sm text-fg-3">
          {t('overview.stages.notStarted')}
        </p>
      )}
    </div>
  );
}
