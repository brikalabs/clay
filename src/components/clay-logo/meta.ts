/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'clay-logo',
  displayName: 'Clay Logo',
  group: 'Primitives',
  description: 'Clay brand mark, three rounded tiles in an optional badge. Tiles use currentColor; badge bg overridable via --clay-logo-bg.',
  accessibility: [
    'Purely decorative, `aria-hidden="true"` is applied automatically.',
    'When used inside a link or button, supply `aria-label` on the interactive wrapper.',
  ],
};
