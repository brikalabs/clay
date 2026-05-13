import { Badge } from '@brika/clay/components/badge';

/** `asChild` renders badge styles on the child element, useful for version or tag links. */
export default function BadgeAsLinkDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge asChild variant="outline">
        <a href="https://example.com">v2.0.0</a>
      </Badge>
      <Badge asChild variant="secondary">
        <a href="https://example.com">MIT</a>
      </Badge>
    </div>
  );
}
