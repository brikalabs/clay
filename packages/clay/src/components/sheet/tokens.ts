/**
 * Layer-2 tokens for Sheet.
 */

import { registerComponent } from '../../tokens/define';
import { SPACING_4, SPACING_6 } from '../../tokens/spacing';
import { meta } from './meta';

// Sheet content takes the full edge of the viewport, so no `radius` token
// is registered, the only utility that would consume `--sheet-radius` is
// `rounded-sheet`, which is never applied.
registerComponent(meta, {
  shadow: { default: 'var(--shadow-modal)', description: 'Sheet elevation.' },
  border: '1px',
  motion: true,
  backdropBlur: {
    default: '0px',
    description: 'Backdrop blur applied behind a translucent sheet.',
  },
  geometry: { paddingX: SPACING_6, paddingY: SPACING_6, gap: SPACING_4 },
  slots: {
    'surface-container': {
      default: 'var(--popover)',
      description: 'Background of the sliding sheet surface.',
    },
    'surface-label': {
      default: 'var(--popover-foreground)',
      description: 'Default foreground color inside the sheet.',
    },
    'title-color': {
      default: 'var(--foreground)',
      description: 'Foreground color of the sheet title.',
    },
    'description-color': {
      default: 'var(--muted-foreground)',
      description: 'Foreground color of the sheet description text.',
    },
    'close-active-container': {
      default: 'var(--secondary)',
      description: 'Background of the built-in close-X button when its data-state is open.',
    },
    'close-ring-color': {
      default: 'var(--ring)',
      description: 'Focus ring color of the built-in close-X button.',
    },
    'close-ring-offset-color': {
      default: 'var(--background)',
      description:
        'Focus ring offset color of the built-in close-X button (matches the surface behind the sheet, so the offset reads as a gap).',
    },
  },
});
