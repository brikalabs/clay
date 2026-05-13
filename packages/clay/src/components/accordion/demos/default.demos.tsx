'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@brika/clay/components/accordion';
/** Single-select FAQ accordion, one item open at a time, collapsible. */
export default function AccordionDefaultDemo() {
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
