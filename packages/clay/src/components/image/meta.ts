/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'image',
  displayName: 'Image',
  group: 'Data',
  badge: 'New',
  description:
    'Compound image component with a skeleton pulse while loading and an `ImageFallback` slot rendered when the source fails, times out, or is absent. A hanging image host still shows the fallback once `timeoutMs` elapses.',
  accessibility: [
    'Always supply a meaningful `alt` text; use `alt=""` only for purely decorative images.',
    'The skeleton overlay is `aria-hidden` so loading state does not pollute the AT tree.',
    'The `ImageFallback` slot is `aria-hidden` by default; add an accessible label when the fallback content conveys meaningful information.',
  ],
};
