/**
 * Layer-2 tokens for EmptyState.
 */

import { defineComponent } from '../../tokens/define';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the empty-state surface. Set non-zero for a frosted-glass treatment.',
  },
});
