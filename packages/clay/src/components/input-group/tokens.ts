/**
 * Layer-2 tokens for InputGroup.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the input-group surface. Set non-zero for a frosted-glass treatment.',
  },
});
