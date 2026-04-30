import { defineComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3 } from '../../tokens/spacing';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  radius: {
    default: 'var(--radius-surface)',
    description: 'HoverCard corner radius.',
    alias: 'hover-card',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'HoverCard elevation.',
    alias: 'hover-card',
  },
  border: '1px',
  motion: true,
  geometry: { paddingX: SPACING_3, paddingY: SPACING_3, gap: SPACING_2 },
});
