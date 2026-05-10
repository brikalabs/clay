/**
 * Unified length control. The slider edits whatever the right-hand
 * dropdown points to:
 *
 *   • A literal unit (px / rem / em) → slider becomes a number; output
 *     is `12rem`.
 *   • A token reference (× var(--spacing), etc.) → slider becomes a
 *     multiplier; output is `calc(var(--spacing) * N)` (or `var(--x)`
 *     when N === 1, to keep emitted CSS minimal).
 *
 * Live commits — every slider tick flows through to onChange. The
 * computed pixel value is shown next to the slider so designers see
 * the actual size whether they're typing literals or scaling tokens.
 */

import { Input } from '@brika/clay/components/input';
import { Slider, SliderValue } from '@brika/clay/components/slider';
import { useEffect, useMemo, useState } from 'react';
import {
  compatibleTokens,
  computePixels,
  parseExpression,
  serialiseExpression,
} from './expression';
import { TokenRefPicker, type RefKey } from './TokenRefPicker';
import type { TokenControlBaseProps } from './types';

interface SliderRange {
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly decimals?: number;
}

/** Slider range when the user is editing a literal (per unit). */
const LITERAL_RANGES: Readonly<Record<string, Readonly<Record<string, SliderRange>>>> = {
  radius: {
    rem: { min: 0, max: 2, step: 0.0625, decimals: 4 },
    px: { min: 0, max: 32, step: 0.5, decimals: 2 },
    em: { min: 0, max: 2, step: 0.0625, decimals: 4 },
  },
  size: {
    rem: { min: 0, max: 4, step: 0.0625, decimals: 4 },
    px: { min: 0, max: 64, step: 0.5, decimals: 2 },
    em: { min: 0, max: 4, step: 0.0625, decimals: 4 },
  },
  'border-width': {
    px: { min: 0, max: 8, step: 0.5, decimals: 2 },
    rem: { min: 0, max: 0.5, step: 0.015625, decimals: 4 },
    em: { min: 0, max: 0.5, step: 0.015625, decimals: 4 },
  },
  'font-size': {
    rem: { min: 0.5, max: 4, step: 0.0625, decimals: 4 },
    px: { min: 8, max: 64, step: 0.5, decimals: 2 },
    em: { min: 0.5, max: 4, step: 0.0625, decimals: 4 },
  },
  'letter-spacing': {
    em: { min: -0.1, max: 0.3, step: 0.005, decimals: 4 },
    rem: { min: -0.1, max: 0.3, step: 0.005, decimals: 4 },
    px: { min: -2, max: 8, step: 0.1, decimals: 2 },
  },
  blur: {
    px: { min: 0, max: 32, step: 1, decimals: 0 },
    rem: { min: 0, max: 2, step: 0.0625, decimals: 4 },
    em: { min: 0, max: 2, step: 0.0625, decimals: 4 },
  },
  'line-height': {
    em: { min: 0.8, max: 2.4, step: 0.05, decimals: 2 },
    rem: { min: 0.8, max: 2.4, step: 0.05, decimals: 2 },
    px: { min: 8, max: 48, step: 1, decimals: 0 },
  },
};

/** Slider range when the user is editing a multiplier on a token reference. */
const MULTIPLIER_RANGE: SliderRange = { min: 0, max: 8, step: 0.05, decimals: 2 };

const PARSE_LITERAL = /^(-?\d+(?:\.\d+)?)\s*(px|rem|em)?$/i;
type LiteralUnit = 'px' | 'rem' | 'em';

interface LiteralValue {
  readonly mode: 'literal';
  readonly amount: number;
  readonly unit: LiteralUnit;
}

interface ReferenceValue {
  readonly mode: 'reference';
  readonly tokenName: string;
  readonly multiplier: number;
}

type ParsedValue = LiteralValue | ReferenceValue | null;

function parseValue(raw: string): ParsedValue {
  const expr = parseExpression(raw);
  if (expr) return { mode: 'reference', tokenName: expr.tokenName, multiplier: expr.multiplier };
  const m = PARSE_LITERAL.exec(raw.trim());
  if (m) {
    const amount = Number.parseFloat(m[1]);
    if (!Number.isNaN(amount)) {
      return { mode: 'literal', amount, unit: (m[2]?.toLowerCase() as LiteralUnit) ?? 'px' };
    }
  }
  return null;
}

function trim(n: number, decimals: number): string {
  return Number.parseFloat(n.toFixed(decimals)).toString();
}

interface LengthControlProps extends TokenControlBaseProps {
  /** Token type, used to pick a sensible slider range. */
  readonly tokenType: string;
}


