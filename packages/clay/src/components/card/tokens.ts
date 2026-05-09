/**
 * Layer-2 tokens for Card.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_4, SPACING_6 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-container)',
    description: 'Card corner radius.',
  },
  shadow: { default: 'var(--shadow-raised)', description: 'Card elevation.' },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur applied behind a translucent card. Set non-zero for glass.',
  },
  geometry: { paddingX: SPACING_6, paddingY: SPACING_6, gap: SPACING_4 },
  typography: { fontSize: 'var(--text-body-md)' },
  slots: {
    container: { default: 'var(--card)', description: 'Card background.' },
    label: { default: 'var(--card-foreground)', description: 'Card text color.' },
    'border-color': {
      default: 'var(--border)',
      description: 'Resting border color of a card without an accent stripe.',
    },
    'interactive-border-rest': {
      default: 'color-mix(in oklch, var(--foreground) 10%, transparent)',
      description:
        'Border color of an interactive (`interactive`) card in its resting state, no accent. The light foreground tint reads as a quiet hairline against either light or dark surfaces.',
    },
    'interactive-border-hover': {
      default: 'color-mix(in oklch, var(--foreground) 20%, transparent)',
      description:
        'Border color of an interactive card on hover, no accent. Doubles the resting tint to telegraph the interactive affordance.',
    },
    'description-color': {
      default: 'var(--muted-foreground)',
      description: 'Foreground color of `<CardDescription>` text.',
    },
  },
});
