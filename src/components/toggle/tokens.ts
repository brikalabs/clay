import { defineComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3 } from '../../tokens/spacing';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Toggle corner radius.',
    alias: 'toggle',
  },
  surface: true,
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the toggle on hover and active (`data-[state=on]`). Set non-zero for a frosted-glass affordance, the resting state stays transparent.',
  },
  geometry: { height: '2.25rem', paddingX: SPACING_3, paddingY: SPACING_2, gap: SPACING_2 },
  typography: { fontSize: 'var(--text-body-md)', fontWeight: '500' },
});
