/**
 * Layer-2 tokens for ClayLogo.
 *
 * Tiles render with `currentColor` so the mark inherits text color via
 * Tailwind utilities. The badge background is the only themable color
 * surface, exposed as a slot so it can be retargeted per theme without
 * touching the SVG.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    bg: {
      default: 'var(--secondary)',
      description:
        'Background color of the rounded badge that wraps the tiles in the `badge` variant. Defaults to the theme `--secondary` so the chip reads as distinct from the page surface.',
    },
  },
});
