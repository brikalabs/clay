/**
 * Chart primitives for the Clay component library. Split into:
 *
 *   - `chart-sparkline.tsx` : the fixed-shape `<Chart />` area chart
 *                             with sparkline / axes mode + tooltip.
 *   - `chart-context.tsx`   : `<ChartContainer>` + `ChartConfig` +
 *                             `useChartContext`.
 *   - `chart-overlays.tsx`  : themed `<ChartTooltipContent />` /
 *                             `<ChartLegendContent />` consumed by
 *                             arbitrary recharts trees.
 *
 * `ChartTooltip` / `ChartLegend` are recharts re-exports kept here so
 * consumers only import once.
 */

export { Chart } from './chart-sparkline';
export {
  type ChartConfig,
  type ChartConfigEntry,
  ChartContainer,
} from './chart-context';
export {
  ChartLegendContent,
  ChartTooltipContent,
} from './chart-overlays';

export { Tooltip as ChartTooltip, Legend as ChartLegend } from 'recharts';
