/**
 * Layer-2 tokens for Skeleton.
 */

import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'pulse-color': {
      default: 'var(--accent)',
      description:
        'Background color of the skeleton placeholder block. The Tailwind `animate-pulse` keyframes fade this fill in and out to read as loading.',
    },
  },
});
