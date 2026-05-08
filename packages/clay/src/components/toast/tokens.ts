/**
 * Layer-2 tokens for Toast.
 */

import { registerComponent } from '../../tokens/define';

registerComponent('toast', {
  radius: {
    default: 'var(--radius-container)',
    description: 'Toast corner radius.',
  },
  shadow: {
    default: 'var(--shadow-spotlight)',
    description: 'Toast elevation.',
  },
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur on the toast surface. Set non-zero for a frosted-glass toast.',
  },
});
