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
    'Star rating that works as both a fractional display and an interactive input. Fractional values (e.g. 3.75) render partial stars with no rounding. Provide `onValueChange` to switch to input mode.',
  badge: 'New',
  accessibility: [
    'Display mode (no `onValueChange`): uses `role="img"` with an `aria-label` defaulting to "Rated {value} out of {max}". Override with the `aria-label` prop.',
    'Interactive mode (`onValueChange` provided): uses `role="slider"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`. The whole row is focusable and responds to ArrowRight/ArrowUp (+step), ArrowLeft/ArrowDown (-step), Home (min), End (max).',
    'Each `<FractionalStar>` is `aria-hidden`; only the container carries the accessible name, avoiding redundant announcements.',
    'Pass `disabled` to render the visual without interaction; the slider role is omitted and opacity is reduced.',
  ],
};
