/**
 * Layer-2 tokens for PageHeader.
 *
 * PageHeader is structural (layout + typography), the only themed surface
 * is the muted description line below the title. Title color is left to
 * inherit from the document root so themes that re-color the page heading
 * cascade through automatically.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'description-color': {
      default: 'var(--muted-foreground)',
      description:
        'Foreground color of `<PageHeaderDescription>` (and the inline `<PageHeaderCount>` chip). Defaults to the muted role so the description reads as secondary against the title.',
    },
  },
});
