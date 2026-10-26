import { useId, useMemo, useState } from 'react';
import { formatCount } from '@p2c/domain';
import { Chart } from '@p2c/ui';
import { t } from '../../i18n';
import { PANEL } from '../classes';
import { stageBadge } from '../stage-badge';
import {
  stageChartLastText,
  stageChartOption,
  stageChartSummary,
  stageChartTable,
  stagePalette,
  type StageChartTable,
} from './stage-chart';
import { CHART_STAGES, type ChartStage, type StageBlockView, type StageChart } from './stage-view';

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
export function StageBlock({ block }: { block: StageBlockView }) {
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
    <section aria-label={title} className={PANEL}>
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
              onClick={() => toggle(stage)}
              className={`flex cursor-pointer items-baseline gap-2.5 rounded-md border border-t-3 border-border px-3 pt-2 pb-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${TOP[stage]} ${off ? 'border-dashed bg-surface-1' : 'bg-surface-2'}`}
            >
              {stageBadge(stage)}
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
                  {stageChartLastText(chart, shown)}
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
  const summaryId = useId();
  const summary = stageChartSummary(chart, shown);
  const label =
    chart.team === null
      ? t('overview.stages.chart')
      : t('overview.stages.teamChart', { name: chart.team });
  return (
    <div className="relative">
      <Chart
        label={label}
        describedBy={summary === null ? undefined : summaryId}
        option={option}
        palette={palette}
        className={short ? 'h-44 w-full' : 'h-56 w-full'}
      />
      {/* Hidden, yet read as the description: said once, with the image, never again as text. */}
      {summary !== null && (
        <span id={summaryId} hidden>
          {summary}
        </span>
      )}
      <NumbersTable
        caption={t('overview.stages.chartTable', { label })}
        table={stageChartTable(chart, shown)}
      />
      {summary === null && (
        <p className="pointer-events-none absolute inset-0 m-0 grid place-items-center text-sm text-fg-3">
          {t('overview.stages.notStarted')}
        </p>
      )}
    </div>
  );
}

/**
 * The numbers of a chart off screen (review of Phase 4, P8): a screen reader gets the chart as one
 * image, described by its last numbers (`stageChartSummary`); this table, right after it and named
 * by its caption, gives every mark.
 */
function NumbersTable({ caption, table }: { caption: string; table: StageChartTable }) {
  // A table grows to its content whatever its width: the box around it is what takes no room.
  return (
    <div className="sr-only">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {table.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.title}>
              <th scope="row">{row.title}</th>
              {row.cells.map((cell, index) => (
                <td key={table.head[index + 1]}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
