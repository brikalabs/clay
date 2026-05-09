/**
 * Layer-2 tokens for AlertDialog.
 *
 * AlertDialog reuses every dialog-* surface token (radius, shadow,
 * padding, overlay scrim, close button, description). This file only
 * registers the slots that are unique to the AlertDialog primitives
 * (`<AlertDialogMedia>`).
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'media-container': {
      default: 'var(--muted)',
      description:
        'Background of the `<AlertDialogMedia>` thumbnail / icon tile shown above the title.',
    },
    'border-color': {
      default: 'var(--border)',
      description:
        'Border color drawn around the `<AlertDialogContent>` surface. Defaults to the theme border color.',
    },
  },
});
