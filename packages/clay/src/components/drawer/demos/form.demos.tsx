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
import { Input } from '@brika/clay/components/input';
import { Label } from '@brika/clay/components/label';

/** Drawer used for mobile-first data entry, keeps the form reachable at the bottom of the screen. */
export default function DrawerFormDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>New project</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New project</DrawerTitle>
          <DrawerDescription>Enter a name to get started.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="grid gap-1.5">
            <Label htmlFor="project-name">Project name</Label>
            <Input id="project-name" placeholder="e.g. Marketing site" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Create project</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
