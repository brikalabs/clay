import { Badge } from '@brika/clay/components/badge';
import { Check, Circle } from 'lucide-react';

/** SVG children are automatically sized to 12 px, no extra className needed. */
export default function BadgeWithIconDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <Check />
        Verified
      </Badge>
      <Badge variant="outline">
        <Circle className="fill-current" />
        Active
      </Badge>
      <Badge variant="destructive">
        <Circle className="fill-current" />
        Blocked
      </Badge>
    </div>
  );
}
