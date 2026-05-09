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
  slots: {
    'surface-container': {
      default: 'var(--foreground)',
      description:
        'Background of the tooltip body. Defaults to the inverted page foreground for the conventional dark-on-light tooltip.',
    },
    'surface-label': {
      default: 'var(--background)',
      description: 'Foreground color of the tooltip body. Defaults to the inverted page background.',
    },
    'arrow-color': {
      default: 'var(--foreground)',
      description:
        'Fill of the small arrow that points from the tooltip body towards the trigger. Override jointly with `surface-container` to keep the arrow flush.',
    },
  },
});
