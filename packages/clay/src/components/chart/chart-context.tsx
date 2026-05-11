'use client';

import * as React from 'react';
import { useContext, useId, useMemo } from 'react';
import { ResponsiveContainer } from 'recharts';

import { cn } from '../../primitives/cn';

export interface ChartConfigEntry {
  /** Human-readable label shown in tooltips and legends. */
  readonly label?: React.ReactNode;
  /** Optional icon rendered next to the legend / tooltip swatch. */
  readonly icon?: React.ComponentType<{ className?: string }>;
  /**
   * CSS color (hex / hsl / oklch / `var(--token)`). When set, the
   * container exposes `--color-<key>` so primitives can reference it
   * as `fill="var(--color-<key>)"`. When omitted, no var is exposed
   * and primitives may either fall back to a literal or skip the
   * entry.
   */
  readonly color?: string;
}

export type ChartConfig = Readonly<Record<string, ChartConfigEntry>>;

interface ChartContextValue {
  readonly config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

export function useChartContext(component: string): ChartContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used inside <ChartContainer>.`);
  }
  return ctx;
}

function buildChartCssVars(config: ChartConfig): React.CSSProperties {
  const vars: Record<`--${string}`, string> = {};
  for (const [key, value] of Object.entries(config)) {
    if (value.color) vars[`--color-${key}`] = value.color;
  }
  return vars;
}

interface ChartContainerProps extends React.ComponentProps<'div'> {
  /** Per-series labels and colors. Keys map to recharts `dataKey` values. */
  readonly config: ChartConfig;
  /** A single recharts chart element (BarChart, LineChart, PieChart, ...). */
  readonly children: React.ReactElement;
}

/**
 * Themed wrapper around a recharts chart. Provides:
 *   - `ResponsiveContainer` sizing
 *   - per-series CSS vars derived from `config`
 *   - context for `<ChartTooltipContent>` / `<ChartLegendContent>`
 *
 * Pass an explicit height via `className` (e.g. `h-72`) or rely on the
 * default `aspect-video` so the chart sizes itself from its width.
 */
export function ChartContainer({
  config,
  className,
  children,
  style,
  ...props
}: Readonly<ChartContainerProps>) {
  const reactId = useId().replaceAll(/[^a-zA-Z0-9]/g, '');
  const chartId = `clay-${reactId}`;
  const cssVars = useMemo(() => buildChartCssVars(config), [config]);
  const value = useMemo<ChartContextValue>(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={value}>
      <div
        data-clay-chart={chartId}
        style={{ ...cssVars, ...style }}
        className={cn(
          // Block-level wrapper that fully fills its parent. Consumers
          // must give the parent (or pass via `className`) an explicit
          // width AND height; recharts' polar charts (Pie / Donut /
          // Radial / Radar) render to nothing when the container
          // measures 0×0, so we DON'T ship a default `aspect-*` here
          // that could collide with caller-supplied sizing classes.
          'block h-full w-full text-xs',
          // Subdued recharts internals so they pick up theme colors.
          '[&_.recharts-cartesian-axis-line]:stroke-border',
          '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
          '[&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-cartesian-grid_line]:stroke-1 [&_.recharts-cartesian-grid_line]:opacity-50',
          '[&_.recharts-polar-grid_path]:stroke-border [&_.recharts-polar-grid_path]:opacity-50',
          '[&_.recharts-polar-angle-axis-tick_text]:fill-muted-foreground',
          '[&_.recharts-polar-radius-axis-tick_text]:fill-muted-foreground',
          '[&_.recharts-radial-bar-background-sector]:fill-muted',
          '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:opacity-50',
          '[&_.recharts-reference-line_line]:stroke-border',
          '[&_.recharts-sector[stroke="#fff"]]:stroke-transparent',
          '[&_.recharts-surface]:outline-none',
          className
        )}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}
