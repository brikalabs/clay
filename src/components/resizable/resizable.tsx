'use client';

import { GripVerticalIcon } from 'lucide-react';
import * as React from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';

import { cn } from '../../primitives/cn';

// Group sets flex-direction via inline style — no orientation CSS class needed.
const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof Group>) => (
  <Group
    data-slot="resizable-panel-group"
    className={cn('h-full w-full overflow-hidden', className)}
    {...props}
  />
);

const ResizablePanel = (props: React.ComponentProps<typeof Panel>) => <Panel {...props} />;

// In react-resizable-panels v4 the Separator's aria-orientation is the OPPOSITE
// of the Group orientation:
//   Group orientation="horizontal" → Separator aria-orientation="vertical"   (vertical bar between panels)
//   Group orientation="vertical"   → Separator aria-orientation="horizontal" (horizontal bar between panels)
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  /** Renders a visible grip icon on the handle. */
  withHandle?: boolean;
}) => (
  <Separator
    data-slot="resizable-handle"
    className={cn(
      'relative shrink-0 bg-border outline-none transition-colors hover:bg-primary/40 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
      // Vertical bar (horizontal group)
      '[&[aria-orientation=vertical]]:flex [&[aria-orientation=vertical]]:w-px [&[aria-orientation=vertical]]:cursor-col-resize [&[aria-orientation=vertical]]:items-center [&[aria-orientation=vertical]]:justify-center',
      // Horizontal bar (vertical group)
      '[&[aria-orientation=horizontal]]:flex [&[aria-orientation=horizontal]]:h-px [&[aria-orientation=horizontal]]:w-full [&[aria-orientation=horizontal]]:cursor-row-resize [&[aria-orientation=horizontal]]:items-center [&[aria-orientation=horizontal]]:justify-center',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-background shadow-sm">
        <GripVerticalIcon className="size-2.5 text-muted-foreground" />
      </div>
    )}
  </Separator>
);

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
