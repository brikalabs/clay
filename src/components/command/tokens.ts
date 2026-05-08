import { registerComponent } from '../../tokens/define';
import { SPACING_1_5, SPACING_2 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-surface)',
    description: 'Command palette container radius.',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'Command palette elevation.',
  },
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur on the command palette container. Set non-zero for a frosted-glass overlay.',
  },
  border: '1px',
  geometry: { paddingX: '0px', paddingY: '0px', gap: '0px' },
});

registerComponent('command-item', {
  themeKey: 'commandItem',
  radius: {
    default: 'var(--radius-control)',
    description: 'Command palette item corner radius.',
  },
  surface: true,
  geometry: { paddingX: SPACING_2, paddingY: SPACING_1_5, gap: SPACING_2 },
  typography: { fontSize: 'var(--text-body-md)' },
});
