import { defineComponent } from '../../tokens/define';
import { SPACING_2, SPACING_4 } from '../../tokens/spacing';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Accordion trigger corner radius.',
    alias: 'accordion',
  },
  motion: true,
  geometry: { paddingX: SPACING_4, paddingY: SPACING_2 },
});
