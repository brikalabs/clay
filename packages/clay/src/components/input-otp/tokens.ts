import { registerComponent } from '../../tokens/define';
import { meta } from './meta';

registerComponent(meta, {
  radius: {
    default: 'var(--radius-control)',
    description: 'OTP slot corner radius.',
  },
  surface: { borderWidth: '1px' },
  backdropBlur: {
    default: '0px',
    description:
      'Backdrop blur applied to the input-otp slot surface. Set non-zero for a frosted-glass treatment.',
  },
  slots: {
    size: { default: '2.5rem', description: 'OTP slot width and height.' },
  },
  typography: { fontSize: 'var(--text-body-md)', fontWeight: '500' },
});
