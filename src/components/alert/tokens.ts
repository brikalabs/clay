/**
 * Layer-2 tokens for Alert.
 */

import { defineComponent } from '../../tokens/define';

export const tokens = defineComponent('alert', {
  radius: {
    default: 'var(--radius-container)',
    description: 'Alert corner radius.',
    alias: 'alert',
  },
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the alert. Set non-zero alongside a translucent `tint-base` (e.g. `transparent`) for a glass variant.',
  },
  slots: {
    'tint-base': {
      default: 'var(--background)',
      description:
        'Base color the per-variant accent is mixed into. Defaults to the page surface for opaque tints; set to `transparent` for translucent / glass variants.',
    },
    'tint-bg-amount': {
      default: '12%',
      description:
        'Accent percentage mixed into the tinted-variant background. Higher values produce more saturated bg fills.',
      type: 'opacity',
    },
    'tint-border-amount': {
      default: '40%',
      description:
        'Accent percentage mixed into the tinted-variant border. Usually higher than the bg amount so the edge stays defined.',
      type: 'opacity',
    },
  },
});
