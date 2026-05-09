/**
 * Layer-2 tokens for Switch (the track) and SwitchThumb (the dot inside).
 *
 * They live in the same file because the thumb is conceptually owned by
 * the switch even though it has its own token namespace.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: '9999px',
    description: 'Switch track corner radius. Default is fully rounded.',
  },
  surface: true,
  slots: {
    'track-width': {
      default: '2.5rem',
      description: 'Switch track width. Fits two thumb diameters + padding + border.',
    },
    'track-height': {
      default: '1.5rem',
      description: 'Switch track height. Leaves room for thumb + padding + border.',
    },
    'checked-container': {
      default: 'var(--primary)',
      description: 'Track background when the switch is on (`data-[state=checked]`).',
    },
    'unchecked-container': {
      default: 'var(--input)',
      description:
        'Track background when the switch is off (`data-[state=unchecked]`). Dark mode applies an 80% opacity automatically.',
    },
    'focus-border': {
      default: 'var(--ring)',
      description:
        'Border color drawn on the track when keyboard focus lands on the switch (`focus-visible`). Pairs with `focus-ring` to render the focus halo.',
    },
    'focus-ring': {
      default: 'var(--ring)',
      description:
        'Color of the 3px focus halo painted around the switch on `focus-visible`. Rendered at 50% opacity to soften the outer glow.',
    },
  },
});

registerComponent('switch-thumb', {
  themeKey: 'switchThumb',
  radius: {
    default: '9999px',
    description: 'Switch thumb corner radius.',
  },
  slots: {
    size: { default: '1rem', description: 'Switch thumb diameter at the default size.' },
    'unchecked-color': {
      default: 'var(--background)',
      description:
        'Thumb fill when the switch is off. Dark mode swaps to `--foreground` automatically.',
    },
    'checked-color-dark': {
      default: 'var(--primary-foreground)',
      description:
        'Thumb fill when the switch is on, dark mode only. Light mode keeps the unchecked color so the thumb reads against the primary track.',
    },
    'unchecked-color-dark': {
      default: 'var(--foreground)',
      description:
        'Thumb fill when the switch is off, dark mode only. Light mode uses `unchecked-color` so the thumb stands out against the input-tinted track.',
    },
  },
});
