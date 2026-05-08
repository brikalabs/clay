/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'password-input',
  displayName: 'Password Input',
  group: 'Forms',
  description: 'Input variant for password entry with an eye toggle to reveal characters.',
  accessibility: [
    'The reveal toggle carries `aria-label` that updates between "Show password" and "Hide password".',
    'The underlying input switches between `type="password"` and `type="text"`, AT announces the mode change.',
    '`aria-invalid="true"` triggers the destructive ring; pair with a visible error message.',
    'Autocomplete attributes (`autocomplete="current-password"`) improve password-manager integration.',
  ],
};
