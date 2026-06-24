/**
 * Layer-2 tokens for Cropper.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'stage-bg': {
      default: 'var(--accent)',
      description:
        'Background fill of the crop canvas stage, visible as letterboxing when the image does not cover the full square.',
    },
    'overlay-color': {
      default: 'oklch(0.08 0.01 60 / 0.42)',
      description:
        'Color of the vignette mask painted outside the crop circle/rounded-rect. Defaults to a near-black at 42% opacity so the crop boundary reads on any image.',
    },
    'overlay-border': {
      default: 'oklch(1 0 0 / 0.45)',
      description:
        'Border drawn on the inner edge of the crop mask to delineate the crop area. Defaults to 45% white.',
    },
    'drop-active-ring': {
      default: 'var(--primary)',
      description:
        'Outline ring color applied to CropperViewport while an image file is dragged over it. Uses the brand primary so it matches the theme accent.',
    },
    'placeholder-color': {
      default: 'var(--muted-foreground)',
      description:
        'Icon and text color for the empty-state placeholder shown inside CropperViewport when no image has been loaded yet.',
    },
  },
});
