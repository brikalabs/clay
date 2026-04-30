import { defineComponent } from '../../tokens/define';
import { SPACING_1, SPACING_1_5, SPACING_2 } from '../../tokens/spacing';
import { meta } from './meta';

export const tokens = [
  ...defineComponent(meta.name, {
    radius: {
      default: 'var(--radius-control)',
      description: 'Menubar root border radius.',
      alias: 'menubar',
    },
    border: '1px',
    motion: true,
    geometry: { height: '2.25rem', paddingX: SPACING_1_5, paddingY: SPACING_1 },
  }),
  ...defineComponent('menubar-content', {
    themeKey: 'menubarContent',
    radius: {
      default: 'var(--radius-surface)',
      description: 'Menubar dropdown content corner radius.',
      alias: 'menubar-content',
    },
    shadow: {
      default: 'var(--shadow-overlay)',
      description: 'Menubar dropdown elevation.',
      alias: 'menubar-content',
    },
    border: '1px',
    motion: true,
    geometry: { paddingX: SPACING_1, paddingY: SPACING_1 },
  }),
  ...defineComponent('menubar-item', {
    themeKey: 'menubarItem',
    radius: {
      default: 'var(--radius-control)',
      description: 'Menubar item corner radius.',
      alias: 'menubar-item',
    },
    surface: true,
    geometry: { paddingX: SPACING_2, paddingY: SPACING_1_5, gap: SPACING_2 },
    typography: { fontSize: 'var(--text-body-md)' },
  }),
];
