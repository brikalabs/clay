/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'command',
  displayName: 'Command',
  group: 'Navigation',
  description: 'A fast, composable command palette with fuzzy search, ideal for keyboard-driven power users.',
  externalDocs: [{ label: "cmdk", url: "https://cmdk.paco.me" }],
  accessibility: [
    'Arrow keys navigate list items; Enter activates the focused item.',
    'The input is always focused while the list is visible, Tab closes the command palette.',
    'Grouped items announce their group heading; `CommandEmpty` is announced when no results match.',
    'Wrap in `CommandDialog` for modal use, adds focus trapping and Escape-to-close.',
  ],
};
