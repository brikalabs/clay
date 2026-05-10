/**
 * Searchable token-reference picker. Replaces the plain `<Select>` in
 * LengthControl's unit selector. Built on Clay's Command primitives
 * (cmdk) for type-ahead search and Popover for placement.
 *
 * Layout:
 *
 *   ┌─────────────────────────────────────┐
 *   │ 🔍 search references…               │
 *   ├─────────────────────────────────────┤
 *   │ LITERAL                             │
 *   │   px        plain pixels            │
 *   │   rem       relative to root        │
 *   │   em        relative to parent      │
 *   │ SCALARS                             │
 *   │   ▢ var(--spacing)     0.25rem      │
 *   │   ▢ var(--radius)      0.75rem      │
 *   │   ▢ var(--text-base)   1rem         │
 *   │ ROLES                               │
 *   │   ▢ var(--radius-tight)             │
 *   │   ▢ var(--radius-pill)              │
 *   │ …                                   │
 *   └─────────────────────────────────────┘
 *
 * Each row's leading glyph visually previews the value: a corner for
 * radii, a horizontal bar for spacings, a "Aa" sample for font sizes.
 */

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@brika/clay/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@brika/clay/components/popover';
import type { ResolvedTokenSpec } from '@brika/clay/tokens';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export type RefKey = `unit:${LiteralUnit}` | `ref:${string}`;
export type LiteralUnit = 'px' | 'rem' | 'em';

interface TokenRefPickerProps {
  /** Current selection key, or null when the value isn't slidable. */
  readonly current: RefKey | null;
  readonly refs: readonly ResolvedTokenSpec[];
  readonly tokenType: string;
  readonly onSelect: (next: RefKey) => void;
}

interface UnitSpec {
  readonly value: LiteralUnit;
  readonly hint: string;
}

const UNITS: readonly UnitSpec[] = [
  { value: 'px', hint: 'plain pixels' },
  { value: 'rem', hint: 'relative to root font' },
  { value: 'em', hint: 'relative to parent font' },
];

export function TokenRefPicker({ current, refs, tokenType, onSelect }: TokenRefPickerProps) {
  const [open, setOpen] = useState(false);

  // Partition refs by layer for grouped display.
  const scalars = refs.filter((r) => r.layer === 'scalar');
  const roles = refs.filter((r) => r.layer === 'role');

  const triggerLabel = current ? renderTriggerLabel(current, refs) : 'px';

  const select = (key: RefKey) => {
    onSelect(key);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Unit or token reference"
          aria-expanded={open}
          className="flex h-7 min-w-0 max-w-[14rem] shrink-0 items-center gap-1.5 rounded-control border border-clay-hairline bg-clay-elevated px-2 font-mono text-[0.625rem] text-clay-default hover:border-clay-default hover:text-clay-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-strong/40"
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown size={11} className="shrink-0 text-clay-subtle" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search references…" />
          <CommandList className="max-h-72">
            <CommandEmpty>No matches.</CommandEmpty>

            <CommandGroup heading="Literal">
              {UNITS.map((u) => {
                const key = `unit:${u.value}` as const;
                return (
                  <CommandItem
                    key={key}
                    value={`unit ${u.value} ${u.hint}`}
                    onSelect={() => select(key)}
                  >
                    <Glyph kind="unit" />
                    <span className="font-mono text-[0.6875rem] text-clay-default">
                      {u.value}
                    </span>
                    <span className="ml-auto font-mono text-[0.625rem] text-clay-subtle italic">
                      {u.hint}
                    </span>
                    {current === key && <Check size={11} className="text-clay-strong" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {scalars.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="× scalars">
                  {scalars.map((t) => (
                    <RefRow
                      key={t.name}
                      token={t}
                      tokenType={tokenType}
                      active={current === `ref:${t.name}`}
                      onSelect={() => select(`ref:${t.name}`)}
                    />
                  ))}
                </CommandGroup>
              </>
            )}

            {roles.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="× roles">
                  {roles.map((t) => (
                    <RefRow
                      key={t.name}
                      token={t}
                      tokenType={tokenType}
                      active={current === `ref:${t.name}`}
                      onSelect={() => select(`ref:${t.name}`)}
                    />
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function renderTriggerLabel(current: RefKey, refs: readonly ResolvedTokenSpec[]): string {
  if (current.startsWith('unit:')) return current.slice('unit:'.length);
  const name = current.slice('ref:'.length);
  // Re-lookup the default for a one-glance hint in the trigger.
  const token = refs.find((r) => r.name === name);
  return token ? `var(--${name})` : `var(--${name})`;
}

interface RefRowProps {
  readonly token: ResolvedTokenSpec;
  readonly tokenType: string;
  readonly active: boolean;
  readonly onSelect: () => void;
}

function RefRow({ token, tokenType, active, onSelect }: RefRowProps) {
  return (
    <CommandItem
      value={`${token.name} ${token.themePath ?? ''} ${token.defaultLight}`}
      onSelect={onSelect}
    >
      <Glyph kind={tokenType} value={token.defaultLight} />
      <span className="min-w-0 flex-1 truncate font-mono text-[0.6875rem] text-clay-default">
        var(--{token.name})
      </span>
      <span className="ml-2 truncate font-mono text-[0.5625rem] text-clay-subtle italic">
        {token.defaultLight}
      </span>
      {active && <Check size={11} className="text-clay-strong" />}
    </CommandItem>
  );
}

/**
 * Tiny glyph that visually previews what type of length we're dealing
 * with. Corner for radius, bar for sizes, "Aa" for typography. Helps
 * scanning when the picker has many similarly-named tokens.
 */
function Glyph({ kind, value }: { readonly kind: string; readonly value?: string }) {
  if (kind === 'radius') {
    return (
      <span
        aria-hidden
        className="size-3 shrink-0 border-2 border-clay-strong/60"
        style={{
          borderRadius: value ?? '0.25rem',
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
        }}
      />
    );
  }
  if (kind === 'font-size' || kind === 'line-height') {
    return (
      <span
        aria-hidden
        className="inline-flex size-3 shrink-0 items-center justify-center font-medium text-[0.625rem] text-clay-strong"
      >
        Aa
      </span>
    );
  }
  if (kind === 'border-width') {
    return (
      <span
        aria-hidden
        className="size-3 shrink-0 rounded-sm border-clay-strong"
        style={{ borderWidth: value ?? '1px', borderStyle: 'solid' }}
      />
    );
  }
  if (kind === 'duration') {
    return (
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-full bg-clay-strong/60"
      />
    );
  }
  if (kind === 'unit') {
    return <span aria-hidden className="size-2 shrink-0 rounded-sm bg-clay-subtle/60" />;
  }
  // Default: show a small filled square sized in the value's units to
  // hint at the magnitude.
  return (
    <span
      aria-hidden
      className="block shrink-0 bg-clay-strong/60"
      style={{ width: value ?? '0.5rem', height: '0.5rem', maxWidth: '0.75rem' }}
    />
  );
}
