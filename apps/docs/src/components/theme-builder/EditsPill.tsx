/**
 * Clickable status pill that shows the count of dirty draft entries
 * and, when clicked, reveals a list of every changed token with a
 * per-row Reset button. Used by HeroIdentity and CompactHero so the
 * user has a single place to inspect and undo their edits.
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@brika/clay/components/dropdown-menu';
import { RotateCcw } from 'lucide-react';
import { useMemo } from 'react';
import type { Draft } from './state/draft';

interface EditsPillProps {
  readonly draft: Draft;
  readonly resetValue: (key: string) => void;
  readonly clearAll: () => void;
  /** Compact variant used in the floating CompactHero. */
  readonly compact?: boolean;
}

export function EditsPill({ draft, resetValue, clearAll, compact }: EditsPillProps) {
  const entries = useMemo(() => [...draft.entries()], [draft]);
  const dirty = entries.length > 0;

  if (!dirty) {
    return (
      <span
        aria-label="No edits"
        className={
          compact
            ? 'inline-flex items-center gap-1.5 rounded-full bg-clay-canvas/40 px-2 py-0.5 font-mono text-[0.625rem] text-clay-subtle uppercase tracking-[0.08em]'
            : 'inline-flex items-center gap-1.5 rounded-full bg-clay-canvas/40 px-2.5 py-0.5 font-mono text-[0.625rem] text-clay-subtle uppercase tracking-[0.08em]'
        }
      >
        <span aria-hidden className="size-1.5 rounded-full bg-clay-inactive" />
        pristine
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`${entries.length} edits, click to inspect`}
          className={
            compact
              ? 'inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium font-mono text-[0.625rem] text-emerald-700 uppercase tracking-[0.08em] transition-colors hover:bg-emerald-500/25 dark:text-emerald-300'
              : 'inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-medium font-mono text-[0.625rem] text-emerald-700 uppercase tracking-[0.08em] transition-colors hover:bg-emerald-500/25 dark:text-emerald-300'
          }
        >
          <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          {entries.length} edits
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="max-h-[60vh] w-80 overflow-y-auto">
        <DropdownMenuLabel className="flex items-baseline justify-between">
          <span>Changed tokens</span>
          <span className="font-mono text-[0.625rem] text-clay-subtle tabular-nums">
            {entries.length}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ul className="flex flex-col py-1">
          {entries.map(([key, value]) => (
            <li key={key}>
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-clay-canvas/40">
                <span className="flex min-w-0 flex-1 flex-col">
                  <code className="truncate font-mono text-[0.6875rem] text-clay-default">
                    {key}
                  </code>
                  <code className="truncate font-mono text-[0.625rem] text-clay-subtle">
                    {value}
                  </code>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    resetValue(key);
                  }}
                  aria-label={`Reset ${key}`}
                  className="shrink-0 rounded-full border border-clay-hairline px-1.5 py-0.5 font-mono text-[0.5625rem] text-clay-subtle uppercase tracking-[0.08em] hover:border-clay-strong hover:text-clay-strong"
                >
                  <RotateCcw size={9} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={clearAll}
          className="font-medium text-destructive focus:text-destructive"
        >
          <RotateCcw size={12} />
          Reset all
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
