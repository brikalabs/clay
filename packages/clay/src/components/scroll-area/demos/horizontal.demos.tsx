import { ScrollArea, ScrollBar } from '@brika/clay/components/scroll-area';
const TAGS = [
  'typescript', 'react', 'tailwindcss', 'radix-ui', 'vite', 'astro', 'bun',
  'framer-motion', 'zod', 'tanstack-query', 'drizzle-orm', 'lucia-auth',
];

/** Horizontal scroll, use `ScrollBar orientation="horizontal"` to show a horizontal bar. */
export default function ScrollAreaHorizontalDemo() {
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
