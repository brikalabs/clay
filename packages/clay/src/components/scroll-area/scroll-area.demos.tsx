import { Card, CardContent, CardHeader, CardTitle } from '@brika/clay/components/card';
import { ScrollArea, ScrollBar } from '@brika/clay/components/scroll-area';
import { defineDemos } from '../_registry';

const TAGS = [
  'typescript', 'react', 'tailwindcss', 'radix-ui', 'vite', 'astro', 'bun',
  'framer-motion', 'zod', 'tanstack-query', 'drizzle-orm', 'lucia-auth',
];

const SETTINGS = [
  'Appearance', 'Notifications', 'Privacy', 'Security', 'Connected apps',
  'Billing', 'API keys', 'Webhooks', 'Team members', 'Audit log',
  'Domains', 'Exports', 'Integrations', 'Danger zone',
];

/** Vertical scroll area constraining a long list to a fixed height. */
export function ScrollAreaDefaultDemo() {
  const rows = Array.from({ length: 20 }, (_, i) => `Component ${i + 1}`);
  return (
    <ScrollArea className="h-72 w-64 rounded-md border border-clay-hairline">
      <ul className="divide-y divide-clay-hairline">
        {rows.map((row) => (
          <li key={row} className="px-4 py-2 text-clay-default text-sm">
            {row}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

/** Horizontal scroll — use `ScrollBar orientation="horizontal"` to show a horizontal bar. */
export function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea className="w-80 whitespace-nowrap rounded-md border border-clay-hairline pb-3">
      <div className="flex gap-2 px-4 py-3">
        {TAGS.map((tag) => (
          <span
            key={tag}
            className="inline-flex shrink-0 items-center rounded-full border border-clay-hairline bg-clay-elevated px-3 py-1 font-mono text-clay-default text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

/** Scroll area inside a Card — constrains a tall settings list inside a bounded surface. */
export function ScrollAreaCardDemo() {
  return (
    <Card className="w-64">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-48">
          <ul className="divide-y divide-clay-hairline px-0">
            {SETTINGS.map((item) => (
              <li
                key={item}
                className="cursor-pointer px-4 py-2 text-clay-default text-sm hover:bg-clay-control"
              >
                {item}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export const demoMeta = defineDemos([
  [ScrollAreaDefaultDemo, 'Default', { description: `Vertical scroll area constraining a long list to a fixed height.` }],
  [ScrollAreaHorizontalDemo, 'Horizontal', { description: `Horizontal scroll — use \`ScrollBar orientation="horizontal"\` to show a horizontal bar.` }],
  [ScrollAreaCardDemo, 'Card', { description: `Scroll area inside a Card — constrains a tall settings list inside a bounded surface.` }],
]);
export const accessibility: readonly string[] = [
  `The scrollable region carries \`role="region"\` — pair with \`aria-label\` for context.`,
  `Custom scrollbars do not affect keyboard scrolling — arrow keys and Page Up/Down work normally.`,
  `Horizontal scroll areas should be announced; users may not expect horizontal scrolling.`,
];
