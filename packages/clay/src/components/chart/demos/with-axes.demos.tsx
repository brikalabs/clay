import { Chart } from '@brika/clay/components/chart';
import { generate, HOUR } from '../chart.demo-data';

const hourly = generate(24, HOUR, 3, 18, 1.5);

/** `showAxes` reveals tick labels on both axes plus a faint grid; tooltip gets a timestamp header. */
export default function ChartWithAxesDemo() {
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
