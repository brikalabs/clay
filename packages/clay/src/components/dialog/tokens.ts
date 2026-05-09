/**
 * Layer-2 tokens for Dialog.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_4, SPACING_6 } from '../../tokens/spacing';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-surface)',
    description: 'Dialog corner radius.',
  },
  shadow: { default: 'var(--shadow-modal)', description: 'Dialog elevation.' },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur applied behind a translucent dialog.',
  },
  geometry: { paddingX: SPACING_6, paddingY: SPACING_6, gap: SPACING_4 },
  slots: {
    container: { default: 'var(--popover)', description: 'Dialog background.' },
    label: { default: 'var(--popover-foreground)', description: 'Dialog text color.' },
    'overlay-bg': {
      default: 'oklch(0 0 0 / 0.5)',
      description:
        'Modal scrim color behind the dialog. Lower alpha + non-zero `overlay-backdrop-blur` produces an iOS-style glass scrim that frosts the page instead of dimming it.',
    },
    'overlay-backdrop-blur': {
      default: '0px',
      description:
        'Backdrop blur applied to the modal scrim. Set non-zero so the page content behind the dialog is frosted by the overlay itself.',
      type: 'blur',
    },
    'description-color': {
      default: 'var(--muted-foreground)',
      description:
        'Foreground color of `<DialogDescription>` text rendered beneath the dialog title.',
    },
    'close-active-container': {
      default: 'var(--accent)',
      description: 'Background of the built-in close-X button when its data-state is open.',
    },
    'close-active-label': {
      default: 'var(--muted-foreground)',
      description: 'Glyph color of the built-in close-X button when its data-state is open.',
    },
    'close-focus-ring-color': {
      default: 'var(--ring)',
      description:
        'Focus ring color of the built-in close-X button when keyboard-focused. Defaults to the theme ring color.',
    },
    'close-focus-ring-offset-color': {
      default: 'var(--background)',
      description:
        'Color drawn between the close-X button and its focus ring (the ring offset). Should match the page background so the offset reads as a gap.',
    },
  },
});
