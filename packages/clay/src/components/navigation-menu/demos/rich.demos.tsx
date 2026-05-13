import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@brika/clay/components/navigation-menu';
/** Rich flyout panel containing a featured item alongside a grid of documentation links. */
export default function NavigationMenuRichDemo() {
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
