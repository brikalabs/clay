import { Separator } from '@brika/clay/components/separator';

/** Labelled horizontal separator, useful for sign-in "or continue with" patterns. */
export default function SeparatorLabelledDemo() {
  return (
    <div className="w-64 flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-muted-foreground text-xs shrink-0">or continue with</span>
      <Separator className="flex-1" />
    </div>
  );
}
