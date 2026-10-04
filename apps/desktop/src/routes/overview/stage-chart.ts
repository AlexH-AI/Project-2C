import { formatCount } from '@p2c/domain';
import { encodeHtml, type ChartOption } from '@p2c/ui';
import { t } from '../../i18n';
import { CHART_STAGES, type ChartStage, type StageChart } from './stage-view';

/** Bottom of the stack first: N1 sits on the axis, so day against day reads easily (§2.8). */
const bottomUp = (shown: readonly ChartStage[]) =>
  CHART_STAGES.filter((stage) => shown.includes(stage)).reverse();

/** Colours of the series of `stageChartOption`, as tokens: each stage in its `StageBadge` colour. */
export const stagePalette = (shown: readonly ChartStage[]): string[] =>
  bottomUp(shown).map((stage) => `--${stage.toLowerCase()}`);

/** What ECharts passes to an axis tooltip formatter, as far as it is read here. */
interface TooltipParam {
  readonly dataIndex: number;
  readonly seriesName?: string;
  readonly marker?: unknown;
}

const row = (marker: string, name: string, value: number) =>
  `<div style="display:flex;justify-content:space-between">` +
  `<span>${marker}${encodeHtml(name)}</span>&emsp;<b>${formatCount(value)}</b></div>`;

/**
 * The stacked column chart of customers by stage (spec Phase 4 §2.8, mockup overview.html 1a–1c)
 * with the stages in `shown`; series colours come from `stagePalette(shown)`.
 */
export function stageChartOption(chart: StageChart, shown: readonly ChartStage[]): ChartOption {
  const stages = bottomUp(shown);
  return {
    grid: { left: 8, right: 8, top: 12, bottom: 4, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      // Text only, every string escaped: a team name never becomes HTML (F-18).
      formatter: (params: unknown) => {
        const list = (Array.isArray(params) ? params : [params]) as TooltipParam[];
        const column = chart.columns[list[0]?.dataIndex ?? 0];
        if (!column) return '';
        const title =
          chart.team === null
            ? column.title
            : `${t('overview.stages.team', { name: chart.team })} ${t('sep.dot')} ${column.title}`;
        const heading = `<div>${encodeHtml(title)}</div>`;
        const values = column.values;
        if (!values) return heading;
        const markers = new Map(
          list.map((param) => [param.seriesName, String(param.marker ?? '')]),
        );
        const top = [...stages].reverse();
        const rows = top.map((stage) => row(markers.get(stage) ?? '', stage, values[stage]));
        const total = top.reduce((sum, stage) => sum + values[stage], 0);
        return heading + rows.join('') + row('', t('overview.stages.total'), total);
      },
    },
    xAxis: {
      type: 'category',
      data: chart.columns.map((column) => column.label),
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { formatter: (value: number) => formatCount(value) },
    },
    series: stages.map((stage) => ({
      type: 'bar',
      name: stage,
      stack: 'stages',
      barCategoryGap: '25%',
      data: chart.columns.map((column) => column.values?.[stage] ?? null),
    })),
  };
}
