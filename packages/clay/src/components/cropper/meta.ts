/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../../component-registry';

export const meta: ComponentMeta = {
  name: 'cropper',
  displayName: 'Cropper',
  group: 'Overlays',
  description:
    'A composable image-crop primitive. The Cropper root manages pan/zoom/rotation state in context; CropperCanvas renders the interactive canvas; CropperOverlay draws the crop mask. The consumer wires their own Dialog, Slider, and Buttons around it.',
  accessibility: [
    'The crop canvas is pointer-only; keyboard-accessible zoom and apply actions must be provided by the consuming layout (e.g. a Slider and Button).',
    'Wrap the entire crop UI with an accessible dialog so screen readers can announce the modal context.',
  ],
};
