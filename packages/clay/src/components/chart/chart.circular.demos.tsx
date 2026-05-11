import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@brika/clay/components/chart';
import { Label, Pie, PieChart } from 'recharts';

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

/** Pie chart with a custom legend; segments map to the data palette via per-row `fill`. */
export function ChartPieDemo() {
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

const DONUT_DATA = [
  { status: 'completed', tasks: 142, fill: 'var(--data-3)' },
  { status: 'inProgress', tasks: 36, fill: 'var(--data-1)' },
  { status: 'blocked', tasks: 8, fill: 'var(--destructive)' },
];
const DONUT_TOTAL = DONUT_DATA.reduce((sum, d) => sum + d.tasks, 0);

const DONUT_CONFIG: ChartConfig = {
  tasks: { label: 'Tasks' },
  completed: { label: 'Completed', color: 'var(--data-3)' },
  inProgress: { label: 'In progress', color: 'var(--data-1)' },
  blocked: { label: 'Blocked', color: 'var(--destructive)' },
};

/**
 * Center label rendered inside the donut hole. Hoisted to the module
 * scope so recharts treats it as a stable component (avoids re-mount
 * per data tick). Recharts' `Label.content` callback receives a Props
 * bag; we only care about `viewBox.{cx,cy}` for the cartesian/polar
 * projection.
 */
function DonutCenterLabel(props: Readonly<{ viewBox?: unknown }>) {
  const viewBox = props.viewBox as { cx?: number; cy?: number } | undefined;
  const cx = viewBox?.cx;
  const cy = viewBox?.cy;
  if (cx === undefined || cy === undefined) return null;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} y={cy} className="fill-foreground font-semibold text-3xl">
        {DONUT_TOTAL}
      </tspan>
      <tspan x={cx} y={cy + 22} className="fill-muted-foreground text-xs">
        Tasks
      </tspan>
    </text>
  );
}

/** Donut variant with a center label showing the total. */
export function ChartDonutDemo() {
  return (
    <ChartContainer config={DONUT_CONFIG} className="mx-auto h-80 w-80">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="status" />} />
        <Pie
          data={DONUT_DATA}
          dataKey="tasks"
          nameKey="status"
          innerRadius={70}
          outerRadius={110}
          strokeWidth={2}
        >
          <Label content={DonutCenterLabel} />
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="status" />} />
      </PieChart>
    </ChartContainer>
  );
}
