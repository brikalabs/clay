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
  slots: {
    'surface-container': {
      default: 'var(--popover)',
      description: 'Background of the command palette surface.',
    },
    'surface-label': {
      default: 'var(--popover-foreground)',
      description: 'Default foreground color inside the command palette.',
    },
    'separator-color': {
      default: 'var(--border)',
      description: 'Color of the divider rule between command palette groups.',
    },
    'input-border-color': {
      default: 'var(--border)',
      description: 'Color of the bottom border under the command input row.',
    },
    'shortcut-color': {
      default: 'var(--muted-foreground)',
      description: 'Color of the keyboard-shortcut hint inside command items.',
    },
    'icon-color': {
      default: 'var(--muted-foreground)',
      description: 'Default color of inline SVG icons inside command items.',
    },
    'group-heading-color': {
      default: 'var(--muted-foreground)',
      description: 'Foreground color of the group heading rendered above grouped items.',
    },
    'placeholder-color': {
      default: 'var(--muted-foreground)',
      description: 'Foreground color of the input placeholder in the command search field.',
    },
    'empty-color': {
      default: 'var(--muted-foreground)',
      description: 'Foreground color of the empty-results message.',
    },
  },
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
  slots: {
    'focus-container': {
      default: 'var(--accent)',
      description:
        'Background of a command item under selection (`data-[selected=true]`) / hover.',
    },
    'focus-label': {
      default: 'var(--accent-foreground)',
      description: 'Foreground color of a command item under selection / hover.',
    },
  },
});
