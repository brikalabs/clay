import { Button } from '@brika/clay/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@brika/clay/components/dialog';
/** Clean modal with a title, description, and two footer actions. */
export default function DialogDefaultDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session expiring soon</DialogTitle>
          <DialogDescription>
            Your session will expire in 5 minutes due to inactivity. Save any
            unsaved work before continuing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Dismiss</Button>
          </DialogClose>
          <Button>Extend session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
