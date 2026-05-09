/**
 * Layer-2 tokens for Scroll Area.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'thumb-color': {
      default: 'var(--border)',
      description: 'Background color of the draggable scrollbar thumb.',
    },
    'track-color': {
      default: 'transparent',
      description:
        'Border color drawn along the scrollbar track edge that meets the viewport (left edge for vertical, top edge for horizontal). Defaults to transparent so the track blends into the surface behind it.',
    },
    'viewport-ring': {
      default: 'var(--ring)',
      description:
        'Focus ring color drawn around the scroll viewport when keyboard-focused; rendered at 50% opacity.',
    },
  },
});
