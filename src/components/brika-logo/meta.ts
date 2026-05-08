/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'brika-logo',
  displayName: 'Brika Logo',
  group: 'Primitives',
  description: 'Brika brand mark, three stacked bricks. Uses currentColor.',
  accessibility: [
    'Purely decorative, `aria-hidden="true"` is applied automatically.',
    'When used as a link or button, supply `aria-label` on the interactive wrapper.',
  ],
};
