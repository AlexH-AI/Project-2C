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
import { SVGRenderer } from 'echarts/renderers';
import { SERIES_TOKENS, chartTheme } from './chart-theme';

// Register only the ECharts modules in use (ADR-0014); add a chart type here when a screen needs it.
// Every chart is small and drawn in SVG; register CanvasRenderer once one has many points (ADR-0014).
registerModules([BarChart, GridComponent, LegendComponent, TooltipComponent, SVGRenderer]);

export type ChartOption = ComposeOption<
  BarSeriesOption | GridComponentOption | LegendComponentOption | TooltipComponentOption
>;

/**
 * Escapes text for the HTML of a tooltip or label formatter: every string from the database (team,
 * RM, customer names) goes through it (F-18).
 */
export const encodeHtml: (text: string) => string = format.encodeHTML;

/** A chart is drawn this long after it is shown at the latest, when no frame was painted before. */
const DRAW_LATE_MS = 200;

interface ChartProps {
  /** Accessible name; the chart is exposed as one image. */
  label: string;
  /**
   * Ids (`aria-describedby`) of what gives a screen reader the numbers drawn, e.g. a short line kept
   * `hidden`: Chromium stops a long description short (review of PR 841).
   */
  describedBy?: string;
  /** Keep the object stable between renders (constant or memo), or the chart redraws. */
  option: ChartOption;
  /** Series colours as token names, in series order; the default palette otherwise. Keep stable. */
  palette?: readonly string[];
  /** Size classes; the chart fills the box. */
  className?: string;
}

/**
 * ECharts wrapper (ADR-0014): themed from the tokens, resizes with its box, disposed on unmount.
 * The box clips at its sides: a tooltip stays between them (`confine` of the theme), and on WebKit
 * the box counted a width past the window while its tooltip sat inside it, which let the page
 * scroll sideways (DR6-183; CI run 44214901028). Not at its bottom: a tooltip whose title takes
 * lines is taller than a low chart, and shows down to its last line.
 */
export function Chart({
  label,
  describedBy,
  option,
  palette = SERIES_TOKENS,
  className = 'h-64 w-full',
}: ChartProps) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    let drawn: { chart: ReturnType<typeof init>; observer: ResizeObserver } | undefined;
    const draw = () => {
      if (drawn) return;
      const style = getComputedStyle(element);
      const chart = init(
        element,
        chartTheme((name) => style.getPropertyValue(name), palette),
        { renderer: 'svg' },
      );
      chart.setOption(option);
      const observer = new ResizeObserver(() => chart.resize());
      observer.observe(element);
      drawn = { chart, observer };
    };
    // Drawn once the frame that shows its box is painted: the first frame of a screen never waits
    // for its charts (T-525: ECharts held that of Tổng quan ≈ 100 ms as the app opened). A page in
    // the background paints no frame: the timer draws it then.
    let next = 0;
    const frame = requestAnimationFrame(() => (next = window.setTimeout(draw)));
    const late = window.setTimeout(draw, DRAW_LATE_MS);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(next);
      clearTimeout(late);
      drawn?.observer.disconnect();
      drawn?.chart.dispose();
    };
  }, [option, palette]);

  return (
    <div
      ref={box}
      role="img"
      aria-label={label}
      aria-describedby={describedBy}
      className={`overflow-x-clip ${className}`}
    />
  );
}
