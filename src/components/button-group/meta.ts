/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'button-group',
  displayName: 'Button Group',
  group: 'Primitives',
  description: `Visually-joined cluster of buttons sharing borders.`,
  accessibility: [
    `The wrapper carries \`role="group"\`, add \`aria-label\` when the group's purpose is not clear from context.`,
    `Each button inside the group keeps its individual focus ring and keyboard behavior.`,
    `Icon-only buttons inside the group still require \`aria-label\`.`,
  ],
};
