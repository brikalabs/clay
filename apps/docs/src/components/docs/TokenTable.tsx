import {
  type ResolvedTokenSpec,
  TOKEN_REGISTRY,
  TOKEN_TYPE_HINT,
  type TokenCategory,
  type TokenLayer,
} from '@brika/clay/tokens';
import { Check, Copy, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TokenPreview } from './TokenPreview';
import { UtilityChips, utilitiesFor } from './TokenUtilityChips';
import { useCopy } from './useCopy';

interface TokenTableProps {
  /** Restrict the table to a single layer. */
  readonly layer?: TokenLayer;
  /** Restrict the table to a single category. */
  readonly category?: TokenCategory;
  /** Restrict to tokens that apply to this component. */
  readonly component?: string;
  /** Optional override of the heading; default is derived from filters. */
  readonly title?: string;
}

const LAYER_LABEL: Readonly<Record<TokenLayer, string>> = {
  scalar: 'Scalar',
  role: 'Role',
  component: 'Component',
};

interface CategoryMeta {
  readonly label: string;
  readonly hint: string;
  readonly hue: string;
}

/** Categories in render order. The hue is reused by the per-token type
 *  chip so chips visually cluster. */
const CATEGORIES: ReadonlyArray<readonly [TokenCategory, CategoryMeta]> = [
  ['color',      { label: 'Color',      hint: 'Fill, border, and text colors.',       hue: 'bg-purple-500/15 text-purple-700 dark:text-purple-300' }],
  ['geometry',   { label: 'Geometry',   hint: 'Sizes, lengths, and corner radii.',    hue: 'bg-sky-500/15 text-sky-700 dark:text-sky-300' }],
  ['border',     { label: 'Border',     hint: 'Border width and style.',              hue: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' }],
  ['typography', { label: 'Typography', hint: 'Typeface, size, weight, spacing.',     hue: 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300' }],
  ['elevation',  { label: 'Elevation',  hint: 'Drop shadow and depth.',               hue: 'bg-rose-500/15 text-rose-700 dark:text-rose-300' }],
  ['focus',      { label: 'Focus',      hint: 'Focus-ring appearance.',               hue: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300' }],
  ['motion',     { label: 'Motion',     hint: 'Animation duration and easing.',       hue: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' }],
  ['state',      { label: 'State',      hint: 'Hover / pressed / disabled overlays.', hue: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300' }],
];
const CATEGORY_META = Object.fromEntries(CATEGORIES) as Readonly<Record<TokenCategory, CategoryMeta>>;

const SEARCH_THRESHOLD = 8;

function visibleTokens({ layer, category, component }: TokenTableProps, query: string): ResolvedTokenSpec[] {
  const q = query.trim().toLowerCase();
  return TOKEN_REGISTRY.filter((t) => {
    if (layer && t.layer !== layer) return false;
    if (category && t.category !== category) return false;
    if (component && t.appliesTo !== component) return false;
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.themePath?.toLowerCase().includes(q) ?? false)
    );
  });
}

function deriveTitle(p: TokenTableProps): string {
  if (p.title) return p.title;
  if (p.component) return `${p.component} tokens`;
  const cat = p.category && CATEGORY_META[p.category].label;
  const layer = p.layer && LAYER_LABEL[p.layer];
  if (cat && layer) return `${layer} · ${cat}`;
  if (cat) return `${cat} tokens`;
  if (layer) return `${layer} tokens`;
  return 'All tokens';
}

function CopyButton({ text, label }: { readonly text: string; readonly label: string }) {
  const [copied, copy] = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={`Copy ${label}`}
      className="inline-flex size-5 shrink-0 items-center justify-center rounded text-clay-inactive opacity-0 transition-all hover:bg-clay-canvas hover:text-clay-strong focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-clay-strong focus-visible:outline-offset-2 group-hover:opacity-100"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

function TokenCard({ token }: { readonly token: ResolvedTokenSpec }) {
  const cssVar = `--${token.name}`;
  const utilities = utilitiesFor(token);
  return (
    <li className="group flex items-start gap-3 rounded-lg border border-clay-hairline bg-clay-canvas/20 p-3 transition-colors hover:border-clay-hairline hover:bg-clay-canvas/50">
      <div className="mt-0.5 shrink-0"><TokenPreview token={token} /></div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <code className="break-all font-mono text-clay-strong text-xs">{cssVar}</code>
          <CopyButton text={cssVar} label={`CSS variable ${cssVar}`} />
          <span
            title={TOKEN_TYPE_HINT[token.type]}
            className={`inline-flex shrink-0 items-center rounded px-1.5 py-px font-medium font-mono text-[0.5625rem] uppercase tracking-[0.08em] ${CATEGORY_META[token.category].hue}`}
          >
            {token.type}
          </span>
          <span aria-hidden className="ml-auto font-mono text-[0.625rem] text-clay-inactive">=</span>
          <code className="max-w-full truncate font-mono text-[0.6875rem] text-clay-subtle" title={token.defaultLight}>
            {token.defaultLight}
          </code>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {token.themePath && (
            <span className="flex items-center gap-1">
              <code className="break-all font-mono text-[0.6875rem] text-clay-subtle">{token.themePath}</code>
              <CopyButton text={token.themePath} label={`theme path ${token.themePath}`} />
            </span>
          )}
          {token.defaultDark && (
            <code className="font-mono text-[0.625rem] text-clay-inactive" title={`dark mode default: ${token.defaultDark}`}>
              dark · {token.defaultDark}
            </code>
          )}
        </div>
        <p className="text-[0.8125rem] text-clay-default leading-snug">{token.description}</p>
        {utilities.length > 0 && <div className="pt-1"><UtilityChips utilities={utilities} /></div>}
      </div>
    </li>
  );
}

function SearchInput({ value, onChange }: { readonly value: string; readonly onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-clay-hairline bg-clay-canvas/40 px-3 py-2 text-sm transition-colors focus-within:border-clay-strong">
      <Search size={14} className="shrink-0 text-clay-inactive" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter tokens by name, path, or description…"
        className="w-full bg-transparent text-clay-default outline-none placeholder:text-clay-inactive"
        aria-label="Filter tokens"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} className="font-mono text-[0.6875rem] text-clay-subtle uppercase tracking-wider hover:text-clay-strong">
          Clear
        </button>
      )}
    </label>
  );
}

/**
 * Render the token registry as a docs reference, grouped by category.
 *
 * Each row shows the CSS variable name, theme path, description, and
 * default value, with a live preview swatch. Click any code identifier
 * to copy it.
 */
export function TokenTable(props: TokenTableProps) {
  const [query, setQuery] = useState('');
  const all = useMemo(() => visibleTokens(props, ''), [props]);
  const filtered = useMemo(() => visibleTokens(props, query), [props, query]);
  const groups = useMemo(
    () => CATEGORIES.flatMap(([c]) => {
      const items = filtered.filter((t) => t.category === c);
      return items.length > 0 ? [[c, items] as const] : [];
    }),
    [filtered]
  );

  if (all.length === 0) {
    return <p className="not-prose font-mono text-clay-subtle text-sm">No tokens match these filters yet.</p>;
  }

  const totalSuffix = filtered.length === all.length ? '' : ` of ${all.length}`;
  const pluralSuffix = all.length === 1 ? '' : 's';
  const countLabel = `${filtered.length}${totalSuffix} token${pluralSuffix}`;

  return (
    <section className="not-prose flex flex-col gap-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-medium text-base text-clay-strong">{deriveTitle(props)}</h3>
        <span className="font-mono text-[0.6875rem] text-clay-subtle uppercase tracking-[0.12em]">{countLabel}</span>
      </header>

      {all.length >= SEARCH_THRESHOLD && <SearchInput value={query} onChange={setQuery} />}

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-clay-hairline bg-clay-canvas/20 px-4 py-6 text-center text-clay-subtle text-sm">
          No tokens match <code className="font-mono">{query}</code>.
        </p>
      ) : (
        groups.map(([category, items]) => (
          <section key={category} className="flex flex-col gap-3">
            <header className="flex items-baseline gap-3">
              <span className="font-medium font-mono text-[0.6875rem] text-clay-strong uppercase tracking-[0.14em]">{CATEGORY_META[category].label}</span>
              <span className="text-[0.75rem] text-clay-subtle italic">{CATEGORY_META[category].hint}</span>
              <span className="block h-px flex-1 bg-clay-hairline" />
              <span className="font-mono text-[0.625rem] text-clay-inactive tabular-nums">{items.length}</span>
            </header>
            <ul className="flex flex-col gap-2">
              {items.map((token) => <TokenCard key={token.name} token={token} />)}
            </ul>
          </section>
        ))
      )}
    </section>
  );
}
