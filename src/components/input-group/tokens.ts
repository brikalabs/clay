/**
 * Layer-2 tokens for InputGroup.
 */

import { defineComponent } from '../../tokens/define';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the input-group surface. Set non-zero for a frosted-glass treatment.',
  },
});
