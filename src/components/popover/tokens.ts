/**
 * Layer-2 tokens for Popover.
 */

import { defineComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3 } from '../../tokens/spacing';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  radius: {
    default: 'var(--radius-surface)',
    description: 'Popover corner radius.',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'Popover elevation.',
  },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur applied behind a translucent popover.',
  },
  geometry: { paddingX: SPACING_3, paddingY: SPACING_3, gap: SPACING_2 },
});
