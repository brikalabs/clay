/**
 * Layer-2 tokens for Section.
 *
 * Section composes a `Card` for its container surface, so border / radius
 * / background come from the Card layer. The only Section-owned themed
 * surface is the muted description line under the title.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'description-color': {
      default: 'var(--muted-foreground)',
      description:
        'Foreground color of `<SectionDescription>`, the muted line under the section title.',
    },
  },
});
