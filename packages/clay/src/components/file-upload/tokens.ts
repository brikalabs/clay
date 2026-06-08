/**
 * Layer-2 tokens for File Upload.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Corner radius of a file-list row and its preview tile.',
  },
  surface: { borderWidth: '1px' },
  geometry: { paddingX: SPACING_3, paddingY: SPACING_2, gap: SPACING_3 },
  slots: {
    'item-container': {
      default: 'var(--card)',
      description: 'Background of a file-list row.',
    },
    'item-border': {
      default: 'var(--border)',
      description: 'Border color of a file-list row.',
    },
    'preview-bg': {
      default: 'var(--muted)',
      description: 'Background of the leading preview/icon tile on each row.',
    },
    icon: {
      default: 'var(--muted-foreground)',
      description: 'Color of the file-type glyph inside the preview tile.',
    },
    name: {
      default: 'var(--foreground)',
      description: 'File name text color.',
    },
    meta: {
      default: 'var(--muted-foreground)',
      description: 'Secondary text color for file size and status.',
    },
  },
});
