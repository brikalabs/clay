import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
} from '@brika/clay/components/avatar';
import { Circle } from 'lucide-react';

/** AvatarBadge overlays a status indicator in the bottom-right corner. */
export default function AvatarBadgeDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>AR</AvatarFallback>
        <AvatarBadge className="bg-success" aria-label="Online">
          <Circle className="fill-current" />
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarFallback>TH</AvatarFallback>
        <AvatarBadge className="bg-muted-foreground" aria-label="Away" />
      </Avatar>
    </div>
  );
}
