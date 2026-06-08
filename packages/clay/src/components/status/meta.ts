/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'status',
  displayName: 'Status',
  group: 'Feedback',
  description:
    'A compact pill that pairs a colored, optionally pulsing dot with a label. Choose a semantic tone (success, warning, info, destructive, or neutral) and supply your own text.',
  added: '2026-06-08',
  accessibility: [
    'The colored dot is `aria-hidden`; the `StatusLabel` text carries the meaning, so state is never conveyed by color alone.',
    'Always provide a `StatusLabel` — color-blind and assistive-tech users rely on the text, not the dot.',
    'For a status that changes at runtime, wrap the pill in a container with `aria-live="polite"` so updates are announced.',
  ],
};
