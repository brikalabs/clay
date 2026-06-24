/**
 * Layer-2 tokens for Tree.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_1_5, SPACING_2 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  // Tree rows are full-width square highlights (VSCode/GitHub file-explorer style), so no radius
  // token is registered. The selected background spans edge-to-edge without rounding.
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
      description: 'Color of the chevron and file glyphs.',
    },
    'folder-icon': {
      default: 'var(--primary)',
      description: 'Color of the folder and folder-open glyphs. Defaults to the brand primary so folder icons pick up the theme accent color automatically.',
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
      default: 'color-mix(in oklch, var(--primary) 12%, transparent)',
      description: 'Row background when the node is selected. Defaults to a light tint of the brand primary.',
    },
    'selected-label': {
      default: 'var(--primary)',
      description: 'Row text color when the node is selected. Defaults to the brand primary so text and file icon read in the theme accent color.',
    },
    'selected-accent': {
      default: 'var(--primary)',
      description:
        'Color of the vertical accent bar on the leading edge of a selected row. Defaults to the brand primary so it picks up theme coral, navy, etc. automatically.',
    },
  },
});
