import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Toggle corner radius.',
  },
  surface: true,
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the toggle on hover and active (`data-[state=on]`). Set non-zero for a frosted-glass affordance, the resting state stays transparent.',
  },
  geometry: { height: '2.25rem', paddingX: SPACING_3, paddingY: SPACING_2, gap: SPACING_2 },
  typography: { fontSize: 'var(--text-body-md)', fontWeight: '500' },
  slots: {
    'hover-container': {
      default: 'var(--muted)',
      description:
        'Hover background of the toggle in its resting (off) state. Pairs with `hover-label` and the hover backdrop blur.',
    },
    'hover-label': {
      default: 'var(--muted-foreground)',
      description: 'Hover label color of the toggle in its resting (off) state.',
    },
    'hover-border': {
      default: 'var(--border)',
      description: 'Hover border color of the toggle in its resting (off) state.',
    },
    'active-container': {
      default: 'var(--accent)',
      description: 'Background of the toggle when pressed (`data-[state=on]`).',
    },
    'active-label': {
      default: 'var(--accent-foreground)',
      description: 'Label color of the toggle when pressed (`data-[state=on]`).',
    },
    'active-border': {
      default: 'var(--border)',
      description: 'Border color of the toggle when pressed (`data-[state=on]`).',
    },
    'outline-border': {
      default: 'var(--input)',
      description:
        'Resting border color of the outline toggle variant. Hover and active states fall through to `hover-border` / `active-border`.',
    },
  },
});
