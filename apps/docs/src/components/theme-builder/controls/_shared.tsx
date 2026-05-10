/**
 * Bits shared across the token-control family. The header (label +
 * reset button) and the free-text input fallback are identical
 * everywhere a control needs them, so they live here instead of
 * being copy-pasted into every `*Control.tsx`.
 */

import { Input } from '@brika/clay/components/input';
import type { TokenControlBaseProps } from './types';

export function ControlHeader({
  label,
  isDirty,
  onReset,
}: Readonly<{
  label: string;
  isDirty: boolean;
  onReset: () => void;
}>) {
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

/** Free-text input wrapped in the standard control row + header. */
export function TextFallback({
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
    </div>
  );
}
