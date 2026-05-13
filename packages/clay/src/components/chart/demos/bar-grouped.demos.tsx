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
  XAxis,
  YAxis,
} from 'recharts';
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const;

const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/**
 * Two series rendered side-by-side, colour-keyed via the config palette.
 * @title Bar, Grouped
 */
export default function ChartBarGroupedDemo() {
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
