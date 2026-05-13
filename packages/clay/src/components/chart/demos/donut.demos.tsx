import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@brika/clay/components/chart';
import { Label, Pie, PieChart } from 'recharts';
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

/** Donut variant with a center label showing the running total. */
export default function ChartDonutDemo() {
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
