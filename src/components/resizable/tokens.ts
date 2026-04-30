import { defineComponent } from '../../tokens/define';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  slots: {
    'handle-size': { default: '0.25rem', description: 'Resize handle thickness.' },
    'handle-color': { default: 'var(--border)', description: 'Resize handle color.' },
    'handle-hover': { default: 'var(--primary)', description: 'Resize handle hover color.' },
  },
});
