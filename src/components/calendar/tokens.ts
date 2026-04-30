import { defineComponent } from '../../tokens/define';
import { SPACING_1, SPACING_2 } from '../../tokens/spacing';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Calendar day button corner radius.',
    alias: 'calendar',
  },
  surface: true,
  geometry: { paddingX: SPACING_2, paddingY: SPACING_2, gap: SPACING_1 },
});
