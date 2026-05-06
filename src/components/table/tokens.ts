/**
 * Layer-2 tokens for Table.
 */

import { defineComponent } from '../../tokens/define';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  slots: {
    'header-bg': {
      default: 'var(--muted)',
      description: 'Background for the table footer (and any consumer-defined header rows).',
    },
    'row-hover-bg': {
      default: 'var(--muted)',
      description:
        'Background for hovered and selected rows; the hover state applies it at 50% opacity.',
    },
  },
});
