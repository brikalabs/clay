import { Button } from '@brika/clay/components/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@brika/clay/components/hover-card';
/** Open delay can be customised via the openDelay prop on HoverCard. */
export default function HoverCardDelayDemo() {
  return (
    <div className="flex items-center gap-4">
      <HoverCard openDelay={0}>
        <HoverCardTrigger asChild>
          <Button variant="link">Instant</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-48 text-sm">Opens with no delay.</HoverCardContent>
      </HoverCard>
      <HoverCard openDelay={700}>
        <HoverCardTrigger asChild>
          <Button variant="link">700 ms</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-48 text-sm">Opens after 700 ms.</HoverCardContent>
      </HoverCard>
    </div>
  );
}
