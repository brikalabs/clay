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
    'fallback-container': {
      default: 'var(--muted)',
      description: 'Background of the avatar fallback (and the `<AvatarGroupCount>` chip).',
    },
    'fallback-label': {
      default: 'var(--muted-foreground)',
      description: 'Text color (initials) of the avatar fallback.',
    },
    'badge-container': {
      default: 'var(--primary)',
      description:
        'Background of the small `<AvatarBadge>` indicator pinned to the bottom-right corner.',
    },
    'badge-label': {
      default: 'var(--primary-foreground)',
      description: 'Foreground (icon / count) color of the `<AvatarBadge>` indicator.',
    },
    'ring-color': {
      default: 'var(--background)',
      description:
        'Color of the 2px ring drawn around the avatar badge and around grouped avatars to separate them from the surrounding surface.',
    },
  },
});
