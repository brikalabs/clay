import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: '9999px',
    description: 'Radio button border radius.',
  },
  surface: { borderWidth: '1px' },
  slots: {
    size: { default: '1rem', description: 'Radio button diameter.' },
  },
});
