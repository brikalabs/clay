/**
 * Layer-2 tokens for DataTable.
 *
 * The bulk of the visual surface comes from the `table` namespace
 * (header bg, row hover, head color, caption color). DataTable only
 * adds the two extras specific to its sortable + selectable behaviour.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'sort-indicator-color': {
      default: 'var(--muted-foreground)',
      description:
        'Color of the chevron rendered next to a sortable column header (asc / desc / unsorted).',
    },
    'selected-row-bg': {
      default: 'var(--accent)',
      description:
        'Background fill applied to a row when it is selected via the row-selection checkbox.',
    },
  },
});
