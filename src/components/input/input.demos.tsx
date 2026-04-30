import { Input } from '@brika/clay/components/input';
import { defineDemos } from '../_registry';

/** Single-line text input in its default state. */
export function InputDefaultDemo() {
  return <Input placeholder="Type something…" />;
}

/** Native input types — email, number, and search all pass through unchanged. */
export function InputTypesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Input type="email" placeholder="you@example.com" />
      <Input type="number" placeholder="42" />
      <Input type="search" placeholder="Search…" />
    </div>
  );
}

/** Validation error state — set aria-invalid to trigger the destructive border. */
export function InputInvalidDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <Input aria-invalid="true" defaultValue="jane@" />
      <p className="text-destructive text-xs">Enter a valid email address.</p>
    </div>
  );
}

/** Disabled input — blocks interaction and reduces opacity. */
export function InputDisabledDemo() {
  return <Input disabled placeholder="Not editable" className="max-w-xs" />;
}

/** Read-only input — focusable but not editable, useful for copy-able values. */
export function InputReadonlyDemo() {
  return <Input readOnly defaultValue="sk-live-xK9…mQ2" className="max-w-xs font-mono text-sm" />;
}

/** File picker using the native file input type. */
export function InputFileDemo() {
  return <Input type="file" className="max-w-xs" />;
}

export const demoMeta = defineDemos([
  [InputDefaultDemo, 'Default', { description: `Single-line text input in its default state.` }],
  [InputTypesDemo, 'Types', { description: `Native input types — email, number, and search all pass through unchanged.` }],
  [InputInvalidDemo, 'Invalid', { description: `Validation error state — set aria-invalid to trigger the destructive border.` }],
  [InputDisabledDemo, 'Disabled', { description: `Disabled input — blocks interaction and reduces opacity.` }],
  [InputReadonlyDemo, 'Readonly', { description: `Read-only input — focusable but not editable, useful for copy-able values.` }],
  [InputFileDemo, 'File', { description: `File picker using the native file input type.` }],
]);
export const accessibility: readonly string[] = [
  `Always pair with a \`<Label>\` via matching \`id\` / \`htmlFor\` — never rely on \`placeholder\` as a label.`,
  `\`aria-invalid="true"\` applies the destructive ring; pair with a visible error message linked via \`aria-describedby\`.`,
  `Disabled inputs are removed from the tab order; use \`readOnly\` when the content must stay focusable.`,
  `File inputs announce "Browse…" or similar on activation — ensure the label describes what to select.`,
];
