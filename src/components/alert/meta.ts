/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'alert',
  displayName: 'Alert',
  group: 'Feedback',
  description: 'Banner-style message for status, errors, and notices. Compose <Alert> with <AlertTitle> + <AlertDescription> and optionally <AlertIcon>.',
  accessibility: [
    'Root carries `role="alert"` so live-region announcements fire on mount.',
    '`AlertTitle` and `AlertDescription` are sibling elements, AT reads them as one block.',
    'Icon inside `AlertIcon` is marked `aria-hidden`; the text content carries the meaning.',
  ],
};
