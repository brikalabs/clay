import { Button } from '@brika/clay/components/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@brika/clay/components/sheet';
/** Left-side sheet, commonly used as an off-canvas navigation panel. */
export default function SheetLeftDemo() {
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
          <a href="https://example.com" className="font-medium text-foreground hover:underline">Dashboard</a>
          <a href="https://example.com" className="text-muted-foreground hover:underline">Projects</a>
          <a href="https://example.com" className="text-muted-foreground hover:underline">Team</a>
          <a href="https://example.com" className="text-muted-foreground hover:underline">Settings</a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
