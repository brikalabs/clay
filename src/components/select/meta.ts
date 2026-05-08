/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'select',
  displayName: 'Select',
  group: 'Forms',
  description: 'Dropdown selection menu. Wraps Radix Select with tokenised styling.',
  accessibility: [
    'Trigger carries `role="combobox"` and `aria-expanded`, no extra markup needed.',
    'Arrow keys navigate options; Home/End jump to first/last; typing ahead filters.',
    'Selected item receives `aria-selected="true"` and a visible check mark.',
    'Disabled items carry `aria-disabled="true"` and are skipped by arrow navigation.',
  ],
};
