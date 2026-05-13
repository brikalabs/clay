'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@brika/clay/components/accordion';
import { useState } from 'react';

/** Controlled accordion, manage open state externally with `value` and `onValueChange`. */
export default function AccordionControlledDemo() {
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
