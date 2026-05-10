import { Input } from '@brika/clay/components/input';
import { ControlHeader } from './_shared';
import type { TokenControlBaseProps } from './types';

interface Preset {
  readonly label: string;
  readonly value: string;
}

const PRESETS: readonly Preset[] = [
  { label: 'none', value: 'none' },
  { label: 'sm', value: '0 1px 2px rgba(0, 0, 0, 0.06)' },
  { label: 'md', value: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)' },
  { label: 'lg', value: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)' },
  { label: 'xl', value: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)' },
];

export function ShadowControl({
  label,
  value,
  defaultValue,
  isDirty,
  onChange,
  onReset,
}: TokenControlBaseProps) {
  return (
    <div className="flex flex-col gap-1">
      <ControlHeader label={label} isDirty={isDirty} onReset={onReset} />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={defaultValue}
        aria-label={label}
        className="h-7 px-2 py-0 font-mono text-[0.6875rem]"
      />
      <div className="flex flex-wrap gap-1 pt-0.5">
        {PRESETS.map((preset) => {
          const active = preset.value === value;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.value)}
              aria-pressed={active}
              className={
                active
                  ? 'rounded border border-clay-strong bg-clay-elevated px-1.5 py-0.5 font-mono text-[0.625rem] text-clay-strong'
                  : 'rounded border border-clay-hairline px-1.5 py-0.5 font-mono text-[0.625rem] text-clay-subtle hover:border-clay-default hover:text-clay-strong'
              }
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
