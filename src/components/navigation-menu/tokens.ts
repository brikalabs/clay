import { defineComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3, SPACING_4 } from '../../tokens/spacing';
import { meta } from './meta';

export const tokens = [
  ...defineComponent(meta.name, {
    radius: {
      default: 'var(--radius-control)',
      description: 'Navigation menu trigger corner radius.',
      alias: 'navigation-menu',
    },
    motion: true,
    geometry: { height: '2.25rem', paddingX: SPACING_4, paddingY: SPACING_2 },
    typography: { fontSize: 'var(--text-body-md)', fontWeight: '500' },
  }),
  ...defineComponent('navigation-menu-viewport', {
    themeKey: 'navigationMenuViewport',
    radius: {
      default: 'var(--radius-surface)',
      description: 'Navigation menu viewport corner radius.',
      alias: 'navigation-menu-viewport',
    },
    shadow: {
      default: 'var(--shadow-overlay)',
      description: 'Navigation menu viewport elevation.',
      alias: 'navigation-menu-viewport',
    },
    border: '1px',
    geometry: { paddingX: SPACING_3, paddingY: SPACING_3, gap: SPACING_2 },
  }),
];
