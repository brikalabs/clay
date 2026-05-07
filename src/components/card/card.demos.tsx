import { Badge } from '@brika/clay/components/badge';
import { Button } from '@brika/clay/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@brika/clay/components/card';
import { Input } from '@brika/clay/components/input';
import { Label } from '@brika/clay/components/label';
import { defineDemos } from '../_registry';

/** Plain card with header and body content. */
export function CardDefaultDemo() {
  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Welcome to Clay</CardTitle>
        <CardDescription>Pressable raw material for every Brika surface.</CardDescription>
      </CardHeader>
      <CardContent>Build UI with tokens that travel between apps.</CardContent>
    </Card>
  );
}

/** Six accent variants mapped to the theme data-* palette. */
export function CardAccentDemo() {
  const accents = ['blue', 'emerald', 'orange', 'violet', 'purple', 'amber'] as const;
  return (
    <div className="flex flex-wrap gap-3">
      {accents.map((accent) => (
        <Card key={accent} accent={accent} className="w-36">
          <CardHeader>
            <CardTitle className="capitalize text-sm">{accent}</CardTitle>
            <CardDescription className="text-xs">data-{accents.indexOf(accent) + 1}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

/** Interactive card with hover lift, wrap in an anchor for full link behaviour. */
export function CardInteractiveDemo() {
  return (
    <Card interactive className="w-72 cursor-pointer">
      <CardHeader>
        <CardTitle>Hover me</CardTitle>
        <CardDescription>Interactive cards lift on hover and can wrap any clickable element.</CardDescription>
      </CardHeader>
    </Card>
  );
}

/** Form card pattern, title, inputs, and a footer action. */
export function CardFormDemo() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Account details</CardTitle>
        <CardDescription>Update your display name and email address.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="display-name">Display name</Label>
          <Input id="display-name" defaultValue="Jane Doe" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="jane@example.com" />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
}

/** Stats card showing a key metric with a trend indicator. */
export function CardStatsDemo() {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardDescription>Active users</CardDescription>
        <div className="flex items-end justify-between gap-2">
          <CardTitle className="text-3xl font-bold">2,847</CardTitle>
          <Badge variant="secondary" className="mb-0.5">+12% this week</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Up from 2,541 last week
      </CardContent>
    </Card>
  );
}

export const demoMeta = defineDemos([
  [CardDefaultDemo, 'Default', { description: `Plain card with header and body content.` }],
  [CardAccentDemo, 'Accent', { description: `Six accent variants mapped to the theme data-* palette.` }],
  [CardInteractiveDemo, 'Interactive', { description: `Interactive card with hover lift, wrap in an anchor for full link behaviour.` }],
  [CardFormDemo, 'Form', { description: `Form card pattern, title, inputs, and a footer action.` }],
  [CardStatsDemo, 'Stats', { description: `Stats card showing a key metric with a trend indicator.` }],
]);
export const accessibility: readonly string[] = [
  `Card is a layout container with no implicit role, add \`role="article"\` for standalone content.`,
  `Interactive cards (with the \`interactive\` prop) should also carry \`tabIndex={0}\` and \`onKeyDown\` for keyboard activation.`,
  `Accent color is visual only, convey variant meaning through text or \`aria-label\` as well.`,
];
