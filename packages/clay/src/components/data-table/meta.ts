/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'data-table',
  displayName: 'Data Table',
  group: 'Data',
  description:
    'Headless TanStack Table v8 wrapped around Clay\'s `Table` primitives, with sortable headers, optional row selection, and pagination out of the box.',
  externalDocs: [{ label: 'TanStack Table', url: 'https://tanstack.com/table/latest' }],
  accessibility: [
    'Sortable column headers expose the current sort direction via `aria-sort` ("ascending", "descending", or "none").',
    'The sort toggle is rendered as a real `<button>` so it is reachable by keyboard and announces its label to AT.',
    'Selected rows carry `data-state="selected"`; provide an `aria-label` on the row checkbox that names the row.',
    'Use `<TableCaption>` from the underlying `Table` to give the data table an accessible name when needed.',
  ],
};
