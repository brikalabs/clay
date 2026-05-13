import { Button } from '@brika/clay/components/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@brika/clay/components/hover-card';
/** Hover over an inline element to preview non-critical supplemental content. */
export default function HoverCardDefaultDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@brika</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">Brika Labs</p>
          <p className="text-muted-foreground text-sm">
            Building Clay, the React component library and design system for Brika products.
          </p>
          <p className="text-muted-foreground text-xs">Joined January 2024</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
