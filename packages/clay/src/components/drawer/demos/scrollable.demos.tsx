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
const NOTIFICATIONS = [
  { id: 1, title: 'New comment on your post', time: '2 min ago' },
  { id: 2, title: 'Jane left a review', time: '14 min ago' },
  { id: 3, title: 'Build succeeded', time: '1 hr ago' },
  { id: 4, title: 'Deployment complete', time: '2 hr ago' },
  { id: 5, title: 'New team member joined', time: '3 hr ago' },
  { id: 6, title: 'Weekly report is ready', time: 'Yesterday' },
  { id: 7, title: 'Storage usage at 80%', time: '2 days ago' },
];

/**
 * Drawer with a scrollable list body and a fixed footer, suited for notification feeds or item pickers.
 */
export default function DrawerScrollableDemo() {
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
