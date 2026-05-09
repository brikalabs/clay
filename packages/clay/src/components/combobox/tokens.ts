/**
 * Layer-2 tokens for Combobox.
 *
 * Most of the combobox surface inherits styling from its composed
 * parts (Popover for the floating panel, Command for the listbox,
 * Button for the trigger), so this slot list is intentionally narrow.
 * It only owns the bits the recipe layers on top of those primitives:
 * the placeholder color shown on the trigger when no value is picked,
 * and the check-mark color used to mark the selected item in the list.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'trigger-placeholder-color': {
      default: 'var(--muted-foreground)',
      description:
        'Foreground color of the placeholder rendered inside the trigger button when no value is selected.',
    },
    'selected-icon-color': {
      default: 'var(--foreground)',
      description:
        'Color of the check icon shown next to the currently selected option inside the listbox.',
    },
  },
});
