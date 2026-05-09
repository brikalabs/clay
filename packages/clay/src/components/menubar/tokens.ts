import { registerComponent } from '../../tokens/define';
import { SPACING_1, SPACING_1_5, SPACING_2 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Menubar root border radius.',
  },
  border: '1px',
  motion: true,
  geometry: { height: '2.25rem', paddingX: SPACING_1_5, paddingY: SPACING_1 },
  slots: {
    'container': {
      default: 'var(--background)',
      description: 'Background of the menubar root rail.',
    },
    'border-color': {
      default: 'var(--input)',
      description: 'Border color of the menubar root rail.',
    },
  },
});

registerComponent('menubar-content', {
  themeKey: 'menubarContent',
  radius: {
    default: 'var(--radius-surface)',
    description: 'Menubar dropdown content corner radius.',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'Menubar dropdown elevation.',
  },
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur on the menubar dropdown content. Set non-zero for a frosted-glass overlay.',
  },
  border: '1px',
  motion: true,
  geometry: { paddingX: SPACING_1, paddingY: SPACING_1 },
  slots: {
    'surface-container': {
      default: 'var(--popover)',
      description: 'Background of the menubar dropdown surface.',
    },
    'surface-label': {
      default: 'var(--popover-foreground)',
      description: 'Default foreground color inside the menubar dropdown surface.',
    },
    'border-color': {
      default: 'var(--input)',
      description: 'Border color of the menubar dropdown surface.',
    },
    'separator-color': {
      default: 'var(--border)',
      description: 'Color of the divider rule between menubar item groups.',
    },
    'shortcut-color': {
      default: 'var(--muted-foreground)',
      description: 'Color of the keyboard-shortcut hint inside menubar items.',
    },
    'icon-color': {
      default: 'var(--muted-foreground)',
      description: 'Default color of inline SVG icons inside menubar items.',
    },
  },
});

registerComponent('menubar-item', {
  themeKey: 'menubarItem',
  radius: {
    default: 'var(--radius-control)',
    description: 'Menubar item corner radius.',
  },
  surface: true,
  geometry: { paddingX: SPACING_2, paddingY: SPACING_1_5, gap: SPACING_2 },
  typography: { fontSize: 'var(--text-body-md)' },
  slots: {
    'focus-container': {
      default: 'var(--accent)',
      description: 'Background of a menubar item under focus / hover / open state.',
    },
    'focus-label': {
      default: 'var(--accent-foreground)',
      description: 'Foreground color of a menubar item under focus / hover / open state.',
    },
    'destructive-color': {
      default: 'var(--destructive)',
      description:
        'Single color driving the destructive variant: text uses it directly, focus background uses it at 10% (light) / 20% (dark) opacity.',
    },
  },
});
