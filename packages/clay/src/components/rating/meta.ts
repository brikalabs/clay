/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'rating',
  displayName: 'Rating',
  group: 'Data',
  description:
    'Star rating that works as both a fractional display and an interactive input. Fractional values (e.g. 3.75) render partial stars with no rounding. Provide `onValueChange` or `defaultValue` to switch to interactive input mode.',
  badge: 'New',
  accessibility: [
    'Display mode (no handler / `readOnly` set): uses `role="img"` with an `aria-label` defaulting to "Rated {value} out of {max}". Override with the `aria-label` prop.',
    'Interactive mode: uses `role="radiogroup"` on the row; each star is a `<button role="radio">` with `aria-checked` and `aria-label` ("N out of max"). The committed star (or star 1 when unset) is the roving tab stop.',
    'Keyboard in interactive mode: ArrowRight/ArrowUp moves to the next star and commits it; ArrowLeft/ArrowDown moves to the previous star and commits it.',
    'Each `<FractionalStar>` is `aria-hidden`; only the button label carries the accessible name.',
    'Pass `disabled` to render the visual without interaction; buttons are absent and opacity is reduced.',
  ],
};
