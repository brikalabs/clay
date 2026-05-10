/**
 * Designer-grade color picker. Saturation × value pad, hue slider,
 * alpha track with checkerboard, format tabs (hex / rgb / hsl), one-
 * click pills for `currentColor` / `transparent` / `inherit`, recent-
 * colors strip, and live WCAG contrast badges.
 *
 * Built from Clay primitives — every interactive control is a Clay
 * component (`Button`, `ToggleGroup`, `Input`, `InputGroup`), so
 * theming, focus rings, and disabled states match the rest of the
 * library without re-implementing them.
 *
 * Controlled-only. `value` may be:
 *   - any 3 / 4 / 6 / 8-digit hex (alpha handled);
 *   - one of the special CSS keywords `currentColor`, `transparent`,
 *     `inherit` (the picker exposes these as one-click pills and
 *     keeps the visual controls live, so any drag commits a real
 *     color and exits the keyword automatically);
 *   - any other CSS color string the consumer wants to round-trip
 *     (e.g. `oklch(...)`, `rgba(...)`); the picker won't drive its
 *     pad to that value but `onChange` will replace it the moment the
 *     user interacts with a control.
 */

'use client';

import { Pipette, X } from 'lucide-react';
import {
  type ComponentProps,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../primitives/cn';
import { Button } from '../button';
import { Input } from '../input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../input-group';
import { ToggleGroup, ToggleGroupItem } from '../toggle-group';
import {
  type HSL,
  type HSV,
  type RGBA,
  type SpecialKeyword,
  SPECIAL_KEYWORDS,
  contrastRatio,
  hasEyeDropper,
  hexToHsv,
  hexToRgba,
  hslToRgba,
  hsvToRgba,
  isSpecialKeyword,
  pickWithEyeDropper,
  rgbaToHex,
  rgbaToHsl,
} from './color-utils';

const FORMATS = ['hex', 'rgb', 'hsl'] as const;
type Format = (typeof FORMATS)[number];

const DEFAULT_HSV: HSV = { h: 220, s: 70, v: 95 };

export interface ColorPickerProps {
  readonly value: string;
  readonly onChange: (next: string) => void;
  /** Defaults to the full set; pass `[]` to hide the special pills. */
  readonly specialKeywords?: readonly SpecialKeyword[];
  /** Defaults to `true`. Set false for opaque-only pickers. */
  readonly showAlpha?: boolean;
  /** Defaults to `true`. */
  readonly showContrast?: boolean;
  /** Defaults to `true`. Auto-hidden when `window.EyeDropper` is unavailable. */
  readonly showEyedropper?: boolean;
  /** Render an "✕" close button on the right edge of the header. */
  readonly onClose?: () => void;
  /** Recently-picked colors shown beneath the inputs. */
  readonly recentColors?: readonly string[];
  /** Called when the user clicks the swatch to save its value to recents. */
  readonly onAddRecent?: (value: string) => void;
  readonly className?: string;
}

export function ColorPicker({
  value,
  onChange,
  specialKeywords = SPECIAL_KEYWORDS,
  showAlpha = true,
  showContrast = true,
  showEyedropper = true,
  onClose,
  recentColors = [],
  onAddRecent,
  className,
}: ColorPickerProps) {
  const initialRgba = hexToRgba(value) ?? { r: 59, g: 130, b: 246, a: 1 };
  const [hsv, setHsv] = useState<HSV>(hexToHsv(value) ?? DEFAULT_HSV);
  const [alpha, setAlpha] = useState<number>(showAlpha ? initialRgba.a : 1);
  const [format, setFormat] = useState<Format>('hex');

  useEffect(() => {
    const rgba = hexToRgba(value);
    if (!rgba) return;
    const parsed = hexToHsv(value);
    if (parsed) setHsv(parsed);
    setAlpha(showAlpha ? rgba.a : 1);
  }, [value, showAlpha]);

  const commit = useCallback(
    (nextHsv: HSV, nextAlpha: number) => {
      const a = showAlpha ? nextAlpha : 1;
      setHsv(nextHsv);
      setAlpha(a);
      onChange(rgbaToHex(hsvToRgba(nextHsv, a)));
    },
    [onChange, showAlpha]
  );

  const currentHex = useMemo(() => rgbaToHex(hsvToRgba(hsv, alpha)), [hsv, alpha]);
  const activeSpecial = isSpecialKeyword(value)
    ? (value.trim().toLowerCase() as Lowercase<SpecialKeyword>)
    : null;

  const togglePill = (keyword: SpecialKeyword) => {
    if (activeSpecial === keyword.toLowerCase()) {
      // Clicking the active pill restores the hex the visual controls
      // were already showing, so users have a reversible way out.
      onChange(currentHex);
    } else {
      onChange(keyword);
    }
  };

  const handleEyedropper = async () => {
    const picked = await pickWithEyeDropper();
    if (!picked) return;
    const parsed = hexToHsv(picked);
    if (parsed) {
      commit(parsed, 1);
      onAddRecent?.(picked);
    }
  };

  const eyedropperVisible = showEyedropper && hasEyeDropper();
  const headerHasContent =
    specialKeywords.length > 0 || eyedropperVisible || onClose;

  return (
    <div
      data-slot="color-picker"
      aria-label="Color picker"
      className={cn(
        'w-80 overflow-hidden rounded-color-picker border border-color-picker-border bg-color-picker-surface-container text-color-picker-surface-label shadow-color-picker',
        className
      )}
    >
      {headerHasContent && (
        <div className="flex items-center justify-between gap-2 border-color-picker-border border-b bg-card/40 px-3 py-2">
          <div className="flex flex-wrap items-center gap-1">
            {specialKeywords.map((keyword) => (
              <Button
                key={keyword}
                type="button"
                size="sm"
                variant={activeSpecial === keyword.toLowerCase() ? 'default' : 'outline'}
                aria-pressed={activeSpecial === keyword.toLowerCase()}
                onClick={() => togglePill(keyword)}
                className="h-6 rounded-full px-2.5 font-mono text-[0.625rem] tracking-wide"
              >
                {keyword}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {eyedropperVisible && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleEyedropper}
                aria-label="Eyedropper"
                className="aspect-square size-6 shrink-0 rounded-full"
              >
                <Pipette className="size-3" />
              </Button>
            )}
            {onClose && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onClose}
                aria-label="Close"
                className="aspect-square size-6 shrink-0 rounded-full"
              >
                <X className="size-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 p-3">
        <SatValPad
          hue={hsv.h}
          s={hsv.s}
          v={hsv.v}
          onChange={(s, v) => commit({ ...hsv, s, v }, alpha)}
        />
        <HueSlider hue={hsv.h} onChange={(h) => commit({ ...hsv, h }, alpha)} />
      </div>

      {showAlpha && (
        <div className="px-3 pb-3">
          <AlphaSlider hsv={hsv} alpha={alpha} onChange={(a) => commit(hsv, a)} />
        </div>
      )}

      <div className="flex flex-col gap-2 px-3 pb-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => onAddRecent?.(currentHex)}
            disabled={!onAddRecent}
            aria-label="Save to recent"
            className="aspect-square size-9 shrink-0 overflow-hidden p-0"
            style={{ background: checkerboardBg(currentHex) }}
          />
          <ToggleGroup
            type="single"
            value={format}
            onValueChange={(next) => {
              if (next) setFormat(next as Format);
            }}
            className="flex-1"
          >
            {FORMATS.map((f) => (
              <ToggleGroupItem
                key={f}
                value={f}
                size="sm"
                className="flex-1 font-mono text-[0.625rem] tracking-widest uppercase"
              >
                {f}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <FormatFields
          format={format}
          hsv={hsv}
          alpha={alpha}
          showAlpha={showAlpha}
          onCommit={commit}
        />
      </div>

      {recentColors.length > 0 && (
        <div className="flex flex-col gap-1.5 border-color-picker-border border-t px-3 py-2.5">
          <span className="font-mono text-[0.625rem] text-muted-foreground uppercase tracking-widest">
            Recent
          </span>
          <div className="flex flex-wrap gap-1.5">
            {recentColors.slice(0, 12).map((c, i) => (
              <Button
                key={`${c}-${i}`}
                type="button"
                size="icon"
                variant="outline"
                onClick={() => onChange(c)}
                aria-label={`Use ${c}`}
                title={c}
                className="aspect-square size-5 overflow-hidden rounded-full p-0"
                style={{ background: checkerboardBg(c) }}
              />
            ))}
          </div>
        </div>
      )}

      {showContrast && <ContrastRow hex={currentHex} />}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Swatch helper, intended for trigger faces and previews
// ───────────────────────────────────────────────────────────────────────────

export interface ColorPickerSwatchProps extends Omit<ComponentProps<'span'>, 'children'> {
  readonly value: string;
}

/**
 * Paint a CSS color value over a checkerboard so alpha and translucent
 * `var(...)` chains are visible. Renders the literal color when `value`
 * is one of the special keywords (`currentColor` resolves to the
 * surrounding text color, `transparent` shows pure checkerboard,
 * `inherit` resolves wherever inheritance lands). Empty values fall
 * back to a 45° stripe pattern so unset slots are obvious.
 */
export function ColorPickerSwatch({ value, className, style, ...rest }: Readonly<ColorPickerSwatchProps>) {
  const v = value.trim();
  let resolvedStyle: CSSProperties;
  if (v.length === 0) {
    resolvedStyle = {
      background: 'repeating-linear-gradient(45deg, color-mix(in oklch, currentColor 20%, transparent) 0 4px, transparent 4px 8px)',
    };
  } else if (isSpecialKeyword(v) && v.toLowerCase() !== 'transparent') {
    resolvedStyle = { background: v };
  } else {
    resolvedStyle = { background: `linear-gradient(${v}, ${v}), ${CHECKERBOARD}` };
  }
  return (
    <span
      data-slot="color-picker-swatch"
      aria-hidden
      className={cn(
        'inline-block aspect-square size-5 shrink-0 overflow-hidden rounded-control ring-1 ring-color-picker-border',
        className
      )}
      style={{ ...resolvedStyle, ...style }}
      {...rest}
    />
  );
}

// ───────────────────────────────────────────────────────────────────────────
// 2D pad + 1D sliders (own pointer logic; no Clay primitive matches a
// custom 2D / vertical-1D / alpha-track shape)
// ───────────────────────────────────────────────────────────────────────────

function SatValPad({
  hue,
  s,
  v,
  onChange,
}: Readonly<{
  hue: number;
  s: number;
  v: number;
  onChange: (s: number, v: number) => void;
}>) {
  const padRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef(false);

  const update = (clientX: number, clientY: number) => {
    const el = padRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onChange(
      clamp01((clientX - rect.left) / rect.width) * 100,
      (1 - clamp01((clientY - rect.top) / rect.height)) * 100
    );
  };

  const handlers = makePointerHandlers(dragRef, update);

  return (
    <div
      ref={padRef}
      // 2D pad: pointer-only by design — drop `role`/`tabIndex` rather
      // than claim a `role="slider"` contract that ARIA reserves for
      // single-value widgets. Keyboard users edit through the H / S /
      // L / RGB / hex numeric inputs below, which are fully labelled.
      aria-label={`Saturation ${Math.round(s)}%, value ${Math.round(v)}%`}
      {...handlers}
      className="relative h-40 flex-1 cursor-crosshair touch-none rounded-lg ring-1 ring-color-picker-border"
      style={{
        background: `linear-gradient(to top, #000 0%, transparent 100%), linear-gradient(to right, #fff 0%, hsl(${hue}, 100%, 50%) 100%)`,
      }}
    >
      <span
        aria-hidden
        className="-translate-x-1/2 -translate-y-1/2 absolute size-4 rounded-full border-2 border-color-picker-marker shadow-md"
        style={{
          left: `${s}%`,
          top: `${100 - v}%`,
          background: rgbaToHex(hsvToRgba({ h: hue, s, v })),
        }}
      />
    </div>
  );
}

function HueSlider({
  hue,
  onChange,
}: Readonly<{
  hue: number;
  onChange: (h: number) => void;
}>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef(false);

  const update = (_x: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onChange(clamp01((clientY - rect.top) / rect.height) * 360);
  };

  const handlers = makePointerHandlers(dragRef, update);

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hue)}
      tabIndex={0}
      {...handlers}
      className="relative h-40 w-4 cursor-pointer touch-none rounded-full ring-1 ring-color-picker-border"
      style={{
        background:
          'linear-gradient(to bottom, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))',
      }}
    >
      <span
        aria-hidden
        className="-translate-y-1/2 absolute inset-x-[-2px] h-2 rounded-full border-2 border-color-picker-marker shadow"
        style={{ top: `${(hue / 360) * 100}%`, background: `hsl(${hue}, 100%, 50%)` }}
      />
    </div>
  );
}

function AlphaSlider({
  hsv,
  alpha,
  onChange,
}: Readonly<{
  hsv: HSV;
  alpha: number;
  onChange: (a: number) => void;
}>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef(false);

  const update = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onChange(clamp01((clientX - rect.left) / rect.width));
  };

  const handlers = makePointerHandlers(dragRef, (x) => update(x));
  const opaque = rgbaToHex(hsvToRgba(hsv, 1));
  const trackBg = `linear-gradient(to right, ${rgbToCss({
    ...hsvToRgba(hsv),
    a: 0,
  })}, ${opaque}), ${CHECKERBOARD}`;

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Alpha"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(alpha * 100)}
      tabIndex={0}
      {...handlers}
      className="relative h-3 w-full cursor-pointer touch-none rounded-full ring-1 ring-color-picker-border"
      style={{ background: trackBg, backgroundSize: 'auto, 8px 8px' }}
    >
      <span
        aria-hidden
        className="-translate-x-1/2 absolute inset-y-[-2px] w-2 rounded-full border-2 border-color-picker-marker shadow"
        style={{ left: `${alpha * 100}%`, background: rgbaToHex(hsvToRgba(hsv, alpha)) }}
      />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Contrast row
// ───────────────────────────────────────────────────────────────────────────

function ContrastRow({ hex }: Readonly<{ hex: string }>) {
  const onWhite = contrastRatio(hex, '#ffffff');
  const onBlack = contrastRatio(hex, '#000000');
  if (onWhite === null && onBlack === null) return null;
  return (
    <div className="flex items-center justify-between gap-2 border-color-picker-border border-t px-3 py-2 font-mono text-[0.625rem] text-muted-foreground">
      <ContrastBadge label="vs #fff" ratio={onWhite} on="#fff" against={hex} />
      <ContrastBadge label="vs #000" ratio={onBlack} on="#000" against={hex} />
    </div>
  );
}

function ContrastBadge({
  label,
  ratio,
  on,
  against,
}: Readonly<{
  label: string;
  ratio: number | null;
  on: string;
  against: string;
}>) {
  if (ratio === null) return <span className="opacity-40">{label}</span>;
  const verdict = wcagVerdict(ratio);
  return (
    <span className="flex items-center gap-1.5">
      <span
        aria-hidden
        className="grid aspect-square size-4 shrink-0 place-items-center rounded-full ring-1 ring-color-picker-border"
        style={{ background: on, color: against }}
      >
        Aa
      </span>
      <span>
        {label} · {ratio.toFixed(1)} · {verdict}
      </span>
    </span>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Format-specific numeric inputs (use Clay Input + InputGroup so unit
// suffixes render through the same addon machinery as PasswordInput, etc.)
// ───────────────────────────────────────────────────────────────────────────

interface FormatFieldsProps {
  readonly format: Format;
  readonly hsv: HSV;
  readonly alpha: number;
  readonly showAlpha: boolean;
  readonly onCommit: (next: HSV, alpha: number) => void;
}

function FormatFields({ format, hsv, alpha, showAlpha, onCommit }: Readonly<FormatFieldsProps>) {
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
          if (parsed) {
            const next = hexToHsv(e.target.value);
            if (next) onCommit(next, showAlpha ? parsed.a : 1);
          }
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

// ───────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────

const CHECKERBOARD =
  'repeating-conic-gradient(var(--color-picker-checker, #d4cec3) 0% 25%, #ffffff 0% 50%) 50% / 8px 8px';

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function wcagVerdict(ratio: number): string {
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA·lg';
  return '·';
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function clampChannel(n: number, k: 'r' | 'g' | 'b' | 'a'): number {
  if (k === 'a') return clamp(n, 0, 1);
  return clamp(Math.round(n), 0, 255);
}

function rgbToCss({ r, g, b, a }: RGBA): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}

function checkerboardBg(value: string): string {
  return `linear-gradient(${value}, ${value}), ${CHECKERBOARD}`;
}

function makePointerHandlers(
  dragRef: RefObject<boolean>,
  update: (clientX: number, clientY: number) => void
) {
  return {
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
      dragRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      update(e.clientX, e.clientY);
    },
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      update(e.clientX, e.clientY);
    },
    onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => {
      dragRef.current = false;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    },
    onPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => {
      dragRef.current = false;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    },
  };
}
