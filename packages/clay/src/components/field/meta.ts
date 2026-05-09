/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'field',
  displayName: 'Field',
  group: 'Forms',
  description:
    'Form-field layout primitive. Standardises the label + control + description + error stack with consistent spacing and ARIA wiring.',
  accessibility: [
    'Always associate `FieldLabel` with its control via `htmlFor` matching the input `id`.',
    'Wire `aria-describedby` on the control to `FieldDescription`/`FieldError` ids when present so assistive tech announces helper and error copy.',
    'Use `FieldSet` + `FieldLegend` (semantic `<fieldset>`/`<legend>`) to group related controls such as radio options.',
    '`FieldError` should set `role="alert"` (default here) so dynamically appearing validation messages are announced.',
  ],
};
