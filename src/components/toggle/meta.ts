/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'toggle',
  displayName: 'Toggle',
  group: 'Forms',
  description: 'A two-state button that can be toggled on or off, useful for formatting toolbars.',
  accessibility: [
    'Carries `aria-pressed` automatically, AT announces "pressed" / "not pressed".',
    'Icon-only toggles REQUIRE an `aria-label`, there is no text fallback.',
    'Use `variant="outline"` to make the active state more visually distinct.',
  ],
};
