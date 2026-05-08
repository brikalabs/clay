/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'progress',
  displayName: 'Progress',
  group: 'Feedback',
  description: 'Linear determinate progress bar. Pass `value` 0 to 100.',
  accessibility: [
    'Carries `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` automatically.',
    'Pair with a visible label or `aria-label` so AT announces what is progressing.',
    'Indeterminate state should also carry an accessible description explaining the uncertainty.',
  ],
};
