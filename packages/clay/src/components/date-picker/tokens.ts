/**
 * Layer-2 tokens for DatePicker.
 *
 * The trigger borrows Button (variant="outline") styling and the panel
 * borrows Popover + Calendar styling, so this file only registers the
 * couple of slots unique to the picker shell, the placeholder text and
 * the leading calendar icon color.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'trigger-placeholder-color': {
      default: 'var(--muted-foreground)',
      description:
        'Foreground color of the trigger label when no date is selected (the placeholder copy).',
    },
    'trigger-icon-color': {
      default: 'var(--muted-foreground)',
      description: 'Color of the leading calendar icon rendered inside the trigger button.',
    },
  },
});
