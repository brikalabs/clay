import { Button } from '@brika/clay/components/button';
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
/** Right-side sheet (default), suited for filters, detail views, and settings panels. */
export default function SheetDefaultDemo() {
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
