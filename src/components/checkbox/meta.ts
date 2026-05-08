/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'checkbox',
  displayName: 'Checkbox',
  group: 'Forms',
  description: 'Binary toggle with checked / unchecked / indeterminate states. Built on Radix Checkbox.',
  accessibility: [
    'Built on Radix Checkbox, keyboard, focus, and ARIA state (`aria-checked`) are handled automatically.',
    'Indeterminate state surfaces as `checked="indeterminate"`; AT announces "mixed".',
    'Always pair with a visible label, wrap in `<label>` or use matching `htmlFor` / `id`.',
    'Disabled checkboxes are removed from the tab order.',
  ],
};
