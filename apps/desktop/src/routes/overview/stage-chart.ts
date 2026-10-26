import { formatCount } from '@p2c/domain';
import { encodeHtml, type ChartOption } from '@p2c/ui';
import { joinParts, t } from '../../i18n';
import { CHART_STAGES, type ChartStage, type StageChart, type StageValues } from './stage-view';

/** Top of the stack first, as the tooltip and the table of a chart list the stages. */
const topDown = (shown: readonly ChartStage[]) =>
  CHART_STAGES.filter((stage) => shown.includes(stage));

/** Bottom of the stack first: N1 sits on the axis, so day against day reads easily (§2.8). */
const bottomUp = (shown: readonly ChartStage[]) => topDown(shown).reverse();

const totalOf = (values: StageValues, stages: readonly ChartStage[]) =>
  stages.reduce((sum, stage) => sum + values[stage], 0);

/**
 * Colours of the series of `stageChartOption`, as tokens: each stage in its `StageBadge` colour,
 * then the outline of the marks after today.
 */
export const stagePalette = (shown: readonly ChartStage[]): string[] => [
  ...bottomUp(shown).map((stage) => `--${stage.toLowerCase()}`),
  '--border-strong',
];

/** A chart of more marks than this labels only some of them (mockup 1a: 01, 05, 10 … 31). */
const ALL_LABELS_MAX = 12;
const EVERY = 5;

/**
 * The marks labelled under a long chart: today, then the first and the last, then every 5th; a
 * label beside one that ranks higher gives way, so none overlap in a narrow team chart.
 */
function labelled(chart: StageChart): number | ((index: number) => boolean) {
  const { columns } = chart;
  if (columns.length <= ALL_LABELS_MAX) return 0;
  const today = columns.findIndex((column) => column.today);
  const edges = [0, columns.length - 1];
  const beside = (index: number, other: number) => other >= 0 && Math.abs(index - other) === 1;
  return (index) => {
    if (index === today) return true;
    if (beside(index, today)) return false;
    if (edges.includes(index)) return true;
    if (edges.some((edge) => beside(index, edge))) return false;
    return (index + 1) % EVERY === 0;
  };
}

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
        const top = topDown(shown);
        const rows = top.map((stage) =>
          row(markers.get(stage) ?? '', t(`stage.${stage}`), values[stage]),
        );
        return heading + rows.join('') + row('', t('overview.stages.total'), totalOf(values, top));
      },
    },
    xAxis: {
      type: 'category',
      data: chart.columns.map((column) => column.label),
      axisTick: { alignWithLabel: true },
      axisLabel: {
        interval: labelled(chart),
        // The `today` rich style (date-today colour, bold) comes from the chart theme.
        formatter: (value: string, index: number) =>
          chart.columns[index]?.today ? `{today|${value}}` : value,
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { formatter: (value: number) => formatCount(value) },
    },
    series: [
      ...stages.map((stage) => ({
        type: 'bar' as const,
        name: stage,
        stack: 'stages',
        barCategoryGap: '25%',
        data: chart.columns.map((column) => column.values?.[stage] ?? null),
      })),
      // A mark after today is left empty, a dashed line on the axis (mockup 1a): a zero bar kept
      // at a minimum height, outlined in its palette colour.
      {
        type: 'bar' as const,
        id: 'future',
        stack: 'stages',
        barCategoryGap: '25%',
        barMinHeight: 2,
        silent: true,
        itemStyle: {
          color: 'transparent',
          borderColor: 'auto',
          borderType: 'dashed',
          borderWidth: 1,
        },
        data: chart.columns.map((column) => (column.values ? null : 0)),
      },
    ],
  };
}

/** The numbers of a chart for screen readers (P8): one row per mark, as its tooltip lists them. */
export interface StageChartTable {
  /** Over the columns: the day, each stage shown top first, then Tổng. */
  readonly head: readonly string[];
  readonly rows: readonly { readonly title: string; readonly cells: readonly string[] }[];
}

/** `chart` as a table of the stages in `shown`, a mark after today "—", from the same columns. */
export function stageChartTable(chart: StageChart, shown: readonly ChartStage[]): StageChartTable {
  const stages = topDown(shown);
  return {
    head: [
      t('overview.stages.day'),
      ...stages.map((stage) => t(`stage.${stage}`)),
      t('overview.stages.total'),
    ],
    rows: chart.columns.map(({ title, values }) => ({
      title,
      cells: values
        ? [
            ...stages.map((stage) => formatCount(values[stage])),
            formatCount(totalOf(values, stages)),
          ]
        : Array<string>(stages.length + 1).fill(t('overview.none')),
    })),
  };
}

/**
 * The last mark of `chart` with numbers, as its row of `stageChartTable` says it: its title, then
 * "N4 1.200" for each stage shown, top first, and "Tổng 1.206" last. Null while no mark has numbers.
 */
function lastNumbers(
  chart: StageChart,
  shown: readonly ChartStage[],
): { readonly title: string; readonly parts: readonly string[] } | null {
  const last = chart.columns.findLastIndex((column) => column.values !== null);
  if (last < 0) return null;
  const { head, rows } = stageChartTable(chart, shown);
  const { title, cells } = rows[last]!;
  return { title, parts: cells.map((cell, index) => `${head[index + 1]} ${cell}`) };
}

/**
 * What describes `chart` to a screen reader (Owner 26/10/2026): the last mark with numbers, as its
 * row of `stageChartTable` says it, then that the table follows. Short, so that Chromium reads it
 * whole, which it did not of the whole table (review of PR 841). Null while no mark has numbers.
 */
export function stageChartSummary(chart: StageChart, shown: readonly ChartStage[]): string | null {
  const last = lastNumbers(chart, shown);
  if (!last) return null;
  return t('overview.stages.chartSummary', { mark: last.title, values: joinParts(last.parts) });
}

/**
 * "N3 90 · N2 44 · N1 22" by a team's name (mockup 1b): the numbers its chart ends on, as the
 * summary says them, without the total. Empty while no mark has numbers.
 */
export function stageChartLastText(chart: StageChart, shown: readonly ChartStage[]): string {
  return joinParts(lastNumbers(chart, shown)?.parts.slice(0, -1) ?? []);
}
