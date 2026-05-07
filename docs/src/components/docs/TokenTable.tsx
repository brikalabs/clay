import {
  type ResolvedTokenSpec,
  TOKEN_REGISTRY,
  TOKEN_TYPE_HINT,
  type TokenCategory,
  type TokenLayer,
  type TokenType,
} from '@brika/clay/tokens';
import { Check, Copy, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

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

const CATEGORY_ORDER: readonly TokenCategory[] = [
  'color',
  'geometry',
  'border',
  'typography',
  'elevation',
  'focus',
  'motion',
  'state',
];

const LAYER_LABEL: Readonly<Record<TokenLayer, string>> = {
  scalar: 'Scalar',
  role: 'Role',
  component: 'Component',
};

const CATEGORY_LABEL: Readonly<Record<TokenCategory, string>> = {
  color: 'Color',
  geometry: 'Geometry',
  border: 'Border',
  typography: 'Typography',
  elevation: 'Elevation',
  focus: 'Focus',
  motion: 'Motion',
  state: 'State',
};

const CATEGORY_HINT: Readonly<Record<TokenCategory, string>> = {
  color: 'Fill, border, and text colors.',
  geometry: 'Sizes, lengths, and corner radii.',
  border: 'Border width and style.',
  typography: 'Typeface, size, weight, spacing.',
  elevation: 'Drop shadow and depth.',
  focus: 'Focus-ring appearance.',
  motion: 'Animation duration and easing.',
  state: 'Hover / pressed / disabled overlays.',
};

const SEARCH_THRESHOLD = 8;

function filterTokens(props: TokenTableProps): ResolvedTokenSpec[] {
  return TOKEN_REGISTRY.filter((token) => {
    if (props.layer && token.layer !== props.layer) {
      return false;
    }
    if (props.category && token.category !== props.category) {
      return false;
    }
    if (props.component && token.appliesTo !== props.component) {
      return false;
    }
    return true;
  });
}

function applySearch(tokens: readonly ResolvedTokenSpec[], query: string): ResolvedTokenSpec[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...tokens];
  }
  return tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.themePath?.toLowerCase().includes(q) ?? false)
  );
}

function groupByCategory(
  tokens: readonly ResolvedTokenSpec[]
): Map<TokenCategory, ResolvedTokenSpec[]> {
  const groups = new Map<TokenCategory, ResolvedTokenSpec[]>();
  for (const category of CATEGORY_ORDER) {
    const matching = tokens.filter((t) => t.category === category);
    if (matching.length > 0) {
      groups.set(category, matching);
    }
  }
  return groups;
}

function deriveTitle(props: TokenTableProps): string {
  if (props.title) {
    return props.title;
  }
  if (props.component) {
    return `${props.component} tokens`;
  }
  if (props.category && props.layer) {
    return `${LAYER_LABEL[props.layer]} · ${CATEGORY_LABEL[props.category]}`;
  }
  if (props.category) {
    return `${CATEGORY_LABEL[props.category]} tokens`;
  }
  if (props.layer) {
    return `${LAYER_LABEL[props.layer]} tokens`;
  }
  return 'All tokens';
}

interface CopyButtonProps {
  readonly text: string;
  readonly label: string;
}

