'use client';

import { CircleIcon } from 'lucide-react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';
import { withSlot } from '../../primitives/with-slot';

const RadioGroup = withSlot(RadioGroupPrimitive.Root, 'radio-group');

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'radio-group peer corner-themed aspect-square size-(--radio-group-size) rounded-radio-group border-input-border bg-input-container shadow-surface outline-none transition-[color,background-color,border-color,box-shadow] focus-visible:ring-themed disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <CircleIcon className="size-[45%] fill-primary-foreground stroke-none" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
