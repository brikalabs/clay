import { Chart } from '@brika/clay/components/chart';
import { DAY, generate } from '../chart.demo-data';

const monthly = generate(30, DAY, 4, 22, 0.4);

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/**
 * `xLabel`/`yLabel` add axis titles; tick formatters render dates and currency for a finance-style chart.
 */
export default function ChartLabeledAxesDemo() {
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
