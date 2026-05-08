/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'section',
  displayName: 'Section',
  group: 'Layout',
  description: `Standard section block, heading, description, and content area.`,
  accessibility: [
    `\`SectionTitle\` renders as \`<h2>\` by default, adjust via the \`as\` prop to maintain heading hierarchy.`,
    `Actions in the header slot should have descriptive labels matching the operation.`,
  ],
};
