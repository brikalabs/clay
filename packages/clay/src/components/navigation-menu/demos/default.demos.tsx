import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@brika/clay/components/navigation-menu';
/** Flyout navigation with two trigger menus and a plain link. */
export default function NavigationMenuDefaultDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-4 w-64">
              <li>
                <NavigationMenuLink asChild>
                  <a href="https://example.com" className="flex flex-col gap-1 rounded-md p-3 text-sm hover:bg-accent">
                    <span className="font-medium">Introduction</span>
                    <span className="text-muted-foreground text-xs">Install and configure Clay.</span>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a href="https://example.com" className="flex flex-col gap-1 rounded-md p-3 text-sm hover:bg-accent">
                    <span className="font-medium">Theming</span>
                    <span className="text-muted-foreground text-xs">Customize your design tokens.</span>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-4 w-64">
              <li>
                <NavigationMenuLink asChild>
                  <a href="https://example.com" className="flex flex-col gap-1 rounded-md p-3 text-sm hover:bg-accent">
                    <span className="font-medium">Button</span>
                    <span className="text-muted-foreground text-xs">Interactive action surfaces.</span>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a href="https://example.com" className="flex flex-col gap-1 rounded-md p-3 text-sm hover:bg-accent">
                    <span className="font-medium">Dialog</span>
                    <span className="text-muted-foreground text-xs">Modal overlays for focused tasks.</span>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="https://example.com" className={navigationMenuTriggerStyle()}>Changelog</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
