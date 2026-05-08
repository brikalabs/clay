/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'scroll-area',
  displayName: 'Scroll Area',
  group: 'Layout',
  description: 'Container with custom scrollbars. Use to constrain a tall list inside a card.',
  accessibility: [
    'The scrollable region carries `role="region"`, pair with `aria-label` for context.',
    'Custom scrollbars do not affect keyboard scrolling, arrow keys and Page Up/Down work normally.',
    'Horizontal scroll areas should be announced; users may not expect horizontal scrolling.',
  ],
};
