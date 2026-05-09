/**
 * Layer-2 tokens for BrikaLogo.
 *
 * The `mark` variant inherits color via `currentColor`, so only the
 * boxed `full` lockup exposes themable surfaces, the rounded-rect
 * background and the brick fill on top of it.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'full-bg': {
      default: 'black',
      description:
        'Background color of the rounded-rect chip in the `full` lockup. Defaults to literal `black` to preserve the canonical black-on-white brand mark.',
    },
    'full-fg': {
      default: 'white',
      description:
        'Fill color of the brick shapes in the `full` lockup. Defaults to literal `white` to preserve the canonical black-on-white brand mark.',
    },
  },
});
