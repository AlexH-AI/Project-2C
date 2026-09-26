import { useEffect, useRef } from 'react';
import { init, use as registerModules, type ComposeOption } from 'echarts/core';
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
import { chartTheme } from './chart-theme';

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

interface ChartProps {
  /** Accessible name; the chart is exposed as one image. */
  label: string;
  /** Keep the object stable between renders (constant or memo), or the chart redraws. */
  option: ChartOption;
  /** SVG for small charts, Canvas for many points (ADR-0014). */
  renderer?: 'svg' | 'canvas';
  /** Size classes; the chart fills the box. */
  className?: string;
}

/** ECharts wrapper (ADR-0014): themed from the tokens, resizes with its box, disposed on unmount. */
export function Chart({ label, option, renderer = 'svg', className = 'h-64 w-full' }: ChartProps) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const style = getComputedStyle(element);
    const chart = init(
      element,
      chartTheme((name) => style.getPropertyValue(name)),
      { renderer },
    );
    chart.setOption(option);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(element);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option, renderer]);

  return <div ref={box} role="img" aria-label={label} className={className} />;
}
