/**
 * Layer-2 tokens for ProgressDisplay.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the progress-display log surface. Set non-zero for a frosted-glass treatment.',
  },
  slots: {
    'phase-foreground': {
      default: 'var(--muted-foreground)',
      description: 'Text color of the phase label rendered above the bar.',
    },
    'log-foreground': {
      default: 'var(--muted-foreground)',
      description: 'Text color of the log entries (and empty-logs message) inside the scroll area.',
    },
    'log-bg': {
      default: 'color-mix(in oklch, var(--muted) 30%, transparent)',
      description: 'Background fill of the log scroll area surface.',
    },
    'spinner-color': {
      default: 'var(--primary)',
      description: 'Color of the in-flight spinner glyph shown while processing.',
    },
    'success-color': {
      default: 'var(--success)',
      description:
        'Color of the success indicator (check icon and progress fill) and the success block accents.',
    },
    'success-bg': {
      default: 'color-mix(in oklch, var(--success) 10%, transparent)',
      description: 'Background fill of the success message block.',
    },
    'success-border': {
      default: 'color-mix(in oklch, var(--success) 50%, transparent)',
      description: 'Border color of the success message block.',
    },
    'error-color': {
      default: 'var(--destructive)',
      description:
        'Color of the error indicator (X icon and progress fill) and the error block text.',
    },
    'error-bg': {
      default: 'color-mix(in oklch, var(--destructive) 10%, transparent)',
      description: 'Background fill of the error message block.',
    },
    'error-border': {
      default: 'color-mix(in oklch, var(--destructive) 50%, transparent)',
      description: 'Border color of the error message block.',
    },
  },
});
