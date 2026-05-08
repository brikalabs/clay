/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'alert-dialog',
  displayName: 'Alert Dialog',
  group: 'Overlays',
  description: 'Confirmation dialog with destructive intent. Blocks interaction until resolved.',
  accessibility: [
    'Unlike `Dialog`, `AlertDialog` does not close on backdrop click, the user must explicitly respond.',
    'Focus defaults to the cancel action on open, reducing accidental destructive confirmations.',
    '`AlertDialogTitle` and `AlertDialogDescription` are announced immediately when the dialog opens.',
    'Only two outcomes are possible: confirm or cancel. Do not add other interactive elements.',
  ],
};
