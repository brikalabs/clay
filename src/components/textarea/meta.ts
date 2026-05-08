/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'textarea',
  displayName: 'Textarea',
  group: 'Forms',
  description: `Multi-line text input. Auto-resizes if you let it, or clamp via \`rows\`.`,
  accessibility: [
    `Always associate with a \`<Label>\` via matching \`id\` / \`htmlFor\`.`,
    `\`aria-invalid="true"\` triggers the destructive ring; pair with a visible error message via \`aria-describedby\`.`,
    `Disabled textareas are removed from the tab order, use \`readOnly\` when content must stay focusable.`,
    `Character count readouts should be linked via \`aria-describedby\` so AT announces remaining characters.`,
  ],
};
