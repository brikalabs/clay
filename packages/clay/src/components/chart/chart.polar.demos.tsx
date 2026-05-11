import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@brika/clay/components/chart';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
} from 'recharts';

/** Radial bar chart, useful for goal-completion / capacity visualisations. */
export function ChartRadialDemo() {
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

/** Radar chart, multivariate comparison across labelled axes. */
export function ChartRadarDemo() {
  const data = [
    { axis: 'Speed', current: 86, target: 70 },
    { axis: 'Reliability', current: 74, target: 80 },
    { axis: 'Cost', current: 62, target: 75 },
    { axis: 'Coverage', current: 90, target: 85 },
    { axis: 'Latency', current: 68, target: 78 },
    { axis: 'Throughput', current: 82, target: 80 },
  ];
  const config: ChartConfig = {
    current: { label: 'Current quarter', color: 'var(--data-1)' },
    target: { label: 'Target', color: 'var(--data-3)' },
  };
  return (
    <ChartContainer config={config} className="mx-auto h-80 w-80">
      <RadarChart data={data} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
        <PolarGrid />
        <PolarAngleAxis dataKey="axis" />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Radar
          dataKey="current"
          fill="var(--color-current)"
          fillOpacity={0.3}
          stroke="var(--color-current)"
          strokeWidth={2}
        />
        <Radar
          dataKey="target"
          fill="var(--color-target)"
          fillOpacity={0.15}
          stroke="var(--color-target)"
          strokeWidth={2}
        />
      </RadarChart>
    </ChartContainer>
  );
}
