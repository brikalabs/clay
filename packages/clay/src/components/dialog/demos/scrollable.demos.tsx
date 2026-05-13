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
const TERMS_SECTIONS = [
  'general',
  'account',
  'payments',
  'content',
  'privacy',
  'security',
  'liability',
  'termination',
  'disputes',
  'changes',
] as const;

/** Dialog with long scrollable content, the panel caps at 85vh and scrolls internally. */
export default function DialogScrollableDemo() {
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
          {TERMS_SECTIONS.map((section, idx) => (
            <p key={section}>
              Section {idx + 1}: Lorem ipsum dolor sit amet, consectetur
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
