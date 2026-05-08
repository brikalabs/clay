/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'popover',
  displayName: 'Popover',
  group: 'Overlays',
  description: 'Floating panel anchored to a trigger. Use for menus, info panels, mini-forms.',
  accessibility: [
    'Focus moves into the popover when it opens, Tab navigates within it.',
    'Escape and clicking outside close the popover and return focus to the trigger.',
    'Use `Popover` over `HoverCard` when content must be keyboard-reachable.',
    'The trigger carries `aria-expanded` and `aria-controls` pointing to the panel.',
  ],
};
