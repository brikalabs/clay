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
import { Input } from '@brika/clay/components/input';
import { Label } from '@brika/clay/components/label';
import { defineDemos } from '../_registry';

/** Clean modal with a title, description, and two footer actions. */
export function DialogDefaultDemo() {
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

/** Dialog wrapping a form, useful for inline editing without leaving the page. */
export function DialogFormDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your display name and email address.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Jane Smith" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="jane@example.com" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Dialog with long scrollable content, the panel caps at 85vh and scrolls internally. */
export function DialogScrollableDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View terms</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>Last updated January 2025.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2 text-muted-foreground text-sm">
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i}>
              Section {i + 1}: Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat duis aute irure dolor in reprehenderit.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const demoMeta = defineDemos([
  [DialogDefaultDemo, 'Default', { description: `Clean modal with a title, description, and two footer actions.` }],
  [DialogFormDemo, 'Form', { description: `Dialog wrapping a form, useful for inline editing without leaving the page.` }],
  [DialogScrollableDemo, 'Scrollable', { description: `Dialog with long scrollable content, the panel caps at 85vh and scrolls internally.` }],
]);
export const accessibility: readonly string[] = [
  `Focus is trapped inside the dialog while open, Tab cycles only through its interactive elements.`,
  `Escape and clicking the backdrop close the dialog and return focus to the trigger.`,
  `\`DialogTitle\` is required and becomes the accessible name, use \`sr-only\` to visually hide it if needed.`,
  `Scrollable content should be the scrollable region, not the entire dialog.`,
];
