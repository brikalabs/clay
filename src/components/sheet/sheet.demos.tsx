import { Button } from '@brika/clay/components/button';
import { Input } from '@brika/clay/components/input';
import { Label } from '@brika/clay/components/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@brika/clay/components/sheet';
import { Textarea } from '@brika/clay/components/textarea';
import { defineDemos } from '../_registry';

/** Right-side sheet (default) — suited for filters, detail views, and settings panels. */
export function SheetDefaultDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow the results using the controls below.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-4 py-6 text-muted-foreground text-sm">
          Filter controls go here.
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Reset</Button>
          </SheetClose>
          <Button>Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/** Left-side sheet — commonly used as an off-canvas navigation panel. */
export function SheetLeftDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open nav</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Browse sections of the application.</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 px-4 py-6 text-sm">
          <a href="#" className="font-medium text-foreground hover:underline">Dashboard</a>
          <a href="#" className="text-muted-foreground hover:underline">Projects</a>
          <a href="#" className="text-muted-foreground hover:underline">Team</a>
          <a href="#" className="text-muted-foreground hover:underline">Settings</a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

/** Sheet with a form — useful for quick data entry without navigating away. */
export function SheetFormDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add item</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add item</SheetTitle>
          <SheetDescription>
            Fill in the details below and click save to add the item.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 py-6">
          <div className="grid gap-1.5">
            <Label htmlFor="item-name">Name</Label>
            <Input id="item-name" placeholder="Item name" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="item-notes">Notes</Label>
            <Textarea id="item-notes" placeholder="Optional notes…" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save item</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const demoMeta = defineDemos([
  [SheetDefaultDemo, 'Default', { description: `Right-side sheet (default) — suited for filters, detail views, and settings panels.` }],
  [SheetLeftDemo, 'Left', { description: `Left-side sheet — commonly used as an off-canvas navigation panel.` }],
  [SheetFormDemo, 'Form', { description: `Sheet with a form — useful for quick data entry without navigating away.` }],
]);
export const accessibility: readonly string[] = [
  `Focus is trapped inside the sheet while open.`,
  `Escape dismisses the sheet and returns focus to the trigger.`,
  `\`SheetTitle\` is required for an accessible name — use \`sr-only\` to visually hide it if the design omits a heading.`,
  `The \`side\` prop ("top", "right", "bottom", "left") does not affect AT semantics.`,
];
