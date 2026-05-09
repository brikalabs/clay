/**
 * Layer-2 tokens for Badge.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_1, SPACING_2 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-pill)',
    description: 'Badge corner radius.',
  },
  surface: true,
  geometry: { height: '1.5rem', paddingX: SPACING_2, paddingY: '0.125rem', gap: SPACING_1 },
  typography: { fontSize: 'var(--text-label-md)' },
  slots: {
    'filled-container': {
      default: 'var(--primary)',
      description: 'Background of the default (filled) badge variant.',
    },
    'filled-label': {
      default: 'var(--primary-foreground)',
      description: 'Label color of the default (filled) badge variant.',
    },
    'secondary-container': {
      default: 'var(--secondary)',
      description: 'Background of the secondary badge variant.',
    },
    'secondary-label': {
      default: 'var(--secondary-foreground)',
      description: 'Label color of the secondary badge variant.',
    },
    'destructive-container': {
      default: 'var(--destructive)',
      description: 'Background of the destructive badge variant.',
    },
    'destructive-label': {
      default: 'oklch(1 0 0)',
      description:
        'Label color of the destructive badge variant. Defaults to white so it stays legible regardless of `--destructive` hue.',
    },
    'outline-border': {
      default: 'var(--border)',
      description: 'Border color of the outline badge variant.',
    },
    'outline-label': {
      default: 'var(--foreground)',
      description: 'Label color of the outline badge variant.',
    },
    'ghost-hover-container': {
      default: 'var(--accent)',
      description:
        'Hover background of the outline / ghost badge variants when wrapped in an `<a>` (`[a&]:hover`).',
    },
    'ghost-hover-label': {
      default: 'var(--accent-foreground)',
      description:
        'Hover label color of the outline / ghost badge variants when wrapped in an `<a>`.',
    },
    'link-color': {
      default: 'var(--primary)',
      description: 'Foreground color of the link badge variant.',
    },
    'focus-border': {
      default: 'var(--ring)',
      description:
        'Border color of the badge while focus-visible. Defaults to the `--ring` role so focus rings stay consistent with the rest of the system.',
    },
    'focus-ring': {
      default: 'var(--ring)',
      description:
        'Outer focus halo of the badge, applied via `focus-visible:ring-badge-focus-ring/50`. Defaults to the `--ring` role at 50% so themes can recolor the badge focus halo without affecting other components.',
    },
    'invalid-border': {
      default: 'var(--destructive)',
      description:
        'Border color when the badge carries `aria-invalid`. Defaults to the destructive role so themes can retune the validation tint independently.',
    },
    'invalid-ring': {
      default: 'var(--destructive)',
      description:
        'Outer ring color when the badge carries `aria-invalid`, applied at 20% (40% in dark mode) via `aria-invalid:ring-badge-invalid-ring/20`.',
    },
    'destructive-focus': {
      default: 'var(--destructive)',
      description:
        'Focus-ring color of the destructive badge variant. Applied via `focus-visible:ring-badge-destructive-focus/20` (and `dark:.../40`) so themes can shift the destructive halo independently of the fill.',
    },
  },
});
