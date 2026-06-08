/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'file-upload',
  displayName: 'File Upload',
  group: 'Forms',
  description:
    'A button-triggered file picker paired with a list of selected files, each showing its name, size, upload progress, and a remove control.',
  added: '2026-06-08',
  accessibility: [
    'The native file `<input>` is visually hidden but stays in the DOM, so the trigger and assistive tech reach the OS file picker.',
    '`FileUploadTrigger` renders a real `<button>` (or your own element via `asChild`) and forwards focus and keyboard activation.',
    '`FileUploadItemRemove` carries an `aria-label` (defaults to "Remove file") so its purpose is announced.',
    'Progress bars expose `role="progressbar"` with the current value through the underlying Progress primitive.',
  ],
};
