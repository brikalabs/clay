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
import { defineDemos } from '../_registry';

const NOTIFICATIONS = [
  { id: 1, title: 'New comment on your post', time: '2 min ago' },
  { id: 2, title: 'Jane left a review', time: '14 min ago' },
  { id: 3, title: 'Build succeeded', time: '1 hr ago' },
  { id: 4, title: 'Deployment complete', time: '2 hr ago' },
  { id: 5, title: 'New team member joined', time: '3 hr ago' },
  { id: 6, title: 'Weekly report is ready', time: 'Yesterday' },
  { id: 7, title: 'Storage usage at 80%', time: '2 days ago' },
];

/** Bottom-sheet overlay — drag the handle or tap outside to close. */
export function DrawerDefaultDemo() {
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

/** Drawer with a scrollable list body and a fixed footer — suited for notification feeds or item pickers. */
export function DrawerScrollableDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">View notifications</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>{NOTIFICATIONS.length} unread</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-2" style={{ maxHeight: '40vh' }}>
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="flex items-start justify-between border-b py-3 last:border-0"
            >
              <span className="text-sm">{n.title}</span>
              <span className="ml-4 shrink-0 text-muted-foreground text-xs">{n.time}</span>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Mark all read</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

/** Drawer used for mobile-first data entry — keeps the form reachable at the bottom of the screen. */
export function DrawerFormDemo() {
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

export const demoMeta = defineDemos([
  [DrawerDefaultDemo, 'Default', { description: `Bottom-sheet overlay — drag the handle or tap outside to close.` }],
  [DrawerScrollableDemo, 'Scrollable', { description: `Drawer with a scrollable list body and a fixed footer — suited for notification feeds or item pickers.` }],
  [DrawerFormDemo, 'Form', { description: `Drawer used for mobile-first data entry — keeps the form reachable at the bottom of the screen.` }],
]);
export const accessibility: readonly string[] = [
  `Focus is trapped inside the drawer while open.`,
  `Escape dismisses the drawer; the drag handle is decorative and keyboard users dismiss with Escape.`,
  `\`DrawerTitle\` is required for an accessible name.`,
  `Ensure scrollable content inside the drawer is reachable by keyboard, not only by touch-drag.`,
];
