/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'progress-display',
  displayName: 'Progress Display',
  group: 'Feedback',
  description: `Composite progress affordance with label, percentage, and bar.`,
  accessibility: [
    `Log entries update via a live region, AT announces new lines as they stream in.`,
    `Error and success states should also be communicated via a \`toast\` or \`alert\` for AT users in background contexts.`,
    `The scrollable log area should be reachable by keyboard when it overflows.`,
  ],
};
