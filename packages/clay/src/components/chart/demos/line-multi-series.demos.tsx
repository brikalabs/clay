import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@brika/clay/components/chart';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const;

/**
 * Multi-series line chart with a dashed target overlay and a themed legend.
 * @title Line, Multi-series
 */
export default function ChartLineMultiDemo() {
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
