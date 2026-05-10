import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@brika/clay/components/select';
import { Input } from '@brika/clay/components/input';
import type { TokenControlBaseProps } from './types';

interface Option {
  readonly value: string;
  readonly label: string;
}

const EASING_OPTIONS: readonly Option[] = [
  { value: 'linear', label: 'linear' },
  { value: 'ease', label: 'ease' },
  { value: 'ease-in', label: 'ease-in' },
  { value: 'ease-out', label: 'ease-out' },
  { value: 'ease-in-out', label: 'ease-in-out' },
  { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'standard (Material)' },
  { value: 'cubic-bezier(0.16, 1, 0.3, 1)', label: 'expressive (default)' },
  { value: 'cubic-bezier(0.32, 0.72, 0, 1)', label: 'spring' },
];

const FONT_OPTIONS: readonly Option[] = [
  { value: '"Inter", ui-sans-serif, system-ui, sans-serif', label: 'Inter' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
  { value: '"Helvetica Neue", Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, "Iowan Old Style", serif', label: 'Georgia (serif)' },
  { value: '"Instrument Serif", Georgia, serif', label: 'Instrument Serif' },
  { value: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace', label: 'JetBrains Mono' },
  { value: 'ui-monospace, SFMono-Regular, Menlo, monospace', label: 'System Mono' },
];

const BORDER_STYLE_OPTIONS: readonly Option[] = [
  { value: 'solid', label: 'solid' },
  { value: 'dashed', label: 'dashed' },
  { value: 'double', label: 'double' },
  { value: 'dotted', label: 'dotted' },
  { value: 'groove', label: 'groove' },
  { value: 'ridge', label: 'ridge' },
  { value: 'none', label: 'none' },
];

const TEXT_TRANSFORM_OPTIONS: readonly Option[] = [
  { value: 'none', label: 'none' },
  { value: 'uppercase', label: 'uppercase' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'capitalize' },
];

const CORNER_SHAPE_OPTIONS: readonly Option[] = [
  { value: 'round', label: 'round' },
  { value: 'bevel', label: 'bevel' },
  { value: 'squircle', label: 'squircle' },
  { value: 'scoop', label: 'scoop' },
  { value: 'notch', label: 'notch' },
];

const FONT_WEIGHT_OPTIONS: readonly Option[] = [
  { value: '100', label: '100 — Thin' },
  { value: '200', label: '200 — Extra Light' },
  { value: '300', label: '300 — Light' },
  { value: '400', label: '400 — Regular' },
  { value: '500', label: '500 — Medium' },
  { value: '600', label: '600 — Semibold' },
  { value: '700', label: '700 — Bold' },
  { value: '800', label: '800 — Extra Bold' },
  { value: '900', label: '900 — Black' },
];

const OPTIONS_BY_TYPE: Readonly<Record<string, readonly Option[]>> = {
  easing: EASING_OPTIONS,
  'font-family': FONT_OPTIONS,
  'border-style': BORDER_STYLE_OPTIONS,
  'text-transform': TEXT_TRANSFORM_OPTIONS,
  'corner-shape': CORNER_SHAPE_OPTIONS,
  'font-weight': FONT_WEIGHT_OPTIONS,
};

interface SelectControlProps extends TokenControlBaseProps {
  readonly tokenType: string;
}

export function SelectControl({
  label,
  value,
  defaultValue,
  isDirty,
  onChange,
  onReset,
  tokenType,
}: SelectControlProps) {
  const options = OPTIONS_BY_TYPE[tokenType] ?? [];
  const known = options.some((o) => o.value === value);
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
      <div className="flex items-center gap-2">
        {options.length > 0 && (
          <Select value={known ? value : ''} onValueChange={onChange}>
            <SelectTrigger size="sm" className="h-7 flex-1 text-[0.6875rem]">
              <SelectValue placeholder={known ? value : 'Custom value…'} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-[0.6875rem]">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {!known && (
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={defaultValue}
            aria-label={`${label} (custom value)`}
            className="h-7 flex-1 px-2 py-0 font-mono text-[0.6875rem]"
          />
        )}
      </div>
    </div>
  );
}
