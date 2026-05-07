'use client';

import { Textarea } from '@brika/clay/components/textarea';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Multi-line text input in its default auto-sizing state. */
export function TextareaDefaultDemo() {
  return (
    <div className="w-full max-w-sm">
      <Textarea placeholder="Tell us about your project…" />
    </div>
  );
}

/** Fixed height using the rows attribute. */
export function TextareaRowsDemo() {
  return (
    <div className="w-full max-w-sm">
      <Textarea rows={6} placeholder="Paste your content here (6 rows fixed)…" />
    </div>
  );
}

/** Disabled textarea blocks interaction and reduces opacity. */
export function TextareaDisabledDemo() {
  return (
    <div className="w-full max-w-sm">
      <Textarea disabled defaultValue="This field is locked and cannot be edited." />
    </div>
  );
}

/** Validation error state, aria-invalid triggers the destructive border. */
export function TextareaInvalidDemo() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-1">
      <Textarea aria-invalid="true" defaultValue="x" rows={3} />
      <p className="text-destructive text-xs">Description must be at least 20 characters.</p>
    </div>
  );
}

/** Controlled textarea showing a live character counter. */
export function TextareaControlledDemo() {
  const MAX = 280;
  const [value, setValue] = useState('');
  return (
    <div className="w-full max-w-sm flex flex-col gap-1">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={MAX}
        placeholder="What's on your mind?"
        rows={4}
      />
      <p className="text-right text-xs text-muted-foreground">
        {value.length} / {MAX}
      </p>
    </div>
  );
}

export const demoMeta = defineDemos([
  [TextareaDefaultDemo, 'Default', { description: `Multi-line text input in its default auto-sizing state.` }],
  [TextareaRowsDemo, 'Rows', { description: `Fixed height using the rows attribute.` }],
  [TextareaDisabledDemo, 'Disabled', { description: `Disabled textarea blocks interaction and reduces opacity.` }],
  [TextareaInvalidDemo, 'Invalid', { description: `Validation error state, aria-invalid triggers the destructive border.` }],
  [TextareaControlledDemo, 'Controlled', { description: `Controlled textarea showing a live character counter.` }],
]);
export const accessibility: readonly string[] = [
  `Always associate with a \`<Label>\` via matching \`id\` / \`htmlFor\`.`,
  `\`aria-invalid="true"\` triggers the destructive ring; pair with a visible error message via \`aria-describedby\`.`,
  `Disabled textareas are removed from the tab order, use \`readOnly\` when content must stay focusable.`,
  `Character count readouts should be linked via \`aria-describedby\` so AT announces remaining characters.`,
];
