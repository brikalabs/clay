/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'combobox',
  displayName: 'Combobox',
  group: 'Forms',
  description:
    'Typeahead-search select that pairs a Popover trigger with a Command palette listbox.',
  accessibility: [
    'Trigger button advertises `role="combobox"` and `aria-expanded` so AT users hear the open/closed state.',
    'When no value is selected, the trigger renders the placeholder using the muted-foreground slot for sufficient contrast.',
    'The active selection is announced inside the listbox via a leading check icon, mirrored in the trigger label.',
  ],
};
