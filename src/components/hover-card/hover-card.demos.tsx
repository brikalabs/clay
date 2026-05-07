import { Avatar, AvatarFallback, AvatarImage } from '@brika/clay/components/avatar';
import { Button } from '@brika/clay/components/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@brika/clay/components/hover-card';
import { defineDemos } from '../_registry';

/** Hover over an inline element to preview non-critical supplemental content. */
export function HoverCardDefaultDemo() {
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

/** Rich profile preview with avatar, display name, handle, bio, and join date. */
export function HoverCardProfileDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@jane_doe</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-3">
          <Avatar className="size-10 shrink-0">
            <AvatarImage src="https://i.pravatar.cc/40?u=jane" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <div>
              <p className="font-semibold text-sm leading-none">Jane Doe</p>
              <p className="mt-0.5 text-muted-foreground text-xs">@jane_doe</p>
            </div>
            <p className="text-sm leading-snug">
              Product designer at Brika. Passionate about design systems and accessible interfaces.
            </p>
            <p className="text-muted-foreground text-xs">Joined March 2022</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

/** Open delay can be customised via the openDelay prop on HoverCard. */
export function HoverCardDelayDemo() {
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

export const demoMeta = defineDemos([
  [HoverCardDefaultDemo, 'Default', { description: `Hover over an inline element to preview non-critical supplemental content.` }],
  [HoverCardProfileDemo, 'Profile', { description: `Rich profile preview with avatar, display name, handle, bio, and join date.` }],
  [HoverCardDelayDemo, 'Delay', { description: `Open delay can be customised via the openDelay prop on HoverCard.` }],
]);
export const accessibility: readonly string[] = [
  `Content opens on hover AND focus, keyboard users can trigger it via Tab.`,
  `Not suitable for content that must be permanently reachable, use \`Popover\` for interactive content.`,
  `Ensure the trigger is keyboard-focusable; an \`asChild\` link or button works well.`,
];
