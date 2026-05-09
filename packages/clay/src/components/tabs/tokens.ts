/**
 * Layer-2 tokens for Tabs.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  radius: { default: 'var(--radius-control)', description: 'Tabs corner radius.' },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the tab pill bar. Set non-zero (with a translucent muted color) for a frosted-glass tab strip.',
  },
  typography: { fontSize: 'var(--text-label-lg)', fontWeight: '500' },
  slots: {
    'trigger-padding-x': {
      default: 'calc(var(--spacing) * 3)',
      description: 'Inline padding inside a tab trigger.',
    },
    'trigger-padding-y': {
      default: 'calc(var(--spacing) * 1.5)',
      description: 'Block padding inside a tab trigger.',
    },
    'list-container': {
      default: 'var(--muted)',
      description:
        'Background of the tabs list rail in the default (pill) variant. The line variant keeps the list transparent.',
    },
    'list-label': {
      default: 'var(--muted-foreground)',
      description:
        'Default label color for tabs in their inactive state. Active tabs override to `trigger-active-label`.',
    },
    'trigger-active-container': {
      default: 'var(--background)',
      description: 'Background of the active tab pill (default variant).',
    },
    'trigger-active-label': {
      default: 'var(--foreground)',
      description: 'Foreground color of the active tab.',
    },
    'trigger-hover-label': {
      default: 'var(--foreground)',
      description: 'Foreground color of an inactive tab on hover.',
    },
    'line-indicator': {
      default: 'var(--foreground)',
      description:
        'Color of the underline rule painted under the active tab in the line variant.',
    },
    'trigger-focus-border': {
      default: 'var(--ring)',
      description:
        'Border color drawn on a tab trigger on `focus-visible`. Pairs with `trigger-focus-ring` to render the keyboard focus halo.',
    },
    'trigger-focus-outline': {
      default: 'var(--ring)',
      description:
        'Outline color drawn on a tab trigger on `focus-visible`. Sits underneath the focus ring at 1px width.',
    },
    'trigger-focus-ring': {
      default: 'var(--ring)',
      description:
        'Color of the 3px focus halo painted around a tab trigger on `focus-visible`. Rendered at 50% opacity to soften the outer glow.',
    },
    'trigger-active-border-dark': {
      default: 'var(--input)',
      description:
        'Border color of the active tab pill in dark mode (default variant). Light mode keeps the transparent resting border so only the pill background reads as active.',
    },
  },
});
