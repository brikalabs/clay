/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'badge',
  displayName: 'Badge',
  group: 'Feedback',
  description: 'Small status descriptor. Use for tags, counts, and inline status.',
  accessibility: [
    'Renders as a `<span>`, purely informational, carries no interactive role.',
    'When used as a link with `asChild`, the accessible name comes from the badge text.',
    'Numeric count badges in tab triggers should be accompanied by a visually hidden description.',
  ],
};
