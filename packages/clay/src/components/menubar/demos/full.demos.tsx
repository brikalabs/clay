import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@brika/clay/components/menubar';
/** Checkbox items for toggled settings and radio items for mutually exclusive options. */
export default function MenubarFullDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Show toolbar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show status bar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show activity bar</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Panel position</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarRadioGroup value="bottom">
                <MenubarRadioItem value="bottom">Bottom</MenubarRadioItem>
                <MenubarRadioItem value="right">Right</MenubarRadioItem>
                <MenubarRadioItem value="left">Left</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Zoom in <MenubarShortcut>⌘+</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Zoom out <MenubarShortcut>⌘-</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Reset zoom <MenubarShortcut>⌘0</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
