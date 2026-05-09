import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: '9999px',
    description: 'Radio button border radius.',
  },
  surface: { borderWidth: '1px' },
  slots: {
    size: { default: '1rem', description: 'Radio button diameter.' },
    'unchecked-container': {
      default: 'var(--input-container)',
      description: 'Disc background in the resting (unchecked) state.',
    },
    'unchecked-border': {
      default: 'var(--input-border)',
      description: 'Disc border color in the resting (unchecked) state.',
    },
    'checked-container': {
      default: 'var(--primary)',
      description: 'Disc background when selected (`data-[state=checked]`).',
    },
    'checked-border': {
      default: 'var(--primary)',
      description: 'Disc border color when selected.',
    },
    'indicator-color': {
      default: 'var(--primary-foreground)',
      description: 'Color of the inner dot painted on the selected disc.',
    },
    'invalid-border': {
      default: 'var(--destructive)',
      description:
        'Disc border color when the radio has `aria-invalid="true"`. Defaults to the theme destructive hue.',
    },
    'invalid-ring': {
      default: 'var(--destructive)',
      description:
        'Color of the invalid-state focus halo. Painted at 20% opacity in light mode, 40% in dark mode for parity with other form controls.',
    },
  },
});
