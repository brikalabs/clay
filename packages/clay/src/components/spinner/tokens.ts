/**
 * Layer-2 tokens for Spinner. The `color` slot defaults to
 * `currentColor` so the spinner inherits the surrounding text color
 * out of the box, themes can pin a specific color when they want a
 * fixed accent. The `size` slot exposes the default 1rem dimension so
 * themes can grow or shrink the baseline without forking variants.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    color: {
      default: 'currentColor',
      description: 'Spinner stroke color, defaults to `currentColor` so it inherits text color.',
    },
    size: {
      default: '1rem',
      description: 'Default spinner dimension (width and height) for the `default` size variant.',
    },
  },
});
