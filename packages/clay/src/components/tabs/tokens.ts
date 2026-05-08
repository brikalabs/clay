/**
 * Layer-2 tokens for Tabs.
 */

import { defineComponent } from '../../tokens/define';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  radius: { default: 'var(--radius-control)', description: 'Tabs corner radius.', alias: 'tabs' },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the tab pill bar. Set non-zero (with a translucent muted color) for a frosted-glass tab strip.',
  },
  typography: { fontSize: 'var(--text-label-lg)', fontWeight: '500' },
  slots: {
    'trigger-padding-x': {
      default: 'calc(var(--spacing) * 3)',
      description: 'Inline padding inside a tab trigger.',
    },
    'trigger-padding-y': {
      default: 'calc(var(--spacing) * 1.5)',
      description: 'Block padding inside a tab trigger.',
    },
  },
});
