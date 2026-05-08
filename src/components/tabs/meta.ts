/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'tabs',
  displayName: 'Tabs',
  group: 'Navigation',
  description: 'Tabbed navigation between related views.',
  accessibility: [
    'Arrow keys navigate between triggers inside the list, Tab moves focus to the active panel.',
    'Active panel carries `aria-labelledby` pointing to its trigger.',
    'Triggers carry `role="tab"` and `aria-selected`; the list carries `role="tablist"`.',
    'Vertical tabs require `orientation="vertical"` so AT uses the correct arrow key direction.',
  ],
};
