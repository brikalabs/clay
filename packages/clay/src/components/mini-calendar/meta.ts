/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'mini-calendar',
  displayName: 'Mini Calendar',
  group: 'Forms',
  description:
    'A compact horizontal strip of selectable days with previous/next navigation — a space-efficient date picker for toolbars, popovers, and inline forms.',
  added: '2026-06-08',
  externalDocs: [
    {
      label: 'Intl.DateTimeFormat',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat',
    },
  ],
  accessibility: [
    'The strip is wrapped in `role="group"` with an `aria-label` so assistive tech announces it as a single date picker.',
    'Day cells are real `<button>`s — keyboard-focusable, with Enter/Space activating selection.',
    'Each day carries `aria-pressed` and a localized `aria-label` (e.g. "Monday, June 8, 2026"); nav buttons are labelled "Previous days" / "Next days".',
    'Weekday and day labels are formatted with `Intl.DateTimeFormat`, so a `locale` prop localizes the visible text for assistive tech too.',
  ],
};
