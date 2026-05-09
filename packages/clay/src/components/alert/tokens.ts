/**
 * Layer-2 tokens for Alert.
 */

import { registerComponent } from '../../tokens/define';

registerComponent('alert', {
  radius: {
    default: 'var(--radius-container)',
    description: 'Alert corner radius.',
  },
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the alert. Set non-zero alongside a translucent `tint-base` (e.g. `transparent`) for a glass variant.',
  },
  slots: {
    'accent': {
      default: 'currentColor',
      description:
        'Accent color the variant icon picks up. Each variant overrides this inline (`[--alert-accent:var(--destructive)]` etc.); the default falls back to `currentColor` so a custom variant inherits the alert label color.',
      // Read directly via `var(--alert-accent, currentColor)` in alert.tsx
      // (AlertIcon glyph), set inline by each variant string. The :root
      // default keeps the bare ref valid when no variant override applies.
      consumedByCss: true,
    },
    'background': {
      default: 'var(--background)',
      description:
        'Background fill of the default (untinted) alert variant. Tinted variants override the bg via inline `color-mix()` and ignore this slot.',
    },
    'foreground': {
      default: 'var(--foreground)',
      description:
        'Body text color shared by every alert variant; the title and surface inherit this so swapping it retints the whole alert label.',
    },
    'border-color': {
      default: 'var(--border)',
      description:
        'Border color of the default (untinted) alert variant. Tinted variants override the border via inline `color-mix()` and ignore this slot.',
    },
    'description-foreground': {
      default: 'var(--muted-foreground)',
      description:
        'Text color of the alert description block; muted by default so the title stays the visual anchor.',
    },
    'destructive-title': {
      default: 'var(--destructive)',
      description:
        'Title text color when the alert is the `destructive` variant. Lifted into a slot so themes can dial the title saturation independently of the destructive role token.',
    },
    'close-foreground': {
      default: 'var(--muted-foreground)',
      description: 'Resting text color of the close (X) button.',
    },
    'close-foreground-hover': {
      default: 'var(--foreground)',
      description: 'Hover text color of the close (X) button.',
    },
    'close-bg-hover': {
      default: 'color-mix(in oklch, var(--foreground) 5%, transparent)',
      description: 'Hover background fill of the close (X) button.',
    },
    'close-ring': {
      default: 'var(--ring)',
      description: 'Focus ring color of the close (X) button.',
    },
    'tint-base': {
      default: 'var(--background)',
      description:
        'Base color the per-variant accent is mixed into. Defaults to the page surface for opaque tints; set to `transparent` for translucent / glass variants.',
      // Read directly via `var(--alert-tint-base)` inside `color-mix()` in
      // alert.tsx, no Tailwind utility wraps the access, so the var-chain
      // default must land in `:root` for the mix to resolve.
      consumedByCss: true,
    },
    'tint-bg-amount': {
      default: '12%',
      description:
        'Accent percentage mixed into the tinted-variant background. Higher values produce more saturated bg fills.',
      type: 'opacity',
    },
    'tint-border-amount': {
      default: '40%',
      description:
        'Accent percentage mixed into the tinted-variant border. Usually higher than the bg amount so the edge stays defined.',
      type: 'opacity',
    },
  },
});
