/**
 * Layer-2 tokens for ColorPicker. The picker reuses popover-level
 * surface tokens for its panel chrome (it almost always renders
 * inside a popover anyway) and adds slot tokens for the controls
 * specific to the picker, the marker rings on the sat/val pad and
 * sliders, and the checkerboard cell color visible behind alpha.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-surface)',
    description: 'ColorPicker panel corner radius.',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'ColorPicker panel elevation.',
  },
  border: '1px',
  motion: true,
  slots: {
    'pad-radius': {
      default: '0.5rem',
      description:
        'Corner radius of the saturation/value pad. Set to `0` for square / brutalist looks.',
      alias: 'color-picker-pad',
    },
    'track-radius': {
      default: '9999px',
      description:
        'Corner radius of the hue and alpha slider tracks and their markers. Defaults to a full pill; set lower for square / brutalist looks.',
      alias: 'color-picker-track',
    },
    'surface-container': {
      default: 'var(--popover)',
      description: 'Background of the picker panel.',
    },
    'surface-label': {
      default: 'var(--popover-foreground)',
      description: 'Default foreground inside the picker panel.',
    },
    border: {
      default: 'var(--border)',
      description: 'Color of the panel and inner control borders.',
    },
    marker: {
      default: '#ffffff',
      description:
        'Ring color around the sat/val pad cursor and slider thumbs. Defaults to white so the marker is visible over both light and dark colors.',
    },
    checker: {
      default: 'var(--muted)',
      description:
        'Color of the dark cells in the alpha-track checkerboard. The light cells are white.',
    },
  },
});
