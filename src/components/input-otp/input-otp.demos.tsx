'use client';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@brika/clay/components/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Six-digit OTP split into two groups of three with a dash separator. */
export function InputOTPDefaultDemo() {
  return (
    <InputOTP maxLength={6}>
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
  );
}

/** Four-slot PIN entry without a separator — suitable for numeric PINs. */
export function InputOTPPatternDemo() {
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

/** Digits-only input using the REGEXP_ONLY_DIGITS pattern — rejects letters and symbols. */
export function InputOTPNumericDemo() {
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

/** Controlled OTP that shows a Verify button only once all six slots are filled. */
export function InputOTPControlledDemo() {
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

export const demoMeta = defineDemos([
  [InputOTPDefaultDemo, 'Input O T P Default', { description: `Six-digit OTP split into two groups of three with a dash separator.` }],
  [InputOTPPatternDemo, 'Input O T P Pattern', { description: `Four-slot PIN entry without a separator — suitable for numeric PINs.` }],
  [InputOTPNumericDemo, 'Input O T P Numeric', { description: `Digits-only input using the REGEXP_ONLY_DIGITS pattern — rejects letters and symbols.` }],
  [InputOTPControlledDemo, 'Input O T P Controlled', { description: `Controlled OTP that shows a Verify button only once all six slots are filled.` }],
]);
export const accessibility: readonly string[] = [
  `Paste works out-of-the-box — pasting a code fills all slots.`,
  `A single hidden \`<input>\` handles the value; each visible slot is a presentation of that input's characters.`,
  `The active slot gets a focus ring matching the input's focus state.`,
  `Numeric-only patterns should use \`inputMode="numeric"\` to bring up the numeric keyboard on mobile.`,
];
