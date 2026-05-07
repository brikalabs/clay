import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@brika/clay/components/input-group';
import { Search, X } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Currency field with dollar-sign prefix and currency code suffix. */
export function InputGroupDefaultDemo() {
  return (
    <div className="w-full max-w-xs">
      <InputGroup>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput placeholder="0.00" type="number" min={0} step={0.01} />
        <InputGroupAddon align="inline-end">USD</InputGroupAddon>
      </InputGroup>
    </div>
  );
}

/** Search field with a leading icon and a trailing clear button. */
export function InputGroupSearchDemo() {
  return (
    <div className="w-full max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search components…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="ghost" size="icon-xs" aria-label="Clear search">
            <X className="size-3.5" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

/** URL field with a fixed scheme prefix to guide input format. */
export function InputGroupUrlDemo() {
  return (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="your-domain.com" type="text" />
      </InputGroup>
    </div>
  );
}

/** Textarea variant, block-level addon labels above and below a multiline input. */
export function InputGroupTextareaDemo() {
  return (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <span className="text-xs font-medium">System prompt</span>
        </InputGroupAddon>
        <InputGroupAddon align="inline-start">
          <InputGroupText>AI</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="You are a helpful assistant…" />
      </InputGroup>
    </div>
  );
}

export const demoMeta = defineDemos([
  [InputGroupDefaultDemo, 'Default', { description: `Currency field with dollar-sign prefix and currency code suffix.` }],
  [InputGroupSearchDemo, 'Search', { description: `Search field with a leading icon and a trailing clear button.` }],
  [InputGroupUrlDemo, 'Url', { description: `URL field with a fixed scheme prefix to guide input format.` }],
  [InputGroupTextareaDemo, 'Textarea', { description: `Textarea variant, block-level addon labels above and below a multiline input.` }],
]);
export const accessibility: readonly string[] = [
  `Addons are presentational, always pair the group with a \`<Label>\` that describes the full field.`,
  `Icon-only addon buttons require an \`aria-label\`.`,
  `The visible prefix (e.g. "https://") is part of the label context; announce it via \`aria-label\` on the input if needed.`,
];
