/**
 * Layer-2 tokens for Sidebar.
 */

import { defineComponent } from '../../tokens/define';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the sidebar surface. Set non-zero for a frosted-glass treatment.',
  },
  slots: {
    width: { default: '16rem', description: 'Sidebar width when expanded.' },
    'width-icon': {
      default: '3rem',
      description: 'Sidebar width when collapsed to icon-only mode.',
    },
    'width-mobile': {
      default: '18rem',
      description: 'Sidebar width when shown as a mobile sheet.',
    },
  },
});
