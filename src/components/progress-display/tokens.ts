/**
 * Layer-2 tokens for ProgressDisplay.
 */

import { defineComponent } from '../../tokens/define';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the progress-display log surface. Set non-zero for a frosted-glass treatment.',
  },
});
