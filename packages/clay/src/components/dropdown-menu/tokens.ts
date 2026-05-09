/**
 * Layer-2 tokens for DropdownMenu (the surface) and DropdownMenuItem
 * (each row inside).
 *
 * Token names use the shorter `--menu-*` / `--menu-item-*` prefix so the
 * Select component can reuse the same tokens for its own dropdown surface.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_1, SPACING_1_5, SPACING_2 } from '../../tokens/spacing';

registerComponent('menu', {
  radius: {
    default: 'var(--radius-surface)',
    description: 'Menu surface corner radius.',
  },
  shadow: {
    default: 'var(--shadow-overlay)',
    description: 'Menu surface elevation.',
  },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur applied behind a translucent dropdown menu.',
  },
  geometry: { paddingX: SPACING_1, paddingY: SPACING_1, gap: '0.125rem' },
  slots: {
    'surface-container': {
      default: 'var(--popover)',
      description: 'Background of the menu surface (popover, dropdown, sub-menu).',
    },
    'surface-label': {
      default: 'var(--popover-foreground)',
      description: 'Default foreground color inside the menu surface.',
    },
    'separator-color': {
      default: 'var(--border)',
      description: 'Color of the horizontal divider rule between menu groups.',
    },
    'shortcut-color': {
      default: 'var(--muted-foreground)',
      description: 'Color of the keyboard-shortcut hint shown at the right of an item.',
    },
    'icon-color': {
      default: 'var(--muted-foreground)',
      description:
        'Default color of inline SVG icons inside menu items. Items can opt out by setting an explicit `text-*` class on the icon.',
    },
  },
});

registerComponent('menu-item', {
  themeKey: 'menuItem',
  radius: {
    default: 'var(--radius-control)',
    description: 'Menu-item corner radius.',
  },
  surface: true,
  geometry: { paddingX: SPACING_2, paddingY: SPACING_1_5, gap: SPACING_2 },
  typography: { fontSize: 'var(--text-body-md)' },
  slots: {
    'focus-container': {
      default: 'var(--accent)',
      description: 'Background of a menu item under focus / hover / open state.',
    },
    'focus-label': {
      default: 'var(--accent-foreground)',
      description: 'Foreground color of a menu item under focus / hover / open state.',
    },
    'destructive-color': {
      default: 'var(--destructive)',
      description:
        'Single color driving the destructive variant: text uses it directly, focus background uses it at 10% (light) / 20% (dark) opacity. Override to retune the destructive intent across every menu.',
    },
  },
});
