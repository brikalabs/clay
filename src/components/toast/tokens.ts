/**
 * Layer-2 tokens for Toast.
 */

import { defineComponent } from '../../tokens/define';

export const tokens = defineComponent('toast', {
  radius: {
    default: 'var(--radius-container)',
    description: 'Toast corner radius.',
    alias: 'toast',
  },
  shadow: {
    default: 'var(--shadow-spotlight)',
    description: 'Toast elevation.',
    alias: 'toast',
  },
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur on the toast surface. Set non-zero for a frosted-glass toast.',
  },
});
