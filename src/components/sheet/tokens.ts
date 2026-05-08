/**
 * Layer-2 tokens for Sheet.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_4, SPACING_6 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-surface)',
    description: 'Sheet corner radius.',
  },
  shadow: { default: 'var(--shadow-modal)', description: 'Sheet elevation.' },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur applied behind a translucent sheet.',
  },
  geometry: { paddingX: SPACING_6, paddingY: SPACING_6, gap: SPACING_4 },
});
