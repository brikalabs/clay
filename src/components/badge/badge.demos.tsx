import { Badge } from '@brika/clay/components/badge';
import { Check, Circle } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Default filled badge — use for status labels, counts, and tags. */
export function BadgeDefaultDemo() {
  return <Badge>New</Badge>;
}

/** All five variants, ordered by emphasis. */
export function BadgeVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}

/** SVG children are automatically sized to 12 px — no extra className needed. */
export function BadgeWithIconDemo() {
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

/** `asChild` renders badge styles on the child element — useful for version or tag links. */
export function BadgeAsLinkDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge asChild variant="outline">
        <a href="#">v2.0.0</a>
      </Badge>
      <Badge asChild variant="secondary">
        <a href="#">MIT</a>
      </Badge>
    </div>
  );
}

export const demoMeta = defineDemos([
  [BadgeDefaultDemo, 'Default', { description: `Default filled badge — use for status labels, counts, and tags.` }],
  [BadgeVariantsDemo, 'Variants', { description: `All five variants, ordered by emphasis.` }],
  [BadgeWithIconDemo, 'With Icon', { description: `SVG children are automatically sized to 12 px — no extra className needed.` }],
  [BadgeAsLinkDemo, 'As Link', { description: `\`asChild\` renders badge styles on the child element — useful for version or tag links.` }],
]);
export const accessibility: readonly string[] = [
  `Renders as a \`<span>\` — purely informational, carries no interactive role.`,
  `When used as a link with \`asChild\`, the accessible name comes from the badge text.`,
  `Numeric count badges in tab triggers should be accompanied by a visually hidden description.`,
];
