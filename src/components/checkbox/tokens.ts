/**
 * Layer-2 tokens for Checkbox.
 */

import { registerComponent } from '../../tokens/define';

registerComponent('checkbox', {
  radius: {
    default: 'var(--radius-tight)',
    description: 'Checkbox corner radius.',
  },
  surface: { borderWidth: '1px' },
  slots: {
    size: { default: '1rem', description: 'Checkbox box edge length.' },
  },
});
