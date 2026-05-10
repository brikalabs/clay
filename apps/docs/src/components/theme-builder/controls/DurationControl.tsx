import { Slider, SliderValue } from '@brika/clay/components/slider';
import { Input } from '@brika/clay/components/input';
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

export function DurationControl({
  label,
  value,
  defaultValue,
  isDirty,
  onChange,
  onReset,
}: TokenControlBaseProps) {
  const ms = parseMs(value);
  if (ms === null) {
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
  const set = (next: number) => onChange(`${Math.round(next)}ms`);
  return (
    <div className="flex flex-col gap-1">
      <Header label={label} isDirty={isDirty} onReset={onReset} />
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
