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
  slots: {
    'container': {
      default: 'var(--background)',
      description: 'Resting background of the navigation-menu trigger.',
    },
    'focus-container': {
      default: 'var(--accent)',
      description:
        'Background of the navigation-menu trigger under hover / focus. Active and open states use this color at 50% opacity.',
    },
    'focus-label': {
      default: 'var(--accent-foreground)',
      description: 'Foreground color of the navigation-menu trigger under hover / focus.',
    },
    'indicator-color': {
      default: 'var(--border)',
      description:
        'Color of the navigation-menu indicator arrow shown beneath the active trigger.',
    },
  },
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
  slots: {
    'surface-container': {
      default: 'var(--popover)',
      description: 'Background of the navigation-menu flyout viewport.',
    },
    'surface-label': {
      default: 'var(--popover-foreground)',
      description: 'Default foreground color inside the navigation-menu flyout viewport.',
    },
  },
});
