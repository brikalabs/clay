'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@brika/clay/components/accordion';
/** Multiple open sections at once, pass `type="multiple"` to the root. */
export default function AccordionMultipleDemo() {
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
