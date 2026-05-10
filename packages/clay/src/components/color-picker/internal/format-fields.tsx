/**
 * Numeric input grid that swaps between HEX, RGB, and HSL. The labels
 * (R / G / B / A, H / S / L / A) are universally-understood color
 * abbreviations; the unit suffix (`°` / `%`) renders inside the input
 * via Clay's `<InputGroupAddon>`.
 */

import { cn } from '../../../primitives/cn';
import { Input } from '../../input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../../input-group';
import {
  type HSL,
  type HSV,
  hexToHsv,
  hexToRgba,
  hslToRgba,
  hsvToRgba,
  rgbaToHex,
  rgbaToHsl,
} from '../color-utils';
import type { Format } from './use-picker-state';

const clamp = (n: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, n));

function clampChannel(n: number, k: 'r' | 'g' | 'b' | 'a'): number {
  if (k === 'a') return clamp(n, 0, 1);
  return clamp(Math.round(n), 0, 255);
}

export function FormatFields({
  format,
  hsv,
  alpha,
  showAlpha,
  onCommit,
}: Readonly<{
  format: Format;
  hsv: HSV;
  alpha: number;
  showAlpha: boolean;
  onCommit: (next: HSV, alpha: number) => void;
}>) {
  const rgba = hsvToRgba(hsv, alpha);
  const hex = rgbaToHex(rgba);
  const hsl = rgbaToHsl(rgba);
  const cols = showAlpha ? 'grid-cols-4' : 'grid-cols-3';

  if (format === 'hex') {
    return (
      <Input
        type="text"
        value={hex}
        spellCheck={false}
        aria-label="Hex value"
        onChange={(e) => {
          const parsed = hexToRgba(e.target.value);
          if (!parsed) return;
          const next = hexToHsv(e.target.value);
          if (next) onCommit(next, showAlpha ? parsed.a : 1);
        }}
        className="h-8 font-mono text-[0.75rem]"
      />
    );
  }

  if (format === 'rgb') {
    const set = (k: 'r' | 'g' | 'b' | 'a', n: number) => {
      const next = { ...rgba, [k]: clampChannel(n, k) };
      const nextHsv = hexToHsv(rgbaToHex({ ...next, a: 1 })) ?? hsv;
      onCommit(nextHsv, next.a);
    };
    return (
      <div className={cn('grid gap-1', cols)}>
        <NumField label="R" value={Math.round(rgba.r)} min={0} max={255} onChange={(n) => set('r', n)} />
        <NumField label="G" value={Math.round(rgba.g)} min={0} max={255} onChange={(n) => set('g', n)} />
        <NumField label="B" value={Math.round(rgba.b)} min={0} max={255} onChange={(n) => set('b', n)} />
        {showAlpha && (
          <NumField label="A" value={Math.round(alpha * 100)} min={0} max={100} suffix="%" onChange={(n) => set('a', n / 100)} />
        )}
      </div>
    );
  }

  // hsl
  const setHsl = (next: HSL) => {
    const rgb = hslToRgba(next, alpha);
    const nextHsv = hexToHsv(rgbaToHex({ ...rgb, a: 1 })) ?? hsv;
    onCommit(nextHsv, alpha);
  };
  return (
    <div className={cn('grid gap-1', cols)}>
      <NumField label="H" value={Math.round(hsl.h)} min={0} max={360} suffix="°" onChange={(n) => setHsl({ ...hsl, h: clamp(n, 0, 360) })} />
      <NumField label="S" value={Math.round(hsl.s)} min={0} max={100} suffix="%" onChange={(n) => setHsl({ ...hsl, s: clamp(n, 0, 100) })} />
      <NumField label="L" value={Math.round(hsl.l)} min={0} max={100} suffix="%" onChange={(n) => setHsl({ ...hsl, l: clamp(n, 0, 100) })} />
      {showAlpha && (
        <NumField label="A" value={Math.round(alpha * 100)} min={0} max={100} suffix="%" onChange={(n) => onCommit(hsv, clamp(n, 0, 100) / 100)} />
      )}
    </div>
  );
}

function NumField({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: Readonly<{
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (n: number) => void;
}>) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="font-mono text-[0.5625rem] text-muted-foreground tracking-widest uppercase">
        {label}
      </span>
      <InputGroup className="h-8">
        <InputGroupInput
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(n);
          }}
          aria-label={label}
          className="font-mono text-[0.6875rem] tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix && (
          <InputGroupAddon align="inline-end" className="font-mono text-[0.5625rem]">
            {suffix}
          </InputGroupAddon>
        )}
      </InputGroup>
    </label>
  );
}
