/**
 * Layer-2 tokens for Checkbox.
 */

import { registerComponent } from '../../tokens/define';

registerComponent('checkbox', {
  radius: {
    default: 'var(--radius-tight)',
    description: 'Checkbox corner radius.',
  },
  surface: { borderWidth: '1px' },
  slots: {
    size: { default: '1rem', description: 'Checkbox box edge length.' },
    'unchecked-container': {
      default: 'var(--input-container)',
      description: 'Box background in the resting (unchecked) state.',
    },
    'unchecked-border': {
      default: 'var(--input-border)',
      description: 'Box border color in the resting (unchecked) state.',
    },
    'checked-container': {
      default: 'var(--primary)',
      description:
        'Box background when checked or indeterminate (`data-[state=checked]` / `data-[state=indeterminate]`).',
    },
    'checked-border': {
      default: 'var(--primary)',
      description: 'Box border color when checked or indeterminate.',
    },
    'checked-glyph': {
      default: 'var(--primary-foreground)',
      description: 'Color of the check / dash glyph painted inside a checked box.',
    },
    'invalid-border': {
      default: 'var(--destructive)',
      description:
        'Box border color when the checkbox has `aria-invalid="true"`. Defaults to the theme destructive hue.',
    },
    'invalid-ring': {
      default: 'var(--destructive)',
      description:
        'Color of the invalid-state focus halo. Painted at 20% opacity in light mode, 40% in dark mode for parity with other form controls.',
    },
  },
});
