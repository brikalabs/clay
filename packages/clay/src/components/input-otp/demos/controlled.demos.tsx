'use client';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@brika/clay/components/input-otp';
import { useState } from 'react';

/** Controlled OTP that shows a Verify button only once all six slots are filled. */
export default function InputOTPControlledDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col items-center gap-4">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {value.length === 6 && (
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
          onClick={() => setValue('')}
        >
          Verify code
        </button>
      )}
    </div>
  );
}
