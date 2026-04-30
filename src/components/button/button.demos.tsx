import { Button } from '@brika/clay/components/button';
import { Loader2, Settings } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Default solid button — use for the primary call-to-action. */
export function ButtonDefaultDemo() {
  return <Button>Save changes</Button>;
}

/** Six emphasis tiers in one row, ordered from most to least prominent. */
export function ButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}

/** Four text sizes, plus matching icon-only variants (`icon-xs` through `icon-lg`). */
export function ButtonSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

/** Icon-only button — `aria-label` is required for screen readers. */
export function ButtonIconDemo() {
  return (
    <Button size="icon" aria-label="Open settings">
      <Settings />
    </Button>
  );
}

/** Disabled with a spinner — use while an async operation is in flight. */
export function ButtonLoadingDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button disabled>
        <Loader2 className="animate-spin" />
        Saving…
      </Button>
      <Button variant="outline" disabled>
        <Loader2 className="animate-spin" />
        Loading
      </Button>
    </div>
  );
}

/** `asChild` delegates button styles to the child element — here an anchor tag. */
export function ButtonAsLinkDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild>
        <a href="#">Browse components</a>
      </Button>
      <Button asChild variant="outline">
        <a href="#">View on GitHub</a>
      </Button>
    </div>
  );
}

export const demoMeta = defineDemos([
  [ButtonDefaultDemo, 'Default', { description: `Default solid button — use for the primary call-to-action.` }],
  [ButtonVariantsDemo, 'Variants', { description: `Six emphasis tiers in one row, ordered from most to least prominent.` }],
  [ButtonSizesDemo, 'Sizes', { description: `Four text sizes, plus matching icon-only variants (\`icon-xs\` through \`icon-lg\`).` }],
  [ButtonIconDemo, 'Icon', { description: `Icon-only button — \`aria-label\` is required for screen readers.` }],
  [ButtonLoadingDemo, 'Loading', { description: `Disabled with a spinner — use while an async operation is in flight.` }],
  [ButtonAsLinkDemo, 'As Link', { description: `\`asChild\` delegates button styles to the child element — here an anchor tag.` }],
]);
export const accessibility: readonly string[] = [
  `Focus ring uses \`--ring\` token for WCAG contrast.`,
  `\`disabled\` removes pointer events and reduces opacity; it does not set \`aria-disabled\`.`,
  `Icon-only buttons (\`size="icon"\`) REQUIRE an \`aria-label\` — there is no text fallback.`,
  `\`asChild\` passes all button props (including \`role\` and \`aria-*\`) to the child element.`,
];
