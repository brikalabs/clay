/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'carousel',
  displayName: 'Carousel',
  group: 'Layout',
  description: 'A touch-friendly, accessible slideshow for cycling through items, powered by Embla.',
  externalDocs: [{ label: "Embla Carousel", url: "https://www.embla-carousel.com" }],
  accessibility: [
    'Root carries `role="region"` with a label; each slide has `role="group" aria-roledescription="slide"`.',
    'Previous/Next buttons include `sr-only` screen-reader labels.',
    'Left/Right arrow keys navigate slides while focus is inside the carousel.',
    'Autoplay should pause on hover and focus to respect user attention and `prefers-reduced-motion`.',
  ],
};
