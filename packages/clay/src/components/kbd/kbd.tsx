/**
 * Kbd, inline keyboard-shortcut hint.
 *
 * Wraps the native `<kbd>` element in a small monospace pill so chords
 * like `⌘K` or `Ctrl+Shift+P` line up with surrounding body copy. Decorative
 * by design, `pointer-events-none` and `select-none` keep it out of the
 * interaction model so a kbd inside a button doesn't intercept clicks.
 *
 * Usage:
 *   <Kbd>⌘</Kbd>
 *   <KbdGroup aria-label="Open command palette">
 *     <Kbd>Ctrl</Kbd>
 *     <Kbd>K</Kbd>
 *   </KbdGroup>
 *   <Button variant="outline">Accept <Kbd>⏎</Kbd></Button>
 */

import * as React from 'react';

import { cn } from '../../primitives/cn';

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "kbd pointer-events-none inline-flex w-fit shrink-0 select-none items-center justify-center whitespace-nowrap rounded-kbd border border-kbd-border-color bg-kbd-container text-kbd-label align-middle min-w-(--kbd-height) [&_svg:not([class*='size-'])]:size-3 in-data-[slot=tooltip-content]:border-transparent in-data-[slot=tooltip-content]:bg-tooltip-surface-label/15 in-data-[slot=tooltip-content]:text-tooltip-surface-label",
        className
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-1 align-middle', className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
