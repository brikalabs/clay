/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'input-group',
  displayName: 'Input Group',
  group: 'Forms',
  description: `Compose an Input with adornments, addon icons, trailing buttons, prefix labels.`,
  accessibility: [
    `Addons are presentational, always pair the group with a \`<Label>\` that describes the full field.`,
    `Icon-only addon buttons require an \`aria-label\`.`,
    `The visible prefix (e.g. "https://") is part of the label context; announce it via \`aria-label\` on the input if needed.`,
  ],
};
