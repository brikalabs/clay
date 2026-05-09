/**
 * Layer-2 tokens for Field.
 *
 * Field is a layout primitive, the geometry token is the vertical gap
 * between the rows (label, control, description, error). Color slots
 * cover the muted helper copy, the destructive error copy, the legend
 * heading inside `FieldSet`, and the optional `FieldSeparator` line.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_1_5 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  geometry: {
    gap: SPACING_1_5,
  },
  slots: {
    'description-color': {
      default: 'var(--muted-foreground)',
      description: 'Text color of the supporting description copy below the control.',
    },
    'error-color': {
      default: 'var(--destructive)',
      description: 'Text color of the validation error message rendered by `FieldError`.',
    },
    'legend-color': {
      default: 'var(--foreground)',
      description: 'Text color of the `FieldLegend` heading inside a `FieldSet`.',
    },
    'separator-color': {
      default: 'var(--border)',
      description: 'Line color of the optional `FieldSeparator` divider.',
    },
  },
});
