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
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from 'recharts';
import { defineDemos } from '../../component-registry';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const;

const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Vertical bar chart with a single series, themed via `ChartContainer` config. */
export function ChartBarDemo() {
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

/** Two series rendered side by side, colour-keyed via the config palette. */
export function ChartBarGroupedDemo() {
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

/** Stacked bar chart: bars share a column, totalled top-to-bottom. */
export function ChartBarStackedDemo() {
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

/** Multi-series line chart with a dashed legend indicator. */
export function ChartLineMultiDemo() {
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
 * Center label rendered inside the donut hole. Hoisted to the module scope so
 * recharts treats it as a stable component (avoids re-mount per data tick).
 * Recharts' `Label.content` callback receives a Props bag, we only care
 * about `viewBox.{cx,cy}` for the cartesian/polar projection.
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

export const demoMeta = defineDemos([
  [ChartBarDemo, 'Bar', { description: 'Vertical bar chart with a single series, themed via `ChartContainer` config.' }],
  [ChartBarGroupedDemo, 'Bar, Grouped', { description: 'Two series rendered side-by-side, colour-keyed via the config palette.' }],
  [ChartBarStackedDemo, 'Bar, Stacked', { description: 'Stacked bar chart, bars share a column, totalled top-to-bottom.' }],
  [ChartLineMultiDemo, 'Line, Multi-series', { description: 'Multi-series line chart with a dashed target overlay and a themed legend.' }],
  [ChartPieDemo, 'Pie', { description: 'Pie chart with a custom legend, segments map to the data palette via per-row `fill`.' }],
  [ChartDonutDemo, 'Donut', { description: 'Donut variant with a center label showing the running total.' }],
  [ChartRadialDemo, 'Radial', { description: 'Radial bar chart, useful for goal-completion or capacity visualisations.' }],
  [ChartRadarDemo, 'Radar', { description: 'Radar chart, multivariate comparison across labelled axes.' }],
]);
