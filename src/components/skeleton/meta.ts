/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'skeleton',
  displayName: 'Skeleton',
  group: 'Feedback',
  description: 'Loading placeholder with subtle shimmer. Match the rough size of incoming content.',
  accessibility: [
    'Mark skeleton containers with `aria-hidden="true"` and `aria-busy="true"` on the parent.',
    'When content loads, remove the busy state and announce the result via a live region.',
    'Do not use `Skeleton` inside elements that carry interactive roles.',
  ],
};
