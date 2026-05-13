import { Button } from '@brika/clay/components/button';
import { Kbd, KbdGroup } from '@brika/clay/components/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
/** Inside `TooltipContent`, Kbd auto-recolors to read against the inverted surface. */
export default function KbdInTooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Print</Button>
        </TooltipTrigger>
        <TooltipContent>
          Print the document
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>P</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
