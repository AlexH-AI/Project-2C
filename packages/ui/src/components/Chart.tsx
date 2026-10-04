import { useEffect, useRef } from 'react';
import { format, init, use as registerModules, type ComposeOption } from 'echarts/core';
import { BarChart, type BarSeriesOption } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  type GridComponentOption,
  type LegendComponentOption,
  type TooltipComponentOption,
} from 'echarts/components';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import { SERIES_TOKENS, chartTheme } from './chart-theme';

// Register only the ECharts modules in use (ADR-0014); add a chart type here when a screen needs it.
registerModules([
  BarChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  SVGRenderer,
  CanvasRenderer,
]);

export type ChartOption = ComposeOption<
  BarSeriesOption | GridComponentOption | LegendComponentOption | TooltipComponentOption
>;

/**
 * Escapes text for the HTML of a tooltip or label formatter: every string from the database (team,
 * RE, customer names) goes through it (F-18).
 */
export const encodeHtml: (text: string) => string = format.encodeHTML;

interface ChartProps {
  /** Accessible name; the chart is exposed as one image. */
  label: string;
  /** Keep the object stable between renders (constant or memo), or the chart redraws. */
  option: ChartOption;
  /** Series colours as token names, in series order; the default palette otherwise. Keep stable. */
  palette?: readonly string[];
  /** SVG for small charts, Canvas for many points (ADR-0014). */
  renderer?: 'svg' | 'canvas';
  /** Size classes; the chart fills the box. */
  className?: string;
}

/** ECharts wrapper (ADR-0014): themed from the tokens, resizes with its box, disposed on unmount. */
export function Chart({
  label,
  option,
  palette = SERIES_TOKENS,
  renderer = 'svg',
  className = 'h-64 w-full',
}: ChartProps) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const style = getComputedStyle(element);
    const chart = init(
      element,
      chartTheme((name) => style.getPropertyValue(name), palette),
      { renderer },
    );
    chart.setOption(option);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(element);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option, palette, renderer]);

  return <div ref={box} role="img" aria-label={label} className={className} />;
}
