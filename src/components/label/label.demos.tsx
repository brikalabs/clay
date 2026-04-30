import { Input } from '@brika/clay/components/input';
import { Label } from '@brika/clay/components/label';
import { defineDemos } from '../_registry';

/** Label paired with an input — clicking the label focuses the field. */
export function LabelDefaultDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <Label htmlFor="email-demo">Email address</Label>
      <Input id="email-demo" type="email" placeholder="you@example.com" />
    </div>
  );
}

/** Required field — add an asterisk inside a span to signal mandatory status. */
export function LabelRequiredDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <Label htmlFor="username-demo">
        Username <span className="text-destructive" aria-hidden="true">*</span>
      </Label>
      <Input id="username-demo" placeholder="brika_user" required />
    </div>
  );
}

/** Label on a disabled field — inherits reduced opacity via the peer-disabled class. */
export function LabelDisabledDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <Label htmlFor="api-key-demo" className="peer">API key</Label>
      <Input id="api-key-demo" disabled defaultValue="sk-live-••••••••" />
    </div>
  );
}

export const demoMeta = defineDemos([
  [LabelDefaultDemo, 'Default', { description: `Label paired with an input — clicking the label focuses the field.` }],
  [LabelRequiredDemo, 'Required', { description: `Required field — add an asterisk inside a span to signal mandatory status.` }],
  [LabelDisabledDemo, 'Disabled', { description: `Label on a disabled field — inherits reduced opacity via the peer-disabled class.` }],
]);
export const accessibility: readonly string[] = [
  `Renders a \`<label>\` element — clicking it focuses the associated input.`,
  `Always link to the input via \`htmlFor\` matching the input's \`id\`.`,
  `Required-field indicators (* or "required") should be inside the label or referenced via \`aria-describedby\`.`,
  `Disabled labels inherit \`opacity-50\` visually; no ARIA change is needed.`,
];