function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const onClick = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Copy ${label}`}
      className="inline-flex size-5 shrink-0 items-center justify-center rounded text-clay-inactive opacity-0 transition-all hover:bg-clay-canvas hover:text-clay-strong focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-clay-strong focus-visible:outline-offset-2 group-hover:opacity-100"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

/** Color-coded chip showing the token's granular value type. Hue mirrors
 *  the category (color/geom/border/etc.) so chips visually cluster. */
const TYPE_CHIP_HUE: Readonly<Record<TokenType, string>> = {
  color: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  size: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  radius: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  'border-width': 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  'border-style': 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  shadow: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  duration: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  easing: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  'font-family': 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
  'font-size': 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
  'font-weight': 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
  'line-height': 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
  'letter-spacing': 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
  'text-transform': 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
  'corner-shape': 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  opacity: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300',
  blur: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
};

function TokenTypeChip({ type }: { readonly type: TokenType }) {
  return (
    <span
      title={TOKEN_TYPE_HINT[type]}
      className={`inline-flex shrink-0 items-center rounded px-1.5 py-px font-medium font-mono text-[0.5625rem] uppercase tracking-[0.08em] ${TYPE_CHIP_HUE[type]}`}
    >
      {type}
    </span>
  );
}

interface TokenPreviewProps {
  readonly token: ResolvedTokenSpec;
}

const PREVIEW_BOX =
  'grid size-9 shrink-0 place-items-center overflow-hidden rounded-md border border-clay-hairline bg-clay-canvas';

const OPACITY_CHECKERS = {
  backgroundImage:
    'repeating-linear-gradient(45deg, var(--color-clay-hairline) 0 4px, transparent 4px 8px)',
};

/**
 * Renders a small visualization of the token's value. Every TokenType
 * has a tailored preview so the docs reads as a visual atlas, not a
 * table of CSS strings. The actual CSS variable is referenced live so
 * each preview reflects the current theme.
 */
function TokenPreview({ token }: TokenPreviewProps) {
  const cssVar = `var(--${token.name})`;
  switch (token.type) {
    case 'color':
      return (
        <span
          aria-hidden
          className="block size-9 shrink-0 rounded-md border border-clay-hairline shadow-inner"
          style={{ backgroundColor: cssVar }}
        />
      );
    case 'radius':
      return (
        <span aria-hidden className={PREVIEW_BOX}>
          <span
            className="block size-6 border border-clay-strong/60 bg-clay-strong/10"
            style={{ borderRadius: cssVar }}
          />
        </span>
      );
    case 'size':
      return (
        <span aria-hidden className={`${PREVIEW_BOX} px-1`}>
          <span
            className="block h-1 max-w-full rounded-full bg-clay-strong/60"
            style={{ width: `min(${cssVar}, 100%)` }}
          />
        </span>
      );
    case 'border-width':
      return (
        <span aria-hidden className={PREVIEW_BOX}>
          <span
            className="block size-6"
            style={{
              borderWidth: cssVar,
              borderStyle: 'solid',
              borderColor: 'var(--color-clay-strong)',
            }}
          />
        </span>
      );
    case 'border-style':
      return (
        <span aria-hidden className={PREVIEW_BOX}>
          <span
            className="block size-6"
            style={{
              borderWidth: '2px',
              borderStyle: cssVar,
              borderColor: 'var(--color-clay-strong)',
            }}
          />
        </span>
      );
    case 'shadow':
      return (
        <span
          aria-hidden
          className="block size-9 shrink-0 rounded-md border border-clay-hairline bg-clay-canvas"
          style={{ boxShadow: cssVar }}
        />
      );
    case 'duration':
      return (
        <span aria-hidden className={`${PREVIEW_BOX} relative`}>
          <span
            className="block size-2 animate-pulse rounded-full bg-clay-strong"
            style={{ animationDuration: cssVar, animationTimingFunction: 'ease-in-out' }}
          />
        </span>
      );
    case 'easing':
      return (
        <span aria-hidden className={`${PREVIEW_BOX} relative`}>
          <span
            className="block size-2 animate-pulse rounded-full bg-clay-strong"
            style={{ animationDuration: '1.4s', animationTimingFunction: cssVar }}
          />
        </span>
      );
    case 'font-family':
      return (
        <span aria-hidden className={PREVIEW_BOX}>
          <span className="font-medium text-base text-clay-strong" style={{ fontFamily: cssVar }}>
            Aa
          </span>
        </span>
      );
    case 'font-size':
      return (
        <span aria-hidden className={PREVIEW_BOX}>
          <span
            className="text-clay-strong leading-none"
            style={{ fontSize: `min(${cssVar}, 1.25rem)` }}
          >
            Aa
          </span>
        </span>
      );
    case 'font-weight':
      return (
        <span aria-hidden className={PREVIEW_BOX}>
          <span className="text-base text-clay-strong" style={{ fontWeight: cssVar }}>
            Aa
          </span>
        </span>
      );
    case 'line-height':
      return (
        <span aria-hidden className={PREVIEW_BOX}>
          <span className="block text-[0.5rem] text-clay-strong" style={{ lineHeight: cssVar }}>
            ──
            <br />
            ──
          </span>
        </span>
      );
    case 'letter-spacing':
      return (
        <span aria-hidden className={PREVIEW_BOX}>
          <span
            className="font-mono text-[0.625rem] text-clay-strong"
            style={{ letterSpacing: cssVar }}
          >
            AaA
          </span>
        </span>
      );
    case 'text-transform':
      return (
        <span aria-hidden className={PREVIEW_BOX}>
          <span className="text-clay-strong text-xs" style={{ textTransform: cssVar }}>
            Aa
          </span>
        </span>
      );
    case 'corner-shape':
      return (
        <span aria-hidden className={PREVIEW_BOX}>
          <span className="font-mono text-[0.5rem] text-clay-subtle uppercase tracking-wider">
            shape
          </span>
        </span>
      );
    case 'opacity':
      return (
        <span aria-hidden className={PREVIEW_BOX} style={OPACITY_CHECKERS}>
          <span className="block size-6 rounded-full bg-clay-strong" style={{ opacity: cssVar }} />
        </span>
      );
    case 'blur':
      return (
        <span aria-hidden className={`${PREVIEW_BOX} relative`}>
          <span className="absolute inset-0 grid place-items-center font-mono text-[0.625rem] text-clay-strong">
            Aa
          </span>
          <span
            className="absolute inset-0"
            style={{ backdropFilter: `blur(${cssVar})`, WebkitBackdropFilter: `blur(${cssVar})` }}
          />
        </span>
      );
  }
}

/**
 * Tailwind utility prefixes per token-namespace. The first entry is the
 * canonical/most-used variant, shown prominently; the rest collapse into
 * `+N` chips. `motion` and `blur` discriminate further on `TokenType`
 * because the namespace covers two distinct utility families
 * (`duration-` vs `ease-`, `blur-` vs `backdrop-blur-`).
 */
const COLOR_PREFIXES: readonly string[] = [
  'bg',
  'text',
  'border',
  'ring',
  'outline',
  'fill',
  'stroke',
  'decoration',
  'accent',
  'caret',
  'placeholder',
];

const SPACING_PREFIXES: readonly string[] = [
  'w',
  'h',
  'min-w',
  'min-h',
  'max-w',
  'max-h',
  'p',
  'px',
  'py',
  'm',
  'mx',
  'my',
  'gap',
  'inset',
  'top',
  'right',
  'bottom',
  'left',
];

function prefixesFor(token: ResolvedTokenSpec): readonly string[] {
  const ns = token.tailwindNamespace;
  if (!ns || ns === 'none' || ns === 'default') return [];
  switch (ns) {
    case 'color':
      return COLOR_PREFIXES;
    case 'radius':
      return ['rounded'];
    case 'shadow':
      return ['shadow'];
    case 'spacing':
      return SPACING_PREFIXES;
    case 'text':
      return ['text'];
    case 'font':
      return ['font'];
    case 'opacity':
      return ['opacity'];
    case 'blur':
      return token.name.startsWith('backdrop-')
        ? ['backdrop-blur', 'blur']
        : ['blur', 'backdrop-blur'];
    case 'motion':
      return token.type === 'easing' ? ['ease'] : ['duration'];
  }
}

/**
 * Per-namespace suffix → preferred-prefix overrides. A `card-foreground`
 * color token leads with `text-`, a `switch-track-width` size token with
 * `w-`, etc. The first matching suffix wins, longest entries listed first
 * so `-padding-x` resolves before `-padding`.
 */
const PRIMARY_PREFIX_OVERRIDES: Partial<
  Record<NonNullable<ResolvedTokenSpec['tailwindNamespace']>, ReadonlyArray<readonly [suffix: string, prefix: string]>>
> = {
  color: [
    ['-foreground', 'text'],
    ['-label', 'text'],
    ['-border', 'border'],
    ['-hairline', 'border'],
    ['-ring', 'ring'],
    ['-outline', 'outline'],
  ],
  spacing: [
    ['-padding-x', 'px'],
    ['-padding-y', 'py'],
    ['-width', 'w'],
    ['-height', 'h'],
    ['-gap', 'gap'],
  ],
};

/**
 * Given a token, pick the most idiomatic Tailwind prefix to lead with.
 * Falls back to the first entry of the namespace's prefix list.
 */
function pickPrimaryPrefix(
  token: ResolvedTokenSpec,
  prefixes: readonly string[]
): string {
  const ns = token.tailwindNamespace;
  const overrides = ns ? PRIMARY_PREFIX_OVERRIDES[ns] : undefined;
  if (overrides) {
    const name = token.utilityAlias ?? token.name;
    const match = overrides.find(([suffix]) => name.endsWith(suffix));
    if (match) return match[1];
  }
  return prefixes[0] ?? 'bg';
}

function utilitiesFor(token: ResolvedTokenSpec): readonly string[] {
  const prefixes = prefixesFor(token);
  if (prefixes.length === 0) return [];
  const suffix = token.utilityAlias ?? token.name;
  const primaryPrefix = pickPrimaryPrefix(token, prefixes);
  const ordered = [primaryPrefix, ...prefixes.filter((p) => p !== primaryPrefix)];
  return ordered.map((p) => `${p}-${suffix}`);
}

/**
 * A single Tailwind utility, rendered as a copy-on-click pill. The
 * `muted` variant is used for the alternate-prefix list inside an
 * expanded chip group so the canonical utility stays visually dominant.
 */
function UtilityChip({
  utility,
  muted,
}: {
  readonly utility: string;
  readonly muted?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const onClick = () => {
    void navigator.clipboard.writeText(utility).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Copy ${utility}`}
      title={copied ? 'Copied!' : `Click to copy`}
      className={`group/chip inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[0.6875rem] transition-colors focus-visible:outline-2 focus-visible:outline-clay-strong focus-visible:outline-offset-2 ${
        muted
          ? 'border-transparent text-clay-subtle hover:border-clay-hairline hover:bg-clay-elevated hover:text-clay-strong'
          : 'border-clay-hairline bg-clay-elevated text-clay-strong hover:border-clay-strong'
      } ${copied ? 'border-clay-strong text-clay-strong' : ''}`}
    >
      <span>{utility}</span>
      {copied ? (
        <Check size={10} aria-hidden className="text-clay-strong" />
      ) : (
        <Copy
          size={10}
          aria-hidden
          className="text-clay-inactive opacity-0 transition-opacity group-hover/chip:opacity-100"
        />
      )}
    </button>
  );
}

