import { defineComponent } from '../../tokens/define';
import { meta } from './meta';

export const tokens = defineComponent(meta.name, {
  radius: {
    default: 'var(--radius-control)',
    description: 'OTP slot corner radius.',
    alias: 'input-otp',
  },
  surface: { borderWidth: '1px' },
  slots: {
    size: { default: '2.5rem', description: 'OTP slot width and height.' },
  },
  typography: { fontSize: 'var(--text-body-md)', fontWeight: '500' },
});
