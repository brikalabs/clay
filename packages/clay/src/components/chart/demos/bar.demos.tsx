import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@brika/clay/components/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const;

const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Vertical bar chart with a single series, themed via `ChartContainer` config. */
export default function ChartBarDemo() {
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
