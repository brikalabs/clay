import { Separator } from '@brika/clay/components/separator';
import { defineDemos } from '../_registry';

/** Horizontal separator dividing two content blocks. */
export function SeparatorDefaultDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <p className="text-sm font-medium">Billing</p>
      <Separator />
      <p className="text-muted-foreground text-sm">Manage your subscription and payment methods.</p>
    </div>
  );
}

/** Vertical separator between inline elements. */
export function SeparatorVerticalDemo() {
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

/** Vertical separator in a navigation link row. */
export function SeparatorNavDemo() {
  return (
    <div className="flex h-5 items-center gap-3">
      <a href="#" className="text-sm hover:underline">Docs</a>
      <Separator orientation="vertical" />
      <a href="#" className="text-sm hover:underline">API</a>
      <Separator orientation="vertical" />
      <a href="#" className="text-sm hover:underline">GitHub</a>
    </div>
  );
}

/** Labelled horizontal separator — useful for sign-in "or continue with" patterns. */
export function SeparatorLabelledDemo() {
  return (
    <div className="w-64 flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-muted-foreground text-xs shrink-0">or continue with</span>
      <Separator className="flex-1" />
    </div>
  );
}

export const demoMeta = defineDemos([
  [SeparatorDefaultDemo, 'Default', { description: `Horizontal separator dividing two content blocks.` }],
  [SeparatorVerticalDemo, 'Vertical', { description: `Vertical separator between inline elements.` }],
  [SeparatorNavDemo, 'Nav', { description: `Vertical separator in a navigation link row.` }],
  [SeparatorLabelledDemo, 'Labelled', { description: `Labelled horizontal separator — useful for sign-in "or continue with" patterns.` }],
]);
export const accessibility: readonly string[] = [
  `Renders \`<hr>\` with \`role="separator"\` — meaningful to AT when it divides distinct content sections.`,
  `Pass \`aria-orientation="vertical"\` when used as a vertical divider between inline items.`,
  `Purely decorative separators should carry \`aria-hidden="true"\`.`,
];
