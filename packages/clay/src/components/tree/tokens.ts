/**
 * Layer-2 tokens for Tree.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_1_5, SPACING_2 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Corner radius of a tree row.',
  },
  motion: true,
  geometry: { paddingX: SPACING_2, paddingY: SPACING_1_5, gap: SPACING_2 },
  slots: {
    indent: {
      default: '1.25rem',
      type: 'size',
      namespace: 'none',
      description: 'Horizontal indentation added per nesting level.',
    },
    guide: {
      default: 'var(--border)',
      description: 'Color of the vertical guide lines connecting nested items (shown when `showLines`).',
    },
    icon: {
      default: 'var(--muted-foreground)',
      description: 'Color of the chevron, folder, and file glyphs.',
    },
    label: {
      default: 'var(--foreground)',
      description: 'Text color of a resting tree row.',
    },
    'item-hover': {
      default: 'var(--accent)',
      description: 'Row background on hover.',
    },
    selected: {
      default: 'var(--accent)',
      description: 'Row background when the node is selected.',
    },
    'selected-label': {
      default: 'var(--accent-foreground)',
      description: 'Row text color when the node is selected.',
    },
  },
});
