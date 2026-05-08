/**
 * Layer-2 tokens for ProgressDisplay.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the progress-display log surface. Set non-zero for a frosted-glass treatment.',
  },
});
