/**
 * Layer-2 tokens for EmptyState.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the empty-state surface. Set non-zero for a frosted-glass treatment.',
  },
});
