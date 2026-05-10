/**
 * Color utilities for the picker. Internally we work in HSV (maps
 * cleanly to a hue × saturation/value pad) plus an alpha channel; the
 * picker normalises to hex on output, emitting `#rrggbb` when alpha is
 * 1 and `#rrggbbaa` otherwise. The free-text field on the trigger
 * preserves whatever format the user typed — the popover only updates
 * the swatch when the value can be parsed.
 *
 * "Special" values (`currentColor`, `transparent`, `inherit`) bypass
 * parsing entirely; the picker exposes them as one-click pills.
 */

export interface RGBA {
  /** 0–255 */
  readonly r: number;
  /** 0–255 */
  readonly g: number;
  /** 0–255 */
  readonly b: number;
  /** 0–1 */
  readonly a: number;
}

export interface HSV {
  /** 0–360 */
  readonly h: number;
  /** 0–100 */
  readonly s: number;
  /** 0–100 */
  readonly v: number;
}

export const SPECIAL_KEYWORDS = ['currentColor', 'transparent', 'inherit'] as const;
export type SpecialKeyword = (typeof SPECIAL_KEYWORDS)[number];

export function isSpecialKeyword(value: string): value is SpecialKeyword {
  const v = value.trim();
  return (SPECIAL_KEYWORDS as readonly string[]).some(
    (k) => k.toLowerCase() === v.toLowerCase()
  );
}

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function isHex(value: string): boolean {
  return HEX_PATTERN.test(value.trim());
}

/**
 * Parse a 3/4/6/8-digit hex string to RGBA. Returns null when the
 * string isn't a valid hex.
 */
export function hexToRgba(value: string): RGBA | null {
  const trimmed = value.trim();
  if (!HEX_PATTERN.test(trimmed)) return null;
  const expanded = expandShortHex(trimmed);
  const r = Number.parseInt(expanded.slice(1, 3), 16);
  const g = Number.parseInt(expanded.slice(3, 5), 16);
  const b = Number.parseInt(expanded.slice(5, 7), 16);
  const a = expanded.length === 9 ? Number.parseInt(expanded.slice(7, 9), 16) / 255 : 1;
  return { r, g, b, a };
}

function expandShortHex(value: string): string {
  if (value.length === 4) {
    // #rgb → #rrggbb
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  if (value.length === 5) {
    // #rgba → #rrggbbaa
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}${value[4]}${value[4]}`;
  }
  return value;
}

const to8 = (n: number) =>
  Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');

/**
 * Serialise RGBA. Drops the alpha byte when the channel is fully
 * opaque so the common case stays as `#rrggbb`.
 */
export function rgbaToHex({ r, g, b, a }: RGBA): string {
  const base = `#${to8(r)}${to8(g)}${to8(b)}`;
  return a >= 1 ? base : `${base}${to8(a * 255)}`;
}

export function rgbaToHsv({ r, g, b }: RGBA): HSV {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rN) h = ((gN - bN) / d) % 6;
    else if (max === gN) h = (bN - rN) / d + 2;
    else h = (rN - gN) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s: s * 100, v: max * 100 };
}

export function hsvToRgba({ h, s, v }: HSV, alpha = 1): RGBA {
  const sN = s / 100;
  const vN = v / 100;
  const c = vN * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vN - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255, a: alpha };
}

export function hexToHsv(hex: string): HSV | null {
  const rgba = hexToRgba(hex);
  return rgba ? rgbaToHsv(rgba) : null;
}

export interface HSL {
  /** 0–360 */
  readonly h: number;
  /** 0–100 */
  readonly s: number;
  /** 0–100 */
  readonly l: number;
}

export function rgbaToHsl({ r, g, b }: RGBA): HSL {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rN) h = (gN - bN) / d + (gN < bN ? 6 : 0);
    else if (max === gN) h = (bN - rN) / d + 2;
    else h = (rN - gN) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgba({ h, s, l }: HSL, alpha = 1): RGBA {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255, a: alpha };
}

/**
 * WCAG relative luminance (sRGB). Inputs in 0–255.
 */
function luminance({ r, g, b }: RGBA): number {
  const channel = (n: number) => {
    const v = n / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * WCAG contrast ratio between two hex colors. Returns null when
 * either value isn't parseable. Alpha is ignored (contrast is computed
 * on the literal RGB channels).
 */
export function contrastRatio(a: string, b: string): number | null {
  const ra = hexToRgba(a);
  const rb = hexToRgba(b);
  if (!ra || !rb) return null;
  const la = luminance(ra);
  const lb = luminance(rb);
  const [bright, dark] = la > lb ? [la, lb] : [lb, la];
  return (bright + 0.05) / (dark + 0.05);
}

interface EyeDropperLike {
  open: () => Promise<{ sRGBHex: string }>;
}
type EyeDropperCtor = new () => EyeDropperLike;
interface WindowWithEyeDropper {
  EyeDropper?: EyeDropperCtor;
}

export function hasEyeDropper(): boolean {
  if (globalThis.window === undefined) return false;
  return (
    typeof (globalThis as unknown as WindowWithEyeDropper).EyeDropper === 'function'
  );
}

export async function pickWithEyeDropper(): Promise<string | null> {
  if (globalThis.window === undefined) return null;
  const Ctor = (globalThis as unknown as WindowWithEyeDropper).EyeDropper;
  if (!Ctor) return null;
  try {
    const dropper = new Ctor();
    const result = await dropper.open();
    return result.sRGBHex;
  } catch {
    return null;
  }
}
