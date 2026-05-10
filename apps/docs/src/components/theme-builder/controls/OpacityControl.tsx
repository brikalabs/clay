import { Slider, SliderValue } from '@brika/clay/components/slider';
import { ControlHeader, TextFallback } from './_shared';
import type { TokenControlBaseProps } from './types';

function parseOpacity(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed.endsWith('%')) {
    const n = Number.parseFloat(trimmed.slice(0, -1));
    if (Number.isNaN(n)) return null;
    return n / 100;
  }
  const n = Number.parseFloat(trimmed);
  if (Number.isNaN(n)) return null;
  return n;
}

export function OpacityControl(props: TokenControlBaseProps) {
  const { label, value, isDirty, onChange, onReset } = props;
  const parsed = parseOpacity(value);
  if (parsed === null || parsed < 0 || parsed > 1) return <TextFallback {...props} />;
  const set = (next: number) => onChange(Number(next.toFixed(2)).toString());
  return (
    <div className="flex flex-col gap-1">
      <ControlHeader label={label} isDirty={isDirty} onReset={onReset} />
      <div className="flex items-center gap-2">
        <Slider value={parsed} onChange={set} min={0} max={1} step={0.01} className="flex-1" />
        <SliderValue
          value={parsed}
          onChange={set}
          min={0}
          max={1}
          step={0.01}
          decimals={2}
          width="w-12"
        />
      </div>
    </div>
  );
}
