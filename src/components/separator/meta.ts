/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'separator',
  displayName: 'Separator',
  group: 'Layout',
  description: 'Visual or semantic divider between content sections.',
  accessibility: [
    'Renders `<hr>` with `role="separator"`, meaningful to AT when it divides distinct content sections.',
    'Pass `aria-orientation="vertical"` when used as a vertical divider between inline items.',
    'Purely decorative separators should carry `aria-hidden="true"`.',
  ],
};
