/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'sidebar',
  displayName: 'Sidebar',
  group: 'Navigation',
  description: `App shell sidebar with collapse-to-rail behaviour. Composable navigation.`,
  accessibility: [
    `\`SidebarProvider\` exposes \`collapsed\` state via context, sync \`aria-expanded\` on the toggle button.`,
    `The sidebar should have \`role="navigation"\` or \`role="complementary"\` depending on content.`,
    `Keyboard shortcut (default \`Cmd+B\`) should be announced via \`aria-keyshortcuts\` on the trigger.`,
    `Rail-collapsed state hides labels visually; ensure icon-only items still carry \`aria-label\`.`,
  ],
};
