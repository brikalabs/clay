import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';
import { withSlot } from '../../primitives/with-slot';

const HoverCard = withSlot(HoverCardPrimitive.Root, 'hover-card');
const HoverCardTrigger = withSlot(HoverCardPrimitive.Trigger, 'hover-card-trigger');

function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'hover-card data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 corner-themed z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-hover-card bg-popover text-popover-foreground shadow-hover-card outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in',
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
