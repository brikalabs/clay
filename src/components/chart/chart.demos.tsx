import { Chart } from '@brika/clay/components/chart';
import { defineDemos } from '../_registry';

const now = Date.now();
const data = Array.from({ length: 24 }, (_, index) => ({
  ts: now - (23 - index) * 60_000 * 60,
  value: 30 + Math.sin(index / 3) * 18 + index * 1.5,
}));

export function ChartDefaultDemo() {
  return (
    <div style={{ height: 176, width: 360 }}>
      <Chart data={data} />
    </div>
  );
}

export const demoMeta = defineDemos([
  [ChartDefaultDemo, 'Default'],
]);
export const accessibility: readonly string[] = [
  `Charts are visual, provide a \`<caption>\` or adjacent text summary for screen readers.`,
  `Recharts renders an SVG; ensure the wrapper has \`role="img"\` and \`aria-label\` describing the data.`,
  `Tooltips visible on hover are not reliably announced by AT, critical data should also appear in text form.`,
];
