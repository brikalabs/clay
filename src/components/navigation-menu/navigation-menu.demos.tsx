import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@brika/clay/components/navigation-menu';
import { defineDemos } from '../_registry';

/** Flyout navigation with two trigger menus and a plain link. */
export function NavigationMenuDefaultDemo() {
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

/** Rich flyout panel containing a featured item alongside a grid of documentation links. */
export function NavigationMenuRichDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-[180px_1fr] gap-3 p-4 w-[480px]">
              <NavigationMenuLink asChild>
                <a
                  href="https://example.com"
                  className="flex h-full flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none hover:shadow-md focus:shadow-md"
                >
                  <div className="mt-4 mb-2 text-lg font-medium">Clay</div>
                  <p className="text-muted-foreground text-sm leading-tight">
                    Pressable raw material for every Brika surface.
                  </p>
                </a>
              </NavigationMenuLink>
              <ul className="grid gap-1">
                {[
                  { title: 'Installation', desc: 'How to add Clay to your project.' },
                  { title: 'Tokens', desc: 'CSS custom properties powering every component.' },
                  { title: 'Themes', desc: 'Swap the visual layer without a rebuild.' },
                  { title: 'Contributing', desc: 'Add components and improve the library.' },
                ].map((item) => (
                  <li key={item.title}>
                    <NavigationMenuLink asChild>
                      <a href="https://example.com" className="flex flex-col gap-0.5 rounded-md p-3 text-sm hover:bg-accent">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-muted-foreground text-xs">{item.desc}</span>
                      </a>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/** Plain link items with no flyout, use `navigationMenuTriggerStyle()` for consistent sizing. */
export function NavigationMenuSimpleLinksDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {['Docs', 'Components', 'Blog', 'Changelog'].map((label) => (
          <NavigationMenuItem key={label}>
            <NavigationMenuLink asChild>
              <a href="https://example.com" className={navigationMenuTriggerStyle()}>{label}</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export const demoMeta = defineDemos([
  [NavigationMenuDefaultDemo, 'Default', { description: `Flyout navigation with two trigger menus and a plain link.` }],
  [NavigationMenuRichDemo, 'Rich', { description: `Rich flyout panel containing a featured item alongside a grid of documentation links.` }],
  [NavigationMenuSimpleLinksDemo, 'Simple Links', { description: `Plain link items with no flyout, use \`navigationMenuTriggerStyle()\` for consistent sizing.` }],
]);
export const accessibility: readonly string[] = [
  `Arrow keys move between top-level items; Enter/Space opens flyout panels.`,
  `Active link state is indicated via \`data-active\`; ensure \`aria-current="page"\` is also set for AT.`,
  `Flyout panels are dismissed by moving focus outside or pressing Escape.`,
  `Use \`NavigationMenuLink\` with \`asChild\` for router-link integration.`,
];
