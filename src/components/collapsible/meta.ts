/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'collapsible',
  displayName: 'Collapsible',
  group: 'Layout',
  description: 'Two-state container that hides or reveals content. Use for FAQs, accordions.',
  accessibility: [
    'Trigger carries `aria-expanded` automatically, no extra markup needed.',
    'Content carries `aria-hidden` when collapsed so AT skips it entirely.',
    'Animate height via CSS `overflow-hidden` + transition, not `display:none`, to preserve AT semantics.',
  ],
};
