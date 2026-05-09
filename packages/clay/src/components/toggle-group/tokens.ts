/**
 * Layer-2 tokens for ToggleGroup.
 *
 * The wrapper owns the unified frame (border, fill, dividers) while
 * each item still routes its own colors through the `toggle-*` slots.
 * These tokens isolate the frame and the inter-item dividers so themes
 * can retune the cluster surface without touching plain inputs.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'frame-container': {
      default: 'var(--input-container)',
      description:
        'Background fill of the toggle-group frame. Defaults to the `--input-container` role so a group reads as a single grouped control matching other inputs.',
    },
    'frame-border': {
      default: 'var(--input-border)',
      description:
        'Border color of the toggle-group outer frame. Defaults to the `--input-border` role so the frame matches other input edges.',
    },
    'divider-color': {
      default: 'var(--input-border)',
      description:
        'Color of the 1px separator drawn between adjacent items inside the group (left edge in horizontal orientation, top edge in vertical). Defaults to `--input-border` so dividers blend with the frame.',
    },
  },
});