export function LengthControl({
  label,
  value,
  defaultValue,
  isDirty,
  onChange,
  onReset,
  tokenType,
}: LengthControlProps) {
  const refs = useMemo(() => compatibleTokens(tokenType), [tokenType]);
  const parsed = useMemo(() => parseValue(value), [value]);

  // Live computed pixel value via a hidden DOM probe. Re-runs on
  // value change AND on theme-change so the preview tracks the active
  // theme's `--spacing` / `--radius` / etc.
  const [pixels, setPixels] = useState<number | null>(() => computePixels(value));
  useEffect(() => {
    setPixels(computePixels(value));
    const handler = () => setPixels(computePixels(value));
    window.addEventListener('clay:theme-change', handler);
    return () => window.removeEventListener('clay:theme-change', handler);
  }, [value]);

  const handleRefSelect = (key: RefKey) => {
    if (key.startsWith('unit:')) {
      const unit = key.slice('unit:'.length) as 'px' | 'rem' | 'em';
      // Re-emit the current numeric magnitude in the new unit, or `1`
      // when leaving reference mode without a prior literal.
      const next =
        parsed?.mode === 'literal'
          ? parsed.amount
          : parsed?.mode === 'reference'
          ? parsed.multiplier
          : 1;
      onChange(`${trim(next, 2)}${unit}`);
    } else {
      const tokenName = key.slice('ref:'.length);
      // Default multiplier 1 emits a clean `var(--x)`.
      onChange(serialiseExpression({ tokenName, multiplier: 1 }));
    }
  };

  // Free-text fallback for unrecognised values (`max(...)`, multi-arg).
  if (!parsed) {
    return (
      <div className="flex flex-col gap-1">
        <Header label={label} isDirty={isDirty} onReset={onReset} />
        <div className="flex items-center gap-1.5">
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={defaultValue}
            aria-label={label}
            title={value}
            className="h-7 flex-1 px-2 py-0 font-mono text-[0.6875rem]"
          />
          <TokenRefPicker
            current={null}
            refs={refs}
            tokenType={tokenType}
            onSelect={handleRefSelect}
          />
        </div>
        {pixels !== null && <PixelPreview value={value} pixels={pixels} />}
      </div>
    );
  }

  const inReferenceMode = parsed.mode === 'reference';
  const range = inReferenceMode
    ? MULTIPLIER_RANGE
    : LITERAL_RANGES[tokenType]?.[parsed.unit] ?? LITERAL_RANGES.size.rem;

  const sliderValue = inReferenceMode ? parsed.multiplier : parsed.amount;

  const handleSlider = (next: number) => {
    if (parsed.mode === 'reference') {
      onChange(serialiseExpression({ tokenName: parsed.tokenName, multiplier: next }));
    } else {
      onChange(`${trim(next, range.decimals ?? 2)}${parsed.unit}`);
    }
  };

  const currentRefKey: RefKey = inReferenceMode
    ? `ref:${parsed.tokenName}`
    : `unit:${parsed.unit}`;

  return (
    <div className="flex flex-col gap-1">
      <Header label={label} isDirty={isDirty} onReset={onReset} />
      <div className="flex items-center gap-2">
        <Slider
          value={sliderValue}
          onChange={handleSlider}
          min={range.min}
          max={range.max}
          step={range.step}
          className="flex-1"
        />
        <SliderValue
          value={sliderValue}
          onChange={handleSlider}
          min={range.min}
          max={range.max}
          step={range.step}
          decimals={range.decimals}
          width="w-12"
        />
        <TokenRefPicker
          current={currentRefKey}
          refs={refs}
          tokenType={tokenType}
          onSelect={handleRefSelect}
        />
      </div>
      {pixels !== null && <PixelPreview value={value} pixels={pixels} />}
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
          className="rounded px-1 font-mono text-[0.625rem] text-clay-subtle uppercase tracking-widest hover:text-clay-strong"
        >
          reset
        </button>
      )}
    </div>
  );
}

function PixelPreview({ value, pixels }: { readonly value: string; readonly pixels: number }) {
  // Suppress the "≈ Npx" line for trivial literals where it just echoes the input.
  const trimmed = value.trim();
  if (/^-?\d+(\.\d+)?\s*px$/i.test(trimmed)) return null;
  return (
    <div className="flex items-center gap-1.5 px-0.5 font-mono text-[0.5625rem] text-clay-inactive tabular-nums">
      <span aria-hidden>≈</span>
      <span>{Number.parseFloat(pixels.toFixed(2))}px</span>
    </div>
  );
}
