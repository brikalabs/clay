/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'table',
  displayName: 'Table',
  group: 'Data',
  description: 'Structured tabular data. Compose with TableHeader, TableBody, TableRow, TableCell.',
  accessibility: [
    'Use `<TableCaption>` to describe the table, it becomes the accessible name via `aria-labelledby`.',
    'Sortable column headers should carry `aria-sort="ascending"` or `"descending"`.',
    'Action buttons in cells require `aria-label` that includes the row context (e.g. "Edit Alicia Reyes").',
    'The table responds to standard AT table-navigation keys (e.g. Ctrl+Alt+arrows in screen readers).',
  ],
};
