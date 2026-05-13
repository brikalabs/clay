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
 * Stacked bar chart, bars share a column, totalled top-to-bottom.
 * @title Bar, Stacked
 */
export default function ChartBarStackedDemo() {
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
