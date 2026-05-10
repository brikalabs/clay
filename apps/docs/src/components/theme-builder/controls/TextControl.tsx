import { Input } from '@brika/clay/components/input';
import type { TokenControlBaseProps } from './types';

/**
 * Free-text fallback. Used for token types we don't have a richer control
 * for yet (custom enums, line-height as a unitless ratio, etc.).
 */
export function TextControl({
  label,
  value,
  defaultValue,
  isDirty,
  onChange,
  onReset,
}: TokenControlBaseProps) {
  return (
    <div className="flex flex-col gap-1">
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
