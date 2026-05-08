/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'chart',
  displayName: 'Chart',
  group: 'Data',
  description: 'Recharts wrapper that consumes the theme `--data-*` palette.',
  externalDocs: [{ label: "Recharts", url: "https://recharts.org/en-US/" }],
  accessibility: [
    'Charts are visual, provide a `<caption>` or adjacent text summary for screen readers.',
    'Recharts renders an SVG; ensure the wrapper has `role="img"` and `aria-label` describing the data.',
    'Tooltips visible on hover are not reliably announced by AT, critical data should also appear in text form.',
  ],
};
