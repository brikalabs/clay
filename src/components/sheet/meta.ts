/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'sheet',
  displayName: 'Sheet',
  group: 'Overlays',
  description: `Side-anchored panel. Use for navigation, filters, or lightweight detail views.`,
  accessibility: [
    `Focus is trapped inside the sheet while open.`,
    `Escape dismisses the sheet and returns focus to the trigger.`,
    `\`SheetTitle\` is required for an accessible name, use \`sr-only\` to visually hide it if the design omits a heading.`,
    `The \`side\` prop ("top", "right", "bottom", "left") does not affect AT semantics.`,
  ],
};
