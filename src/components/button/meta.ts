/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'button',
  displayName: 'Button',
  group: 'Primitives',
  description: 'The default action affordance, a themed wrapper over the native button with CVA variants and asChild slot projection.',
  accessibility: [
    'Focus ring uses `--ring` token for WCAG contrast.',
    '`disabled` removes pointer events and reduces opacity; it does not set `aria-disabled`.',
    'Icon-only buttons with `size="icon"` REQUIRE an `aria-label`, there is no text fallback.',
    '`asChild` passes all button props, including `role` and `aria-*`, to the child element.',
  ],
};
