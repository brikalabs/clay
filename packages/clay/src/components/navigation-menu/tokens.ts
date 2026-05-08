import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3, SPACING_4 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Navigation menu trigger corner radius.',
  },
  motion: true,
  geometry: { height: '2.25rem', paddingX: SPACING_4, paddingY: SPACING_2 },
  typography: { fontSize: 'var(--text-body-md)', fontWeight: '500' },
});

registerComponent('navigation-menu-viewport', {
  themeKey: 'navigationMenuViewport',
  radius: {
    default: 'var(--radius-surface)',
    description: 'Navigation menu viewport corner radius.',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'Navigation menu viewport elevation.',
  },
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur on the navigation menu viewport. Set non-zero for a frosted-glass overlay.',
  },
  border: '1px',
  geometry: { paddingX: SPACING_3, paddingY: SPACING_3, gap: SPACING_2 },
});
