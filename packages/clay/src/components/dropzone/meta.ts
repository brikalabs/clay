/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'dropzone',
  displayName: 'Dropzone',
  group: 'Forms',
  description:
    'A drag-and-drop file surface that also opens the native picker on click, with a dashed border that highlights while a file is dragged over it.',
  added: '2026-06-08',
  accessibility: [
    'The surface is a `role="button"` with `tabIndex={0}`; Enter or Space opens the OS file picker.',
    'A visually hidden native `<input type="file">` performs the actual selection so keyboard and assistive-tech users are never blocked.',
    'The drag-over highlight is driven by a `data-drag-active` attribute, decorative state that does not change the accessible name.',
    'Pass an `aria-label` (or include a `DropzoneTitle`) so the purpose of the surface is announced.',
  ],
};
