/**
 * Layer-2 tokens for Select.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Select trigger corner radius.',
  },
  surface: { borderWidth: '1px' },
  geometry: { height: '2.25rem', paddingX: SPACING_3, paddingY: SPACING_2, gap: SPACING_2 },
  typography: { fontSize: 'var(--text-body-md)' },
});
