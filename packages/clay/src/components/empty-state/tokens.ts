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
  slots: {
    'icon-bg': {
      default: 'color-mix(in oklch, var(--muted) 50%, transparent)',
      description: 'Background fill of the rounded icon pill above the title.',
    },
    'icon-foreground': {
      default: 'var(--muted-foreground)',
      description: 'Color of the glyph rendered inside the icon pill.',
    },
    'description-foreground': {
      default: 'var(--muted-foreground)',
      description: 'Text color of the supporting description copy below the title.',
    },
  },
});
