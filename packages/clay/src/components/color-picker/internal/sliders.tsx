/**
 * The three pointer-driven controls — 2D saturation/value pad, vertical
 * hue slider, horizontal alpha track. They share the
 * `usePointerDrag` handlers and a checkerboard background helper, so
 * each renders in ~25 lines of JSX.
 */

import { type HSV, type RGBA, hsvToRgba, rgbaToHex } from '../color-utils';
import { CHECKERBOARD_IMAGE, CHECKERBOARD_SIZE } from './checkerboard';
import { usePointerDrag } from './use-pointer-drag';
import { useRef } from 'react';

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

function rgbaToCss({ r, g, b, a }: RGBA): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}

export function SatValPad({
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
  const ref = useRef<HTMLDivElement | null>(null);
  const { handlers } = usePointerDrag(({ x, y }) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onChange(
      clamp01((x - rect.left) / rect.width) * 100,
      (1 - clamp01((y - rect.top) / rect.height)) * 100
    );
  });

  return (
    <div
      ref={ref}
      // 2D pad: pointer-only by design — drop `role`/`tabIndex` rather
      // than claim a `role="slider"` contract that ARIA reserves for
      // single-value widgets. Keyboard users edit through the H / S /
      // L / RGB / hex numeric inputs below.
      aria-label={`Saturation ${Math.round(s)}%, value ${Math.round(v)}%`}
      {...handlers}
      className="relative h-40 flex-1 cursor-crosshair touch-none rounded-color-picker-pad ring-1 ring-color-picker-border"
      style={{
        background: `linear-gradient(to top, #000 0%, transparent 100%), linear-gradient(to right, #fff 0%, hsl(${hue}, 100%, 50%) 100%)`,
      }}
    >
      <span
        aria-hidden
        className="-translate-x-1/2 -translate-y-1/2 absolute size-4 rounded-color-picker-track border-2 border-color-picker-marker shadow-md"
        style={{
          left: `${s}%`,
          top: `${100 - v}%`,
          background: rgbaToHex(hsvToRgba({ h: hue, s, v })),
        }}
      />
    </div>
  );
}

export function HueSlider({
  hue,
  onChange,
}: Readonly<{ hue: number; onChange: (h: number) => void }>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { handlers } = usePointerDrag(({ y }) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onChange(clamp01((y - rect.top) / rect.height) * 360);
  });

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
      className="relative h-40 w-4 cursor-pointer touch-none rounded-color-picker-track ring-1 ring-color-picker-border"
      style={{
        background:
          'linear-gradient(to bottom, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))',
      }}
    >
      <span
        aria-hidden
        className="-translate-y-1/2 absolute inset-x-[-2px] h-2 rounded-color-picker-track border-2 border-color-picker-marker shadow"
        style={{ top: `${(hue / 360) * 100}%`, background: `hsl(${hue}, 100%, 50%)` }}
      />
    </div>
  );
}

export function AlphaSlider({
  hsv,
  alpha,
  onChange,
}: Readonly<{ hsv: HSV; alpha: number; onChange: (a: number) => void }>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { handlers } = usePointerDrag(({ x }) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onChange(clamp01((x - rect.left) / rect.width));
  });

  const opaque = rgbaToHex(hsvToRgba(hsv, 1));
  const trackBg = `linear-gradient(to right, ${rgbaToCss({
    ...hsvToRgba(hsv),
    a: 0,
  })}, ${opaque}), ${CHECKERBOARD_IMAGE}`;

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
      className="relative h-3 w-full cursor-pointer touch-none rounded-color-picker-track ring-1 ring-color-picker-border"
      style={{ backgroundImage: trackBg, backgroundSize: `auto, ${CHECKERBOARD_SIZE}` }}
    >
      <span
        aria-hidden
        className="-translate-x-1/2 absolute inset-y-[-2px] w-2 rounded-color-picker-track border-2 border-color-picker-marker shadow"
        style={{ left: `${alpha * 100}%`, background: rgbaToHex(hsvToRgba(hsv, alpha)) }}
      />
    </div>
  );
}
