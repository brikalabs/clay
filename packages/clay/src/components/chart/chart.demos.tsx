import { Badge } from '@brika/clay/components/badge';
import { Chart } from '@brika/clay/components/chart';
import { defineDemos } from '../../component-registry';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function generate(
  points: number,
  intervalMs: number,
  seed: number,
  amplitude: number,
  drift: number
): Array<{ ts: number; value: number }> {
  const now = Date.now();
  return Array.from({ length: points }, (_, index) => ({
    ts: now - (points - 1 - index) * intervalMs,
    value: 30 + Math.sin(index / seed) * amplitude + index * drift,
  }));
}

const hourly = generate(24, HOUR, 3, 18, 1.5);
const weekly = generate(7, DAY, 1.2, 12, 4);
const monthly = generate(30, DAY, 4, 22, 0.4);
const volatile = Array.from({ length: 48 }, (_, index) => ({
  ts: Date.now() - (47 - index) * 30 * 60_000,
  value: 50 + (Math.random() - 0.5) * 60,
}));

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

interface KpiSeries {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  color: string;
  data: Array<{ ts: number; value: number }>;
}

const KPI_SERIES: KpiSeries[] = [
  { label: 'Revenue', value: currency.format(48230), delta: '+12.4%', trend: 'up', color: 'var(--data-1)', data: weekly },
  { label: 'Active users', value: '8,402', delta: '+3.1%', trend: 'up', color: 'var(--data-2)', data: monthly },
  { label: 'Error rate', value: percent.format(0.018), delta: '-0.4%', trend: 'down', color: 'var(--destructive)', data: volatile },
  { label: 'Latency p95', value: '142ms', delta: '+5ms', trend: 'up', color: 'var(--data-4)', data: hourly },
];

/** Sparklines compose into a KPI strip; each one keeps its own color via the data palette. */
export function ChartDashboardDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {KPI_SERIES.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-3 overflow-hidden rounded-card border border-border bg-card-container p-4 shadow-card"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">{s.label}</p>
            <Badge variant={s.trend === 'down' ? 'secondary' : 'outline'} className="text-[10px]">
              {s.delta}
            </Badge>
          </div>
          <p className="font-semibold text-2xl text-foreground tabular-nums">{s.value}</p>
          <div className="-mx-1 h-14">
            <Chart data={s.data} color={s.color} />
          </div>
        </div>
      ))}
    </div>
  );
}

export const demoMeta = defineDemos([
  [ChartDashboardDemo, 'KPI Dashboard', { description: 'Sparklines compose into a KPI strip; each one keeps its own color via the data palette.' }],
]);
