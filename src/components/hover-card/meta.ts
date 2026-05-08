/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'hover-card',
  displayName: 'Hover Card',
  group: 'Overlays',
  description: 'A floating card that appears on hover, useful for previewing linked content.',
  accessibility: [
    'Content opens on hover AND focus, keyboard users can trigger it via Tab.',
    'Not suitable for content that must be permanently reachable, use `Popover` for interactive content.',
    'Ensure the trigger is keyboard-focusable; an `asChild` link or button works well.',
  ],
};
