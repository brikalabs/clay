/**
 * Layer-2 tokens for Chart.
 *
 * The chart wrapper consumes the theme `--data-*` palette via the `color`
 * prop; only the tooltip surface and a fallback line color are owned by
 * the component itself.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'tooltip-container': {
      default: 'var(--popover)',
      description:
        'Background color of the chart tooltip surface. Defaults to the theme popover so tooltips read as floating UI.',
    },
    'tooltip-label': {
      default: 'var(--popover-foreground)',
      description:
        'Text color of the chart tooltip readout. Defaults to the theme popover foreground.',
    },
    'tooltip-border': {
      default: 'var(--border)',
      description:
        'Border color of the chart tooltip surface. Defaults to the theme border.',
    },
  },
});
