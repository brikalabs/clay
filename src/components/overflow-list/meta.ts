/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'overflow-list',
  displayName: 'Overflow List',
  group: 'Data',
  description: 'List that adapts to available width by collapsing overflow into a "+N more" indicator.',
  accessibility: [
    'Hidden items remain in the DOM, the indicator communicates the count to all users.',
    'The `activeKey` item is always visible; this preserves context for the current selection.',
    'Consider wrapping the indicator in a `Popover` or `Tooltip` to reveal hidden items on demand.',
  ],
};
