/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'breadcrumb',
  displayName: 'Breadcrumb',
  group: 'Navigation',
  description: 'Hierarchical location indicator with separators.',
  accessibility: [
    'Root renders `<nav aria-label="breadcrumb">`, no extra landmark markup needed.',
    '`BreadcrumbPage` renders `aria-current="page"` on the last item.',
    '`BreadcrumbEllipsis` is `aria-hidden="true"`, AT skips the visual indicator.',
    'Separator elements are presentational; AT does not read them.',
  ],
};
