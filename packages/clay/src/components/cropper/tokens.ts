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
      default: 'color-mix(in oklch, var(--background) 55%, transparent)',
      description:
        'Color of the vignette mask painted outside the crop circle/rounded-rect. Defaults to a soft wash of the theme background at 55% so the outside region is gently de-emphasised without a heavy black overlay. In light themes this is a pale wash; in dark themes a dark wash. Override with any color-mix or solid value to taste.',
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
