/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'tree',
  displayName: 'Tree',
  group: 'Data',
  description:
    'A hierarchical list for browsing nested data such as file systems, with expandable folders, optional guide lines, lazy-loaded children, and single or multi selection.',
  added: '2026-06-08',
  accessibility: [
    'Root carries `role="tree"`; each node is a `role="treeitem"` with `aria-expanded` on folders and `aria-selected` on selectable nodes.',
    'Nested groups use `role="group"` so assistive tech announces nesting depth.',
    'Arrow keys move between visible nodes; Right/Left expand and collapse folders (or step in and out); Home/End jump to the first and last node.',
    'Enter or Space selects a node; hold Cmd/Ctrl to extend selection when `multiSelect` is enabled.',
    'A node fetching its children (`loading`) carries `aria-busy` while the request is in flight.',
  ],
};
