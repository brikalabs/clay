import { Button } from '@brika/clay/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
/** Wrap a disabled button in a focusable span so hover events reach the tooltip. */
export default function TooltipDisabledElementDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* NOSONAR: disabled buttons don't fire pointer/focus events in any browser, so the
              W3C-recommended tooltip workaround wraps them in a focusable span. S6845 doesn't
              recognize this pattern; switching to a real button or role=button breaks it. */}
          <span tabIndex={0} className="inline-block">
            <Button disabled>Publish</Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>You need editor permissions to publish.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
