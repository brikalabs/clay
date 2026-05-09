'use client';

import { Button } from '@brika/clay/components/button';
import { Chart } from '@brika/clay/components/chart';
import { ToggleGroup, ToggleGroupItem } from '@brika/clay/components/toggle-group';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { defineDemos } from '../../component-registry';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const STREAM_RANGES = {
  '60s': { points: 60, intervalMs: 1_000, tickFormat: { minute: '2-digit', second: '2-digit' } as const },
  '5m': { points: 60, intervalMs: 5_000, tickFormat: { hour: 'numeric', minute: '2-digit' } as const },
  '15m': { points: 90, intervalMs: 10_000, tickFormat: { hour: 'numeric', minute: '2-digit' } as const },
} as const;
type StreamRange = keyof typeof STREAM_RANGES;

const METRICS = {
  revenue: { label: 'Revenue / sec', color: 'var(--data-1)', base: 120, jitter: 40, format: (v: number) => currency.format(v) },
  users: { label: 'Active users', color: 'var(--data-2)', base: 8400, jitter: 600, format: (v: number) => Math.round(v).toLocaleString() },
  errors: { label: 'Errors / min', color: 'var(--destructive)', base: 4, jitter: 5, format: (v: number) => v.toFixed(1) },
  latency: { label: 'Latency (ms)', color: 'var(--data-4)', base: 140, jitter: 35, format: (v: number) => `${v.toFixed(0)}ms` },
} as const;
type MetricKey = keyof typeof METRICS;

function nextSample(metric: MetricKey, prev?: number): number {
  const cfg = METRICS[metric];
  const base = prev ?? cfg.base;
  // Random walk with mean-reversion towards the metric's base value.
  const drift = (cfg.base - base) * 0.05;
  const noise = (Math.random() - 0.5) * cfg.jitter;
  return Math.max(0, base + drift + noise);
}

function seedSeries(metric: MetricKey, range: StreamRange): Array<{ ts: number; value: number }> {
  const { points, intervalMs } = STREAM_RANGES[range];
  const now = Date.now();
  const out: Array<{ ts: number; value: number }> = [];
  let prev: number | undefined;
  for (let i = 0; i < points; i += 1) {
    prev = nextSample(metric, prev);
    out.push({ ts: now - (points - 1 - i) * intervalMs, value: prev });
  }
  return out;
}

function Stat({
  label,
  value,
  highlight,
}: Readonly<{ label: string; value: string; highlight?: boolean }>) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs uppercase tracking-wide">{label}</span>
      <span
        className={`tabular-nums ${highlight ? 'font-semibold text-foreground text-lg' : 'text-foreground text-sm'}`}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Live-streaming chart with controls: pick a metric, swap the time window, and
 * pause/resume the simulated feed. Demonstrates how Chart updates smoothly when
 * its `data` prop changes from above.
 */
export function ChartLiveStreamDemo() {
  const [metric, setMetric] = useState<MetricKey>('revenue');
  const [range, setRange] = useState<StreamRange>('60s');
  const [paused, setPaused] = useState(false);
  const [data, setData] = useState<Array<{ ts: number; value: number }>>(() =>
    seedSeries('revenue', '60s')
  );
  const lastValueRef = useRef<number | undefined>(undefined);

  // Reseed when the user swaps metric or range; also reset the random-walk anchor.
  useEffect(() => {
    const seeded = seedSeries(metric, range);
    setData(seeded);
    lastValueRef.current = seeded.at(-1)?.value;
  }, [metric, range]);

  // Stream a new point every interval-ms while not paused.
  useEffect(() => {
    if (paused) return;
    const { intervalMs, points } = STREAM_RANGES[range];
    const id = setInterval(() => {
      const next = nextSample(metric, lastValueRef.current);
      lastValueRef.current = next;
      setData((prev) => [...prev.slice(-(points - 1)), { ts: Date.now(), value: next }]);
    }, intervalMs);
    return () => clearInterval(id);
  }, [metric, range, paused]);

  const cfg = METRICS[metric];
  const tickFormat = STREAM_RANGES[range].tickFormat;

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const values = data.map((d) => d.value);
    const current = values.at(-1) ?? 0;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return { current, min, max, avg };
  }, [data]);

  const reset = (): void => {
    const seeded = seedSeries(metric, range);
    setData(seeded);
    lastValueRef.current = seeded.at(-1)?.value;
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-card border border-border bg-card-container p-4 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          type="single"
          value={metric}
          onValueChange={(v) => v && setMetric(v as MetricKey)}
          aria-label="Metric"
        >
          {(Object.keys(METRICS) as MetricKey[]).map((key) => (
            <ToggleGroupItem key={key} value={key}>
              {METRICS[key].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={range}
            onValueChange={(v) => v && setRange(v as StreamRange)}
            aria-label="Range"
          >
            <ToggleGroupItem value="60s">60s</ToggleGroupItem>
            <ToggleGroupItem value="5m">5m</ToggleGroupItem>
            <ToggleGroupItem value="15m">15m</ToggleGroupItem>
          </ToggleGroup>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume stream' : 'Pause stream'}
          >
            {paused ? <Play /> : <Pause />}
          </Button>
          <Button variant="outline" size="icon-sm" onClick={reset} aria-label="Reset stream">
            <RotateCcw />
          </Button>
        </div>
      </div>

      {stats ? (
        <div className="grid grid-cols-4 gap-3 border-border border-y py-3">
          <Stat label="Current" value={cfg.format(stats.current)} highlight />
          <Stat label="Average" value={cfg.format(stats.avg)} />
          <Stat label="Min" value={cfg.format(stats.min)} />
          <Stat label="Max" value={cfg.format(stats.max)} />
        </div>
      ) : null}

      <div className="h-72 w-full">
        <Chart
          data={data}
          color={cfg.color}
          showAxes
          formatValue={cfg.format}
          formatX={(ts) => new Date(ts).toLocaleTimeString(undefined, tickFormat)}
        />
      </div>

      <p className="flex items-center gap-2 text-muted-foreground text-xs">
        <span
          aria-hidden
          className={`inline-block size-2 rounded-full ${paused ? '' : 'animate-pulse'}`}
          style={{ backgroundColor: paused ? 'var(--muted-foreground)' : cfg.color }}
        />
        {paused ? 'Paused' : `Streaming, new sample every ${STREAM_RANGES[range].intervalMs / 1000}s`}
      </p>
    </div>
  );
}

export const demoMeta = defineDemos([
  [ChartLiveStreamDemo, 'Live Stream', { description: 'Live-streaming chart with controls, pick a metric, swap the time window, pause / resume the simulated feed.' }],
]);
