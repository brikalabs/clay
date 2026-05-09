import type { ResolvedTokenSpec, TailwindNamespace } from '@brika/clay/tokens';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { useCopy } from './useCopy';

/**
 * Tailwind utility prefixes per namespace. The first entry is the
 * canonical/most-used one; the rest collapse into a `+N` chip group.
 * `motion` and `blur` overrides happen in {@link pickPrimary}.
 */
const NAMESPACE_PREFIXES: Record<TailwindNamespace, readonly string[]> = {
  color: ['bg', 'text', 'border', 'ring', 'outline', 'fill', 'stroke', 'decoration', 'accent', 'caret', 'placeholder'],
  radius: ['rounded'],
  shadow: ['shadow'],
  spacing: ['w', 'h', 'min-w', 'min-h', 'max-w', 'max-h', 'p', 'px', 'py', 'm', 'mx', 'my', 'gap', 'inset', 'top', 'right', 'bottom', 'left'],
  text: ['text'],
  font: ['font'],
  opacity: ['opacity'],
  blur: ['blur', 'backdrop-blur'],
  motion: ['duration', 'ease'],
  'border-w': ['border-w'],
  'border-style': ['border-style'],
  'font-weight': ['font-weight'],
  leading: ['leading'],
  tracking: ['tracking'],
  case: ['case'],
  corner: ['corner'],
  default: [],
  none: [],
};

/**
 * Suffix-driven primary-prefix overrides. `card-foreground` color leads
 * with `text-`, `switch-track-width` size with `w-`. First match wins,
 * longest entries listed first so `-padding-x` resolves before `-padding`.
 */
const PRIMARY_BY_SUFFIX: ReadonlyArray<readonly [TailwindNamespace, string, string]> = [
  ['color', '-foreground', 'text'],
  ['color', '-label', 'text'],
  ['color', '-border', 'border'],
  ['color', '-hairline', 'border'],
  ['color', '-ring', 'ring'],
  ['color', '-outline', 'outline'],
  ['spacing', '-padding-x', 'px'],
  ['spacing', '-padding-y', 'py'],
  ['spacing', '-width', 'w'],
  ['spacing', '-height', 'h'],
  ['spacing', '-gap', 'gap'],
];

function pickPrimary(token: ResolvedTokenSpec, ns: TailwindNamespace, suffix: string): string {
  if (ns === 'motion') return token.type === 'easing' ? 'ease' : 'duration';
  if (ns === 'blur' && token.name.startsWith('backdrop-')) return 'backdrop-blur';
  const match = PRIMARY_BY_SUFFIX.find(([n, s]) => n === ns && suffix.endsWith(s));
  return match?.[2] ?? NAMESPACE_PREFIXES[ns][0];
}

export function utilitiesFor(token: ResolvedTokenSpec): readonly string[] {
  const ns = token.tailwindNamespace;
  if (!ns) return [];
  const all = NAMESPACE_PREFIXES[ns];
  if (all.length === 0) return [];
  const suffix = token.utilityAlias ?? token.name;
  const primary = pickPrimary(token, ns, suffix);
  return [primary, ...all.filter((p) => p !== primary)].map((p) => `${p}-${suffix}`);
}

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-clay-strong focus-visible:outline-offset-2';
const CHIP_BASE = `group/chip inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[0.6875rem] transition-colors ${FOCUS_RING}`;
const CHIP_NORMAL = 'border-clay-hairline bg-clay-elevated text-clay-strong hover:border-clay-strong';
const CHIP_MUTED = 'border-transparent text-clay-subtle hover:border-clay-hairline hover:bg-clay-elevated hover:text-clay-strong';

function UtilityChip({ utility, muted }: { readonly utility: string; readonly muted?: boolean }) {
  const [copied, copy] = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(utility)}
      aria-label={`Copy ${utility}`}
      title={copied ? 'Copied!' : 'Click to copy'}
      className={`${CHIP_BASE} ${muted ? CHIP_MUTED : CHIP_NORMAL} ${copied ? 'border-clay-strong text-clay-strong' : ''}`}
    >
      <span>{utility}</span>
      {copied
        ? <Check size={10} aria-hidden className="text-clay-strong" />
        : <Copy size={10} aria-hidden className="text-clay-inactive opacity-0 transition-opacity group-hover/chip:opacity-100" />}
    </button>
  );
}

/**
 * Primary utility chip + a `+N` toggle that expands the remaining
 * prefixes inline. Collapsed by default since color tokens generate 11
 * prefixes and per-token rows should stay readable at rest.
 */
export function UtilityChips({ utilities }: { readonly utilities: readonly string[] }) {
  const [expanded, setExpanded] = useState(false);
  const [primary, ...secondary] = utilities;
  if (!primary) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <UtilityChip utility={primary} />
        {secondary.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={`inline-flex items-center gap-0.5 rounded font-mono text-[0.625rem] text-clay-subtle transition-colors hover:text-clay-strong ${FOCUS_RING}`}
          >
            <span>{expanded ? 'hide' : `+${secondary.length}`}</span>
            <span aria-hidden className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>›</span>
          </button>
        )}
      </div>
      {expanded && (
        <div className="flex flex-wrap gap-1 border-clay-hairline/60 border-l-2 pl-3">
          {secondary.map((u) => <UtilityChip key={u} utility={u} muted />)}
        </div>
      )}
    </div>
  );
}
