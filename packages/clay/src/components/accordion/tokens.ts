import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_4 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Accordion trigger corner radius.',
  },
  motion: true,
  geometry: { paddingX: SPACING_4, paddingY: SPACING_2 },
  slots: {
    'chevron-color': {
      default: 'var(--muted-foreground)',
      description:
        'Color of the chevron icon at the right of an accordion trigger. Rotates 180° when the item is open.',
    },
  },
});
