/**
 * Layer-2 tokens for Kbd.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_1, SPACING_1_5 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Kbd corner radius.',
  },
  surface: { borderWidth: '1px' },
  geometry: { height: '1.25rem', paddingX: SPACING_1_5, paddingY: '0.0625rem', gap: SPACING_1 },
  typography: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-label-sm)',
    fontWeight: '500',
  },
  slots: {
    container: {
      default: 'var(--muted)',
      description: 'Background of the kbd pill.',
    },
    label: {
      default: 'var(--muted-foreground)',
      description: 'Glyph color of the kbd pill.',
    },
    'border-color': {
      default: 'var(--border)',
      description: 'Hairline border color of the kbd pill.',
    },
  },
});
