import { Slider, SliderValue } from '@brika/clay/components/slider';
import { ControlHeader, TextFallback } from './_shared';
import type { TokenControlBaseProps } from './types';

const PARSE = /^(\d+(?:\.\d+)?)\s*(ms|s)?$/i;

function parseMs(value: string): number | null {
  const m = PARSE.exec(value.trim());
  if (!m) return null;
  const n = Number.parseFloat(m[1]);
  if (Number.isNaN(n)) return null;
  const unit = (m[2] ?? 'ms').toLowerCase();
  return unit === 's' ? n * 1000 : n;
}

export function DurationControl(props: TokenControlBaseProps) {
  const { label, value, isDirty, onChange, onReset } = props;
  const ms = parseMs(value);
  if (ms === null) return <TextFallback {...props} />;
  const set = (next: number) => onChange(`${Math.round(next)}ms`);
  return (
    <div className="flex flex-col gap-1">
      <ControlHeader label={label} isDirty={isDirty} onReset={onReset} />
      <div className="flex items-center gap-2">
        <Slider value={ms} onChange={set} min={0} max={1500} step={10} className="flex-1" />
        <SliderValue
          value={ms}
          onChange={set}
          min={0}
          max={1500}
          step={10}
          unit="ms"
          width="w-14"
          decimals={0}
        />
      </div>
    </div>
  );
}
