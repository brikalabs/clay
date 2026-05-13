import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@brika/clay/components/navigation-menu';
/** Plain link items with no flyout, use `navigationMenuTriggerStyle()` for consistent sizing. */
export default function NavigationMenuSimpleLinksDemo() {
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
