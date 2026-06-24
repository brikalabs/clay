/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'rating',
  displayName: 'Rating',
  group: 'Data',
  description: 'Five-star rating display. Renders filled and empty stars proportional to the numeric value.',
  badge: 'New',
  accessibility: [
    'The star row is `aria-hidden="true"` by default; wrap it with a visually-hidden `<span>` carrying the numeric value for screen readers.',
    'Pass `aria-label` on the container when used standalone to convey the rating to assistive technology.',
  ],
};
