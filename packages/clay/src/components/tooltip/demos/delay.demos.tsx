import { Button } from '@brika/clay/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
/** Control open delay with delayDuration on the provider, 0 makes it instant. */
export default function TooltipDelayDemo() {
  return (
    <div className="flex items-center gap-4">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Instant
            </Button>
          </TooltipTrigger>
          <TooltipContent>No delay</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={700}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              700 ms delay
            </Button>
          </TooltipTrigger>
          <TooltipContent>Opens after 700 ms</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
