/**
 * One collapsible section of the editor. The trigger sits on a glass
 * surface with a serif italic title (matching the rest of the docs
 * site's tone) and a small mono count chip on the right.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@brika/clay/components/accordion';
import type { ReactNode } from 'react';

const SERIF = '"Instrument Serif", "Iowan Old Style", Georgia, "Times New Roman", serif';

interface CategoryAccordionProps {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly count?: number;
  readonly defaultOpen?: boolean;
  readonly children: ReactNode;
}

export function CategoryAccordion({
  id,
  label,
  hint,
  count,
  defaultOpen,
  children,
}: CategoryAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? id : undefined}
      className="overflow-hidden rounded-xl border border-clay-hairline bg-clay-elevated/50 backdrop-blur-popover"
    >
      <AccordionItem value={id} className="border-b-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <span className="flex flex-1 items-baseline gap-3">
            <span
              className="text-clay-strong text-xl leading-none"
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                letterSpacing: '-0.012em',
              }}
            >
              {label}
            </span>
            {hint && (
              <span className="font-mono text-[0.6875rem] text-clay-subtle italic">
                {hint}
              </span>
            )}
            {count !== undefined && (
              <span className="ml-auto inline-flex items-center justify-center rounded-full bg-clay-canvas/40 px-2 py-0.5 font-mono text-[0.625rem] text-clay-subtle tabular-nums">
                {count}
              </span>
            )}
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-1 pb-4">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
