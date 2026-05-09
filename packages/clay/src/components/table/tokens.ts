/**
 * Layer-2 tokens for Table.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
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
    'head-color': {
      default: 'var(--foreground)',
      description: 'Foreground color of `<TableHead>` cells.',
    },
    'caption-color': {
      default: 'var(--muted-foreground)',
      description: 'Foreground color of the `<TableCaption>` rendered beneath the table.',
    },
  },
});
