/**
 * Layer-2 tokens for Dropzone.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_6 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-container)',
    description: 'Corner radius of the dropzone surface.',
  },
  motion: true,
  geometry: { paddingX: SPACING_6, paddingY: SPACING_6, gap: SPACING_2 },
  slots: {
    border: {
      default: 'var(--border)',
      description: 'Dashed border color at rest.',
    },
    container: {
      default: 'transparent',
      description: 'Surface background at rest.',
    },
    'active-border': {
      default: 'var(--primary)',
      description: 'Dashed border color while a file is dragged over the surface.',
    },
    'active-container': {
      default: 'color-mix(in oklch, var(--primary) 8%, transparent)',
      description: 'Surface background while a file is dragged over (and on hover).',
    },
    icon: {
      default: 'var(--muted-foreground)',
      description: 'Color of the upload glyph.',
    },
    title: {
      default: 'var(--foreground)',
      description: 'Primary instruction text color.',
    },
    description: {
      default: 'var(--muted-foreground)',
      description: 'Secondary hint text color (accepted types, size limits).',
    },
  },
});
