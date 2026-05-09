/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'kbd',
  displayName: 'Kbd',
  group: 'Primitives',
  description: 'Inline keyboard-shortcut hint rendered as a small monospace pill.',
  accessibility: [
    'Renders a native `<kbd>` so assistive tech announces it as keyboard input.',
    'Use real key names (`Ctrl`, `Shift`, `Enter`) so screen readers spell them sensibly; symbols like `⌘` are visual shorthand and should be paired with text alternatives where possible.',
    '`KbdGroup` wraps a sequence of keys with `role="group"` and an accessible label so the chord is announced as a single shortcut.',
  ],
};
