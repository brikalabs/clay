import { Separator } from '@brika/clay/components/separator';

/** Horizontal separator dividing two content blocks. */
export default function SeparatorDefaultDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <p className="text-sm font-medium">Billing</p>
      <Separator />
      <p className="text-muted-foreground text-sm">Manage your subscription and payment methods.</p>
    </div>
  );
}
