/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'avatar',
  displayName: 'Avatar',
  group: 'Data',
  description: 'User avatar with image, fallback initials, and status badge.',
  accessibility: [
    '`AvatarImage` requires an `alt` attribute, use the user\'s name or leave empty (`alt=""`) for decorative use.',
    '`AvatarFallback` is visible only when the image fails or is missing; AT reads the fallback text.',
    'Status badge text should be wrapped in an `aria-label` when it conveys meaning (e.g. "Online").',
  ],
};
