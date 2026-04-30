import { defineComponent } from '../../tokens/define';
import { SPACING_1, SPACING_1_5, SPACING_2 } from '../../tokens/spacing';
import { meta } from './meta';

export const tokens = [
  ...defineComponent(meta.name, {
    radius: {
      default: 'var(--radius-surface)',
      description: 'Command palette container radius.',
      alias: 'command',
    },
    shadow: {
      default: 'var(--shadow-overlay)',
      description: 'Command palette elevation.',
      alias: 'command',
    },
    border: '1px',
    geometry: { paddingX: '0px', paddingY: '0px', gap: '0px' },
  }),
  ...defineComponent('command-item', {
    themeKey: 'commandItem',
    radius: {
      default: 'var(--radius-control)',
      description: 'Command palette item corner radius.',
      alias: 'command-item',
    },
    surface: true,
    geometry: { paddingX: SPACING_2, paddingY: SPACING_1_5, gap: SPACING_2 },
    typography: { fontSize: 'var(--text-body-md)' },
  }),
];
