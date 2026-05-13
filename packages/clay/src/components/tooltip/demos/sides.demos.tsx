import { Button } from '@brika/clay/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
/** Side and sideOffset control where the tooltip appears relative to its trigger. */
export default function TooltipSidesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <TooltipProvider key={side} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Opens {side}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
