import { Button } from '@brika/clay/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
import { defineDemos } from '../../component-registry';

/** Wrap any element with TooltipTrigger inside a TooltipProvider to add a tooltip. */
export function TooltipDefaultDemo() {
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

/** Control open delay with delayDuration on the provider, 0 makes it instant. */
export function TooltipDelayDemo() {
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

/** Wrap a disabled button in a focusable span so hover events reach the tooltip. */
export function TooltipDisabledElementDemo() {
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

/** Side and sideOffset control where the tooltip appears relative to its trigger. */
export function TooltipSidesDemo() {
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

export const demoMeta = defineDemos([
  [TooltipDefaultDemo, 'Default', { description: 'Wrap any element with TooltipTrigger inside a TooltipProvider to add a tooltip.' }],
  [TooltipDelayDemo, 'Delay', { description: 'Control open delay with delayDuration on the provider, 0 makes it instant.' }],
  [TooltipDisabledElementDemo, 'Disabled Element', { description: 'Wrap a disabled button in a focusable span so hover events reach the tooltip.' }],
  [TooltipSidesDemo, 'Sides', { description: 'Side and sideOffset control where the tooltip appears relative to its trigger.' }],
]);
