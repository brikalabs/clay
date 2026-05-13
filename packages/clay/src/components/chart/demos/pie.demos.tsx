import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@brika/clay/components/chart';
import { Pie, PieChart } from 'recharts';
const PIE_DATA = [
  { browser: 'chrome', visitors: 4280, fill: 'var(--data-1)' },
  { browser: 'safari', visitors: 2310, fill: 'var(--data-2)' },
  { browser: 'firefox', visitors: 1490, fill: 'var(--data-3)' },
  { browser: 'edge', visitors: 870, fill: 'var(--data-4)' },
  { browser: 'other', visitors: 510, fill: 'var(--data-5)' },
];

const PIE_CONFIG: ChartConfig = {
  visitors: { label: 'Visitors' },
  chrome: { label: 'Chrome', color: 'var(--data-1)' },
  safari: { label: 'Safari', color: 'var(--data-2)' },
  firefox: { label: 'Firefox', color: 'var(--data-3)' },
  edge: { label: 'Edge', color: 'var(--data-4)' },
  other: { label: 'Other', color: 'var(--data-5)' },
};

/** Pie chart with a custom legend, segments map to the data palette via per-row `fill`. */
export default function ChartPieDemo() {
  return (
    <ChartContainer config={PIE_CONFIG} className="mx-auto h-80 w-80">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="browser" />} />
        <Pie
          data={PIE_DATA}
          dataKey="visitors"
          nameKey="browser"
          outerRadius={120}
          strokeWidth={2}
        />
        <ChartLegend content={<ChartLegendContent nameKey="browser" />} />
      </PieChart>
    </ChartContainer>
  );
}
