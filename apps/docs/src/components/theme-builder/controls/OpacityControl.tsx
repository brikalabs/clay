import { Slider, SliderValue } from '@brika/clay/components/slider';
import { Input } from '@brika/clay/components/input';
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

export function OpacityControl({
  label,
  value,
  defaultValue,
  isDirty,
  onChange,
  onReset,
}: TokenControlBaseProps) {
  const parsed = parseOpacity(value);
  if (parsed === null || parsed < 0 || parsed > 1) {
    return (
      <div className="flex flex-col gap-1">
        <Header label={label} isDirty={isDirty} onReset={onReset} />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={defaultValue}
          aria-label={label}
          className="h-7 px-2 py-0 font-mono text-[0.6875rem]"
        />
      </div>
    );
  }
  const set = (next: number) => onChange(Number(next.toFixed(2)).toString());
  return (
    <div className="flex flex-col gap-1">
      <Header label={label} isDirty={isDirty} onReset={onReset} />
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

function Header({
  label,
  isDirty,
  onReset,
}: {
  readonly label: string;
  readonly isDirty: boolean;
  readonly onReset: () => void;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="font-mono text-[0.6875rem] text-clay-subtle">{label}</span>
      {isDirty && (
        <button
          type="button"
          onClick={onReset}
          className="rounded px-1 font-mono text-[0.625rem] text-clay-subtle uppercase tracking-[0.08em] hover:text-clay-strong"
        >
          reset
        </button>
      )}
    </div>
  );
}
