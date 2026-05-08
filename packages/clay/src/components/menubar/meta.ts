/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'menubar',
  displayName: 'Menubar',
  group: 'Navigation',
  description: 'A horizontal menu bar offering access to application commands via dropdown menus.',
  accessibility: [
    'Arrow keys navigate between top-level triggers; Enter/Space opens the dropdown.',
    'Escape closes the open dropdown; Tab moves focus outside the menubar entirely.',
    'Each `MenubarMenu` is a `role="menu"` with its trigger as `role="menuitem"`.',
    'Keyboard shortcuts shown in items are visual only, implement the actual shortcuts separately.',
  ],
};
