/**
 * Layer-2 tokens for Mini Calendar.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Corner radius of a day cell.',
  },
  motion: true,
  slots: {
    'day-label': {
      default: 'var(--foreground)',
      description: 'Day-number text color at rest.',
    },
    weekday: {
      default: 'var(--muted-foreground)',
      description: 'Weekday-abbreviation text color at rest.',
    },
    'day-hover': {
      default: 'var(--accent)',
      description: 'Day cell background on hover.',
    },
    'day-selected': {
      default: 'var(--primary)',
      description: 'Selected day cell background.',
    },
    'day-selected-label': {
      default: 'var(--primary-foreground)',
      description: 'Selected day cell text color.',
    },
  },
});
