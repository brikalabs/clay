/**
 * Checkerboard background used everywhere a translucent value needs to
 * be visible (sat/val pad swatches, alpha track, picker swatch face).
 * Themed via `--color-picker-checker`; falls back to a neutral
 * cardstock so the picker still looks right when registered without
 * Clay theme tokens.
 *
 * Split into image + size so callers can compose layered backgrounds
 * with `backgroundImage` / `backgroundSize` longhands — mixing a
 * shorthand `background:` with a separate `backgroundSize` triggers
 * React's "conflicting properties" warning at re-render time.
 */

export const CHECKERBOARD_IMAGE =
  'repeating-conic-gradient(var(--color-picker-checker, #d4cec3) 0% 25%, #ffffff 0% 50%)';

export const CHECKERBOARD_SIZE = '8px 8px';

/**
 * Layered backgroundImage + matching backgroundSize for showing a flat
 * value over the checkerboard. Used for the Save-to-recent face and
 * the recent-strip swatches.
 */
export function checkerboardBg(value: string): {
  backgroundImage: string;
  backgroundSize: string;
} {
  return {
    backgroundImage: `linear-gradient(${value}, ${value}), ${CHECKERBOARD_IMAGE}`,
    backgroundSize: `auto, ${CHECKERBOARD_SIZE}`,
  };
}
