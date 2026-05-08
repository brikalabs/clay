/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'context-menu',
  displayName: 'Context Menu',
  group: 'Navigation',
  description: 'Displays a menu to the user, opened on right-click or a long press.',
  accessibility: [
    'Trigger carries `aria-haspopup="menu"` automatically.',
    'Keyboard: Shift+F10 or the context-menu key opens the menu on the focused trigger.',
    'Arrow keys navigate items; Enter/Space activate; Escape dismisses.',
    'Destructive items should use `variant="destructive"` so the visual indication matches AT context.',
  ],
};
