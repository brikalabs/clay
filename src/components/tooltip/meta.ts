/**
 * Component metadata picked up by the auto-registry. Static prose
 * metadata (description, accessibility callouts, external docs) lives
 * here so consumers can read it without pulling in React, icons, or
 * the demo helpers.
 */

import type { ComponentMeta } from '../_registry';

export const meta: ComponentMeta = {
  name: 'tooltip',
  displayName: 'Tooltip',
  group: 'Overlays',
  description: 'Hovered or focused text overlay. Wrap roots in `<TooltipProvider>`.',
  accessibility: [
    'Tooltips open on both hover and keyboard focus, use for supplementary info, not required instructions.',
    'Never place interactive elements inside a `TooltipContent`, use `Popover` instead.',
    '`delayDuration={0}` on the provider makes tooltips instant, which helps keyboard-only users.',
    'Wrap disabled buttons in a focusable `<span tabIndex={0}>` so the tooltip fires on focus.',
  ],
};
