/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'icon',
  displayName: 'Icon',
  group: 'Primitives',
  description: `Thin wrapper around lucide-react icons that maps a tone prop to Clay's semantic icon-color tokens.`,
  accessibility: [
    `Decorative by default, \`aria-hidden="true"\` is set when no \`aria-label\` is provided.`,
    `Pass \`aria-label\` to make the icon carry standalone meaning (e.g. status indicator).`,
    `Do not use an icon alone as a button label, always pair with \`aria-label\` on the button.`,
  ],
};
