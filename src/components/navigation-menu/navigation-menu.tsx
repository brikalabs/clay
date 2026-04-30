'use client';

import { cva } from 'class-variance-authority';
import { ChevronDownIcon } from 'lucide-react';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../primitives/cn';
import { withSlot } from '../../primitives/with-slot';

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  /** When `true` (default), renders a `NavigationMenuViewport` at the root for flyout panels. */
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn('relative flex max-w-max flex-1 items-center justify-center', className)}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    />
  );
}

const NavigationMenuItem = withSlot(NavigationMenuPrimitive.Item, 'navigation-menu-item');

const navigationMenuTriggerStyle = cva(
  "corner-themed group inline-flex h-(--navigation-menu-height) w-max items-center justify-center gap-1 rounded-navigation-menu bg-background px-(--navigation-menu-padding-x) py-(--navigation-menu-padding-y) font-(--navigation-menu-font-weight) text-sm outline-none transition-[color,background-color] duration-(--navigation-menu-duration) ease-(--navigation-menu-easing) hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 focus-visible:ring-themed"
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="relative top-px ml-1 size-3 transition-transform duration-(--navigation-menu-duration) group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        'data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out md:absolute md:w-auto',
        className
      )}
      {...props}
    />
  );
}

const NavigationMenuLink = withSlot(NavigationMenuPrimitive.Link, 'navigation-menu-link');

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute left-0 top-full flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 corner-themed relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-navigation-menu-viewport border-(length:--navigation-menu-viewport-border-width) bg-popover text-popover-foreground shadow-navigation-menu-viewport [border-style:var(--navigation-menu-viewport-border-style)] data-[state=closed]:animate-out data-[state=open]:animate-in md:w-(--radix-navigation-menu-viewport-width)',
          className
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        'data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=visible]:animate-in',
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
