import { Chart } from '@brika/clay/components/chart';
import { defineDemos } from '../../component-registry';
import { DAY, generate, HOUR } from './chart.demo-data';

const hourly = generate(24, HOUR, 3, 18, 1.5);
const monthly = generate(30, DAY, 4, 22, 0.4);

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** `showAxes` reveals tick labels on both axes plus a faint grid; tooltip gets a timestamp header. */
export function ChartWithAxesDemo() {
  return (
    <div style={{ height: 280, width: '100%' }}>
      <Chart
        data={hourly}
        color="var(--data-1)"
        showAxes
        formatValue={(v) => `${v.toFixed(0)}`}
      />
    </div>
  );
}

/** `xLabel`/`yLabel` add axis titles; tick formatters render dates and currency for a finance-style chart. */
export function ChartLabeledAxesDemo() {
  const data = monthly.map((d) => ({ ts: d.ts, value: d.value * 1234 }));
  return (
    <div style={{ height: 320, width: '100%' }}>
      <Chart
        data={data}
        color="var(--data-2)"
        showAxes
        xLabel="Date"
        yLabel="Revenue (USD)"
        formatValue={(v) => currency.format(v)}
        formatX={(ts) =>
          new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }
      />
    </div>
  );
}

export const demoMeta = defineDemos([
  [ChartWithAxesDemo, 'With Axes', { description: '`showAxes` reveals tick labels on both axes plus a faint grid; tooltip gets a timestamp header.' }],
  [ChartLabeledAxesDemo, 'Labeled Axes', { description: '`xLabel`/`yLabel` add axis titles; tick formatters render dates and currency for a finance-style chart.' }],
]);
