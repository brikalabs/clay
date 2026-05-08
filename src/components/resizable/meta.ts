/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'resizable',
  displayName: 'Resizable',
  group: 'Layout',
  description: 'Drag-to-resize panel groups for building split-pane layouts, powered by react-resizable-panels.',
  externalDocs: [{ label: "react-resizable-panels", url: "https://react-resizable-panels.vercel.app" }],
  accessibility: [
    `The resize handle carries \`role="separator"\` and responds to arrow keys for keyboard resizing.`,
    `\`withHandle\` renders a visible grip icon, improving discoverability of the resize affordance.`,
    `Ensure panels have meaningful \`aria-label\` values when used as distinct content regions.`,
  ],
};
