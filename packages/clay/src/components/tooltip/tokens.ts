/**
 * Layer-2 tokens for Tooltip.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_1, SPACING_2 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Tooltip corner radius.',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'Tooltip elevation.',
  },
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur on the tooltip. Set non-zero for a frosted-glass tooltip.',
  },
  border: true,
  motion: true,
  geometry: { paddingX: SPACING_2, paddingY: SPACING_1 },
  typography: { fontSize: 'var(--text-label-md)', fontWeight: '500' },
});
