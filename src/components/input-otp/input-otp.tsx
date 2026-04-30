'use client';

import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        'flex items-center gap-2 has-[:disabled]:opacity-50',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center', className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & { index: number }) {
  const inputOTPContext = React.use(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index] ?? {
    char: null,
    hasFakeCaret: false,
    isActive: false,
  };

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'corner-themed relative flex size-(--input-otp-size) items-center justify-center border-input-border bg-input-container font-(--input-otp-font-weight) text-sm shadow-surface outline-none transition-all duration-(--input-otp-duration) ease-(--input-otp-easing)',
        '[border-top-width:var(--input-otp-border-width)] [border-bottom-width:var(--input-otp-border-width)] [border-right-width:var(--input-otp-border-width)] first:rounded-l-input-otp first:[border-left-width:var(--input-otp-border-width)] last:rounded-r-input-otp',
        'data-[active=true]:z-10 data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50 data-[active=true]:border-ring',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon className="size-4 text-muted-foreground" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
