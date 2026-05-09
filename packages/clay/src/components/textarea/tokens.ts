/**
 * Layer-2 tokens for Textarea.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_3 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Textarea corner radius.',
  },
  surface: { borderWidth: '1px' },
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the textarea surface. Set non-zero for a frosted-glass treatment.',
  },
  geometry: { paddingX: SPACING_3, paddingY: SPACING_2, gap: SPACING_2 },
  typography: { fontSize: 'var(--text-body-md)' },
  slots: {
    container: {
      default: 'var(--input-container)',
      description:
        'Background color of the textarea. Inherits the standalone Input container so themes that retune `--input-container` retune the textarea automatically.',
    },
    label: {
      default: 'var(--input-label)',
      description: 'Foreground color of the text typed into the textarea. Mirrors `--input-label`.',
    },
    border: {
      default: 'var(--input-border)',
      description: 'Resting border color of the textarea. Mirrors `--input-border`.',
    },
    placeholder: {
      default: 'var(--input-placeholder)',
      description:
        'Foreground color of the textarea placeholder. Mirrors `--input-placeholder`.',
    },
    'invalid-border': {
      default: 'var(--destructive)',
      description: 'Border color drawn when the textarea is in an invalid state (`aria-invalid=true`).',
    },
  },
});
