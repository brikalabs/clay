/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'label',
  displayName: 'Label',
  group: 'Forms',
  description: `Accessible form label. Wraps Radix Label primitive with tokenised typography.`,
  accessibility: [
    `Renders a \`<label>\` element, clicking it focuses the associated input.`,
    `Always link to the input via \`htmlFor\` matching the input's \`id\`.`,
    `Required-field indicators (* or "required") should be inside the label or referenced via \`aria-describedby\`.`,
    `Disabled labels inherit \`opacity-50\` visually; no ARIA change is needed.`,
  ],
};
