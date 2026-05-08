/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'accordion',
  displayName: 'Accordion',
  group: 'Layout',
  description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
  accessibility: [
    'Triggers carry `aria-expanded` and `aria-controls`, no extra markup needed.',
    'Content panels are hidden from AT via `aria-hidden` when collapsed.',
    '`type="single" collapsible` lets the open item be closed; omit `collapsible` to always keep one open.',
    'Arrow keys and Home/End navigate between triggers when focus is inside the accordion.',
  ],
};
