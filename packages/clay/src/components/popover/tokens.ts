/**
 * Layer-2 tokens for Popover.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-surface)',
    description: 'Popover corner radius.',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'Popover elevation.',
  },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur applied behind a translucent popover.',
  },
  geometry: { paddingX: SPACING_3, paddingY: SPACING_3, gap: SPACING_2 },
  slots: {
    'surface-container': {
      default: 'var(--popover)',
      description: 'Background of the popover surface.',
    },
    'surface-label': {
      default: 'var(--popover-foreground)',
      description: 'Default foreground color inside the popover surface.',
    },
    'description-color': {
      default: 'var(--muted-foreground)',
      description:
        'Foreground color of `<PopoverDescription>` text shown beneath the popover title.',
    },
  },
});
