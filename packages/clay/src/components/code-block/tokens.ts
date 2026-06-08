/**
 * Layer-2 tokens for CodeBlock.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Code block corner radius.',
  },
  typography: {
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0',
  },
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the code-block surface. Set non-zero for a frosted-glass treatment.',
  },
  slots: {
    bg: { default: 'var(--muted)', description: 'Code block background.' },
    'border-color': {
      default: 'var(--border)',
      description: 'Border color of the code-block surface and the header divider.',
    },
    'subtle-bg': {
      default: 'color-mix(in oklch, var(--muted) 30%, transparent)',
      description:
        'Background of the `subtle` variant, a faded muted tint that drops the surrounding chrome.',
    },
    'header-bg': {
      default: 'color-mix(in oklch, var(--muted) 60%, transparent)',
      description:
        'Background color of the code-block header strip (filename + actions row).',
    },
    'gutter-bg': {
      default: 'color-mix(in oklch, var(--muted) 40%, transparent)',
      description: 'Background color of the line-number gutter on the left edge.',
    },
    'gutter-border': {
      default: 'color-mix(in oklch, var(--border) 60%, transparent)',
      description: 'Color of the divider between the line-number gutter and the code body.',
    },
    'gutter-label': {
      default: 'var(--muted-foreground)',
      description: 'Text color of the line numbers in the gutter.',
    },
    'tab-label': {
      default: 'var(--muted-foreground)',
      description: 'Text color of an inactive file tab in the header (multi-file blocks).',
    },
    'tab-active-label': {
      default: 'var(--foreground)',
      description: 'Text color of the active file tab in the header (multi-file blocks).',
    },
  },
});
