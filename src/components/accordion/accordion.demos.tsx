'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@brika/clay/components/accordion';
import { useState } from 'react';
import { defineDemos } from '../_registry';

/** Single-select FAQ accordion, one item open at a time, collapsible. */
export function AccordionDefaultDemo() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-sm">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is a design system?</AccordionTrigger>
        <AccordionContent>
          A design system is a collection of reusable components, guidelines, and tokens that
          teams use to build consistent interfaces across products.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is Clay accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. Every component is built on Radix UI primitives, which handle ARIA roles,
          keyboard navigation, and focus management.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I use custom themes?</AccordionTrigger>
        <AccordionContent>
          Yes. The token system lets you override any CSS variable at the theme level without
          touching component source code.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/** Multiple open sections at once, pass `type="multiple"` to the root. */
export function AccordionMultipleDemo() {
  return (
    <Accordion type="multiple" className="w-full max-w-sm">
      <AccordionItem value="item-1">
        <AccordionTrigger>Styling</AccordionTrigger>
        <AccordionContent>
          Components read from CSS custom properties. Override tokens in your theme to restyle
          without touching component code.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Animation</AccordionTrigger>
        <AccordionContent>
          Height transitions use the <code>--radix-accordion-content-height</code> custom
          property injected by Radix. Both sections can be open simultaneously.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Composition</AccordionTrigger>
        <AccordionContent>
          AccordionItem, AccordionTrigger, and AccordionContent are all exported and composable
          independently.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/** Disabled item, set `disabled` on `AccordionItem` to prevent interaction. */
export function AccordionDisabledDemo() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-sm">
      <AccordionItem value="item-1">
        <AccordionTrigger>Available feature</AccordionTrigger>
        <AccordionContent>This item is interactive and can be toggled.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Unavailable feature</AccordionTrigger>
        <AccordionContent>This content is inaccessible when the item is disabled.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Another available feature</AccordionTrigger>
        <AccordionContent>This item is also interactive.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/** Controlled accordion, manage open state externally with `value` and `onValueChange`. */
export function AccordionControlledDemo() {
  const [value, setValue] = useState<string>('item-1');

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex gap-2">
        {['item-1', 'item-2', 'item-3'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setValue(value === item ? '' : item)}
            className="rounded border border-clay-hairline bg-clay-elevated px-2 py-1 font-mono text-clay-default text-xs hover:bg-clay-control"
          >
            {item}
          </button>
        ))}
      </div>
      <Accordion type="single" collapsible value={value} onValueChange={setValue}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section one</AccordionTrigger>
          <AccordionContent>Opened and closed by external state.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section two</AccordionTrigger>
          <AccordionContent>Click a button above to jump between sections.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Section three</AccordionTrigger>
          <AccordionContent>The accordion reflects whatever value is passed in.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export const demoMeta = defineDemos([
  [AccordionDefaultDemo, 'Default', { description: `Single-select FAQ accordion, one item open at a time, collapsible.` }],
  [AccordionMultipleDemo, 'Multiple', { description: `Multiple open sections at once, pass \`type="multiple"\` to the root.` }],
  [AccordionDisabledDemo, 'Disabled', { description: `Disabled item, set \`disabled\` on \`AccordionItem\` to prevent interaction.` }],
  [AccordionControlledDemo, 'Controlled', { description: `Controlled accordion, manage open state externally with \`value\` and \`onValueChange\`.` }],
]);
export const accessibility: readonly string[] = [
  `Triggers carry \`aria-expanded\` and \`aria-controls\`, no extra markup needed.`,
  `Content panels are hidden from AT via \`aria-hidden\` when collapsed.`,
  `\`type="single" collapsible\` lets the open item be closed; omit \`collapsible\` to always keep one open.`,
  `Arrow keys and Home/End navigate between triggers when focus is inside the accordion.`,
];
