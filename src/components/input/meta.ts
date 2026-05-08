/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'input',
  displayName: 'Input',
  group: 'Forms',
  description: 'A themed single-line text input. Thin wrapper over the native input with tokenised styling, focus ring, and aria-invalid handling.',
  accessibility: [
    'Always pair with a `<Label>` via matching `id` / `htmlFor`, never rely on `placeholder` as a label.',
    '`aria-invalid="true"` applies the destructive ring; pair with a visible error message linked via `aria-describedby`.',
    'Disabled inputs are removed from the tab order; use `readOnly` when the content must stay focusable.',
    'File inputs announce "Browse…" or similar on activation, ensure the label describes what to select.',
  ],
};
