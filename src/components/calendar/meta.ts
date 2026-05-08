/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'calendar',
  displayName: 'Calendar',
  group: 'Forms',
  description: 'An accessible date picker calendar supporting single, range, and multiple selection modes.',
  externalDocs: [{ label: "react-day-picker", url: "https://daypicker.dev" }],
  accessibility: [
    `Full keyboard navigation: arrow keys move between days, Enter/Space selects, Page Up/Down change months.`,
    `Screen readers announce the selected date and current month context.`,
    `Disabled dates carry \`aria-disabled\` and are skipped by arrow key navigation.`,
    `For range selection, AT announces the start and end dates as they are selected.`,
  ],
};
