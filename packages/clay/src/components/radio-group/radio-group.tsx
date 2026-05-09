'use client';

import { CircleIcon } from 'lucide-react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-2', className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'radio-group peer corner-themed aspect-square size-radio-group-size rounded-radio-group border-radio-group-unchecked-border bg-radio-group-unchecked-container shadow-surface outline-none transition-[color,background-color,border-color,box-shadow] focus-visible:ring-themed disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-radio-group-invalid-border aria-invalid:ring-radio-group-invalid-ring/20 data-[state=checked]:border-radio-group-checked-border data-[state=checked]:bg-radio-group-checked-container dark:aria-invalid:ring-radio-group-invalid-ring/40',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <CircleIcon className="size-[45%] fill-radio-group-indicator-color stroke-none" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
