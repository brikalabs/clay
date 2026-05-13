import { Avatar, AvatarFallback, AvatarImage } from '@brika/clay/components/avatar';
import { Button } from '@brika/clay/components/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@brika/clay/components/hover-card';
/** Rich profile preview with avatar, display name, handle, bio, and join date. */
export default function HoverCardProfileDemo() {
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
