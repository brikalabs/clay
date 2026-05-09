'use client';

import * as React from 'react';
import { useCallback, useContext, useId, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '../../primitives/cn';

function SparklineTooltipContent({
  active,
  payload,
  formatValue,
  formatX,
}: Readonly<{
  active?: boolean;
  payload?: ReadonlyArray<{
    value?: unknown;
    payload?: { ts?: number };
  }>;
  formatValue: (value: number) => string;
  formatX?: (ts: number) => string;
}>) {
  if (!active || payload?.[0]?.value === null || payload?.[0]?.value === undefined) {
    return null;
  }
  const ts = payload[0].payload?.ts;
  return (
    <div className="rounded-control border border-chart-tooltip-border bg-chart-tooltip-container px-2 py-1 text-sm text-chart-tooltip-label shadow-overlay backdrop-blur-popover">
      {formatX && ts !== undefined ? (
        <div className="text-muted-foreground text-xs">{formatX(ts)}</div>
      ) : null}
      <div>{formatValue(Number(payload[0].value))}</div>
    </div>
  );
}

interface ChartProps {
  /** Array of `{ts, value}` points plotted on the area chart. */
  data: Array<{
    ts: number;
    value: number;
  }>;
  /** Line and gradient color; defaults to `var(--color-primary)`. */
  color?: string;
  /** Formatter for the y-axis and tooltip readout. */
  formatValue?: (value: number) => string;
  /** Formatter for the x-axis ticks and tooltip header (defaults to a short locale time). */
  formatX?: (ts: number) => string;
  /** Show the x and y axes with tick labels. Default: `false` (sparkline mode). */
  showAxes?: boolean;
  /** Render a faint cartesian grid behind the area. Implied when `showAxes` is true. */
  grid?: boolean;
  /** Optional axis titles rendered next to each axis when `showAxes` is true. */
  xLabel?: string;
  yLabel?: string;
  /** Extra Tailwind classes appended to the chart wrapper. */
  className?: string;
}

const DEFAULT_FORMAT_X = (ts: number): string =>
  new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

export function Chart({
  data,
  color = 'var(--color-primary)',
  formatValue = (v) => v.toFixed(1),
  formatX = DEFAULT_FORMAT_X,
  showAxes = false,
  grid = false,
  xLabel,
  yLabel,
  className,
}: Readonly<ChartProps>) {
  // useId guarantees a unique gradient even when multiple Charts of the same
  // color render on the same page (otherwise SVG <defs> ids would collide).
  const reactId = useId().replaceAll(/[^a-zA-Z0-9]/g, '');
  const gradientId = `chart-gradient-${reactId}`;
  const hasData = data.length > 0;
  const showGrid = grid || showAxes;
  const renderTooltip = useCallback(
    (props: {
      active?: boolean;
      payload?: ReadonlyArray<{
        value?: unknown;
        payload?: { ts?: number };
      }>;
    }) => (
      <SparklineTooltipContent
        {...props}
        formatValue={formatValue}
        formatX={showAxes ? formatX : undefined}
      />
    ),
    [formatValue, formatX, showAxes]
  );

  // Show empty placeholder when no data
  if (!hasData) {
    return (
      <div className={cn('flex h-full w-full items-center justify-center', className)}>
        <div
          className="h-px w-full opacity-20"
          style={{
            backgroundColor: color,
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn('h-full w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={
            showAxes
              ? {
                  top: 12,
                  right: 16,
                  // Extra left padding so the y-axis label sits clear of the ticks.
                  left: yLabel ? 16 : 4,
                  // Extra bottom padding so the x-axis label has room.
                  bottom: xLabel ? 12 : 0,
                }
              : { top: 5, right: 5, left: 5, bottom: 5 }
          }
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid ? (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
              vertical={false}
            />
          ) : null}
          <XAxis
            dataKey="ts"
            hide={!showAxes}
            tickFormatter={formatX}
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={32}
          >
            {showAxes && xLabel ? (
              <Label
                value={xLabel}
                position="insideBottom"
                offset={-6}
                fill="var(--muted-foreground)"
                fontSize={11}
              />
            ) : null}
          </XAxis>
          <YAxis
            hide={!showAxes}
            domain={['auto', 'auto']}
            tickFormatter={formatValue}
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={48}
          >
            {showAxes && yLabel ? (
              <Label
                value={yLabel}
                angle={-90}
                position="insideLeft"
                offset={4}
                style={{ textAnchor: 'middle' }}
                fill="var(--muted-foreground)"
                fontSize={11}
              />
            ) : null}
          </YAxis>
          <Tooltip
            content={renderTooltip}
            cursor={{ stroke: 'var(--muted-foreground)', strokeOpacity: 0.4, strokeDasharray: '3 3' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── General-purpose chart container ────────────────────────────────────────
//
// `Chart` above is a fixed-shape sparkline. For arbitrary chart types
// (Bar, Line, Pie, Radial, Radar, multi-series Area, ...) consumers compose
// recharts primitives directly inside `<ChartContainer>`. The container
// wires three things consumers would otherwise repeat per chart:
//
//   1. A theming context (`ChartConfig`) that maps each series key to a
//      `{ label, color }`, then injects `--color-<key>` CSS vars into the
//      chart's wrapper. Recharts primitives reference colors by var
//      (`fill="var(--color-revenue)"`), so the per-series palette lives in
//      one place and the rest of the JSX is colour-agnostic.
//   2. A `ResponsiveContainer` so the chart fills its parent.
//   3. Themed `<ChartTooltipContent>` and `<ChartLegendContent>` bodies that
//      consume the same context, no need to restyle the tooltip per chart.

export interface ChartConfigEntry {
  /** Human-readable label shown in tooltips and legends. */
  readonly label?: React.ReactNode;
  /** Optional icon rendered next to the legend / tooltip swatch. */
  readonly icon?: React.ComponentType<{ className?: string }>;
  /**
   * CSS color (hex / hsl / oklch / `var(--token)`). When set, the container
   * exposes `--color-<key>` so primitives can reference it as
   * `fill="var(--color-<key>)"`. When omitted, no var is exposed and
   * primitives may either fall back to a literal or skip the entry.
   */
  readonly color?: string;
}

export type ChartConfig = Readonly<Record<string, ChartConfigEntry>>;

interface ChartContextValue {
  readonly config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChartContext(component: string): ChartContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used inside <ChartContainer>.`);
  }
  return ctx;
}

function buildChartCss(id: string, config: ChartConfig): string {
  const declarations = Object.entries(config)
    .filter(([, value]) => Boolean(value.color))
    .map(([key, value]) => `  --color-${key}: ${value.color};`)
    .join('\n');
  if (!declarations) return '';
  return `[data-clay-chart="${id}"] {\n${declarations}\n}`;
}

function ChartStyle({ id, css }: Readonly<{ id: string; css: string }>) {
  if (!css) return null;
  // The CSS is built from author-provided color strings; injecting via
  // dangerouslySetInnerHTML is safe here because authors are the same
  // trust boundary as the rest of the React tree.
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
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
  ...props
}: Readonly<ChartContainerProps>) {
  const reactId = useId().replaceAll(/[^a-zA-Z0-9]/g, '');
  const chartId = `clay-${reactId}`;
  const css = useMemo(() => buildChartCss(chartId, config), [chartId, config]);
  const value = useMemo<ChartContextValue>(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={value}>
      <div
        data-clay-chart={chartId}
        className={cn(
          // Block-level wrapper that fully fills its parent. Consumers must
          // give the parent (or pass via `className`) an explicit width AND
          // height; recharts' polar charts (Pie / Donut / Radial / Radar)
          // render to nothing when the container measures 0×0, so we DON'T
          // ship a default `aspect-*` here that could collide with caller-
          // supplied sizing classes.
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
        <ChartStyle id={chartId} css={css} />
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/** Re-export of recharts `Tooltip` so consumers don't need a second import. */
export const ChartTooltip = Tooltip;

/** Re-export of recharts `Legend` so consumers don't need a second import. */
export const ChartLegend = Legend;

interface ChartTooltipPayloadItem {
  readonly value?: number | string;
  readonly name?: string;
  readonly dataKey?: string;
  readonly color?: string;
  readonly payload?: Record<string, unknown>;
}

interface ChartTooltipContentProps {
  readonly active?: boolean;
  readonly payload?: readonly ChartTooltipPayloadItem[];
  readonly label?: string | number;
  /** Marker style next to each tooltip row. */
  readonly indicator?: 'dot' | 'line' | 'dashed';
  /** Hide the marker entirely. */
  readonly hideIndicator?: boolean;
  /** Hide the heading row (the `label` argument from recharts). */
  readonly hideLabel?: boolean;
  /** Pull the label from a specific payload key instead of the `label` arg. */
  readonly labelKey?: string;
  /** Pull the row name from a specific payload key instead of `dataKey`. */
  readonly nameKey?: string;
  /** Format the heading label (defaults to the matched config entry's `label`). */
  readonly labelFormatter?: (label: string | number, payload: readonly ChartTooltipPayloadItem[]) => React.ReactNode;
  /** Format each row's value (defaults to a locale number). */
  readonly formatter?: (value: number | string, name: string, item: ChartTooltipPayloadItem) => React.ReactNode;
  readonly className?: string;
}

const DEFAULT_NUMBER_FORMAT = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

/**
 * Themed tooltip body for use as `<ChartTooltip content={<ChartTooltipContent />} />`.
 * Reads labels from the surrounding `<ChartContainer>`'s `config`.
 */
export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = 'dot',
  hideIndicator = false,
  hideLabel = false,
  labelKey,
  nameKey,
  labelFormatter,
  formatter,
  className,
}: Readonly<ChartTooltipContentProps>) {
  const { config } = useChartContext('ChartTooltipContent');
  if (!active || !payload?.length) return null;

  const headingValue = (() => {
    if (hideLabel) return null;
    if (labelKey && payload[0]?.payload && labelKey in payload[0].payload) {
      return String(payload[0].payload[labelKey]);
    }
    if (label === undefined || label === null) return null;
    if (labelFormatter) return labelFormatter(label, payload);
    // If the label happens to be a config key, render the config label.
    const cfgEntry = typeof label === 'string' ? config[label] : undefined;
    return cfgEntry?.label ?? String(label);
  })();

  return (
    <div
      className={cn(
        'min-w-32 rounded-control border border-chart-tooltip-border bg-chart-tooltip-container px-2.5 py-1.5 text-xs text-chart-tooltip-label shadow-overlay backdrop-blur-popover',
        className
      )}
    >
      {headingValue ? (
        <div className="mb-1 font-medium text-foreground">{headingValue}</div>
      ) : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = (nameKey && item.payload?.[nameKey]) ?? item.dataKey ?? item.name ?? `item-${index}`;
          const cfgKey = String(key);
          const cfgEntry = config[cfgKey];
          const swatchColor = cfgEntry?.color ?? item.color ?? `var(--color-${cfgKey})`;
          const rowName = cfgEntry?.label ?? item.name ?? cfgKey;
          const rawValue = item.value;
          const renderedValue = formatter
            ? formatter(rawValue ?? '', String(item.name ?? cfgKey), item)
            : typeof rawValue === 'number'
              ? DEFAULT_NUMBER_FORMAT.format(rawValue)
              : String(rawValue ?? '');
          return (
            <div key={cfgKey + '-' + index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {!hideIndicator && (
                  <span
                    aria-hidden
                    className={cn(
                      'shrink-0',
                      indicator === 'dot' && 'size-2 rounded-full',
                      indicator === 'line' && 'h-0.5 w-3 rounded-full',
                      indicator === 'dashed' && 'h-0 w-3 border-t border-dashed'
                    )}
                    style={
                      indicator === 'dashed'
                        ? { borderColor: swatchColor }
                        : { backgroundColor: swatchColor }
                    }
                  />
                )}
                {cfgEntry?.icon ? <cfgEntry.icon className="size-3 text-muted-foreground" /> : null}
                <span className="text-muted-foreground">{rowName}</span>
              </div>
              <span className="font-medium tabular-nums text-foreground">{renderedValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ChartLegendItem {
  readonly value?: string;
  readonly dataKey?: string;
  readonly color?: string;
}

interface ChartLegendContentProps {
  readonly payload?: readonly ChartLegendItem[];
  /** Pull the row name from a specific payload key instead of `dataKey`. */
  readonly nameKey?: string;
  /** Hide the swatch markers. */
  readonly hideIcon?: boolean;
  readonly className?: string;
}

/**
 * Themed legend body for use as `<ChartLegend content={<ChartLegendContent />} />`.
 * Reads labels from the surrounding `<ChartContainer>`'s `config`.
 */
export function ChartLegendContent({
  payload,
  nameKey,
  hideIcon = false,
  className,
}: Readonly<ChartLegendContentProps>) {
  const { config } = useChartContext('ChartLegendContent');
  if (!payload?.length) return null;

  return (
    <ul className={cn('flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3', className)}>
      {payload.map((item, index) => {
        const key = (nameKey && (item as Record<string, unknown>)[nameKey]) ?? item.dataKey ?? item.value ?? `item-${index}`;
        const cfgKey = String(key);
        const cfgEntry = config[cfgKey];
        const swatchColor = cfgEntry?.color ?? item.color ?? `var(--color-${cfgKey})`;
        const label = cfgEntry?.label ?? item.value ?? cfgKey;
        return (
          <li key={cfgKey + '-' + index} className="flex items-center gap-1.5 text-muted-foreground text-xs">
            {!hideIcon && (
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: swatchColor }}
              />
            )}
            {cfgEntry?.icon ? <cfgEntry.icon className="size-3" /> : null}
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
