/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'card',
  displayName: 'Card',
  group: 'Layout',
  description: `A surface container that groups related content and actions. Header / title / description / content / footer subcomponents.`,
  accessibility: [
    `Card is a layout container with no implicit role, add \`role="article"\` for standalone content.`,
    `Interactive cards (with the \`interactive\` prop) should also carry \`tabIndex={0}\` and \`onKeyDown\` for keyboard activation.`,
    `Accent color is visual only, convey variant meaning through text or \`aria-label\` as well.`,
  ],
};
