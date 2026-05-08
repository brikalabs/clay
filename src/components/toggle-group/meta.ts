/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'toggle-group',
  displayName: 'Toggle Group',
  group: 'Forms',
  description: 'A group of two-state buttons that share variant and size context.',
  accessibility: [
    'Arrow keys navigate between items within the group; Space toggles the focused item.',
    '`type="single"` enforces one active item at a time; `type="multiple"` allows combinations.',
    'Icon-only items require `aria-label` on each `ToggleGroupItem`.',
    'The group wrapper carries `role="group"`, add `aria-label` to describe the group\'s purpose.',
  ],
};
