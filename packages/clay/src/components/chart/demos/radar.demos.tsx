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
} from 'recharts';
/** Radar chart, multivariate comparison across labelled axes. */
export default function ChartRadarDemo() {
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
