/**
 * Layer-2 tokens for Image.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'skeleton-color': {
      default: 'var(--skeleton-pulse-color, var(--accent))',
      description:
        'Color of the animated skeleton pulse shown while the image loads. Falls back to `--skeleton-pulse-color` so the Image skeleton always matches any standalone Skeleton components in the same theme.',
    },
    'fallback-bg': {
      default: 'var(--muted)',
      description:
        'Background of the container while the image is loading or has errored. Keeps the layout stable and provides a neutral backdrop for the fallback icon.',
    },
    'fallback-icon-color': {
      default: 'var(--muted-foreground)',
      description:
        'Color of the default `ImageOff` icon shown when the source fails and no custom `fallback` is provided.',
    },
  },
});
