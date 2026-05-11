import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@brika/clay/components/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const;

const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Vertical bar chart, single series, themed via `ChartContainer` config. */
export function ChartBarDemo() {
  const data = monthLabels.map((month, i) => ({
    month,
    visitors: 1820 + i * 240 + (i % 2) * 180,
  }));
  const config: ChartConfig = {
    visitors: { label: 'Visitors', color: 'var(--data-1)' },
  };
  return (
    <ChartContainer config={config} className="h-72 w-full">
      <BarChart data={data} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} tickFormatter={(v) => compact.format(v)} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="visitors" fill="var(--color-visitors)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

/** Two series rendered side by side, colour-keyed via the config palette. */
export function ChartBarGroupedDemo() {
  const data = monthLabels.map((month, i) => ({
    month,
    desktop: 1820 + i * 240,
    mobile: 1140 + i * 180 + (i % 2) * 120,
  }));
  const config: ChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--data-1)' },
    mobile: { label: 'Mobile', color: 'var(--data-2)' },
  };
  return (
    <ChartContainer config={config} className="h-72 w-full">
      <BarChart data={data} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} tickFormatter={(v) => compact.format(v)} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

/** Stacked bar chart, bars share a column, totalled top-to-bottom. */
export function ChartBarStackedDemo() {
  const data = monthLabels.map((month, i) => ({
    month,
    paid: 420 + i * 60,
    organic: 1280 + i * 110,
    referral: 380 + i * 30,
  }));
  const config: ChartConfig = {
    paid: { label: 'Paid', color: 'var(--data-1)' },
    organic: { label: 'Organic', color: 'var(--data-3)' },
    referral: { label: 'Referral', color: 'var(--data-5)' },
  };
  return (
    <ChartContainer config={config} className="h-72 w-full">
      <BarChart data={data} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} tickFormatter={(v) => compact.format(v)} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="paid" stackId="a" fill="var(--color-paid)" />
        <Bar dataKey="organic" stackId="a" fill="var(--color-organic)" />
        <Bar dataKey="referral" stackId="a" fill="var(--color-referral)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

/** Multi-series line chart with a dashed legend indicator. */
export function ChartLineMultiDemo() {
  const data = monthLabels.map((month, i) => ({
    month,
    revenue: 18 + i * 4 + Math.sin(i) * 2,
    target: 22 + i * 3,
  }));
  const config: ChartConfig = {
    revenue: { label: 'Revenue', color: 'var(--data-1)' },
    target: { label: 'Target', color: 'var(--muted-foreground)' },
  };
  return (
    <ChartContainer config={config} className="h-72 w-full">
      <LineChart data={data} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-revenue)', r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="var(--color-target)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
