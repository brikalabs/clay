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
});
