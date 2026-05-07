'use client';

import { type VariantProps } from 'class-variance-authority';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';
import { toggleVariants } from '../toggle/toggle';

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: 'default',
  variant: 'default',
});

// Unified-frame wrapper, mirroring ButtonGroup. The frame (border, shadow,
// outer rounded corners, dividers) is owned by the wrapper. Direct children
// are stripped of their own border/shadow/rounding so two adjacent items
// can never paint a doubled edge between them. First / last children round
// their outer corners to match the wrapper without `overflow-hidden`, so
// focus rings stay visible. Items keep their own `data-[state=on]` accent
// fill for the selection affordance.
const wrapperClasses = [
  'isolate inline-flex w-fit rounded-toggle border border-input-border bg-input-container shadow-surface',
  '[&>*]:!rounded-none [&>*]:!border-0 [&>*]:!shadow-none [&>*]:relative',
  '[&>*]:focus-visible:z-10',
].join(' ');

const horizontalClasses = [
  '[&>*:first-child]:!rounded-l-toggle [&>*:last-child]:!rounded-r-toggle',
  '[&>*:not(:first-child)]:!border-l [&>*:not(:first-child)]:!border-l-input-border',
].join(' ');

const verticalClasses = [
  'flex-col',
  '[&>*:first-child]:!rounded-t-toggle [&>*:last-child]:!rounded-b-toggle',
  '[&>*:not(:first-child)]:!border-t [&>*:not(:first-child)]:!border-t-input-border',
].join(' ');

function ToggleGroup({
  className,
  variant,
  size,
  orientation = 'horizontal',
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  const contextValue = React.useMemo(() => ({ variant, size }), [variant, size]);
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        wrapperClasses,
        orientation === 'vertical' ? verticalClasses : horizontalClasses,
        className
      )}
      {...props}
    >
      <ToggleGroupContext value={contextValue}>{children}</ToggleGroupContext>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.use(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
        }),
        'min-w-0',
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
