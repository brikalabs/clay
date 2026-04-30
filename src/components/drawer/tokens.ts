import { defineComponent } from '../../tokens/define';
import { SPACING_2, SPACING_4, SPACING_6 } from '../../tokens/spacing';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  radius: {
    default: 'var(--radius-container)',
    description: 'Drawer sheet top-corner radius.',
    alias: 'drawer',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'Drawer elevation.',
    alias: 'drawer',
  },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur behind translucent drawer.',
  },
  geometry: { paddingX: SPACING_6, paddingY: SPACING_4, gap: SPACING_2 },
});
