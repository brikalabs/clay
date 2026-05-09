/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'date-picker',
  displayName: 'Date Picker',
  group: 'Forms',
  description:
    'Trigger button that opens a popover-anchored calendar for picking a single date or a date range.',
  externalDocs: [
    { label: 'react-day-picker', url: 'https://daypicker.dev/' },
    { label: 'Radix Popover', url: 'https://www.radix-ui.com/primitives/docs/components/popover' },
  ],
  accessibility: [
    'Trigger is a real `<button>` carrying `aria-expanded` and `aria-controls` for the popover.',
    'Calendar inside inherits full keyboard navigation from `react-day-picker` (arrows, Enter/Space, Page Up/Down).',
    'Selecting a date closes the popover and returns focus to the trigger.',
    'Provide an external `aria-label` on the trigger when the formatted date alone does not describe the field.',
  ],
};
