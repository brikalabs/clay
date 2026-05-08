/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'aspect-ratio',
  displayName: 'Aspect Ratio',
  group: 'Layout',
  description: 'Displays content within a desired ratio, useful for responsive images, videos, and embeds.',
  accessibility: [
    `The container is purely presentational, no ARIA role or keyboard behavior.`,
    `Content placed inside inherits normal focus order; ensure images carry meaningful \`alt\` text.`,
  ],
};
