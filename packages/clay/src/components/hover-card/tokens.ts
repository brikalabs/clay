import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-surface)',
    description: 'HoverCard corner radius.',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'HoverCard elevation.',
  },
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur on the hover card. Set non-zero for a frosted-glass surface.',
  },
  border: '1px',
  motion: true,
  geometry: { paddingX: SPACING_3, paddingY: SPACING_3, gap: SPACING_2 },
  slots: {
    'surface-container': {
      default: 'var(--popover)',
      description: 'Background of the hover-card surface.',
    },
    'surface-label': {
      default: 'var(--popover-foreground)',
      description: 'Default foreground color inside the hover-card.',
    },
  },
});
