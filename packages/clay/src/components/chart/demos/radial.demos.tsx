import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@brika/clay/components/chart';
import { RadialBar, RadialBarChart } from 'recharts';

/** Radial bar chart, useful for goal-completion or capacity visualisations. */
export default function ChartRadialDemo() {
  const data = [
    { metric: 'storage', value: 78, fill: 'var(--data-1)' },
    { metric: 'memory', value: 64, fill: 'var(--data-2)' },
    { metric: 'cpu', value: 91, fill: 'var(--destructive)' },
    { metric: 'network', value: 42, fill: 'var(--data-4)' },
  ];
  const config: ChartConfig = {
    value: { label: 'Utilisation' },
    storage: { label: 'Storage', color: 'var(--data-1)' },
    memory: { label: 'Memory', color: 'var(--data-2)' },
    cpu: { label: 'CPU', color: 'var(--destructive)' },
    network: { label: 'Network', color: 'var(--data-4)' },
  };
  return (
    <ChartContainer config={config} className="mx-auto h-80 w-80">
      <RadialBarChart data={data} innerRadius={32} outerRadius={120} startAngle={90} endAngle={-270}>
        <ChartTooltip
          content={<ChartTooltipContent hideLabel nameKey="metric" formatter={(v) => `${v}%`} />}
        />
        <RadialBar dataKey="value" background cornerRadius={6} />
        <ChartLegend content={<ChartLegendContent nameKey="metric" />} />
      </RadialBarChart>
    </ChartContainer>
  );
}
