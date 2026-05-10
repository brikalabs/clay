/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts) lives here so
 * consumers can read it without pulling in React, icons, or the demo
 * helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'color-picker',
  displayName: 'ColorPicker',
  group: 'Forms',
  description:
    'Designer-grade color picker. Saturation × value pad, hue slider, alpha track with checkerboard, format tabs (hex / rgb / hsl), one-click pills for `currentColor` / `transparent` / `inherit`, recent-colors strip, and live WCAG contrast badges. Controlled — emits a CSS color string (`#rrggbb`, `#rrggbbaa`, or one of the special keywords).',
  accessibility: [
    'The saturation/value pad and hue slider expose `role="slider"` with `aria-valuetext` so screen readers announce the current position; both also accept arrow-key navigation.',
    'Each numeric input field is labelled (R / G / B / A or H / S / L / A) and reflects the current value; editing one commits to the same color and updates the others.',
    'Eyedropper is hidden when `window.EyeDropper` is unavailable; consumers should not assume it is always present.',
  ],
};
