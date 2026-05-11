'use client';

import * as React from 'react';

import { cn } from '../../primitives/cn';
import { useChartContext } from './chart-context';

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
  readonly labelFormatter?: (
    label: string | number,
    payload: readonly ChartTooltipPayloadItem[]
  ) => React.ReactNode;
  /** Format each row's value (defaults to a locale number). */
  readonly formatter?: (
    value: number | string,
    name: string,
    item: ChartTooltipPayloadItem
  ) => React.ReactNode;
  readonly className?: string;
}

const DEFAULT_NUMBER_FORMAT = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

// Coerce a recharts payload key to a string without leaning on
// `Object.prototype.toString` for non-primitive values. Recharts
// sometimes surfaces `payload[nameKey]` as `unknown`; we only treat
// strings and finite numbers as legitimate keys, anything else
// collapses to an empty string.
function stringKey(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

/**
 * Themed tooltip body for use as
 * `<ChartTooltip content={<ChartTooltipContent />} />`. Reads labels
 * from the surrounding `<ChartContainer>`'s `config`.
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
        {payload.map((item) => {
          const key = (nameKey && item.payload?.[nameKey]) ?? item.dataKey ?? item.name;
          const cfgKey = stringKey(key);
          const cfgEntry = config[cfgKey];
          const swatchColor = cfgEntry?.color ?? item.color ?? `var(--color-${cfgKey})`;
          const rowName = cfgEntry?.label ?? item.name ?? cfgKey;
          const rawValue = item.value;
          const formattedNumber =
            typeof rawValue === 'number' ? DEFAULT_NUMBER_FORMAT.format(rawValue) : String(rawValue ?? '');
          const renderedValue = formatter
            ? formatter(rawValue ?? '', String(item.name ?? cfgKey), item)
            : formattedNumber;
          return (
            <div key={cfgKey} className="flex items-center justify-between gap-3">
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
 * Themed legend body for use as
 * `<ChartLegend content={<ChartLegendContent />} />`. Reads labels
 * from the surrounding `<ChartContainer>`'s `config`.
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
    <ul
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3',
        className
      )}
    >
      {payload.map((item) => {
        const key = (nameKey && (item as Record<string, unknown>)[nameKey]) ?? item.dataKey ?? item.value;
        const cfgKey = stringKey(key);
        const cfgEntry = config[cfgKey];
        const swatchColor = cfgEntry?.color ?? item.color ?? `var(--color-${cfgKey})`;
        const label = cfgEntry?.label ?? item.value ?? cfgKey;
        return (
          <li key={cfgKey} className="flex items-center gap-1.5 text-muted-foreground text-xs">
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
