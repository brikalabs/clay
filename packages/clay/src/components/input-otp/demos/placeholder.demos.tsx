'use client';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@brika/clay/components/input-otp';
/** Muted dot placeholder in each empty slot, fades out on focus or fill. */
export default function InputOTPPlaceholderDemo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} placeholder />
        <InputOTPSlot index={1} placeholder />
        <InputOTPSlot index={2} placeholder />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} placeholder />
        <InputOTPSlot index={4} placeholder />
        <InputOTPSlot index={5} placeholder />
      </InputOTPGroup>
    </InputOTP>
  );
}
