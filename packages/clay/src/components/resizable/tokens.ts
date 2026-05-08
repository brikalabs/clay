import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  slots: {
    'handle-size': { default: '1px', description: 'Resize handle thickness along the resize axis.' },
    'handle-color': { default: 'var(--border)', description: 'Resting handle color.' },
    'handle-hover': {
      default: 'var(--primary)',
      description: 'Hover-state handle color; applied at 40% opacity.',
    },
  },
});
