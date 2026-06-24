/**
 * Layer-2 tokens for Rating.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'filled-color': {
      default: 'var(--warning)',
      description:
        'Fill and stroke color for stars at or below the rounded value. Defaults to `--warning` (amber) so the hue follows the theme without a hard-coded color.',
    },
    'empty-color': {
      default: 'color-mix(in oklch, var(--muted-foreground) 30%, transparent)',
      description:
        'Stroke color for stars above the rounded value. A 30% mix of `--muted-foreground` against transparent gives a faint ghost that reads on both light and dark surfaces.',
    },
  },
});
