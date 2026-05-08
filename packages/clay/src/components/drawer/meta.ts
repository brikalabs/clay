/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'drawer',
  displayName: 'Drawer',
  group: 'Overlays',
  description: 'A bottom-sheet dialog that slides up from the bottom of the screen, great for mobile-first interactions.',
  externalDocs: [{ label: "Vaul", url: "https://vaul.emilkowal.ski" }],
  accessibility: [
    'Focus is trapped inside the drawer while open.',
    'Escape dismisses the drawer; the drag handle is decorative and keyboard users dismiss with Escape.',
    '`DrawerTitle` is required for an accessible name.',
    'Ensure scrollable content inside the drawer is reachable by keyboard, not only by touch-drag.',
  ],
};
