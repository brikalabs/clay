import { Separator } from '@brika/clay/components/separator';

/** Vertical separator between inline elements. */
export default function SeparatorVerticalDemo() {
  return (
    <div className="flex h-5 items-center gap-3">
      <span className="text-muted-foreground text-sm">Jan 2025</span>
      <Separator orientation="vertical" />
      <span className="text-muted-foreground text-sm">v1.4.2</span>
      <Separator orientation="vertical" />
      <span className="text-muted-foreground text-sm">MIT</span>
    </div>
  );
}
