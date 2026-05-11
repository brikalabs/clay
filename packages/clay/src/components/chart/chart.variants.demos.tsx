/**
 * Chart variant demos shown in the docs site. Split into three groups
 * by axis system: cartesian (bar, line), circular (pie, donut), and
 * polar (radial, radar). Each group lives in its own demo file under
 * 300 lines; this file just wires them into `defineDemos` so the docs
 * registry sees one barrel.
 */

import { defineDemos } from '../../component-registry';
import {
  ChartBarDemo,
  ChartBarGroupedDemo,
  ChartBarStackedDemo,
  ChartLineMultiDemo,
} from './chart.cartesian.demos';
import { ChartDonutDemo, ChartPieDemo } from './chart.circular.demos';
import { ChartRadarDemo, ChartRadialDemo } from './chart.polar.demos';

export {
  ChartBarDemo,
  ChartBarGroupedDemo,
  ChartBarStackedDemo,
  ChartLineMultiDemo,
} from './chart.cartesian.demos';
export { ChartDonutDemo, ChartPieDemo } from './chart.circular.demos';
export { ChartRadarDemo, ChartRadialDemo } from './chart.polar.demos';

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
