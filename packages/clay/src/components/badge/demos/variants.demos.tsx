import { Badge } from '@brika/clay/components/badge';

/** All five variants, ordered by emphasis. */
export default function BadgeVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}
