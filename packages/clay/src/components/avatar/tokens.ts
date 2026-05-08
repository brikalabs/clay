/**
 * Layer-2 tokens for Avatar.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: '9999px',
    description: 'Avatar corner radius. Default is fully circular.',
  },
  slots: {
    size: { default: '2rem', description: 'Avatar diameter at the default size.' },
  },
});
