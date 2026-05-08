/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'switch',
  displayName: 'Switch',
  group: 'Forms',
  description: 'Two-state toggle. Use for on/off settings; prefer Checkbox for multi-select forms.',
  accessibility: [
    'Carries `role="switch"` with `aria-checked`, AT announces "on" / "off" state.',
    'Pair with a `<Label>`, clicking the label also toggles the switch.',
    'Disabled switches carry `aria-disabled` and are removed from the tab order.',
    'Use `Switch` for binary on/off settings; use `Checkbox` for multi-select form fields.',
  ],
};
