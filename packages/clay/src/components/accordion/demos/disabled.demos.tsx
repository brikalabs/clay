'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@brika/clay/components/accordion';
/** Disabled item, set `disabled` on `AccordionItem` to prevent interaction. */
export default function AccordionDisabledDemo() {
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
