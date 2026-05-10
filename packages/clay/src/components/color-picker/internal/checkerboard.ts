/**
 * Checkerboard background used everywhere a translucent value needs to
 * be visible (sat/val pad swatches, alpha track, picker swatch face).
 * Themed via `--color-picker-checker`; falls back to a neutral
 * cardstock so the picker still looks right when registered without
 * Clay theme tokens.
 */

export const CHECKERBOARD =
  'repeating-conic-gradient(var(--color-picker-checker, #d4cec3) 0% 25%, #ffffff 0% 50%) 50% / 8px 8px';

/**
 * Layer a flat color value over the checkerboard. Used for the
 * Save-to-recent face and the recent-strip swatches.
 */
export function checkerboardBg(value: string): string {
  return `linear-gradient(${value}, ${value}), ${CHECKERBOARD}`;
}
