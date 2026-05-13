import { Button } from '@brika/clay/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';

/**
 * Disabled buttons don't fire pointer or focus events, so tooltips never
 * trigger. Use `aria-disabled` instead — the button stays focusable and
 * keyboard-reachable, the tooltip works, and the click handler guards
 * against the disabled action.
 */
export default function TooltipDisabledElementDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-disabled="true"
            className="opacity-50"
            onClick={(event) => event.preventDefault()}
          >
            Publish
          </Button>
        </TooltipTrigger>
        <TooltipContent>You need editor permissions to publish.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
