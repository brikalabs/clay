/**
 * A more product-like preview scene: a faux dashboard with a sidebar,
 * stat row, large chart, and a recent-activity card. Stresses the
 * surface tonal scale, primary-as-accent, and the data-* palette.
 */

import { Badge } from '@brika/clay/components/badge';
import { Button } from '@brika/clay/components/button';
import { Chart } from '@brika/clay/components/chart';
import { Activity, ChevronRight, Folder, Home, Settings, Users } from 'lucide-react';
import { useMemo } from 'react';
import { makeChartData } from './_chart-data';

export function DashboardScene() {
  const chartData = useMemo(() => makeChartData(1.2), []);

  return (
    <div className="grid grid-cols-[200px_1fr] gap-4">
      <aside className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3 text-card-foreground">
        <div className="mb-2 flex items-center gap-2 px-2 py-1">
          <span className="size-6 rounded-md bg-primary" aria-hidden />
          <span className="font-semibold text-sm">Aurora</span>
        </div>
        <NavItem icon={<Home className="size-4" />} label="Overview" active />
        <NavItem icon={<Folder className="size-4" />} label="Projects" badge="12" />
        <NavItem icon={<Users className="size-4" />} label="Team" />
        <NavItem icon={<Activity className="size-4" />} label="Activity" />
        <NavItem icon={<Settings className="size-4" />} label="Settings" />
        <span className="mt-auto px-2 pt-3 font-mono text-[0.625rem] text-muted-foreground uppercase tracking-[0.12em]">
          v14.2 · pro
        </span>
      </aside>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="font-semibold text-2xl tracking-tight">Overview</h2>
            <p className="text-muted-foreground text-sm">Last 24 hours.</p>
          </div>
          <Button size="sm">
            New project <ChevronRight className="size-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Requests" value="12.4k" delta="+8.2%" tone="success" />
          <StatCard label="Errors" value="0.3%" delta="−0.1%" tone="success" />
          <StatCard label="Latency p95" value="86ms" delta="+4ms" tone="warning" />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium text-sm">Traffic</span>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-primary" /> requests
              </span>
            </div>
          </div>
          <div className="h-32 w-full">
            <Chart data={chartData} grid />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-sm">Recent activity</span>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>
          <ul className="flex flex-col gap-1.5 text-sm">
            <ActivityRow tone="success" label="Deploy succeeded" meta="aurora-web · 14:32" />
            <ActivityRow tone="info" label="New teammate joined" meta="ada · 14:01" />
            <ActivityRow tone="warning" label="Token usage at 84%" meta="quota · 13:14" />
            <ActivityRow tone="destructive" label="Migration rolled back" meta="orders-api · 12:48" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  badge,
  active,
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly badge?: string;
  readonly active?: boolean;
}) {
  const cls = active
    ? 'flex items-center gap-2 rounded-md bg-primary/10 px-2 py-1.5 text-primary text-sm'
    : 'flex items-center gap-2 rounded-md px-2 py-1.5 text-foreground/80 text-sm hover:bg-accent';
  return (
    <span className={cls}>
      {icon}
      <span className="flex-1">{label}</span>
      {badge && (
        <Badge variant="secondary" className="text-[0.625rem]">
          {badge}
        </Badge>
      )}
    </span>
  );
}

function StatCard({
  label,
  value,
  delta,
  tone,
}: {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly tone: 'success' | 'warning' | 'destructive';
}) {
  const deltaClass = deltaToneClass(tone);
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-1 text-muted-foreground text-xs">{label}</div>
      <div className="font-semibold text-2xl tabular-nums">{value}</div>
      <div className={`text-xs ${deltaClass}`}>{delta}</div>
    </div>
  );
}

function ActivityRow({
  tone,
  label,
  meta,
}: {
  readonly tone: 'success' | 'warning' | 'destructive' | 'info';
  readonly label: string;
  readonly meta: string;
}) {
  const dotClass = activityToneClass(tone);
  return (
    <li className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-accent">
      <span aria-hidden className={`size-2 shrink-0 rounded-full ${dotClass}`} />
      <span className="flex-1">{label}</span>
      <span className="text-muted-foreground text-xs">{meta}</span>
    </li>
  );
}

function deltaToneClass(tone: 'success' | 'warning' | 'destructive'): string {
  if (tone === 'success') return 'text-success';
  if (tone === 'warning') return 'text-warning';
  return 'text-destructive';
}

function activityToneClass(tone: 'success' | 'warning' | 'destructive' | 'info'): string {
  if (tone === 'success') return 'bg-success';
  if (tone === 'warning') return 'bg-warning';
  if (tone === 'destructive') return 'bg-destructive';
  return 'bg-info';
}
