/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'radio-group',
  displayName: 'Radio Group',
  group: 'Forms',
  description: 'A set of mutually exclusive radio buttons where only one can be selected at a time.',
  accessibility: [
    `Arrow keys move selection within the group, Tab leaves the group entirely.`,
    `Always pair items with visible \`<Label htmlFor={id}>\` elements.`,
    `Disabled individual items carry \`aria-disabled\` and are skipped by arrow keys.`,
    `Use \`defaultValue\` for uncontrolled initial selection; \`value\` + \`onValueChange\` for controlled.`,
  ],
};
