/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'section-label',
  displayName: 'Section Label',
  group: 'Layout',
  description: 'Small uppercase label that introduces a content block.',
  accessibility: [
    'Renders as `<p>` by default, use `as="h3"` when it semantically introduces a group.',
    'Tone colors are visual only; pair with an icon that has a meaningful `aria-label` when tone conveys status.',
  ],
};