/**
 * Primary utility chip + a `+N` toggle that expands the remaining
 * prefixes inline. Collapsed by default, since color tokens generate
 * 11 prefixes and we'd rather keep each token row readable at rest.
 */
function UtilityChips({ utilities }: { readonly utilities: readonly string[] }) {
  const [expanded, setExpanded] = useState(false);
  const [primary, ...secondary] = utilities;
  if (!primary) return null;
  const hasSecondary = secondary.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <UtilityChip utility={primary} />
        {hasSecondary && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-0.5 rounded font-mono text-[0.625rem] text-clay-subtle transition-colors hover:text-clay-strong focus-visible:outline-2 focus-visible:outline-clay-strong focus-visible:outline-offset-2"
          >
            <span>{expanded ? 'hide' : `+${secondary.length}`}</span>
            <span aria-hidden className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>
              ›
            </span>
          </button>
        )}
      </div>
      {expanded && hasSecondary && (
        <div className="flex flex-wrap gap-1 border-clay-hairline/60 border-l-2 pl-3">
          {secondary.map((u) => (
            <UtilityChip key={u} utility={u} muted />
          ))}
        </div>
      )}
    </div>
  );
}

function TokenCard({ token }: { readonly token: ResolvedTokenSpec }) {
  const cssVar = `--${token.name}`;
  const utilities = utilitiesFor(token);

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-clay-hairline bg-clay-canvas/20 p-3 transition-colors hover:border-clay-hairline hover:bg-clay-canvas/50">
      <div className="mt-0.5 shrink-0">
        <TokenPreview token={token} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {/* Identity: var name · theme path · type chip · default value */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <code className="break-all font-mono text-clay-strong text-xs">{cssVar}</code>
          <CopyButton text={cssVar} label={`CSS variable ${cssVar}`} />
          <TokenTypeChip type={token.type} />
          <span aria-hidden className="ml-auto font-mono text-[0.625rem] text-clay-inactive">
            =
          </span>
          <code
            className="max-w-full truncate font-mono text-[0.6875rem] text-clay-subtle"
            title={token.defaultLight}
          >
            {token.defaultLight}
          </code>
        </div>

        {/* Theme path + dark default, both subtle */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {token.themePath && (
            <span className="flex items-center gap-1">
              <code className="break-all font-mono text-[0.6875rem] text-clay-subtle">
                {token.themePath}
              </code>
              <CopyButton text={token.themePath} label={`theme path ${token.themePath}`} />
            </span>
          )}
          {token.defaultDark && (
            <code
              className="font-mono text-[0.625rem] text-clay-inactive"
              title={`dark mode default: ${token.defaultDark}`}
            >
              dark · {token.defaultDark}
            </code>
          )}
        </div>

        {/* Description */}
        <p className="text-[0.8125rem] text-clay-default leading-snug">{token.description}</p>

        {/* Tailwind utilities, when applicable */}
        {utilities.length > 0 && (
          <div className="pt-1">
            <UtilityChips utilities={utilities} />
          </div>
        )}
      </div>
    </li>
  );
}

/**
 * Render the token registry as a docs reference, grouped by category.
 *
 * Each row shows the CSS variable name, theme path, description, and
 * default value, with a live preview swatch for color / radius /
 * elevation / border tokens. Click any code identifier to copy it.
 */
export function TokenTable(props: TokenTableProps) {
  const tokens = useMemo(() => filterTokens(props), [props]);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => applySearch(tokens, query), [tokens, query]);
  const groups = useMemo(() => groupByCategory(filtered), [filtered]);
  const title = deriveTitle(props);
  const showSearch = tokens.length >= SEARCH_THRESHOLD;

  if (tokens.length === 0) {
    return (
      <p className="not-prose font-mono text-clay-subtle text-sm">
        No tokens match these filters yet.
      </p>
    );
  }

  return (
    <section className="not-prose flex flex-col gap-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-medium text-base text-clay-strong">{title}</h3>
        <span className="font-mono text-[0.6875rem] text-clay-subtle uppercase tracking-[0.12em]">
          {filtered.length}
          {filtered.length !== tokens.length && ` of ${tokens.length}`} token
          {tokens.length === 1 ? '' : 's'}
        </span>
      </header>

      {showSearch && (
        <label className="flex items-center gap-2 rounded-lg border border-clay-hairline bg-clay-canvas/40 px-3 py-2 text-sm transition-colors focus-within:border-clay-strong">
          <Search size={14} className="shrink-0 text-clay-inactive" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter tokens by name, path, or description…"
            className="w-full bg-transparent text-clay-default outline-none placeholder:text-clay-inactive"
            aria-label="Filter tokens"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="font-mono text-[0.6875rem] text-clay-subtle uppercase tracking-wider hover:text-clay-strong"
            >
              Clear
            </button>
          )}
        </label>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-clay-hairline bg-clay-canvas/20 px-4 py-6 text-center text-clay-subtle text-sm">
          No tokens match <code className="font-mono">{query}</code>.
        </p>
      ) : (
        Array.from(groups.entries()).map(([category, items]) => (
          <section key={category} className="flex flex-col gap-3">
            <header className="flex items-baseline gap-3">
              <span className="font-medium font-mono text-[0.6875rem] text-clay-strong uppercase tracking-[0.14em]">
                {CATEGORY_LABEL[category]}
              </span>
              <span className="text-[0.75rem] text-clay-subtle italic">
                {CATEGORY_HINT[category]}
              </span>
              <span className="block h-px flex-1 bg-clay-hairline" />
              <span className="font-mono text-[0.625rem] text-clay-inactive tabular-nums">
                {items.length}
              </span>
            </header>
            <ul className="flex flex-col gap-2">
              {items.map((token) => (
                <TokenCard key={token.name} token={token} />
              ))}
            </ul>
          </section>
        ))
      )}
    </section>
  );
}
