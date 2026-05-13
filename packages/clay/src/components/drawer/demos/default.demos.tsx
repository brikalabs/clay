import { Button } from '@brika/clay/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@brika/clay/components/drawer';
/** Bottom-sheet overlay, drag the handle or tap outside to close. */
export default function DrawerDefaultDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Publish changes</DrawerTitle>
          <DrawerDescription>
            Review and confirm before pushing to production.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Publish</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
