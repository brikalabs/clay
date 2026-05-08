/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'navigation-menu',
  displayName: 'Navigation Menu',
  group: 'Navigation',
  description: 'A collection of links for site navigation, with optional flyout panels.',
  accessibility: [
    `Arrow keys move between top-level items; Enter/Space opens flyout panels.`,
    `Active link state is indicated via \`data-active\`; ensure \`aria-current="page"\` is also set for AT.`,
    `Flyout panels are dismissed by moving focus outside or pressing Escape.`,
    `Use \`NavigationMenuLink\` with \`asChild\` for router-link integration.`,
  ],
};
