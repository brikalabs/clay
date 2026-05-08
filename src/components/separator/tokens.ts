/**
 * Layer-2 tokens for Separator.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    color: { default: 'var(--border)', description: 'Separator line color.' },
    width: { default: '1px', description: 'Separator line thickness.' },
    style: { default: 'solid', description: 'Separator line style (`solid`, `dashed`, `double`).' },
  },
});
