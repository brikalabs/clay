'use client';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@brika/clay/components/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

/** Digits-only input using the REGEXP_ONLY_DIGITS pattern, rejects letters and symbols. */
export default function InputOTPNumericDemo() {
  return (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
