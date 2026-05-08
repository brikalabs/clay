/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'dropdown-menu',
  displayName: 'Dropdown Menu',
  group: 'Overlays',
  description: 'Floating menu attached to a button trigger.',
  accessibility: [
    'Arrow keys navigate items; Enter/Space activate; Escape closes and returns focus to the trigger.',
    'Checkbox items carry `aria-checked`; radio items carry `aria-checked` within a `role="group"`.',
    '`DropdownMenuShortcut` renders keyboard hints, these are visual only and not announced by AT.',
    'Destructive items should use `variant="destructive"` to make intent clear visually and in context.',
  ],
};
