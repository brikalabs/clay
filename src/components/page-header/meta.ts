/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'page-header',
  displayName: 'Page Header',
  group: 'Layout',
  description: `Standard page title block with optional description, count, and action slots.`,
  accessibility: [
    `\`PageHeaderTitle\` renders as \`<h1>\` by default, ensure only one \`<h1>\` per page.`,
    `Action buttons should be descriptive: "New dashboard" not just "New".`,
    `When used with a \`Breadcrumb\`, the breadcrumb provides location context the heading cannot.`,
  ],
};
