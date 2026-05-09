import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_4, SPACING_6 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-container)',
    description: 'Drawer sheet top-corner radius.',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'Drawer elevation.',
  },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur behind translucent drawer.',
  },
  geometry: { paddingX: SPACING_6, paddingY: SPACING_4, gap: SPACING_2 },
  slots: {
    'surface-container': {
      default: 'var(--popover)',
      description: 'Background of the drawer panel.',
    },
    'overlay-color': {
      default: 'oklch(0 0 0 / 0.5)',
      description:
        'Color of the modal scrim shown behind an open drawer. Defaults to black at 50% opacity.',
    },
    'handle-color': {
      default: 'var(--muted)',
      description: 'Fill of the small horizontal handle pill drawn at the top of the drawer panel.',
    },
    'description-color': {
      default: 'var(--muted-foreground)',
      description: 'Foreground color of the drawer description text.',
    },
  },
});
