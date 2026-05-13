'use client';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@brika/clay/components/input-otp';
/** Four-slot PIN entry without a separator, suitable for numeric PINs. */
export default function InputOTPPatternDemo() {
  return (
    <InputOTP maxLength={4}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
}
