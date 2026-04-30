import { defineComponent } from '../../tokens/define';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  radius: {
    default: '9999px',
    description: 'Radio button border radius.',
    alias: 'radio-group',
  },
  surface: { borderWidth: '1px' },
  slots: {
    size: { default: '1rem', description: 'Radio button diameter.' },
  },
});
