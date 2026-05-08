/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'dialog',
  displayName: 'Dialog',
  group: 'Overlays',
  description: 'Modal dialog. Use for confirmations, forms, and focused tasks.',
  accessibility: [
    'Focus is trapped inside the dialog while open, Tab cycles only through its interactive elements.',
    'Escape and clicking the backdrop close the dialog and return focus to the trigger.',
    '`DialogTitle` is required and becomes the accessible name, use `sr-only` to visually hide it if needed.',
    'Scrollable content should be the scrollable region, not the entire dialog.',
  ],
};
