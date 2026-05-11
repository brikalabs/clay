'use client';

import { useCallback, useId } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
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
  // useId guarantees a unique gradient even when multiple Charts of
  // the same color render on the same page (otherwise SVG <defs> ids
  // would collide).
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

  // Empty placeholder when no data.
  if (!hasData) {
    return (
      <div className={cn('flex h-full w-full items-center justify-center', className)}>
        <div className="h-px w-full opacity-20" style={{ backgroundColor: color }} />
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
