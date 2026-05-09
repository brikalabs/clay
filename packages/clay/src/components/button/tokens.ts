/**
 * Layer-2 tokens for Button.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_2, SPACING_4 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'Button corner radius. Falls back to `radius-control`.',
  },
  shadow: {
    default: 'var(--shadow-surface)',
    description: 'Resting elevation under a button.',
  },
  surface: true,
  geometry: { height: '2.25rem', paddingX: SPACING_4, paddingY: SPACING_2, gap: SPACING_2 },
  typography: { fontWeight: '500', fontSize: 'var(--text-body-md)' },
  slots: {
    'filled-container': {
      default: 'var(--primary)',
      description: 'Background of the filled button variant.',
    },
    'filled-label': {
      default: 'var(--primary-foreground)',
      description: 'Label color of the filled button variant.',
    },
    'outline-border': {
      default: 'var(--border)',
      description: 'Border color of the outline button variant.',
    },
    'outline-label': {
      default: 'var(--foreground)',
      description: 'Label color of the outline button variant.',
    },
    'destructive-container': {
      default: 'var(--destructive)',
      description: 'Background of the destructive button variant.',
    },
    'destructive-label': {
      default: 'oklch(1 0 0)',
      description:
        'Label color of the destructive button variant. Defaults to white so it stays legible regardless of `--destructive` hue.',
    },
    'secondary-container': {
      default: 'var(--secondary)',
      description: 'Background of the secondary button variant.',
    },
    'secondary-label': {
      default: 'var(--secondary-foreground)',
      description: 'Label color of the secondary button variant.',
    },
    'ghost-hover-container': {
      default: 'var(--accent)',
      description:
        'Hover background of the ghost button variant. Resting state has no fill, the hover affordance is the only paint.',
    },
    'ghost-hover-label': {
      default: 'var(--accent-foreground)',
      description: 'Hover label color of the ghost button variant.',
    },
    'link-color': {
      default: 'var(--primary)',
      description:
        'Foreground color of the link button variant. Underline is rendered in this same color.',
    },
    'invalid-border': {
      default: 'var(--destructive)',
      description:
        'Border color applied when the button carries `aria-invalid`. Defaults to the destructive role so themes can retune the validation tint without affecting other destructive surfaces.',
    },
    'destructive-focus': {
      default: 'var(--destructive)',
      description:
        'Focus-ring color of the destructive button variant. Applied via the `focus-visible:ring-button-destructive-focus/20` (and `dark:.../40`) opacity-modified utility, so themes can shift the destructive halo independently of the fill.',
    },
    'outline-container': {
      default: 'var(--background)',
      description:
        'Resting background of the outline button variant in light mode. Defaults to the surface background; dark mode uses `outline-dark-container` instead.',
    },
    'outline-dark-container': {
      default: 'var(--input)',
      description:
        'Dark-mode resting background of the outline button variant, applied at 30% opacity (50% on hover). Defaults to the `--input` role so the outline button picks up the same tinted dark surface as inputs.',
    },
  },
});
