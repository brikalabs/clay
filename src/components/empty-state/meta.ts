/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'empty-state',
  displayName: 'Empty State',
  group: 'Feedback',
  description: `Friendly placeholder for empty lists or zero-results states.`,
  accessibility: [
    `Icon inside \`EmptyStateIcon\` is \`aria-hidden\`, title and description carry all meaning.`,
    `Action buttons should have descriptive labels matching the specific task ("Clear search", not "Clear").`,
    `Empty states announced as a live region can help AT users know when a list becomes empty dynamically.`,
  ],
};
