/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'pagination',
  displayName: 'Pagination',
  group: 'Navigation',
  description:
    'Page navigation control with previous/next arrows, numbered page links, and ellipsis truncation.',
  accessibility: [
    'Root renders `<nav aria-label="pagination">`, exposing the control as a navigation landmark.',
    '`PaginationLink` renders `aria-current="page"` when `isActive` is set, so AT announces the current page.',
    '`PaginationPrevious` and `PaginationNext` ship with visible labels plus chevron glyphs marked `aria-hidden`.',
    '`PaginationEllipsis` is `aria-hidden="true"` with an `sr-only` "More pages" fallback for screen readers.',
  ],
};
