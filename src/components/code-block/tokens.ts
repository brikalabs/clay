/**
 * Layer-2 tokens for CodeBlock.
 */

import { defineComponent } from '../../tokens/define';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Code block corner radius.',
    alias: 'code-block',
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
  },
});
