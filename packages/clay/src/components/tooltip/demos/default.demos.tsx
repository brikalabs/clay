import { Button } from '@brika/clay/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
/** Wrap any element with TooltipTrigger inside a TooltipProvider to add a tooltip. */
export default function TooltipDefaultDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Save draft</Button>
        </TooltipTrigger>
        <TooltipContent>Saves without publishing</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
