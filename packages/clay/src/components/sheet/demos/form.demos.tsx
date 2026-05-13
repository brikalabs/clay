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

/** Sheet with a form, useful for quick data entry without navigating away. */
export default function SheetFormDemo() {
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
