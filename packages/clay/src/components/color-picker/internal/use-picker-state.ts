/**
 * State + commit reducer for the picker. Holds HSV, alpha, and the
 * active numeric format; mirrors `value` back into HSV when the
 * controlled prop changes externally; emits a hex string on every
 * commit so the component stays controlled.
 *
 *   const { hsv, alpha, format, currentHex, commit, setFormat } =
 *     usePickerState({ value, onChange, showAlpha });
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type HSV,
  hexToHsv,
  hexToRgba,
  hsvToRgba,
  rgbaToHex,
} from '../color-utils';

export const FORMATS = ['hex', 'rgb', 'hsl'] as const;
export type Format = (typeof FORMATS)[number];

const DEFAULT_HSV: HSV = { h: 220, s: 70, v: 95 };

export interface UsePickerStateInput {
  readonly value: string;
  readonly onChange: (next: string) => void;
  readonly showAlpha: boolean;
}

export interface UsePickerState {
  readonly hsv: HSV;
  readonly alpha: number;
  readonly format: Format;
  readonly currentHex: string;
  readonly commit: (next: HSV, alpha: number) => void;
  readonly setFormat: (next: Format) => void;
}

export function usePickerState({
  value,
  onChange,
  showAlpha,
}: UsePickerStateInput): UsePickerState {
  const initialRgba = hexToRgba(value) ?? { r: 59, g: 130, b: 246, a: 1 };
  const [hsv, setHsv] = useState<HSV>(hexToHsv(value) ?? DEFAULT_HSV);
  const [alpha, setAlpha] = useState<number>(showAlpha ? initialRgba.a : 1);
  const [format, setFormat] = useState<Format>('hex');
  // Skip re-deriving HSV when the controlled `value` is just our own
  // emission echoing back. The hex round-trip is 8-bit quantized, so
  // many (s, v) pairs collapse to the same hex at corners (e.g. every
  // s at v=0 → #000000); re-parsing would snap the marker away from
  // where the pointer actually is.
  const lastEmittedRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastEmittedRef.current === value) return;
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
      const hex = rgbaToHex(hsvToRgba(nextHsv, a));
      lastEmittedRef.current = hex;
      onChange(hex);
    },
    [onChange, showAlpha]
  );

  const currentHex = useMemo(() => rgbaToHex(hsvToRgba(hsv, alpha)), [hsv, alpha]);

  return { hsv, alpha, format, currentHex, commit, setFormat };
}
