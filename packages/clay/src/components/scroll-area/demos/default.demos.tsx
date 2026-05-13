import { ScrollArea } from '@brika/clay/components/scroll-area';

/** Vertical scroll area constraining a long list to a fixed height. */
export default function ScrollAreaDefaultDemo() {
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
