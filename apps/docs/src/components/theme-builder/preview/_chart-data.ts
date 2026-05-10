/**
 * Synthetic time-series generator used by the dashboard / kitchen-sink
 * preview scenes for their hero charts. Two scenes were each carrying
 * a copy; centralising it keeps SonarCloud's duplicated-lines metric
 * happy and gives us one place to tune the curve shape.
 */

export interface ChartPoint {
  readonly ts: number;
  readonly value: number;
}

export function makeChartData(seed: number): ChartPoint[] {
  const out: ChartPoint[] = [];
  const start = Date.now() - 24 * 60 * 60 * 1000;
  let v = 50;
  for (let i = 0; i < 32; i++) {
    v += (Math.sin(seed + i / 3) + Math.cos(seed * 0.7 + i / 5)) * 6;
    out.push({ ts: start + i * 45 * 60 * 1000, value: Math.max(10, v) });
  }
  return out;
}
