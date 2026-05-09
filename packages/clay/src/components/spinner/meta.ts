/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'spinner',
  displayName: 'Spinner',
  group: 'Feedback',
  description: 'Inline loading indicator that wraps a spinning lucide icon and inherits the surrounding text color.',
  accessibility: [
    'Decorative spinners must set `aria-hidden="true"` so screen readers skip them, Clay applies this automatically when no `label` is provided.',
    'Spinners that convey loading state should pass a `label`, the wrapper renders `role="status"` with a visually hidden (sr-only) label so AT users hear the state.',
    'When pairing a visible loading text next to the spinner, keep the spinner `aria-hidden` and let the visible text carry the announcement.',
  ],
};
