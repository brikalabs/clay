/**
 * Grouped grid of every Clay component, partitioned by category
 * (Primitives / Forms / Overlays / Navigation / Feedback / Layout /
 * Data). Each card shows the component name, its token count, and a
 * mini swatch strip pulled from the component's first colored slot
 * tokens. Replaces the Combobox picker with a more visually scannable
 * layout that matches the docs' /components index.
 */

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  COMPONENT_GROUPS,
  componentsInGroup,
  type ComponentEntry,
} from '~/lib/component-registry';
import { Input } from '@brika/clay/components/input';
import { tokenCountFor, tokensFor } from './state/component-tokens';

interface ComponentGridProps {
  readonly onSelect: (slug: string) => void;
}

export function ComponentGrid({ onSelect }: ComponentGridProps) {
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();
  const groups = useMemo(() => {
    return COMPONENT_GROUPS.map((group) => {
      const all = componentsInGroup(group);
      const items = all
        .filter((c) => tokenCountFor(c.slug) > 0)
        .filter((c) =>
          trimmed
            ? c.name.toLowerCase().includes(trimmed) ||
              c.slug.includes(trimmed) ||
              c.description.toLowerCase().includes(trimmed)
            : true
        );
      return { group, items };
    }).filter((g) => g.items.length > 0);
  }, [trimmed]);

  const totalCount = useMemo(
    () => groups.reduce((n, g) => n + g.items.length, 0),
    [groups]
  );

  return (
    <div className="flex flex-col gap-4">
      <label className="group flex items-center gap-2 rounded-xl border border-clay-hairline bg-clay-elevated/50 px-3 py-2 backdrop-blur-popover focus-within:border-clay-strong">
        <Search size={14} className="shrink-0 text-clay-subtle" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a component…"
          aria-label="Find a component"
          className="h-7 border-0 bg-transparent px-0 py-0 shadow-none outline-none focus-visible:ring-0"
        />
        <span className="font-mono text-[0.625rem] text-clay-subtle uppercase tracking-[0.08em] tabular-nums">
          {totalCount} {totalCount === 1 ? 'component' : 'components'}
        </span>
      </label>

      {groups.length === 0 && (
        <div className="rounded-xl border border-clay-hairline border-dashed bg-clay-canvas/20 px-4 py-10 text-center font-mono text-[0.6875rem] text-clay-subtle italic">
          No components match your query.
        </div>
      )}

      {groups.map(({ group, items }) => (
        <section key={group} className="flex flex-col gap-2">
          <header className="flex items-baseline gap-3">
            <span className="font-medium font-mono text-[0.6875rem] text-clay-strong uppercase tracking-[0.14em]">
              {group}
            </span>
            <span className="block h-px flex-1 bg-clay-hairline" />
            <span className="font-mono text-[0.625rem] text-clay-inactive tabular-nums">
              {items.length}
            </span>
          </header>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {items.map((entry) => (
              <ComponentCard key={entry.slug} entry={entry} onSelect={onSelect} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

interface ComponentCardProps {
  readonly entry: ComponentEntry;
  readonly onSelect: (slug: string) => void;
}

function ComponentCard({ entry, onSelect }: ComponentCardProps) {
  const swatches = useMemo(() => extractSwatches(entry.slug), [entry.slug]);
  const count = swatches.length === 0 ? 0 : tokenCountFor(entry.slug);
  return (
    <button
      type="button"
      onClick={() => onSelect(entry.slug)}
      className="group flex flex-col items-stretch gap-2 rounded-xl border border-clay-hairline bg-clay-elevated/50 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-clay-strong hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-strong/40 backdrop-blur-popover"
    >
      <div className="flex h-7 w-full overflow-hidden rounded-md ring-1 ring-clay-hairline">
        {swatches.length > 0 ? (
          swatches.map((c, i) => (
            <span
              key={`${entry.slug}-${i}`}
              className="block h-full flex-1"
              style={{ background: c }}
              aria-hidden
            />
          ))
        ) : (
          <span
            aria-hidden
            className="block h-full flex-1 bg-clay-canvas/40"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 4px, transparent 4px 8px)',
            }}
          />
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate font-medium text-clay-strong text-xs group-hover:text-clay-strong">
          {entry.name}
        </span>
        <span className="shrink-0 font-mono text-[0.5625rem] text-clay-inactive tabular-nums">
          {count} {count === 1 ? 'token' : 'tokens'}
        </span>
      </div>
    </button>
  );
}

/** Pull up to four CSS-resolvable color values from this component's slot tokens. */
function extractSwatches(slug: string): readonly string[] {
  const tokens = tokensFor(slug).filter((t) => t.category === 'color');
  // Component slot defaults are typically `var(--<role>)` chains — we
  // pass them through as-is and let the browser resolve them inside the
  // hero card's surface (which inherits the live theme).
  return tokens.slice(0, 4).map((t) => t.defaultLight);
}
