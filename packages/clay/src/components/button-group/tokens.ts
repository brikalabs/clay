/**
 * Layer-2 tokens for ButtonGroup.
 *
 * The wrapper owns the unified frame (border, fill, dividers, optional
 * separator) while each child button still routes its own colors through
 * the `button-*` slots. These tokens isolate the cluster surface so themes
 * can retune the grouped frame without touching plain inputs.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'frame-container': {
      default: 'var(--input-container)',
      description:
        'Background fill of the button-group frame. Defaults to the `--input-container` role so a group reads as a single grouped control matching other inputs.',
    },
    'frame-border': {
      default: 'var(--input-border)',
      description:
        'Border color of the button-group outer frame. Defaults to the `--input-border` role so the frame matches other input edges.',
    },
    'divider-color': {
      default: 'var(--input-border)',
      description:
        'Color of the 1px separator drawn between adjacent buttons in the group, and of the explicit `ButtonGroupSeparator` bar. Defaults to `--input-border` so dividers blend with the frame.',
    },
    'text-color': {
      default: 'var(--muted-foreground)',
      description:
        'Foreground color of the inline `ButtonGroupText` label slot. Defaults to the muted-foreground role so plain text inside a group reads as supporting content.',
    },
  },
});
